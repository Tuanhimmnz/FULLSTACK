using System.Data;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
ConfigureRuntimePort(builder);
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "ProjectHub.Shared.Secret.Key.For.Student.Microservices.2026!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "ProjectHub";
var audience = builder.Configuration["Jwt:Audience"] ?? "ProjectHub.Client";

builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient("notify", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:NotifyService"] ?? "http://localhost:5003");
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => options.TokenValidationParameters = TokenValidation(jwtSecret, issuer, audience));
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();

var db = new SqlDb(app.Configuration.GetConnectionString("ProjectDb")!);
await db.EnsureDatabaseAsync("ProjectDB");
await EnsureSchemaAsync(db);
await SeedProjectsAsync(db);

app.MapGet("/health", () => Results.Ok(new { service = "ProjectService", status = "ok" }));

app.MapGet("/api/projects", async () =>
{
    await using var conn = await db.OpenAsync();
    return Results.Ok(await LoadProjectsAsync(conn));
}).RequireAuthorization();

app.MapGet("/api/projects/{id}", async (string id) =>
{
    await using var conn = await db.OpenAsync();
    var project = (await LoadProjectsAsync(conn, id)).FirstOrDefault();
    return project is null ? Results.NotFound() : Results.Ok(project);
}).RequireAuthorization();

app.MapPost("/api/projects", async (ProjectCreateRequest request, ClaimsPrincipal principal, IHttpClientFactory httpClientFactory) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    var id = "p_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    var createdAt = DateTimeOffset.UtcNow.ToString("yyyy-MM-dd");

    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn,
        """
        INSERT INTO Projects(id, name, description, status, statusText, progress, color, createdAt)
        VALUES(@id,@name,@description,@status,@statusText,0,@color,@createdAt)
        """,
        P("@id", id), P("@name", request.Name), P("@description", request.Description),
        P("@status", request.Status), P("@statusText", request.StatusText),
        P("@color", request.Color), P("@createdAt", createdAt));

    foreach (var member in request.Members ?? [])
    {
        await ExecuteAsync(conn,
            "INSERT INTO ProjectMembers(projectId, userId, role) VALUES(@projectId,@userId,@role)",
            P("@projectId", id), P("@userId", member.Id), P("@role", string.IsNullOrWhiteSpace(member.Role) ? "Member" : member.Role));
    }

    await AddProjectActivityAsync(conn, id, actor, "project.created", $"Created project {request.Name}");
    await PublishProjectEventAsync(httpClientFactory, new ProjectEventRequest(
        "project.created",
        "New project",
        $"{actor.FullName} created project {request.Name}.",
        id,
        (request.Members ?? []).Select(m => m.Id).Distinct().ToList(),
        actor));

    var dto = new ProjectDto(id, request.Name, request.Description, request.Status, request.StatusText, 0, request.Color, createdAt, request.Members ?? []);
    return Results.Created($"/api/projects/{id}", dto);
}).RequireAuthorization();

app.MapPut("/api/projects/{id}", async (string id, ProjectUpdateRequest request, ClaimsPrincipal principal) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn,
        """
        UPDATE Projects SET name=@name, description=@description, status=@status,
        statusText=@statusText, color=@color WHERE id=@id
        """,
        P("@id", id), P("@name", request.Name), P("@description", request.Description),
        P("@status", request.Status), P("@statusText", request.StatusText), P("@color", request.Color));
    await AddProjectActivityAsync(conn, id, actor, "project.updated", $"Updated project {request.Name}");
    var project = (await LoadProjectsAsync(conn, id)).FirstOrDefault();
    return project is null ? Results.NotFound() : Results.Ok(project);
}).RequireAuthorization();

app.MapDelete("/api/projects/{id}", async (string id, ClaimsPrincipal principal) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    await using var conn = await db.OpenAsync();
    await AddProjectActivityAsync(conn, id, actor, "project.deleted", $"Deleted project {id}");
    await ExecuteAsync(conn, "DELETE FROM ProjectMembers WHERE projectId=@id", P("@id", id));
    await ExecuteAsync(conn, "DELETE FROM Sprints WHERE projectId=@id", P("@id", id));
    await ExecuteAsync(conn, "DELETE FROM Milestones WHERE projectId=@id", P("@id", id));
    await ExecuteAsync(conn, "DELETE FROM Projects WHERE id=@id", P("@id", id));
    return Results.Ok(new { id });
}).RequireAuthorization();

app.MapPut("/api/projects/{id}/progress", async (string id, ProjectProgressRequest request, ClaimsPrincipal principal) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn, "UPDATE Projects SET progress=@progress WHERE id=@id", P("@progress", request.Progress), P("@id", id));
    await AddProjectActivityAsync(conn, id, CurrentUser(principal), "project.progress.updated", $"Progress updated to {request.Progress}%");
    return Results.Ok(new { message = "Project progress updated" });
}).RequireAuthorization();

app.MapPut("/api/projects/{id}/members", async (string id, ProjectMembersRequest request, ClaimsPrincipal principal, IHttpClientFactory httpClientFactory) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn, "DELETE FROM ProjectMembers WHERE projectId=@projectId", P("@projectId", id));
    var members = request.MemberRows();
    foreach (var member in members.DistinctBy(m => m.UserId))
    {
        await ExecuteAsync(conn,
            "INSERT INTO ProjectMembers(projectId, userId, role) VALUES(@projectId,@userId,@role)",
            P("@projectId", id), P("@userId", member.UserId), P("@role", string.IsNullOrWhiteSpace(member.Role) ? "Member" : member.Role));
    }

    await AddProjectActivityAsync(conn, id, actor, "project.member.updated", $"Updated project members for {id}");
    await PublishProjectEventAsync(httpClientFactory, new ProjectEventRequest(
        "project.member.added",
        "Project members updated",
        $"{actor.FullName} updated project members.",
        id,
        members.Select(m => m.UserId).Distinct().ToList(),
        actor));
    return Results.Ok(new { message = "Project members updated" });
}).RequireAuthorization();

app.MapGet("/api/projects/{id}/sprints", async (string id) =>
{
    await using var conn = await db.OpenAsync();
    var sprints = await QueryAsync<SprintDto>(conn,
        "SELECT id, projectId, name, goal, startDate, endDate, status FROM Sprints WHERE projectId=@projectId ORDER BY startDate DESC",
        P("@projectId", id));
    return Results.Ok(sprints);
}).RequireAuthorization();

app.MapPost("/api/projects/{id}/sprints", async (string id, SprintCreateRequest request, ClaimsPrincipal principal, IHttpClientFactory httpClientFactory) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    var sprintId = "sp_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    var status = string.IsNullOrWhiteSpace(request.Status) ? "Planned" : request.Status;

    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn,
        "INSERT INTO Sprints(id, projectId, name, goal, startDate, endDate, status) VALUES(@id,@projectId,@name,@goal,@startDate,@endDate,@status)",
        P("@id", sprintId), P("@projectId", id), P("@name", request.Name), P("@goal", request.Goal),
        P("@startDate", request.StartDate), P("@endDate", request.EndDate), P("@status", status));
    await AddProjectActivityAsync(conn, id, actor, "sprint.started", $"Created sprint {request.Name}");
    await PublishProjectEventAsync(httpClientFactory, new ProjectEventRequest(
        "sprint.started",
        "Sprint started",
        $"{actor.FullName} created sprint {request.Name}.",
        id,
        await GetProjectRecipientIdsAsync(conn, id),
        actor));

    return Results.Created($"/api/projects/{id}/sprints/{sprintId}", new SprintDto(sprintId, id, request.Name, request.Goal, request.StartDate, request.EndDate, status));
}).RequireAuthorization();

app.MapGet("/api/projects/{id}/milestones", async (string id) =>
{
    await using var conn = await db.OpenAsync();
    var milestones = await QueryAsync<MilestoneDto>(conn,
        "SELECT id, projectId, name, description, deadline, status, completedAt FROM Milestones WHERE projectId=@projectId ORDER BY deadline",
        P("@projectId", id));
    return Results.Ok(milestones);
}).RequireAuthorization();

app.MapPost("/api/projects/{id}/milestones", async (string id, MilestoneCreateRequest request, ClaimsPrincipal principal, IHttpClientFactory httpClientFactory) =>
{
    if (!IsManager(principal)) return Results.Forbid();
    var actor = CurrentUser(principal);
    var milestoneId = "ms_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    var status = string.IsNullOrWhiteSpace(request.Status) ? "Open" : request.Status;
    var completedAt = status.Equals("Completed", StringComparison.OrdinalIgnoreCase) ? DateTimeOffset.UtcNow.ToString("O") : null;

    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn,
        """
        INSERT INTO Milestones(id, projectId, name, description, deadline, status, completedAt)
        VALUES(@id,@projectId,@name,@description,@deadline,@status,@completedAt)
        """,
        P("@id", milestoneId), P("@projectId", id), P("@name", request.Name), P("@description", request.Description),
        P("@deadline", request.Deadline), P("@status", status), P("@completedAt", (object?)completedAt ?? DBNull.Value));
    await AddProjectActivityAsync(conn, id, actor, "milestone.created", $"Created milestone {request.Name}");

    if (status.Equals("Completed", StringComparison.OrdinalIgnoreCase))
    {
        await PublishProjectEventAsync(httpClientFactory, new ProjectEventRequest(
            "milestone.completed",
            "Milestone completed",
            $"{actor.FullName} completed milestone {request.Name}.",
            id,
            await GetProjectRecipientIdsAsync(conn, id),
            actor));
    }

    return Results.Created($"/api/projects/{id}/milestones/{milestoneId}",
        new MilestoneDto(milestoneId, id, request.Name, request.Description, request.Deadline, status, completedAt));
}).RequireAuthorization();

app.MapGet("/api/projects/{id}/activities", async (string id) =>
{
    await using var conn = await db.OpenAsync();
    var activities = await QueryAsync<ProjectActivityDto>(conn,
        "SELECT TOP 100 id, projectId, actorId, actorName, action, message, createdAt FROM ProjectActivities WHERE projectId=@projectId ORDER BY createdAt DESC",
        P("@projectId", id));
    return Results.Ok(activities);
}).RequireAuthorization();

app.Run();

static void ConfigureRuntimePort(WebApplicationBuilder builder)
{
    var port = Environment.GetEnvironmentVariable("PORT");
    if (!string.IsNullOrWhiteSpace(port))
    {
        builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
    }
}

static TokenValidationParameters TokenValidation(string secret, string issuer, string audience) => new()
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = issuer,
    ValidAudience = audience,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
    ClockSkew = TimeSpan.Zero
};

static bool IsManager(ClaimsPrincipal user)
{
    var role = user.FindFirstValue(ClaimTypes.Role);
    return role is "Admin" or "Project Manager";
}

static EventActor CurrentUser(ClaimsPrincipal principal) => new(
    principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? "",
    principal.FindFirstValue(ClaimTypes.Name) ?? "System",
    principal.FindFirstValue(ClaimTypes.Role) ?? "Member");

static async Task<List<ProjectDto>> LoadProjectsAsync(SqlConnection conn, string? projectId = null)
{
    var where = string.IsNullOrWhiteSpace(projectId) ? "" : "WHERE id=@id";
    var projects = await QueryAsync<ProjectRow>(conn,
        $"SELECT id, name, description, status, statusText, progress, color, createdAt FROM Projects {where} ORDER BY createdAt DESC",
        P("@id", (object?)projectId ?? DBNull.Value));
    var members = await QueryAsync<ProjectMemberRow>(conn, "SELECT projectId, userId, role FROM ProjectMembers");
    return projects.Select(project => new ProjectDto(
        project.Id,
        project.Name,
        project.Description,
        project.Status,
        project.StatusText,
        project.Progress,
        project.Color,
        project.CreatedAt,
        members.Where(m => m.ProjectId == project.Id)
            .Select(m => new MemberDto(m.UserId, m.UserId, "", m.Role, true, ""))
            .ToList())).ToList();
}

static async Task AddProjectActivityAsync(SqlConnection conn, string projectId, EventActor actor, string action, string message)
{
    await ExecuteAsync(conn,
        """
        INSERT INTO ProjectActivities(id, projectId, actorId, actorName, action, message, createdAt)
        VALUES(@id,@projectId,@actorId,@actorName,@action,@message,@createdAt)
        """,
        P("@id", "pa_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + "_" + Guid.NewGuid().ToString("N")[..6]),
        P("@projectId", projectId), P("@actorId", actor.Id), P("@actorName", actor.FullName),
        P("@action", action), P("@message", message), P("@createdAt", DateTimeOffset.UtcNow.ToString("O")));
}

static async Task<List<string>> GetProjectRecipientIdsAsync(SqlConnection conn, string projectId)
{
    return await QueryAsync<string>(conn, "SELECT userId FROM ProjectMembers WHERE projectId=@projectId", P("@projectId", projectId));
}

static async Task PublishProjectEventAsync(IHttpClientFactory factory, ProjectEventRequest request)
{
    try
    {
        await factory.CreateClient("notify").PostAsJsonAsync("/api/internal/project-events", request);
    }
    catch
    {
        // Project service remains available if Notify service is temporarily down.
    }
}

static async Task EnsureSchemaAsync(SqlDb db)
{
    await using var conn = await db.OpenAsync();
    await ExecuteAsync(conn,
        """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Projects' AND xtype='U')
        CREATE TABLE Projects(
            id NVARCHAR(50) PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            description NVARCHAR(MAX),
            status NVARCHAR(50),
            statusText NVARCHAR(100),
            progress INT DEFAULT 0,
            color NVARCHAR(50),
            createdAt NVARCHAR(50)
        );
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectMembers' AND xtype='U')
        CREATE TABLE ProjectMembers(
            projectId NVARCHAR(50) NOT NULL,
            userId NVARCHAR(50) NOT NULL,
            role NVARCHAR(50) DEFAULT 'Member',
            PRIMARY KEY(projectId, userId)
        );
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sprints' AND xtype='U')
        CREATE TABLE Sprints(
            id NVARCHAR(50) PRIMARY KEY,
            projectId NVARCHAR(50) NOT NULL,
            name NVARCHAR(255) NOT NULL,
            goal NVARCHAR(MAX),
            startDate NVARCHAR(50),
            endDate NVARCHAR(50),
            status NVARCHAR(50) DEFAULT 'Planned'
        );
        IF COL_LENGTH('Sprints', 'status') IS NULL
        ALTER TABLE Sprints ADD status NVARCHAR(50) DEFAULT 'Planned';
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Milestones' AND xtype='U')
        CREATE TABLE Milestones(
            id NVARCHAR(50) PRIMARY KEY,
            projectId NVARCHAR(50) NOT NULL,
            name NVARCHAR(255) NOT NULL,
            description NVARCHAR(MAX),
            deadline NVARCHAR(50),
            status NVARCHAR(50) DEFAULT 'Open',
            completedAt NVARCHAR(100)
        );
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectActivities' AND xtype='U')
        CREATE TABLE ProjectActivities(
            id NVARCHAR(50) PRIMARY KEY,
            projectId NVARCHAR(50) NOT NULL,
            actorId NVARCHAR(50),
            actorName NVARCHAR(100),
            action NVARCHAR(100),
            message NVARCHAR(MAX),
            createdAt NVARCHAR(100)
        );
        """);
}

static async Task SeedProjectsAsync(SqlDb db)
{
    await using var conn = await db.OpenAsync();
    var projectIds = new[] { "p_sprintflow", "p_mobile", "p_data", "p_quality", "p_devops" };

    foreach (var id in projectIds)
    {
        await ExecuteAsync(conn, "DELETE FROM ProjectMembers WHERE projectId=@id", P("@id", id));
        await ExecuteAsync(conn, "DELETE FROM Sprints WHERE projectId=@id", P("@id", id));
        await ExecuteAsync(conn, "DELETE FROM Milestones WHERE projectId=@id", P("@id", id));
        await ExecuteAsync(conn, "DELETE FROM ProjectActivities WHERE projectId=@id", P("@id", id));
        await ExecuteAsync(conn, "DELETE FROM Projects WHERE id=@id", P("@id", id));
    }

    var today = DateTimeOffset.UtcNow;
    var projects = new[]
    {
        new ProjectSeed("p_sprintflow", "SprintFlow Core Platform", "Nền tảng quản lý dự án, task, bình luận, thông báo và nhật ký hoạt động.", "Active", "Đang triển khai", 64, "indigo",
            new[] { new ProjectMemberSeed("u0", "Owner"), new ProjectMemberSeed("u_pm", "Manager"), new ProjectMemberSeed("u_backend_01", "Member"), new ProjectMemberSeed("u_frontend_01", "Member"), new ProjectMemberSeed("u_qa_01", "Member"), new ProjectMemberSeed("u_uiux_01", "Member") }),
        new ProjectSeed("p_mobile", "Ứng dụng Mobile nội bộ", "Thiết kế trải nghiệm mobile, đồng bộ task và notification realtime.", "Active", "Sprint 2", 42, "emerald",
            new[] { new ProjectMemberSeed("u_pm", "Manager"), new ProjectMemberSeed("u_frontend_02", "Member"), new ProjectMemberSeed("u_uiux_02", "Member"), new ProjectMemberSeed("u_qa_02", "Member"), new ProjectMemberSeed("u_member_01", "Member") }),
        new ProjectSeed("p_data", "Báo cáo và Dashboard", "Tổng hợp số liệu tiến độ, burndown chart, deadline warning và thống kê sprint.", "Active", "Đang phân tích", 55, "amber",
            new[] { new ProjectMemberSeed("u_pm", "Manager"), new ProjectMemberSeed("u_ba_01", "Member"), new ProjectMemberSeed("u_ba_02", "Member"), new ProjectMemberSeed("u_backend_02", "Member"), new ProjectMemberSeed("u_devops_01", "Member") }),
        new ProjectSeed("p_quality", "Kiểm thử và nghiệm thu", "Test regression, UAT, phân quyền, F12 checklist và dữ liệu demo.", "Active", "Đang kiểm thử", 70, "rose",
            new[] { new ProjectMemberSeed("u_pm", "Manager"), new ProjectMemberSeed("u_qa_01", "Member"), new ProjectMemberSeed("u_qa_02", "Member"), new ProjectMemberSeed("u_viewer_01", "Viewer"), new ProjectMemberSeed("u_member_02", "Member") }),
        new ProjectSeed("p_devops", "Docker và triển khai VPS", "Đóng gói 3 service backend bằng Docker, cấu hình gateway, reverse proxy và health check.", "Active", "Chuẩn bị deploy", 48, "blue",
            new[] { new ProjectMemberSeed("u0", "Owner"), new ProjectMemberSeed("u_devops_01", "Manager"), new ProjectMemberSeed("u_backend_01", "Member"), new ProjectMemberSeed("u_backend_02", "Member") })
    };

    foreach (var project in projects)
    {
        await ExecuteAsync(conn,
            """
            INSERT INTO Projects(id, name, description, status, statusText, progress, color, createdAt)
            VALUES(@id,@name,@description,@status,@statusText,@progress,@color,@createdAt)
            """,
            P("@id", project.Id), P("@name", project.Name), P("@description", project.Description),
            P("@status", project.Status), P("@statusText", project.StatusText), P("@progress", project.Progress),
            P("@color", project.Color), P("@createdAt", today.AddDays(-12).ToString("yyyy-MM-dd")));

        foreach (var member in project.Members)
        {
            await ExecuteAsync(conn,
                "INSERT INTO ProjectMembers(projectId, userId, role) VALUES(@projectId,@userId,@role)",
                P("@projectId", project.Id), P("@userId", member.UserId), P("@role", member.Role));
        }
    }
}

static async Task<List<T>> QueryAsync<T>(SqlConnection conn, string sql, params SqlParameter[] parameters)
{
    await using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddRange(parameters);
    await using var reader = await cmd.ExecuteReaderAsync();
    var list = new List<T>();
    while (await reader.ReadAsync()) list.Add(Map<T>(reader));
    return list;
}

static async Task ExecuteAsync(SqlConnection conn, string sql, params SqlParameter[] parameters)
{
    await using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddRange(parameters);
    await cmd.ExecuteNonQueryAsync();
}

static SqlParameter P(string name, object? value) => new(name, value ?? DBNull.Value);

static T Map<T>(IDataRecord row)
{
    object? Get(string name) => row[name] == DBNull.Value ? null : row[name];
    if (typeof(T) == typeof(string)) return (T)(object)(Get(row.GetName(0))?.ToString() ?? "");
    if (typeof(T) == typeof(ProjectRow))
        return (T)(object)new ProjectRow(Get("id")!.ToString()!, Get("name")!.ToString()!, Get("description")?.ToString() ?? "", Get("status")?.ToString() ?? "New", Get("statusText")?.ToString() ?? "", Convert.ToInt32(Get("progress") ?? 0), Get("color")?.ToString() ?? "indigo", Get("createdAt")?.ToString() ?? "");
    if (typeof(T) == typeof(ProjectMemberRow))
        return (T)(object)new ProjectMemberRow(Get("projectId")!.ToString()!, Get("userId")!.ToString()!, Get("role")?.ToString() ?? "Member");
    if (typeof(T) == typeof(SprintDto))
        return (T)(object)new SprintDto(Get("id")!.ToString()!, Get("projectId")!.ToString()!, Get("name")?.ToString() ?? "", Get("goal")?.ToString() ?? "", Get("startDate")?.ToString() ?? "", Get("endDate")?.ToString() ?? "", Get("status")?.ToString() ?? "Planned");
    if (typeof(T) == typeof(MilestoneDto))
        return (T)(object)new MilestoneDto(Get("id")!.ToString()!, Get("projectId")!.ToString()!, Get("name")?.ToString() ?? "", Get("description")?.ToString() ?? "", Get("deadline")?.ToString() ?? "", Get("status")?.ToString() ?? "Open", Get("completedAt")?.ToString());
    if (typeof(T) == typeof(ProjectActivityDto))
        return (T)(object)new ProjectActivityDto(Get("id")!.ToString()!, Get("projectId")!.ToString()!, Get("actorId")?.ToString(), Get("actorName")?.ToString(), Get("action")?.ToString() ?? "", Get("message")?.ToString() ?? "", Get("createdAt")?.ToString() ?? "");
    throw new NotSupportedException(typeof(T).Name);
}

sealed class SqlDb(string connectionString)
{
    public async Task EnsureDatabaseAsync(string databaseName)
    {
        var master = new SqlConnectionStringBuilder(connectionString) { InitialCatalog = "master" }.ConnectionString;
        await using var conn = await OpenWithRetryAsync(master);
        await using var cmd = new SqlCommand($"IF DB_ID(N'{databaseName.Replace("'", "''")}') IS NULL CREATE DATABASE [{databaseName}]", conn);
        await cmd.ExecuteNonQueryAsync();
    }

    public Task<SqlConnection> OpenAsync()
    {
        return OpenWithRetryAsync(connectionString);
    }

    static async Task<SqlConnection> OpenWithRetryAsync(string cs)
    {
        const int maxAttempts = 30;
        for (var attempt = 1; ; attempt++)
        {
            var conn = new SqlConnection(cs);
            try
            {
                await conn.OpenAsync();
                return conn;
            }
            catch (SqlException) when (attempt < maxAttempts)
            {
                await conn.DisposeAsync();
                await Task.Delay(TimeSpan.FromSeconds(2));
            }
        }
    }
}

record ProjectCreateRequest(string Name, string Description, string Status, string StatusText, string Color, List<MemberDto>? Members);
record ProjectUpdateRequest(string Name, string Description, string Status, string StatusText, string Color);
record ProjectProgressRequest(int Progress);
record ProjectMembersRequest(JsonElement Members)
{
    public List<ProjectMemberRequest> MemberRows()
    {
        if (Members.ValueKind != JsonValueKind.Array) return [];
        var rows = new List<ProjectMemberRequest>();
        foreach (var item in Members.EnumerateArray())
        {
            if (item.ValueKind == JsonValueKind.String)
            {
                var userId = item.GetString();
                if (!string.IsNullOrWhiteSpace(userId)) rows.Add(new ProjectMemberRequest(userId, "Member"));
                continue;
            }

            if (item.ValueKind != JsonValueKind.Object) continue;
            var id = item.TryGetProperty("userId", out var userIdProp)
                ? userIdProp.GetString()
                : item.TryGetProperty("id", out var idProp)
                    ? idProp.GetString()
                    : null;
            if (string.IsNullOrWhiteSpace(id)) continue;
            var role = item.TryGetProperty("role", out var roleProp) ? roleProp.GetString() : "Member";
            rows.Add(new ProjectMemberRequest(id, string.IsNullOrWhiteSpace(role) ? "Member" : role));
        }
        return rows;
    }
}
record ProjectMemberRequest(string UserId, string? Role);
record SprintCreateRequest(string Name, string Goal, string StartDate, string EndDate, string? Status);
record MilestoneCreateRequest(string Name, string Description, string Deadline, string? Status);
record ProjectRow(string Id, string Name, string Description, string Status, string StatusText, int Progress, string Color, string CreatedAt);
record ProjectMemberRow(string ProjectId, string UserId, string Role);
record ProjectMemberSeed(string UserId, string Role);
record ProjectSeed(string Id, string Name, string Description, string Status, string StatusText, int Progress, string Color, ProjectMemberSeed[] Members);
record ProjectDto(string Id, string Name, string Description, string Status, string StatusText, int Progress, string Color, string CreatedAt, List<MemberDto> Members);
record MemberDto(string Id, string FullName, string AvatarUrl, string Role, bool IsOnline, string Email);
record SprintDto(string Id, string ProjectId, string Name, string Goal, string StartDate, string EndDate, string Status);
record MilestoneDto(string Id, string ProjectId, string Name, string Description, string Deadline, string Status, string? CompletedAt);
record ProjectActivityDto(string Id, string ProjectId, string? ActorId, string? ActorName, string Action, string Message, string CreatedAt);
record EventActor(string Id, string FullName, string Role);
record ProjectEventRequest(string Type, string Title, string Message, string? ProjectId, List<string> RecipientUserIds, EventActor? Actor);

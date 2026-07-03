param(
  [string]$GatewayBase = "http://localhost:7000",
  [string]$Email = "admin@projecthub.com",
  [string]$Password = "admin123"
)

$ErrorActionPreference = "Stop"
$api = "$GatewayBase/api"

function Write-Step([string]$message) {
  Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Url,
    $Body = $null,
    [hashtable]$Headers = @{}
  )

  $params = @{
    Method = $Method
    Uri = $Url
    Headers = $Headers
  }

  if ($null -ne $Body) {
    $json = ($Body | ConvertTo-Json -Depth 12)
    $params.ContentType = "application/json; charset=utf-8"
    $params.Body = [System.Text.Encoding]::UTF8.GetBytes($json)
  }

  Invoke-RestMethod @params
}

Write-Host "SprintFlow Gateway full-flow test" -ForegroundColor Green
Write-Host "Gateway: $GatewayBase"

Write-Step "1. Gateway health"
$gatewayHealth = Invoke-Api GET "$GatewayBase/health"
$gatewayHealth | ConvertTo-Json -Depth 6

Write-Step "2. Login through Gateway"
$login = Invoke-Api POST "$api/auth/login" @{ email = $Email; password = $Password }
$token = $login.token
if (-not $token) { throw "Login did not return token" }
$headers = @{ Authorization = "Bearer $token" }
$user = $login.user
Write-Host "Logged in as $($user.fullName) / $($user.role)" -ForegroundColor Green

Write-Step "3. Read users/projects/tasks/notifications through Gateway"
$users = Invoke-Api GET "$api/users" $null $headers
$credentials = Invoke-Api GET "$api/users/credentials" $null $headers
$projectsBefore = Invoke-Api GET "$api/projects" $null $headers
$tasksBefore = Invoke-Api GET "$api/tasks" $null $headers
$notificationsBefore = Invoke-Api GET "$api/notifications" $null $headers
Write-Host "Users=$($users.Count), Credentials=$($credentials.Count), Projects=$($projectsBefore.Count), Tasks=$($tasksBefore.Count), Notifications=$($notificationsBefore.Count)" -ForegroundColor Green

Write-Step "3.1 Register and login a new account through Gateway"
$demoEmail = "demo$(Get-Date -Format HHmmss)@projecthub.com"
$registered = Invoke-Api POST "$api/auth/register" @{
  fullName = "Demo Tester"
  email = $demoEmail
  password = "123456"
  role = "Member"
}
if (-not $registered.token) { throw "Register did not return token" }
$registeredLogin = Invoke-Api POST "$api/auth/login" @{ email = $demoEmail; password = "123456" }
Write-Host "Registered and logged in: $($registeredLogin.user.email)" -ForegroundColor Green

Write-Step "3.2 Admin reset password for a demo user"
$targetCredential = @($credentials | Where-Object { $_.email -eq "viewer02@projecthub.com" } | Select-Object -First 1)[0]
if ($targetCredential) {
  Invoke-Api PUT "$api/users/$($targetCredential.id)/password" @{ newPassword = "123456" } $headers | Out-Null
  Write-Host "Reset password OK for $($targetCredential.email)" -ForegroundColor Green
} else {
  Write-Host "viewer02@projecthub.com not found, skip reset password test" -ForegroundColor Yellow
}

Write-Step "4. Create real Project in ProjectDB via Gateway"
$project = Invoke-Api POST "$api/projects" @{
  name = "Dự án F12 Demo $(Get-Date -Format HHmmss)"
  description = "Tạo bằng scripts/test-sprintflow-flow.ps1 để chứng minh frontend gọi API Gateway."
  status = "Active"
  statusText = "Đang triển khai"
  color = "indigo"
} $headers
Write-Host "Created project: $($project.id)" -ForegroundColor Green

Invoke-Api PUT "$api/projects/$($project.id)/members" @{ members = @($user.id) } $headers | Out-Null
Write-Host "Updated project members: $($user.id)" -ForegroundColor Green

Write-Step "5. Create real Task in TaskDB via Gateway"
$task = Invoke-Api POST "$api/tasks" @{
  title = "Kiểm thử comment và notification $(Get-Date -Format HHmmss)"
  description = "Task tạo bằng test tool để thầy thấy F12 gọi /api/tasks qua Gateway."
  status = "ToDo"
  priority = "High"
  dueDate = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
  projectId = $project.id
  assigneeId = $user.id
  creatorId = $user.id
  labels = @("demo", "gateway", "kiểm thử")
  estimatedHours = 4
} $headers
Write-Host "Created task: $($task.id)" -ForegroundColor Green

Write-Step "6. Add real Comment in NotifyDB via Gateway"
$comment = Invoke-Api POST "$api/tasks/$($task.id)/comments" @{
  content = "Bình luận thật từ test tool. Nếu mở F12 sẽ thấy POST /api/tasks/$($task.id)/comments đi qua Gateway."
} $headers
Write-Host "Created comment: $($comment.id)" -ForegroundColor Green

Write-Step "6.1 Add subtask and toggle completed state"
$subTask = Invoke-Api POST "$api/tasks/$($task.id)/subtasks" @{
  title = "Checklist demo F12 qua Gateway"
} $headers
Invoke-Api PUT "$api/tasks/$($task.id)/subtasks/$($subTask.id)/toggle" $null $headers | Out-Null
Write-Host "Subtask toggled: $($subTask.id)" -ForegroundColor Green

Write-Step "6.2 Add worklog"
$worklog = Invoke-Api POST "$api/tasks/$($task.id)/worklogs" @{
  hours = 1
  description = "Log giờ thật từ test tool"
} $headers
Write-Host "Worklog hours: $($worklog.hours)" -ForegroundColor Green

Write-Step "7. Read notifications, unread count, activity logs"
$notifications = Invoke-Api GET "$api/notifications" $null $headers
$unread = Invoke-Api GET "$api/notifications/unread-count" $null $headers
$logs = Invoke-Api GET "$api/activity-logs" $null $headers
Write-Host "Notifications=$($notifications.Count), Unread=$($unread.count), ActivityLogs=$($logs.Count)" -ForegroundColor Green

if ($notifications.Count -gt 0) {
  Invoke-Api PATCH "$api/notifications/$($notifications[0].id)/read" $null $headers | Out-Null
  Write-Host "Marked first notification as read" -ForegroundColor Green
}

Write-Step "8. Diagnostics services/routes through Gateway"
$diagServices = Invoke-Api GET "$api/diagnostics/services" $null $headers
$diagRoutes = Invoke-Api GET "$api/diagnostics/routes" $null $headers
$diagServices | ConvertTo-Json -Depth 8
Write-Host "Route rows=$($diagRoutes.Count)" -ForegroundColor Green

Write-Step "DONE"
Write-Host "F12 checklist URLs:" -ForegroundColor Yellow
Write-Host "POST  $api/auth/login"
Write-Host "GET   $api/projects"
Write-Host "GET   $api/tasks"
Write-Host "POST  $api/tasks/$($task.id)/comments"
Write-Host "PUT   $api/tasks/$($task.id)/subtasks/$($subTask.id)/toggle"
Write-Host "POST  $api/tasks/$($task.id)/worklogs"
Write-Host "GET   $api/users/credentials"
Write-Host "GET   $api/notifications"
Write-Host "GET   $api/diagnostics/services"

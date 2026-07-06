param(
  [string]$ApiBase = "http://localhost:7000/api",
  [string]$Email = "admin@projecthub.com",
  [string]$Password = "admin123",
  [switch]$CreateRealTask
)

$ErrorActionPreference = "Stop"
$GatewayBase = $ApiBase -replace "/api/?$", ""

function Invoke-SprintFlowApi {
  param(
    [string]$Method,
    [string]$Url,
    $Body = $null,
    $Headers = @{}
  )

  $params = @{
    Method = $Method
    Uri = $Url
    Headers = $Headers
  }

  if ($null -ne $Body) {
    $params.Body = ($Body | ConvertTo-Json -Depth 12)
    $params.ContentType = "application/json; charset=utf-8"
  }

  Invoke-RestMethod @params
}

Write-Host "== SprintFlow AI/Broker smoke test =="
Write-Host "Gateway: $GatewayBase"

Write-Host "`n[1] Gateway health"
Invoke-SprintFlowApi GET "$GatewayBase/health" | ConvertTo-Json -Depth 8

Write-Host "`n[2] Login admin"
$login = Invoke-SprintFlowApi POST "$ApiBase/auth/login" @{ email = $Email; password = $Password }
$token = $login.token
if (-not $token) { throw "Login failed: token is empty" }
$headers = @{ Authorization = "Bearer $token" }
Write-Host "Logged in as $($login.user.fullName) / $($login.user.role)"

Write-Host "`n[3] Diagnostics services"
Invoke-SprintFlowApi GET "$ApiBase/diagnostics/services" $null $headers | ConvertTo-Json -Depth 10

Write-Host "`n[4] Diagnostics routes"
Invoke-SprintFlowApi GET "$ApiBase/diagnostics/routes" $null $headers | ConvertTo-Json -Depth 10

Write-Host "`n[5] Diagnostics broker"
Invoke-SprintFlowApi GET "$ApiBase/diagnostics/broker" $null $headers | ConvertTo-Json -Depth 10

Write-Host "`n[6] AI chat"
Invoke-SprintFlowApi POST "$ApiBase/ai/chat" @{
  message = "Tom tat tinh trang workspace va neu ro frontend dang goi qua Gateway."
} $headers | ConvertTo-Json -Depth 10

Write-Host "`n[7] AI suggest tasks"
$suggest = Invoke-SprintFlowApi POST "$ApiBase/ai/suggest-tasks" @{
  prompt = "Can them task demo cho nhom 3: comment, notification, activity log va AI."
} $headers
$suggest | ConvertTo-Json -Depth 10

Write-Host "`n[8] AI create task draft"
$draft = Invoke-SprintFlowApi POST "$ApiBase/ai/create-task-from-text" @{
  prompt = "Kiem thu AI tao task qua Gateway va sinh notification cho nguoi duoc giao"
  confirm = $false
} $headers
$draft | ConvertTo-Json -Depth 10

if ($CreateRealTask) {
  Write-Host "`n[9] AI create real task"
  Invoke-SprintFlowApi POST "$ApiBase/ai/create-task-from-text" @{
    prompt = "AI smoke test task $(Get-Date -Format 'HHmmss')"
    confirm = $true
  } $headers | ConvertTo-Json -Depth 10

  Write-Host "`n[10] Notifications after task creation"
  Invoke-SprintFlowApi GET "$ApiBase/notifications?status=all" $null $headers | Select-Object -First 5 | ConvertTo-Json -Depth 10
}

Write-Host "`nOK - smoke test completed."

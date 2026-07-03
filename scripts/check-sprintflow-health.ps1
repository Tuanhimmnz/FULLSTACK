param(
  [string]$GatewayBase = "http://localhost:7000",
  [string]$ProjectBase = "http://localhost:5001",
  [string]$TaskBase = "http://localhost:5002",
  [string]$NotifyBase = "http://localhost:5003"
)

$ErrorActionPreference = "Continue"
$targets = @(
  @{ Name = "Gateway"; Url = "$GatewayBase/health" },
  @{ Name = "ProjectService"; Url = "$ProjectBase/health" },
  @{ Name = "TaskService"; Url = "$TaskBase/health" },
  @{ Name = "NotifyService"; Url = "$NotifyBase/health" }
)

Write-Host "SprintFlow health check" -ForegroundColor Cyan
foreach ($target in $targets) {
  try {
    $result = Invoke-RestMethod -Method GET -Uri $target.Url -TimeoutSec 5
    Write-Host ("[OK]   {0,-14} {1}" -f $target.Name, $target.Url) -ForegroundColor Green
    $result | ConvertTo-Json -Depth 4
  } catch {
    Write-Host ("[FAIL] {0,-14} {1} -> {2}" -f $target.Name, $target.Url, $_.Exception.Message) -ForegroundColor Red
  }
}

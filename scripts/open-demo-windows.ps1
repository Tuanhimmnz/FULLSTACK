param(
  [int]$FrontendPort = 8080,
  [int]$GatewayPort = 7000
)

$root = Resolve-Path "$PSScriptRoot\.."
$frontendUrl = "http://localhost:$FrontendPort"
$gatewayUrl = "http://localhost:$GatewayPort/health"

Write-Host "Starting visible demo windows from $root" -ForegroundColor Cyan

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$root'; docker compose -f docker-compose.microservices.yml up -d --build; docker compose -f docker-compose.microservices.yml logs -f --tail=80"
)

Start-Sleep -Seconds 3

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$root'; npm install --prefix frontend; npm run dev --prefix frontend -- --host 0.0.0.0 --port $FrontendPort"
)

Start-Sleep -Seconds 5
Start-Process $frontendUrl
Start-Process $gatewayUrl

Write-Host "Frontend: $frontendUrl" -ForegroundColor Green
Write-Host "Gateway health: $gatewayUrl" -ForegroundColor Green

param([int]$Port = 5780)
$ErrorActionPreference = 'Stop'
$taskRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$taskHome = Join-Path $taskRoot '.datapass\cockpit-home'
$taskServer = Join-Path $taskRoot 'apps\server\dist\bin.mjs'
if ($Port -lt 1024 -or $Port -gt 65535) { throw 'Choose a port between 1024 and 65535.' }
if (-not (Test-Path -LiteralPath $taskServer)) { throw 'Build the T3 server and web client first. See docs/user/datapass-cockpit.md.' }
Push-Location $taskRoot
try {
  # Explicit isolated home, loopback only, no automatic browser and no provider launch.
  Write-Output "DataPass cockpit: http://127.0.0.1:$Port/datapass"
  & node $taskServer --host 127.0.0.1 --port $Port --base-dir $taskHome --no-browser
} finally { Pop-Location }

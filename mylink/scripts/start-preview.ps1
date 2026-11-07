$ErrorActionPreference = 'Stop'
$taskProjectRoot = Split-Path -Parent $PSScriptRoot
$taskNodeCommand = Get-Command node -ErrorAction SilentlyContinue
$taskNodeExecutable = if ($taskNodeCommand) { $taskNodeCommand.Source } else { $null }

if (-not $taskNodeExecutable) {
    $taskRuntimeRoot = Join-Path $env:TEMP 'codex-mylink-runtime'
    $taskCachedRuntime = Get-ChildItem -LiteralPath $taskRuntimeRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^node-v\d+.*-win-x64$' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1
    if ($taskCachedRuntime) { $taskNodeExecutable = Join-Path $taskCachedRuntime.FullName 'node.exe' }
}

if (-not $taskNodeExecutable -or -not (Test-Path -LiteralPath $taskNodeExecutable)) {
    throw 'Install Node.js LTS from https://nodejs.org and run preview.cmd again.'
}

$taskNodeDirectory = Split-Path -Parent $taskNodeExecutable
$env:Path = $taskNodeDirectory + ';' + $env:Path
Set-Location -LiteralPath $taskProjectRoot

if (-not (Test-Path -LiteralPath (Join-Path $taskProjectRoot 'out\index.html'))) {
    & (Join-Path $taskNodeDirectory 'npm.cmd') ci --no-fund --no-audit
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    & (Join-Path $taskNodeDirectory 'npm.cmd') run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host 'MyLink profile: http://localhost:3000'
Write-Host 'Manage links:   http://localhost:3000/mypage/'
Write-Host 'Keep this window open. Press Ctrl+C to stop.'
& $taskNodeExecutable (Join-Path $PSScriptRoot 'preview.mjs')
exit $LASTEXITCODE

# Restart SkillHub in the background on Windows.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$VenvPython = Join-Path $Root ".venv\Scripts\python.exe"
$Python = if (Test-Path $VenvPython) { $VenvPython } else { "python" }

Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object { $_.CommandLine -like "*skillhub*" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Start-Process -FilePath $Python `
  -ArgumentList "-m", "skillhub", "--port", "8080" `
  -WorkingDirectory $Root `
  -WindowStyle Hidden

Start-Sleep -Seconds 2
Invoke-RestMethod "http://127.0.0.1:8080/api/health"

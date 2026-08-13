@echo off
title Put Capacity Tracker on this Desktop
cd /d "%~dp0"

set "PS1=%~dp0Start-CapacityTracker.ps1"
if not exist "%PS1%" (
  echo Could not find Start-CapacityTracker.ps1 in this folder.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Get-ChildItem -LiteralPath '%~dp0' -File | Unblock-File -ErrorAction SilentlyContinue;" ^
  "$desk = [Environment]::GetFolderPath('Desktop');" ^
  "$path = Join-Path $desk 'Capacity Tracker.lnk';" ^
  "$w = New-Object -ComObject WScript.Shell;" ^
  "$s = $w.CreateShortcut($path);" ^
  "$s.TargetPath = (Get-Command powershell.exe).Source;" ^
  "$s.Arguments = '-NoProfile -ExecutionPolicy Bypass -File ""%PS1%""';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.WindowStyle = 1;" ^
  "$s.Description = 'Start Capacity Tracker';" ^
  "$s.Save();" ^
  "Write-Host 'Created:' $path"

echo.
echo Done. Delete the old Desktop icon if it still asks every time.
echo Use the new Capacity Tracker icon.
echo.
pause

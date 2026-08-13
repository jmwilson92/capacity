@echo off
title Put Capacity Tracker on this Desktop
cd /d "%~dp0"

set "TARGET=%~dp0START Capacity Tracker.bat"
if not exist "%TARGET%" set "TARGET=%~dp0Start-CapacityTracker.bat"
if not exist "%TARGET%" (
  echo Could not find the starter in this folder.
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$desk = [Environment]::GetFolderPath('Desktop');" ^
  "$path = Join-Path $desk 'Capacity Tracker.lnk';" ^
  "$w = New-Object -ComObject WScript.Shell;" ^
  "$s = $w.CreateShortcut($path);" ^
  "$s.TargetPath = '%TARGET%';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.WindowStyle = 1;" ^
  "$s.Description = 'Start Capacity Tracker';" ^
  "$s.Save();" ^
  "Write-Host 'Created:' $path"

echo.
echo Done. Look on your Desktop for "Capacity Tracker".
echo Double-click that from now on.
echo.
pause

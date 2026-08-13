@echo off
title Unblock Capacity Tracker files
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -LiteralPath '%~dp0' -File | Unblock-File; Write-Host 'Unblocked files in this folder.'"
echo.
echo If Windows still asks every time, delete your old Desktop shortcut
echo and run "Put shortcut on Desktop.bat" again.
echo.
pause

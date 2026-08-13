@echo off
title Capacity Tracker — keep this window open
cd /d "%~dp0"
echo Starting Capacity Tracker...
echo A browser window will open to http://127.0.0.1:8765
echo Leave THIS black window open until you are done.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-CapacityTracker.ps1"
echo.
echo Server stopped. You can close this window.
pause

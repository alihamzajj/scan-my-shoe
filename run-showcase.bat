@echo off
echo Starting App Showcase + Admin Dashboard Prototype...
cd /d "%~dp0showcase-platform"
call npm run dev -- --host --port 5173
pause

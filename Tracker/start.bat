@echo off
echo ========================================
echo Starting Project Tracker Backend
echo ========================================
cd Backend
start cmd /k "npm start"
echo Backend starting on http://localhost:5000
echo.
timeout /t 3
echo.
echo ========================================
echo Starting Project Tracker Frontend
echo ========================================
cd ..\Frontend\mcp_tracker
start cmd /k "npm start"
echo Frontend will open on http://localhost:3000
echo.
echo ========================================
echo Both servers are starting!
echo Close this window when done.
echo ========================================

@echo off
echo ========================================
echo Project Tracker - Installation Script
echo ========================================
echo.

echo Installing Backend dependencies...
cd Backend
call npm install
call npm install cors nodemon
echo Backend dependencies installed!
echo.

echo Installing Frontend dependencies...
cd ..\Frontend\mcp_tracker
echo Frontend dependencies should already be installed
echo If not, run: npm install
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in Backend folder):
echo    npm start
echo    or
echo    npm run dev
echo.
echo 2. Start Frontend (in Frontend/mcp_tracker folder):
echo    npm start
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
pause

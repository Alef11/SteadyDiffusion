@echo off
echo Starting DaddyDiffusion...
echo.

REM Start backend server in a new window
echo Starting backend API server...
start "DaddyDiffusion Backend" cmd /k "cd /d %~dp0 && python backend\main.py"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend server in a new window
echo Starting frontend development server...
start "DaddyDiffusion Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait for frontend to start
echo Waiting for servers to start...
timeout /t 8 /nobreak > nul

REM Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo DaddyDiffusion is running!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will continue running)...
pause > nul

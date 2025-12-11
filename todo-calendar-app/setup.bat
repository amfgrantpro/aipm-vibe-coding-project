@echo off
REM Quick-start script for To-Do Calendar App (Windows)

echo 🎯 To-Do + Calendar App Setup
echo ================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
echo.

REM Setup backend
echo 📦 Setting up backend...
cd backend
if exist node_modules (
    echo    ✓ Backend dependencies already installed
) else (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo    ✓ Backend dependencies installed
    ) else (
        echo    ❌ Failed to install backend dependencies
        exit /b 1
    )
)
cd ..

REM Setup frontend
echo 📦 Setting up frontend...
cd frontend
if exist node_modules (
    echo    ✓ Frontend dependencies already installed
) else (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo    ✓ Frontend dependencies installed
    ) else (
        echo    ❌ Failed to install frontend dependencies
        exit /b 1
    )
)
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 To start the app:
echo.
echo    Terminal 1 (Backend):
echo    ^> cd backend ^&^& npm start
echo.
echo    Terminal 2 (Frontend):
echo    ^> cd frontend ^&^& npm run dev
echo.
echo    Then open: http://localhost:3000
echo.
echo Try these tasks to test parsing:
echo    • Dentist at 3pm tomorrow
echo    • Report due by Friday
echo    • Water plants
echo    • Meeting Monday at 10am
echo.
pause

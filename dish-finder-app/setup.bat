@echo off
REM Dish Finder App - Setup Script for Windows

echo 🍽️  Dish Finder App - Setup Script
echo ====================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js found: %NODE_VERSION%
echo ✅ npm found: %NPM_VERSION%

REM Setup Backend
echo.
echo 📦 Setting up backend...
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

echo ✅ Backend dependencies installed
cd ..

REM Setup Frontend
echo.
echo 📦 Setting up frontend...
cd frontend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo ✅ Frontend dependencies installed
cd ..

REM Success message
echo.
echo ======================================
echo ✅ Setup Complete!
echo ======================================
echo.
echo To run the app:
echo.
echo Terminal 1 (Backend):
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend ^&^& npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause

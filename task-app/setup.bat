@echo off
REM Setup Task Manager App

echo 📋 Setting up Task Manager...
echo.

REM Install backend
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend  
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the app:
echo   1. Terminal 1: cd task-app\backend ^&^& npm start
echo   2. Terminal 2: cd task-app\frontend ^&^& npm run dev
echo.
echo Then open: http://localhost:5173

@echo off
echo Setting up Medicine Information Web Application...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To start the application:
echo 1. Open two command prompts
echo 2. In first prompt: cd backend && npm start
echo 3. In second prompt: cd frontend && npm start
echo.
echo The application will be available at http://localhost:3000
pause
@echo off
setlocal enabledelayedexpansion

REM LinkedInScholar Development Setup Script for Windows
REM This script sets up the development environment for LinkedInScholar

echo.
echo 🚀 Setting up LinkedInScholar development environment...
echo.

REM Check if Node.js is installed
echo [STEP] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%i in ('node -v ^| findstr /r "v[0-9]*\."') do (
    set NODE_VERSION=%%i
    set NODE_VERSION=!NODE_VERSION:v=!
)

if !NODE_VERSION! lss 18 (
    echo [ERROR] Node.js version 18+ is required. Current version: 
    node -v
    pause
    exit /b 1
)

for /f %%i in ('node -v') do set NODE_VER=%%i
echo [SUCCESS] Node.js !NODE_VER! is installed
echo.

REM Check if MongoDB is accessible
echo [STEP] Checking MongoDB connection...
echo [WARNING] Please ensure MongoDB is running on localhost:27017
echo   You can start MongoDB using:
echo   - MongoDB Service: net start MongoDB
echo   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest
echo.

REM Install root dependencies
echo [STEP] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Root dependencies installed
echo.

REM Install backend dependencies
echo [STEP] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
echo.

REM Install frontend dependencies
echo [STEP] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
echo.

cd ..

REM Create environment files from examples
echo [STEP] Setting up environment files...

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo [SUCCESS] Created backend\.env from example
    echo [WARNING] Please update backend\.env with your actual API keys and configuration
) else (
    echo [WARNING] backend\.env already exists, skipping...
)

if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul
    echo [SUCCESS] Created frontend\.env from example
    echo [WARNING] Please update frontend\.env with your configuration
) else (
    echo [WARNING] frontend\.env already exists, skipping...
)

echo.

REM Check for required API keys
echo [STEP] Checking environment configuration...
echo [WARNING] Please ensure you have the following API keys configured in backend\.env:
echo   - LINKEDIN_CLIENT_ID (LinkedIn OAuth)
echo   - LINKEDIN_CLIENT_SECRET (LinkedIn OAuth)
echo   - GEMINI_API_KEY (Google Gemini AI)
echo   - JWT_SECRET (Generate a secure random string)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Configure your API keys in backend\.env
echo 2. Start MongoDB if not already running
echo 3. Run 'npm run dev' to start both frontend and backend
echo.
echo 🔗 Useful commands:
echo   npm run dev          - Start both frontend and backend
echo   npm run dev:backend  - Start only backend server
echo   npm run dev:frontend - Start only frontend server
echo   npm run build        - Build frontend for production
echo.
echo 🌐 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   API:      http://localhost:5000/api
echo.
echo [SUCCESS] Happy coding with LinkedInScholar! 🚀
echo.

pause
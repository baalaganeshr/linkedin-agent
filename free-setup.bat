@echo off
setlocal enabledelayedexpansion

REM LinkedInScholar FREE Setup Demo Script for Windows
REM This script demonstrates how to set up the 100% FREE version

cls
echo.
echo 🚀 LinkedInScholar - 100% FREE VERSION Setup 🆓
echo =================================================
echo.
echo 💰 Total Cost: ₹0 (ZERO RUPEES)  
echo ⚡ AI Power: Groq (FREE - 14,400 requests/day)
echo 🗄️  Database: MongoDB Atlas (FREE - 512MB)
echo 🌐 Hosting: Render + Vercel (FREE)
echo.
echo Let's get started! 🎯
echo.

REM Check Node.js
echo 🔍 Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js !NODE_VERSION! is installed
echo.

echo 📦 Installing dependencies...
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies (FREE)...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully

REM Install frontend dependencies  
echo 📦 Installing frontend dependencies (FREE)...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully

cd ..

echo.
echo ⚙️  Setting up environment files...

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo ✅ Created backend\.env from example
) else (
    echo ⚠️  backend\.env already exists
)

REM Create frontend .env if it doesn't exist
if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul
    echo ✅ Created frontend\.env from example
) else (
    echo ⚠️  frontend\.env already exists
)

echo.
echo 🎉 Setup Complete! Here's what you need to do next:
echo.
echo 📋 STEP 1: Get your FREE API keys (5 minutes):
echo.
echo    🔗 MongoDB Atlas (FREE Database - 512MB):
echo       👉 https://www.mongodb.com/cloud/atlas/register
echo       📝 Create FREE cluster → Get connection string
echo.
echo    🔗 Groq AI (FREE - 14,400 requests/day):  
echo       👉 https://console.groq.com/
echo       📝 Sign up FREE → Get API key
echo.
echo    🔗 LinkedIn OAuth (FREE):
echo       👉 https://www.linkedin.com/developers/apps
echo       📝 Create app → Get Client ID ^& Secret
echo.
echo 📋 STEP 2: Update your environment files:
echo.
echo    📝 Edit backend\.env with your API keys:
echo       - MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/linkedinscholar
echo       - GROQ_API_KEY=gsk_your_free_groq_api_key
echo       - LINKEDIN_CLIENT_ID=your_client_id
echo       - LINKEDIN_CLIENT_SECRET=your_client_secret
echo.
echo 📋 STEP 3: Start the application:
echo.
echo    🚀 Run both frontend and backend:
echo       npm run dev
echo.
echo    🌐 Or run separately:
echo       npm run dev:backend  (port 5000)
echo       npm run dev:frontend (port 3000)
echo.
echo 🎯 URLs after setup:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    API Health: http://localhost:5000/api/health
echo.
echo 💡 Pro Tips:
echo    • All features are FREE - no premium plans!
echo    • Groq AI is faster than OpenAI GPT-4
echo    • MongoDB Atlas FREE tier is permanent
echo    • Deploy FREE on Render + Vercel
echo.
echo 🎉 Happy coding with LinkedInScholar FREE! 🚀
echo.
echo 📞 Need help? Check out our documentation:
echo    👉 FREE_README.md
echo.
echo ⭐ Star our repo if this helped you land a job! ⭐
echo.

REM Offer to start the development server
set /p "choice=🚀 Do you want to start the development server now? (y/n): "
if /i "%choice%"=="y" (
    echo.
    echo 🚀 Starting LinkedInScholar FREE version...
    echo 💡 Make sure you've added your API keys to backend\.env first!
    echo.
    call npm run dev
)

pause
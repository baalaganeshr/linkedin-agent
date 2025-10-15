@echo off
REM 🤖 AI Provider Setup Script for LinkedInScholar (Windows)
REM Choose your preferred AI provider - ALL OPTIONS INCLUDED!

echo LinkedInScholar - AI Provider Setup
echo ======================================
echo.
echo Choose your AI provider (multiple options supported):
echo.
echo 1. [FREE] Ollama (LOCAL - 100%% FREE, No API needed)
echo    - Runs on your computer
echo    - No internet required after setup  
echo    - No usage limits
echo    - Privacy: Your data never leaves your machine
echo.
echo 2. [FREE] Groq (CLOUD - FREE 14,400 requests/day)
echo    - Fast and reliable
echo    - No credit card required
echo    - Great for production use
echo.
echo 3. [FREE] Google Gemini (CLOUD - FREE tier available)
echo    - Google's latest AI
echo    - Generous free tier
echo.
echo 4. [PAID] OpenAI (CLOUD - PAID)
echo    - High quality responses
echo    - Popular choice
echo.
echo 5. [TEMPLATE] Template-based (NO AI - Always works)
echo    - No API required
echo    - Good quality templates
echo    - Perfect fallback
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo [FREE] Setting up Ollama (LOCAL)...
    echo.
    echo Setup Instructions:
    echo 1. Install Ollama from: https://ollama.ai
    echo 2. Run: ollama pull llama3.2:3b
    echo 3. Start Ollama service
    echo.
    echo 💾 Adding to .env file...
    echo OLLAMA_HOST=http://localhost:11434 >> backend\.env
    echo ✅ Ollama configured!
) else if "%choice%"=="2" (
    echo 🆓 Setting up Groq...
    echo.
    echo 📋 Setup Instructions:
    echo 1. Visit: https://console.groq.com/
    echo 2. Sign up (FREE, no credit card)
    echo 3. Create API key
    echo.
    set /p groq_key="Enter your Groq API key: "
    echo GROQ_API_KEY=%groq_key% >> backend\.env
    echo ✅ Groq configured!
) else if "%choice%"=="3" (
    echo 🆓 Setting up Google Gemini...
    echo.
    echo 📋 Setup Instructions:
    echo 1. Visit: https://makersuite.google.com/app/apikey
    echo 2. Create API key (FREE tier available)  
    echo.
    set /p gemini_key="Enter your Gemini API key: "
    echo GEMINI_API_KEY=%gemini_key% >> backend\.env
    echo ✅ Gemini configured!
) else if "%choice%"=="4" (
    echo 💰 Setting up OpenAI...
    echo.
    echo 📋 Setup Instructions:
    echo 1. Visit: https://platform.openai.com/api-keys
    echo 2. Create API key (requires payment method)
    echo.
    set /p openai_key="Enter your OpenAI API key: "
    echo OPENAI_API_KEY=%openai_key% >> backend\.env
    echo ✅ OpenAI configured!
) else if "%choice%"=="5" (
    echo 📝 Using Template-based AI...
    echo ✅ No setup required - always works!
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Setup Complete!
echo.
echo 🚀 Next steps:
echo 1. cd backend ^&^& npm install
echo 2. npm start  
echo 3. Your AI provider is ready to use!
echo.
echo 💡 Pro tip: You can configure multiple providers as fallbacks!
pause
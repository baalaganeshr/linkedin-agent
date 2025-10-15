#!/bin/bash
# 🤖 AI Provider Setup Script for LinkedInScholar
# Choose your preferred AI provider - ALL OPTIONS INCLUDED!

echo "🚀 LinkedInScholar - AI Provider Setup"
echo "======================================"
echo ""
echo "Choose your AI provider (multiple options supported):"
echo ""
echo "1. 🆓 Ollama (LOCAL - 100% FREE, No API needed)"
echo "   - Runs on your computer"
echo "   - No internet required after setup"
echo "   - No usage limits"
echo "   - Privacy: Your data never leaves your machine"
echo ""
echo "2. 🆓 Groq (CLOUD - FREE 14,400 requests/day)"
echo "   - Fast and reliable"
echo "   - No credit card required"
echo "   - Great for production use"
echo ""
echo "3. 🆓 Google Gemini (CLOUD - FREE tier available)"
echo "   - Google's latest AI"
echo "   - Generous free tier"
echo ""
echo "4. 💰 OpenAI (CLOUD - PAID)"
echo "   - High quality responses"
echo "   - Popular choice"
echo ""
echo "5. 📝 Template-based (NO AI - Always works)"
echo "   - No API required"
echo "   - Good quality templates"
echo "   - Perfect fallback"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo "🆓 Setting up Ollama (LOCAL)..."
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Install Ollama from: https://ollama.ai"
    echo "2. Run: ollama pull llama3.2:3b"
    echo "3. Start Ollama service"
    echo ""
    echo "💾 Adding to .env file..."
    echo "OLLAMA_HOST=http://localhost:11434" >> backend/.env
    echo "✅ Ollama configured!"
    ;;
  2)
    echo "🆓 Setting up Groq..."
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Visit: https://console.groq.com/"
    echo "2. Sign up (FREE, no credit card)"
    echo "3. Create API key"
    echo ""
    read -p "Enter your Groq API key: " groq_key
    echo "GROQ_API_KEY=$groq_key" >> backend/.env
    echo "✅ Groq configured!"
    ;;
  3)
    echo "🆓 Setting up Google Gemini..."
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Visit: https://makersuite.google.com/app/apikey"
    echo "2. Create API key (FREE tier available)"
    echo ""
    read -p "Enter your Gemini API key: " gemini_key
    echo "GEMINI_API_KEY=$gemini_key" >> backend/.env
    echo "✅ Gemini configured!"
    ;;
  4)
    echo "💰 Setting up OpenAI..."
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Visit: https://platform.openai.com/api-keys"
    echo "2. Create API key (requires payment method)"
    echo ""
    read -p "Enter your OpenAI API key: " openai_key
    echo "OPENAI_API_KEY=$openai_key" >> backend/.env
    echo "✅ OpenAI configured!"
    ;;
  5)
    echo "📝 Using Template-based AI..."
    echo "✅ No setup required - always works!"
    ;;
  *)
    echo "❌ Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "🚀 Next steps:"
echo "1. cd backend && npm install"
echo "2. npm start"
echo "3. Your AI provider is ready to use!"
echo ""
echo "💡 Pro tip: You can configure multiple providers as fallbacks!"
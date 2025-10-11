#!/bin/bash

echo "🚀 LinkedInScholar Phase 2 Setup - Infrastructure Only"
echo "======================================================"

echo ""
echo "📋 Phase 2 includes:"
echo "✅ Authentication system (LinkedIn OAuth)"
echo "✅ Database models and connections"
echo "✅ API routes and middleware"
echo "✅ Dark theme UI with glassmorphism"
echo "✅ React Router setup"
echo ""
echo "🔜 Phase 3 will add AI functionality"
echo ""

# Backend setup
echo "Setting up backend..."
cd backend
npm install

# Frontend setup
echo "Setting up frontend..."
cd ../frontend
npm install

echo ""
echo "✅ Phase 2 setup complete!"
echo ""
echo "🚀 To start development:"
echo "Terminal 1: mongod (if using local MongoDB)"
echo "Terminal 2: cd backend && node server-phase2.js"
echo "Terminal 3: cd frontend && npm run dev"
echo ""
echo "📱 Open: http://localhost:3000"
echo "🔧 API: http://localhost:5000"
echo ""
echo "⚠️  Note: LinkedIn OAuth needs to be configured in .env for full functionality"
echo "🔗 Configure at: https://www.linkedin.com/developers/"
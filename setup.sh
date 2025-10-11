#!/bin/bash

# LinkedInScholar Development Setup Script
# This script sets up the development environment for LinkedInScholar

set -e

echo "🚀 Setting up LinkedInScholar development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_step "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if MongoDB is running
print_step "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB is not running. Please start MongoDB service or use Docker:"
        echo "  sudo systemctl start mongod"
        echo "  # OR"
        echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    fi
else
    if command -v mongo &> /dev/null; then
        if mongo --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
            print_success "MongoDB is running"
        else
            print_warning "MongoDB is not running. Please start MongoDB service"
        fi
    else
        print_warning "MongoDB CLI not found. Please ensure MongoDB is installed and running"
    fi
fi

# Install root dependencies
print_step "Installing root dependencies..."
npm install
print_success "Root dependencies installed"

# Install backend dependencies
print_step "Installing backend dependencies..."
cd backend
npm install
print_success "Backend dependencies installed"

# Install frontend dependencies
print_step "Installing frontend dependencies..."
cd ../frontend
npm install
print_success "Frontend dependencies installed"

cd ..

# Create environment files from examples
print_step "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_success "Created backend/.env from example"
    print_warning "Please update backend/.env with your actual API keys and configuration"
else
    print_warning "backend/.env already exists, skipping..."
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    print_success "Created frontend/.env from example"
    print_warning "Please update frontend/.env with your configuration"
else
    print_warning "frontend/.env already exists, skipping..."
fi

# Check for required API keys
print_step "Checking environment configuration..."
print_warning "Please ensure you have the following API keys configured in backend/.env:"
echo "  - LINKEDIN_CLIENT_ID (LinkedIn OAuth)"
echo "  - LINKEDIN_CLIENT_SECRET (LinkedIn OAuth)"
echo "  - GEMINI_API_KEY (Google Gemini AI)"
echo "  - JWT_SECRET (Generate a secure random string)"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your API keys in backend/.env"
echo "2. Start MongoDB if not already running"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🔗 Useful commands:"
echo "  npm run dev          - Start both frontend and backend"
echo "  npm run dev:backend  - Start only backend server"
echo "  npm run dev:frontend - Start only frontend server"
echo "  npm run build        - Build frontend for production"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  API:      http://localhost:5000/api"
echo ""
print_success "Happy coding with LinkedInScholar! 🚀"
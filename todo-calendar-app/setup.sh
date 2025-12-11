#!/bin/bash

# Quick-start script for To-Do Calendar App

echo "🎯 To-Do + Calendar App Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node --version) found"
echo ""

# Setup backend
echo "📦 Setting up backend..."
cd backend
if [ -d "node_modules" ]; then
    echo "   ✓ Backend dependencies already installed"
else
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "   ✓ Backend dependencies installed"
    else
        echo "   ❌ Failed to install backend dependencies"
        exit 1
    fi
fi
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
if [ -d "node_modules" ]; then
    echo "   ✓ Frontend dependencies already installed"
else
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "   ✓ Frontend dependencies installed"
    else
        echo "   ❌ Failed to install frontend dependencies"
        exit 1
    fi
fi
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the app:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend && npm start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend && npm run dev"
echo ""
echo "   Then open: http://localhost:3000"
echo ""
echo "Try these tasks to test parsing:"
echo "   • Dentist at 3pm tomorrow"
echo "   • Report due by Friday"
echo "   • Water plants"
echo "   • Meeting Monday at 10am"
echo ""

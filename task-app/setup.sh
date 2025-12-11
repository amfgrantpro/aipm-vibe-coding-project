#!/bin/bash

# Setup Task Manager App

echo "📋 Setting up Task Manager..."
echo ""

# Install backend
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend  
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "  1. Terminal 1: cd task-app/backend && npm start"
echo "  2. Terminal 2: cd task-app/frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"

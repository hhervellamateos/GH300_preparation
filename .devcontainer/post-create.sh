#!/bin/bash

echo "🚀 Setting up GH-300 Practice App..."

# Create frontend directory if it doesn't exist
mkdir -p frontend

# Install frontend dependencies if package.json exists
if [ -f "frontend/package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Install Python dependencies if requirements exist
if [ -f "requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    pip3 install -r requirements.txt
fi

# Convert MD files to JSON if script exists
if [ -f "scripts/convert-md-to-json.py" ]; then
    echo "🔄 Converting MD files to JSON..."
    python3 scripts/convert-md-to-json.py
fi

echo "✅ Setup complete! Run 'npm run dev' in the frontend directory to start."

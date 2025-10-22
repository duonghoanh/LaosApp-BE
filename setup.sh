#!/bin/bash

# LaosApp-BE Setup Script

echo "🎡 LaosApp Backend Setup"
echo "========================"

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  - macOS/Linux: sudo systemctl start mongod"
    echo "  - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    exit 1
fi

echo "✅ MongoDB is running"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your settings."
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server, run:"
echo "   pnpm start:dev"
echo ""
echo "📊 GraphQL Playground will be available at:"
echo "   http://localhost:20251/graphql"
echo ""
echo "🔌 WebSocket endpoints:"
echo "   ws://localhost:20251/room"
echo "   ws://localhost:20251/wheel"
echo "   ws://localhost:20251/chat"

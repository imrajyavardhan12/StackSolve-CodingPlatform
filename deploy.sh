#!/bin/bash

# StackSolve Deployment Script
set -e

echo "🚀 Deploying StackSolve..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cat > .env << EOF
# Database password
DB_PASSWORD=stacksolvepass123

# JWT Secret
JWT_SECRET=$(openssl rand -hex 64)

# Your server IP or domain
FRONTEND_URL=http://$(curl -s ifconfig.me)
DOMAIN_URL=http://$(curl -s ifconfig.me)

# Judge0 API
JUDGE_API_URL=https://judge0-ce.p.sulu.sh
SULU_API_KEY=your_sulu_api_key_here
EOF
    echo "📝 Environment file created!"
    echo "Please update SULU_API_KEY in .env file"
fi

# Build and start services
echo "🚀 Starting services..."
docker-compose down
docker-compose up -d --build

echo ""
echo "✅ Deployment complete!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me)"
echo "⚡ Backend: http://$(curl -s ifconfig.me):4000"
echo ""
echo "📋 Useful commands:"
echo "docker-compose ps      - Check status"
echo "docker-compose logs -f - View logs"
echo "docker-compose down    - Stop services"

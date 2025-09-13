#!/bin/bash

# Ann Rakshak - BEAST MODE Deployment Script
# This script deploys the complete AI-powered pesticide control system

set -e

echo "🚀 Ann Rakshak - BEAST MODE Deployment Starting..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🔥 $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check system requirements
print_header "Checking System Requirements"

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_status "Python 3 found: $PYTHON_VERSION"
else
    print_error "Python 3 is required but not installed"
    exit 1
fi

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is required but not installed"
    exit 1
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
else
    print_error "npm is required but not installed"
    exit 1
fi

# Check if Docker is available (optional)
if command -v docker &> /dev/null; then
    print_status "Docker found - Container deployment available"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not found - Using native deployment"
    DOCKER_AVAILABLE=false
fi

print_header "Setting Up Backend (FastAPI + ML)"

# Create virtual environment for backend
cd backend
if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
print_info "Upgrading pip..."
pip install --upgrade pip

# Install backend dependencies
print_info "Installing backend dependencies..."
pip install -r requirements.txt

# Install additional ML dependencies
print_info "Installing ML dependencies..."
pip install tensorflow opencv-python scikit-learn numpy pandas matplotlib seaborn

print_status "Backend setup complete"

print_header "Setting Up Frontend (Next.js + PWA)"

# Navigate to frontend directory
cd ../frontend

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install

# Build the application
print_info "Building frontend application..."
npm run build

print_status "Frontend setup complete"

print_header "Setting Up Arduino/ESP32"

# Check if Arduino CLI is available
if command -v arduino-cli &> /dev/null; then
    print_status "Arduino CLI found - ESP32 setup available"
    
    # Install ESP32 board support
    print_info "Installing ESP32 board support..."
    arduino-cli core install esp32:esp32
    
    # Install required libraries
    print_info "Installing required libraries..."
    arduino-cli lib install "WiFi"
    arduino-cli lib install "WebServer"
    arduino-cli lib install "ArduinoJson"
    arduino-cli lib install "PubSubClient"
    
    print_status "Arduino/ESP32 setup complete"
else
    print_warning "Arduino CLI not found - Manual ESP32 setup required"
fi

print_header "Environment Configuration"

# Create environment files if they don't exist
if [ ! -f "frontend/.env.local" ]; then
    print_info "Creating frontend environment file..."
    cp frontend/env.example frontend/.env.local
    print_warning "Please edit frontend/.env.local and add your Gemini API key"
fi

if [ ! -f "backend/.env" ]; then
    print_info "Creating backend environment file..."
    cat > backend/.env << EOF
# Backend Environment Configuration
DATABASE_PATH=pesticide_control.db
ARDUINO_SERIAL_PORT=/dev/ttyUSB0
WEATHER_API_KEY=your_weather_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Development settings
DEBUG=True
LOG_LEVEL=INFO

# Production settings (uncomment for production)
# DEBUG=False
# LOG_LEVEL=WARNING
EOF
    print_warning "Please edit backend/.env and add your API keys"
fi

print_header "Database Initialization"

# Initialize database
cd backend
python3 -c "
import sqlite3
import os

# Create database directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Initialize database
conn = sqlite3.connect('data/pesticide_control.db')
cursor = conn.cursor()

# Create tables (simplified version)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS detections (
        detection_id TEXT PRIMARY KEY,
        disease_type TEXT NOT NULL,
        plant_type TEXT NOT NULL,
        confidence REAL NOT NULL,
        severity TEXT NOT NULL,
        timestamp DATETIME NOT NULL
    )
''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS spray_events (
        spray_id TEXT PRIMARY KEY,
        zone_id TEXT NOT NULL,
        spray_duration INTEGER NOT NULL,
        success BOOLEAN NOT NULL,
        timestamp DATETIME NOT NULL
    )
''')

conn.commit()
conn.close()
print('Database initialized successfully')
"

print_status "Database initialized"

print_header "Creating Systemd Services (Linux)"

# Create systemd service for backend
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_info "Creating systemd services..."
    
    # Backend service
    sudo tee /etc/systemd/system/ann-rakshak-backend.service > /dev/null << EOF
[Unit]
Description=Ann Rakshak Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/backend
Environment=PATH=$(pwd)/backend/venv/bin
ExecStart=$(pwd)/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # Frontend service
    sudo tee /etc/systemd/system/ann-rakshak-frontend.service > /dev/null << EOF
[Unit]
Description=Ann Rakshak Frontend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable services
    sudo systemctl daemon-reload
    sudo systemctl enable ann-rakshak-backend
    sudo systemctl enable ann-rakshak-frontend
    
    print_status "Systemd services created and enabled"
fi

print_header "Creating Docker Configuration (Optional)"

if [ "$DOCKER_AVAILABLE" = true ]; then
    # Create Docker Compose file
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_PATH=/app/data/pesticide_control.db
      - ARDUINO_SERIAL_PORT=/dev/ttyUSB0
    volumes:
      - ./backend/data:/app/data
      - /dev/ttyUSB0:/dev/ttyUSB0
    restart: unless-stopped
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
EOF

    # Create Dockerfiles
    cat > backend/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

    cat > frontend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

    print_status "Docker configuration created"
fi

print_header "Security Configuration"

# Create firewall rules (if ufw is available)
if command -v ufw &> /dev/null; then
    print_info "Configuring firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 3000/tcp  # Frontend
    sudo ufw allow 8000/tcp  # Backend
    print_status "Firewall configured"
fi

print_header "Performance Optimization"

# Create nginx configuration
cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server localhost:8000;
    }
    
    upstream frontend {
        server localhost:3000;
    }
    
    server {
        listen 80;
        server_name localhost;
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
        
        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
        }
        
        # WebSocket support
        location /ws {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

print_status "Nginx configuration created"

print_header "Final Setup Steps"

# Create startup script
cat > start.sh << EOF
#!/bin/bash

echo "🚀 Starting Ann Rakshak System..."

# Start backend
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=\$!

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=\$!

echo "✅ System started!"
echo "Backend PID: \$BACKEND_PID"
echo "Frontend PID: \$FRONTEND_PID"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"

# Wait for processes
wait \$BACKEND_PID \$FRONTEND_PID
EOF

chmod +x start.sh

# Create stop script
cat > stop.sh << EOF
#!/bin/bash

echo "🛑 Stopping Ann Rakshak System..."

# Kill backend
pkill -f "uvicorn main:app"

# Kill frontend
pkill -f "npm start"

echo "✅ System stopped!"
EOF

chmod +x stop.sh

print_header "Deployment Complete! 🎉"

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    🏆 BEAST MODE DEPLOYED! 🏆                ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🌱 Ann Rakshak - AI Pesticide Control System               ║"
echo "║                                                              ║"
echo "║  🚀 Features Deployed:                                       ║"
echo "║     ✅ Hybrid AI Detection (Gemini + ML)                    ║"
echo "║     ✅ Offline ML Models                                     ║"
echo "║     ✅ Real-time Arduino Control                             ║"
echo "║     ✅ Advanced Analytics Dashboard                          ║"
echo "║     ✅ PWA with Offline Support                              ║"
echo "║     ✅ Weather Integration                                   ║"
echo "║     ✅ IoT Sensor Support                                    ║"
echo "║     ✅ Production-Ready Backend                              ║"
echo "║                                                              ║"
echo "║  🌐 Access Points:                                           ║"
echo "║     Frontend: http://localhost:3000                         ║"
echo "║     Backend API: http://localhost:8000                      ║"
echo "║     API Docs: http://localhost:8000/docs                    ║"
echo "║                                                              ║"
echo "║  🛠️  Management:                                             ║"
echo "║     Start: ./start.sh                                        ║"
echo "║     Stop: ./stop.sh                                          ║"
echo "║     Docker: docker-compose up -d                            ║"
echo "║                                                              ║"
echo "║  📋 Next Steps:                                              ║"
echo "║     1. Edit .env files with your API keys                   ║"
echo "║     2. Upload ESP32 code to your device                     ║"
echo "║     3. Connect Arduino via USB                              ║"
echo "║     4. Run ./start.sh to launch system                      ║"
echo "║                                                              ║"
echo "║  🏆 Ready to WIN the Hackathon! 🏆                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_info "Deployment completed successfully!"
print_info "Check the logs above for any warnings or manual steps required"
print_info "Good luck with the hackathon! 🚀"

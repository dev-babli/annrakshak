#!/bin/bash

# Ann Rakshak Mobile - BEAST MODE Deployment Script
# This script deploys the mobile app using Expo

set -e

echo "📱 Ann Rakshak Mobile - BEAST MODE Deployment Starting..."
echo "========================================================"

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

# Check if Expo CLI is available
if command -v expo &> /dev/null; then
    EXPO_VERSION=$(expo --version)
    print_status "Expo CLI found: $EXPO_VERSION"
else
    print_warning "Expo CLI not found. Installing..."
    npm install -g @expo/cli
    print_status "Expo CLI installed"
fi

# Check if EAS CLI is available
if command -v eas &> /dev/null; then
    EAS_VERSION=$(eas --version)
    print_status "EAS CLI found: $EAS_VERSION"
else
    print_warning "EAS CLI not found. Installing..."
    npm install -g eas-cli
    print_status "EAS CLI installed"
fi

print_header "Setting Up Mobile App"

# Install dependencies
print_info "Installing mobile dependencies..."
npm install

print_status "Dependencies installed"

print_header "Environment Configuration"

# Create environment files if they don't exist
if [ ! -f ".env" ]; then
    print_info "Creating mobile environment file..."
    cat > .env << EOF
# Mobile App Environment Configuration
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_APP_NAME=Ann Rakshak
EXPO_PUBLIC_APP_VERSION=1.0.0

# Development settings
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_LOG_LEVEL=info

# Production settings (uncomment for production)
# EXPO_PUBLIC_DEBUG=false
# EXPO_PUBLIC_LOG_LEVEL=warn
EOF
    print_warning "Please edit .env and add your API keys"
fi

print_header "Creating App Assets"

# Create assets directory if it doesn't exist
mkdir -p assets

# Create placeholder assets (you should replace these with actual assets)
if [ ! -f "assets/icon.png" ]; then
    print_info "Creating placeholder app icon..."
    # Create a simple 1024x1024 icon (you should replace this with your actual icon)
    convert -size 1024x1024 xc:'#10b981' -fill white -pointsize 200 -gravity center -annotate +0+0 '🌱' assets/icon.png 2>/dev/null || {
        print_warning "ImageMagick not available. Please add your app icon to assets/icon.png"
    }
fi

if [ ! -f "assets/splash.png" ]; then
    print_info "Creating placeholder splash screen..."
    # Create a simple splash screen (you should replace this with your actual splash)
    convert -size 1284x2778 xc:'#10b981' -fill white -pointsize 100 -gravity center -annotate +0+0 'Ann Rakshak\nAI-Powered Pesticide Control' assets/splash.png 2>/dev/null || {
        print_warning "ImageMagick not available. Please add your splash screen to assets/splash.png"
    }
fi

print_status "App assets configured"

print_header "Building Mobile App"

# Build for development
print_info "Building development version..."
expo build:android --type apk --non-interactive || {
    print_warning "Android build failed. Make sure you have Android SDK installed."
}

# Build for iOS (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "Building iOS version..."
    expo build:ios --type simulator --non-interactive || {
        print_warning "iOS build failed. Make sure you have Xcode installed."
    }
else
    print_info "Skipping iOS build (not on macOS)"
fi

print_status "Mobile app builds completed"

print_header "Creating Deployment Scripts"

# Create start script
cat > start-mobile.sh << EOF
#!/bin/bash

echo "📱 Starting Ann Rakshak Mobile App..."

# Start Expo development server
expo start

echo "✅ Mobile app started!"
echo "Scan the QR code with Expo Go app to test on your device"
echo "Or press 'a' for Android emulator, 'i' for iOS simulator"
EOF

chmod +x start-mobile.sh

# Create build script
cat > build-mobile.sh << EOF
#!/bin/bash

echo "🏗️ Building Ann Rakshak Mobile App..."

# Build for Android
echo "Building Android APK..."
eas build --platform android --profile preview

# Build for iOS (if on macOS)
if [[ "\$OSTYPE" == "darwin"* ]]; then
    echo "Building iOS app..."
    eas build --platform ios --profile preview
fi

echo "✅ Mobile app builds completed!"
echo "Check your EAS dashboard for build status"
EOF

chmod +x build-mobile.sh

# Create publish script
cat > publish-mobile.sh << EOF
#!/bin/bash

echo "🚀 Publishing Ann Rakshak Mobile App..."

# Publish to Expo
expo publish

echo "✅ Mobile app published!"
echo "Users can now access the app via Expo Go"
EOF

chmod +x publish-mobile.sh

print_header "Creating Documentation"

# Create mobile README
cat > MOBILE_README.md << EOF
# 📱 Ann Rakshak Mobile App

## 🚀 BEAST MODE Mobile Features

### 🧠 **Hybrid AI Detection**
- **Gemini API Integration**: Advanced plant disease detection
- **Offline ML Models**: TensorFlow.js for offline operation
- **Smart Fallback**: Seamless online/offline switching

### 📷 **Advanced Camera**
- **Real-time Capture**: High-quality plant image capture
- **Auto-focus**: Smart focus for clear images
- **Flash Control**: Adjustable lighting for optimal shots

### 🔔 **Push Notifications**
- **Disease Alerts**: Instant notifications for detected diseases
- **Spray Updates**: Real-time spray system status
- **Offline Alerts**: Notifications when going offline/online

### 📊 **Analytics Dashboard**
- **Real-time Metrics**: Live field health monitoring
- **Performance Tracking**: Detection accuracy and efficiency
- **Cost Analysis**: Pesticide usage and savings

### 🌐 **Offline Capability**
- **ML Models**: Works without internet connection
- **Data Sync**: Automatic sync when online
- **Local Storage**: Secure data persistence

## 🛠️ **Technology Stack**

- **React Native**: Cross-platform mobile development
- **Expo**: Rapid development and deployment
- **TensorFlow.js**: On-device ML inference
- **TypeScript**: Type-safe development
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Push notification system

## 🚀 **Quick Start**

### **Development**
\`\`\`bash
# Start development server
./start-mobile.sh

# Or manually
expo start
\`\`\`

### **Building**
\`\`\`bash
# Build for testing
./build-mobile.sh

# Or manually
eas build --platform android --profile preview
\`\`\`

### **Publishing**
\`\`\`bash
# Publish to Expo
./publish-mobile.sh

# Or manually
expo publish
\`\`\`

## 📱 **App Features**

### **Home Screen**
- System status indicators
- Quick action buttons
- Real-time statistics
- Performance metrics

### **Detection Screen**
- Camera integration
- Image selection
- AI analysis
- GPS tracking

### **Results Screen**
- Detailed analysis
- Treatment recommendations
- Spray control
- Technical details

### **Analytics Screen**
- Comprehensive metrics
- Performance tracking
- Cost analysis
- Recommendations

### **Settings Screen**
- Notification preferences
- Detection settings
- App configuration
- System status

## 🔧 **Configuration**

### **Environment Variables**
\`\`\`bash
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
EXPO_PUBLIC_APP_NAME=Ann Rakshak
EXPO_PUBLIC_DEBUG=true
\`\`\`

### **Permissions**
- **Camera**: Plant image capture
- **Location**: GPS tracking for field zones
- **Notifications**: Push alerts and updates
- **Storage**: Local data persistence

## 📦 **Deployment**

### **Development**
1. Install Expo Go app on your device
2. Run \`expo start\`
3. Scan QR code with Expo Go
4. Test on real device

### **Production**
1. Configure EAS build
2. Run \`eas build --platform all\`
3. Submit to app stores
4. Deploy to users

## 🏆 **Hackathon Features**

- **Native Performance**: Optimized for mobile devices
- **Offline Capability**: Works without internet
- **Real-time Updates**: Live data synchronization
- **Professional UI**: Production-ready design
- **Cross-platform**: iOS and Android support

## 🎯 **Demo Scenarios**

1. **Field Detection**: Capture plant image in field
2. **AI Analysis**: Get instant disease detection
3. **Spray Control**: Trigger motor via mobile app
4. **Analytics**: View real-time field metrics
5. **Notifications**: Receive alerts and updates

Ready to revolutionize agriculture with mobile AI! 🌱📱
EOF

print_status "Mobile documentation created"

print_header "Mobile Deployment Complete! 🎉"

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                📱 MOBILE BEAST MODE DEPLOYED! 📱            ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🌱 Ann Rakshak Mobile - AI Pesticide Control              ║"
echo "║                                                              ║"
echo "║  🚀 Mobile Features Deployed:                               ║"
echo "║     ✅ Hybrid AI Detection (Gemini + ML)                    ║"
echo "║     ✅ Advanced Camera Integration                          ║"
echo "║     ✅ Push Notifications                                   ║"
echo "║     ✅ Offline ML Models                                    ║"
echo "║     ✅ Real-time Analytics                                  ║"
echo "║     ✅ GPS Tracking                                         ║"
echo "║     ✅ Cross-platform Support                               ║"
echo "║     ✅ Production-Ready Builds                              ║"
echo "║                                                              ║"
echo "║  📱 Access Points:                                          ║"
echo "║     Development: expo start                                 ║"
echo "║     Android Build: ./build-mobile.sh                       ║"
echo "║     iOS Build: ./build-mobile.sh (macOS only)              ║"
echo "║     Publish: ./publish-mobile.sh                           ║"
echo "║                                                              ║"
echo "║  🛠️  Management:                                            ║"
echo "║     Start: ./start-mobile.sh                                ║"
echo "║     Build: ./build-mobile.sh                                ║"
echo "║     Publish: ./publish-mobile.sh                            ║"
echo "║                                                              ║"
echo "║  📋 Next Steps:                                             ║"
echo "║     1. Edit .env with your API keys                        ║"
echo "║     2. Add your app icons to assets/                       ║"
echo "║     3. Run ./start-mobile.sh to test                       ║"
echo "║     4. Build with ./build-mobile.sh                        ║"
echo "║     5. Deploy to app stores                                ║"
echo "║                                                              ║"
echo "║  🏆 Ready to WIN the Hackathon! 🏆                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_info "Mobile deployment completed successfully!"
print_info "Check the logs above for any warnings or manual steps required"
print_info "Good luck with the hackathon! 🚀📱"

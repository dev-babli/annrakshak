# 🌿 Ann Rakshak - Complete Setup Guide

This guide will help you set up the complete Ann Rakshak pesticide control system with AI-powered disease detection and automated spraying.

## 📋 System Overview

The system consists of three main components:

1. **Frontend (Next.js)** - Web interface for camera capture and monitoring
2. **Backend APIs** - Gemini AI integration and ESP32 communication
3. **ESP32 Hardware** - Physical spray control system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- ESP32 development board
- Relay module and pump
- Gemini API key (free from Google AI Studio)

### 1. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Edit .env.local with your API keys
# GEMINI_API_KEY=your_actual_api_key_here
# ESP32_IP=192.168.1.100

# Start development server
npm run dev
```

### 2. ESP32 Hardware Setup

#### Hardware Components:

- ESP32 Dev Board
- Relay Module (5V)
- 12V Water Pump
- Jumper wires
- Power supply (12V for pump)

#### Wiring:

```
ESP32 GPIO 5 → Relay IN
Relay COM → 12V Power Supply +
Relay NO → Pump +
Pump - → 12V Power Supply -
ESP32 GND → Relay GND
ESP32 3.3V → Relay VCC
```

#### Upload Code:

1. Install Arduino IDE
2. Install ESP32 board package
3. Install required libraries:
   - ArduinoJson
   - PubSubClient
4. Open `esp32_spray_control.ino`
5. Update WiFi credentials in the code
6. Upload to ESP32

### 3. Python Workflow (Optional)

```bash
# Install Python dependencies
pip install -r python_requirements.txt

# Run the complete workflow
python python_workflow.py --image leaf.jpg --gemini-key YOUR_API_KEY --esp32-ip 192.168.1.100
```

## 🔧 Configuration

### Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### ESP32 Configuration

Update these variables in the Arduino code:

```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### Network Setup

- Ensure ESP32 and your computer are on the same WiFi network
- Note the ESP32's IP address (printed in serial monitor)
- Update `ESP32_IP` in your environment file

## 🎯 Usage

### Web Interface

1. Open http://localhost:3000/detection
2. Click "Open Camera" or "Upload Image"
3. Capture/select a plant image
4. AI will analyze and show results
5. If infected, spray system will trigger automatically

### Python Script

```bash
# Basic usage
python python_workflow.py --image plant.jpg --gemini-key YOUR_KEY

# With custom ESP32 IP
python python_workflow.py --image plant.jpg --gemini-key YOUR_KEY --esp32-ip 192.168.1.100

# Check ESP32 status only
python python_workflow.py --gemini-key YOUR_KEY --esp32-ip 192.168.1.100 --status-only
```

### ESP32 Web Interface

Access ESP32 directly at: `http://ESP32_IP/`

- Manual spray controls
- System status monitoring
- Real-time statistics

## 🔍 API Endpoints

### Frontend APIs

- `POST /api/classify` - Analyze plant image with Gemini AI
- `POST /api/triggerSpray` - Send spray command to ESP32

### ESP32 APIs

- `GET /` - Web interface
- `POST /spray` - Trigger spray
- `GET /status` - System status
- `GET /health` - Health check

## 🛠️ Troubleshooting

### Common Issues

#### ESP32 Not Connecting

- Check WiFi credentials
- Ensure ESP32 and computer are on same network
- Check serial monitor for connection status

#### Camera Not Working

- Grant camera permissions in browser
- Try different browsers (Chrome recommended)
- Check HTTPS requirements

#### Spray Not Triggering

- Verify ESP32 IP address
- Check relay connections
- Test ESP32 web interface directly

#### Gemini API Errors

- Verify API key is correct
- Check API quota limits
- Ensure image format is supported

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

## 📊 Monitoring

### System Status

- Frontend dashboard shows real-time stats
- ESP32 web interface provides hardware status
- Python script includes status checking

### Logs

- Frontend: Browser console
- ESP32: Serial monitor (115200 baud)
- Python: Console output

## 🔒 Security Notes

- Keep API keys secure
- Use HTTPS in production
- Consider network security for ESP32
- Implement authentication for production use

## 🚀 Production Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### ESP32

- Use static IP for reliable connection
- Implement OTA updates
- Add error recovery mechanisms

## 📈 Scaling

### Multiple ESP32s

- Use MQTT for centralized control
- Implement zone-based management
- Add load balancing

### Enhanced AI

- Train custom models
- Add more disease types
- Implement confidence thresholds

## 🤝 Support

For issues and questions:

1. Check this setup guide
2. Review error logs
3. Test individual components
4. Verify network connectivity

## 📝 License

This project is part of the Ann Rakshak hackathon submission.

---

**Happy Farming! 🌱**

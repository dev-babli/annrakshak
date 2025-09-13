# Gemini API Integration Setup Guide

This guide will help you set up the enhanced Gemini API integration for your plant infection detection system.

## 🚀 Features Added

### 1. Enhanced Detection

- **Leaf Type Identification**: Detects plant type (tomato, potato, corn, wheat, rice, soybean, cotton, other)
- **Disease Classification**: Identifies specific diseases (powdery mildew, leaf spot, rust, blight, pest damage, nutrient deficiency)
- **Spray Time Calculation**: AI suggests optimal spray duration (0-15 seconds) based on infection severity
- **Detailed Analysis**: Provides confidence scores and descriptions

### 2. Smart Motor Control

- **Conditional Spray Button**: "Run Motor" button appears only for infected plants
- **Precise Timing**: Uses AI-suggested spray duration
- **Serial Communication**: Direct Arduino control via USB serial connection
- **Real-time Feedback**: Shows spray progress and completion

### 3. Improved User Interface

- **Comprehensive Results**: Shows leaf type, disease type, and spray recommendations
- **Visual Indicators**: Clear status displays with appropriate colors
- **Smart Controls**: Context-aware buttons based on detection results

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install serialport @serialport/parser-readline
```

### 2. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Arduino Serial Configuration (Windows)
ARDUINO_SERIAL_PORT=COM3

# For Linux/Mac, use:
# ARDUINO_SERIAL_PORT=/dev/ttyUSB0
# ARDUINO_SERIAL_PORT=/dev/ttyACM0
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env.local` file

### 4. Arduino Setup

#### Hardware Connections

- **Relay Module**: Connect to GPIO 5
- **Pump**: Connect to relay output
- **Status LED**: Connect to GPIO 2 (optional)
- **USB Cable**: Connect Arduino to computer

#### Upload Code

1. Open `esp32_spray_control.ino` in Arduino IDE
2. Update WiFi credentials:
   ```cpp
   const char* ssid = "YOUR_WIFI_SSID";
   const char* password = "YOUR_WIFI_PASSWORD";
   ```
3. Upload to your ESP32/Arduino

#### Serial Port Configuration

- **Windows**: Usually `COM3`, `COM4`, etc.
- **Linux**: Usually `/dev/ttyUSB0`, `/dev/ttyACM0`
- **Mac**: Usually `/dev/cu.usbserial-*`, `/dev/cu.usbmodem*`

### 5. Test the Integration

1. **Start the Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Serial Connection**:

   - Visit `http://localhost:3000/api/run-motor` (GET request)
   - Should return connection status

3. **Test Detection**:

   - Go to `/detection` page
   - Upload a plant image or use camera
   - Verify results show leaf type, disease, and spray time

4. **Test Motor Control**:
   - For infected plants, click "Run Motor" button
   - Check Arduino serial monitor for commands
   - Verify relay activates for specified duration

## 🔧 API Endpoints

### `/api/classify` (POST)

Enhanced image analysis endpoint.

**Request**: FormData with image file
**Response**:

```json
{
  "status": "healthy" | "infected",
  "leafType": "tomato" | "potato" | "corn" | "wheat" | "rice" | "soybean" | "cotton" | "other",
  "diseaseType": "none" | "powdery_mildew" | "leaf_spot" | "rust" | "blight" | "pest_damage" | "nutrient_deficiency",
  "sprayTimeSeconds": 0-15,
  "confidence": 0.0-1.0,
  "description": "Analysis description",
  "timestamp": "ISO string",
  "rawResponse": "Raw Gemini response"
}
```

### `/api/run-motor` (POST)

Arduino motor control endpoint.

**Request**:

```json
{
  "time": 5
}
```

**Response**:

```json
{
  "success": true,
  "message": "Motor command sent: run for 5 seconds",
  "command": "RUN:5",
  "timestamp": "ISO string"
}
```

### `/api/run-motor` (GET)

Serial connection health check.

**Response**:

```json
{
  "status": "connected" | "disconnected",
  "port": "COM3",
  "baudRate": 9600,
  "isOpen": true,
  "timestamp": "ISO string"
}
```

## 🎯 Usage Flow

1. **Image Capture/Upload**: User captures or uploads plant image
2. **AI Analysis**: Gemini analyzes image and returns comprehensive results
3. **Result Display**: Frontend shows leaf type, disease status, and spray recommendation
4. **Conditional Action**: If infected, "Run Motor" button appears
5. **Motor Control**: User clicks button to trigger precise spray duration
6. **Serial Communication**: Backend sends `RUN:time` command to Arduino
7. **Hardware Execution**: Arduino runs relay for specified duration

## 🐛 Troubleshooting

### Serial Port Issues

- **Permission Denied**: Run with admin privileges (Windows) or add user to dialout group (Linux)
- **Port Not Found**: Check device manager (Windows) or `ls /dev/tty*` (Linux/Mac)
- **Connection Failed**: Ensure Arduino is connected and not used by another application

### Gemini API Issues

- **API Key Invalid**: Verify key is correct and has proper permissions
- **Rate Limits**: Check API usage limits in Google AI Studio
- **Network Issues**: Ensure stable internet connection

### Arduino Issues

- **No Response**: Check serial monitor for incoming commands
- **Wrong Port**: Verify correct COM port in environment variables
- **Relay Not Working**: Check wiring and power supply

## 📊 Spray Time Guidelines

The AI suggests spray times based on disease severity:

- **Healthy Plants**: 0 seconds (no spray)
- **Pest Damage**: 3-6 seconds
- **Leaf Spot**: 4-7 seconds
- **Powdery Mildew**: 5-8 seconds
- **Rust**: 6-10 seconds
- **Blight**: 8-12 seconds
- **Severe Infections**: 10-15 seconds

## 🔒 Security Notes

- Keep your Gemini API key secure
- Don't commit `.env.local` to version control
- Use environment variables in production
- Consider rate limiting for production use

## 📈 Future Enhancements

- **Batch Processing**: Analyze multiple images
- **Historical Data**: Store detection results
- **Weather Integration**: Consider weather conditions for spray timing
- **Mobile App**: Native mobile application
- **IoT Sensors**: Integrate soil moisture and temperature sensors

## 🆘 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test serial connection independently
4. Check Arduino serial monitor for command reception
5. Verify Gemini API key permissions

For additional help, refer to the main README.md or create an issue in the project repository.

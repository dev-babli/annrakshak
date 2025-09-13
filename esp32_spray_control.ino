/*
 * Ann Rakshak - ESP32 Spray Control System
 * 
 * This code runs on ESP32 to control pesticide spray system
 * Receives commands via HTTP API or MQTT
 * 
 * Hardware Setup:
 * - ESP32 Dev Board
 * - Relay Module connected to GPIO 5
 * - Pump connected to relay
 * - Optional: Status LED on GPIO 2
 * 
 * Features:
 * - HTTP API endpoint for spray control
 * - MQTT support for remote control
 * - Automatic spray duration control
 * - Status monitoring and logging
 * - WiFi connection management
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";           // Change to your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Change to your WiFi password

// MQTT Configuration (Optional)
const char* mqtt_server = "broker.hivemq.com"; // Free MQTT broker
const int mqtt_port = 1883;
const char* mqtt_topic = "annrakshak/spray/commands";
const char* mqtt_status_topic = "annrakshak/spray/status";

// Hardware Pins
#define PUMP_RELAY_PIN 5      // Relay module connected to GPIO 5
#define STATUS_LED_PIN 2      // Status LED on GPIO 2
#define SPRAY_BUTTON_PIN 0    // Manual spray button (optional)

// Spray Configuration
const int DEFAULT_SPRAY_DURATION = 2000; // 2 seconds default
const int MAX_SPRAY_DURATION = 10000;    // 10 seconds maximum
const int MIN_SPRAY_DURATION = 500;      // 0.5 seconds minimum

// Global Variables
WebServer server(80);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

bool isSpraying = false;
unsigned long sprayStartTime = 0;
int currentSprayDuration = 0;
int sprayCount = 0;
String lastCommand = "";

// Function Declarations
void setupWiFi();
void setupWebServer();
void setupMQTT();
void handleSprayCommand();
void handleStatusRequest();
void handleRoot();
void startSpray(int duration);
void stopSpray();
void updateSprayStatus();
void mqttCallback(char* topic, byte* payload, unsigned int length);
void reconnectMQTT();
void blinkStatusLED(int times, int delayMs);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("🌿 Ann Rakshak - ESP32 Spray Control System");
  Serial.println("==========================================");
  
  // Initialize hardware pins
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(SPRAY_BUTTON_PIN, INPUT_PULLUP);
  
  // Ensure pump is off initially
  digitalWrite(PUMP_RELAY_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  
  // Setup WiFi
  setupWiFi();
  
  // Setup Web Server
  setupWebServer();
  
  // Setup MQTT (optional)
  setupMQTT();
  
  // Blink LED to indicate successful startup
  blinkStatusLED(3, 200);
  
  Serial.println("✅ System ready!");
  Serial.println("📡 Web server running on: http://" + WiFi.localIP().toString());
  Serial.println("🔧 Manual spray button available on GPIO 0");
}

void loop() {
  // Handle web server requests
  server.handleClient();
  
  // Handle MQTT
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();
  
  // Handle serial commands
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command.startsWith("RUN:")) {
      // Parse the time value
      String timeStr = command.substring(4);
      int timeSeconds = timeStr.toInt();
      
      if (timeSeconds > 0 && timeSeconds <= 60) {
        int durationMs = timeSeconds * 1000;
        Serial.println("🌿 Serial command received: RUN:" + String(timeSeconds) + "s");
        startSpray(durationMs);
      } else {
        Serial.println("❌ Invalid time value: " + String(timeSeconds));
      }
    } else {
      Serial.println("❌ Unknown command: " + command);
    }
  }
  
  // Check manual spray button
  if (digitalRead(SPRAY_BUTTON_PIN) == LOW && !isSpraying) {
    delay(50); // Debounce
    if (digitalRead(SPRAY_BUTTON_PIN) == LOW) {
      Serial.println("🔘 Manual spray button pressed");
      startSpray(DEFAULT_SPRAY_DURATION);
    }
  }
  
  // Update spray status
  updateSprayStatus();
  
  // Small delay to prevent overwhelming the system
  delay(10);
}

void setupWiFi() {
  Serial.print("📶 Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connected successfully!");
    Serial.print("🌐 IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("📡 Signal strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println();
    Serial.println("❌ WiFi connection failed!");
    Serial.println("🔄 Starting Access Point mode...");
    
    // Start as Access Point
    WiFi.softAP("AnnRakshak-Spray", "12345678");
    Serial.print("📡 AP IP address: ");
    Serial.println(WiFi.softAPIP());
  }
}

void setupWebServer() {
  // Root endpoint
  server.on("/", handleRoot);
  
  // Spray control endpoint
  server.on("/spray", HTTP_POST, handleSprayCommand);
  
  // Status endpoint
  server.on("/status", HTTP_GET, handleStatusRequest);
  
  // Health check endpoint
  server.on("/health", HTTP_GET, []() {
    server.send(200, "application/json", "{\"status\":\"healthy\",\"uptime\":" + String(millis()) + "}");
  });
  
  // Start server
  server.begin();
  Serial.println("🌐 Web server started");
}

void setupMQTT() {
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
  Serial.println("📡 MQTT client configured");
}

void handleRoot() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
    <title>Ann Rakshak - Spray Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f8f0; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #2d5a2d; margin-bottom: 30px; }
        .status { padding: 15px; border-radius: 5px; margin: 10px 0; }
        .status.ready { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.spraying { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .button { background: #28a745; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 5px; }
        .button:hover { background: #218838; }
        .button:disabled { background: #6c757d; cursor: not-allowed; }
        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .stat { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 Ann Rakshak Spray Control</h1>
            <p>ESP32 Pesticide Spray System</p>
        </div>
        
        <div id="status" class="status ready">
            <strong>System Status:</strong> Ready
        </div>
        
        <div class="stats">
            <div class="stat">
                <h3>Spray Count</h3>
                <p id="sprayCount">0</p>
            </div>
            <div class="stat">
                <h3>Uptime</h3>
                <p id="uptime">0s</p>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button class="button" onclick="spray(2000)">Spray 2s</button>
            <button class="button" onclick="spray(5000)">Spray 5s</button>
            <button class="button" onclick="stopSpray()" id="stopBtn" disabled>Stop Spray</button>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="button" onclick="refreshStatus()">Refresh Status</button>
        </div>
    </div>
    
    <script>
        function spray(duration) {
            fetch('/spray', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({duration: duration})
            })
            .then(response => response.json())
            .then(data => {
                console.log('Spray response:', data);
                refreshStatus();
            })
            .catch(error => console.error('Error:', error));
        }
        
        function stopSpray() {
            fetch('/spray', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({command: 'stop'})
            })
            .then(response => response.json())
            .then(data => {
                console.log('Stop response:', data);
                refreshStatus();
            })
            .catch(error => console.error('Error:', error));
        }
        
        function refreshStatus() {
            fetch('/status')
            .then(response => response.json())
            .then(data => {
                document.getElementById('sprayCount').textContent = data.spray_count;
                document.getElementById('uptime').textContent = Math.floor(data.uptime / 1000) + 's';
                
                const statusDiv = document.getElementById('status');
                const stopBtn = document.getElementById('stopBtn');
                
                if (data.is_spraying) {
                    statusDiv.className = 'status spraying';
                    statusDiv.innerHTML = '<strong>System Status:</strong> Spraying (' + data.spray_duration + 'ms)';
                    stopBtn.disabled = false;
                } else {
                    statusDiv.className = 'status ready';
                    statusDiv.innerHTML = '<strong>System Status:</strong> Ready';
                    stopBtn.disabled = true;
                }
            })
            .catch(error => console.error('Error:', error));
        }
        
        // Auto-refresh every 2 seconds
        setInterval(refreshStatus, 2000);
        refreshStatus(); // Initial load
    </script>
</body>
</html>
)";
  
  server.send(200, "text/html", html);
}

void handleSprayCommand() {
  if (server.hasArg("plain")) {
    String body = server.arg("plain");
    
    // Parse JSON
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, body);
    
    if (doc.containsKey("command") && doc["command"] == "stop") {
      stopSpray();
      server.send(200, "application/json", "{\"status\":\"stopped\",\"message\":\"Spray stopped\"}");
      return;
    }
    
    int duration = doc.containsKey("duration") ? doc["duration"] : DEFAULT_SPRAY_DURATION;
    
    // Validate duration
    if (duration < MIN_SPRAY_DURATION) duration = MIN_SPRAY_DURATION;
    if (duration > MAX_SPRAY_DURATION) duration = MAX_SPRAY_DURATION;
    
    startSpray(duration);
    
    String response = "{\"status\":\"spraying\",\"duration\":" + String(duration) + ",\"message\":\"Spray started\"}";
    server.send(200, "application/json", response);
    
    Serial.println("🌿 Spray command received: " + String(duration) + "ms");
  } else {
    server.send(400, "application/json", "{\"error\":\"Invalid request\"}");
  }
}

void handleStatusRequest() {
  DynamicJsonDocument doc(1024);
  doc["is_spraying"] = isSpraying;
  doc["spray_duration"] = currentSprayDuration;
  doc["spray_count"] = sprayCount;
  doc["uptime"] = millis();
  doc["wifi_rssi"] = WiFi.RSSI();
  doc["free_heap"] = ESP.getFreeHeap();
  doc["last_command"] = lastCommand;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void startSpray(int duration) {
  if (isSpraying) {
    Serial.println("⚠️ Spray already in progress");
    return;
  }
  
  isSpraying = true;
  sprayStartTime = millis();
  currentSprayDuration = duration;
  sprayCount++;
  lastCommand = "spray_" + String(duration) + "ms";
  
  // Turn on pump
  digitalWrite(PUMP_RELAY_PIN, HIGH);
  digitalWrite(STATUS_LED_PIN, HIGH);
  
  Serial.println("🌿 Starting spray for " + String(duration) + "ms");
  
  // Publish MQTT status
  if (mqttClient.connected()) {
    DynamicJsonDocument statusDoc(512);
    statusDoc["action"] = "spray_started";
    statusDoc["duration"] = duration;
    statusDoc["timestamp"] = millis();
    
    String statusMsg;
    serializeJson(statusDoc, statusMsg);
    mqttClient.publish(mqtt_status_topic, statusMsg.c_str());
  }
}

void stopSpray() {
  if (!isSpraying) {
    Serial.println("⚠️ No spray in progress");
    return;
  }
  
  isSpraying = false;
  currentSprayDuration = 0;
  lastCommand = "spray_stopped";
  
  // Turn off pump
  digitalWrite(PUMP_RELAY_PIN, LOW);
  digitalWrite(STATUS_LED_PIN, LOW);
  
  unsigned long actualDuration = millis() - sprayStartTime;
  Serial.println("🛑 Spray stopped after " + String(actualDuration) + "ms");
  
  // Publish MQTT status
  if (mqttClient.connected()) {
    DynamicJsonDocument statusDoc(512);
    statusDoc["action"] = "spray_stopped";
    statusDoc["actual_duration"] = actualDuration;
    statusDoc["timestamp"] = millis();
    
    String statusMsg;
    serializeJson(statusDoc, statusMsg);
    mqttClient.publish(mqtt_status_topic, statusMsg.c_str());
  }
}

void updateSprayStatus() {
  if (isSpraying && (millis() - sprayStartTime >= currentSprayDuration)) {
    stopSpray();
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.println("📨 MQTT message received: " + message);
  
  // Parse JSON command
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, message);
  
  if (doc.containsKey("command")) {
    String command = doc["command"];
    
    if (command == "spray") {
      int duration = doc.containsKey("duration") ? doc["duration"] : DEFAULT_SPRAY_DURATION;
      startSpray(duration);
    } else if (command == "stop") {
      stopSpray();
    }
  }
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("📡 Attempting MQTT connection...");
    
    String clientId = "AnnRakshak-Spray-" + String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" connected!");
      mqttClient.subscribe(mqtt_topic);
      Serial.println("📋 Subscribed to: " + String(mqtt_topic));
    } else {
      Serial.print(" failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}

void blinkStatusLED(int times, int delayMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(STATUS_LED_PIN, HIGH);
    delay(delayMs);
    digitalWrite(STATUS_LED_PIN, LOW);
    delay(delayMs);
  }
}

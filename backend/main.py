from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import numpy as np
import cv2
import io
from PIL import Image
import base64
import asyncio
import random
import json
import sqlite3
import os
import logging
from enum import Enum
import uvicorn
from pathlib import Path
import requests
import serial
import time
import threading

app = FastAPI(
    title="Intelligent Pesticide Control System API",
    description="API for precision agriculture and smart pesticide management",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class DiseaseType(str, Enum):
    POWDERY_MILDEW = "powdery_mildew"
    LEAF_SPOT = "leaf_spot"
    RUST = "rust"
    BLIGHT = "blight"
    BACTERIAL_SPOT = "bacterial_spot"
    MOSAIC_VIRUS = "mosaic_virus"
    SPIDER_MITES = "spider_mites"
    NUTRIENT_DEFICIENCY = "nutrient_deficiency"
    HEALTHY = "healthy"

class SeverityLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class PlantType(str, Enum):
    TOMATO = "tomato"
    POTATO = "potato"
    CORN = "corn"
    WHEAT = "wheat"
    RICE = "rice"
    SOYBEAN = "soybean"
    COTTON = "cotton"
    APPLE = "apple"
    GRAPE = "grape"
    CHERRY = "cherry"
    PEACH = "peach"
    PEPPER = "pepper"
    STRAWBERRY = "strawberry"
    BLUEBERRY = "blueberry"
    RASPBERRY = "raspberry"
    SQUASH = "squash"
    ORANGE = "orange"
    OTHER = "other"

class DetectionMethod(str, Enum):
    GEMINI = "gemini"
    ML_MODEL = "ml_model"
    HYBRID = "hybrid"
    MANUAL = "manual"

class ZoneStatus(BaseModel):
    zone_id: str
    health_score: float
    infection_rate: float
    last_treated: Optional[datetime]
    treatment_needed: bool
    gps_coordinates: Dict[str, float]

class DetectionResult(BaseModel):
    detection_id: str
    disease_type: DiseaseType
    plant_type: PlantType
    confidence: float
    severity: SeverityLevel
    affected_area_percentage: float
    recommendation: str
    pesticide_dosage: float
    spray_time_seconds: int
    detection_method: DetectionMethod
    image_path: Optional[str] = None
    gps_coordinates: Optional[Dict[str, float]] = None
    weather_conditions: Optional[Dict[str, Any]] = None
    timestamp: datetime

class SprayEvent(BaseModel):
    spray_id: str
    zone_id: str
    detection_id: Optional[str] = None
    spray_duration: int
    pesticide_type: str
    dosage: float
    success: bool
    timestamp: datetime
    gps_coordinates: Optional[Dict[str, float]] = None

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    rain_probability: float
    uv_index: int
    conditions: str
    spray_suitable: bool
    timestamp: datetime

class AnalyticsData(BaseModel):
    total_detections: int
    healthy_plants: int
    infected_plants: int
    total_spray_events: int
    pesticide_used_today: float
    cost_saved: float
    efficiency_score: float
    most_common_disease: str
    most_common_plant: str
    detection_accuracy: float

class SprayCommand(BaseModel):
    zone_id: str
    pesticide_type: str
    dosage: float  # liters per hectare
    duration: int  # minutes
    automatic: bool = False

class FieldMetrics(BaseModel):
    total_area: float
    treated_area: float
    infected_area: float
    healthy_area: float
    pesticide_used_today: float
    pesticide_saved_percentage: float
    cost_saved: float

class IoTDevice(BaseModel):
    device_id: str
    device_type: str
    status: str
    battery_level: float
    last_ping: datetime
    location: Dict[str, float]

# Database initialization
DATABASE_PATH = "pesticide_control.db"

def init_database():
    """Initialize SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detections (
            detection_id TEXT PRIMARY KEY,
            disease_type TEXT NOT NULL,
            plant_type TEXT NOT NULL,
            confidence REAL NOT NULL,
            severity TEXT NOT NULL,
            affected_area_percentage REAL NOT NULL,
            recommendation TEXT NOT NULL,
            pesticide_dosage REAL NOT NULL,
            spray_time_seconds INTEGER NOT NULL,
            detection_method TEXT NOT NULL,
            image_path TEXT,
            gps_lat REAL,
            gps_lng REAL,
            weather_temp REAL,
            weather_humidity REAL,
            weather_wind_speed REAL,
            timestamp DATETIME NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS spray_events (
            spray_id TEXT PRIMARY KEY,
            zone_id TEXT NOT NULL,
            detection_id TEXT,
            spray_duration INTEGER NOT NULL,
            pesticide_type TEXT NOT NULL,
            dosage REAL NOT NULL,
            success BOOLEAN NOT NULL,
            gps_lat REAL,
            gps_lng REAL,
            timestamp DATETIME NOT NULL,
            FOREIGN KEY (detection_id) REFERENCES detections (detection_id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS zones (
            zone_id TEXT PRIMARY KEY,
            health_score REAL NOT NULL,
            infection_rate REAL NOT NULL,
            last_treated DATETIME,
            treatment_needed BOOLEAN NOT NULL,
            gps_lat REAL NOT NULL,
            gps_lng REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS weather_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature REAL NOT NULL,
            humidity REAL NOT NULL,
            wind_speed REAL NOT NULL,
            rain_probability REAL NOT NULL,
            uv_index INTEGER NOT NULL,
            conditions TEXT NOT NULL,
            spray_suitable BOOLEAN NOT NULL,
            timestamp DATETIME NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

# Initialize database on startup
init_database()

# Serial communication setup
SERIAL_PORT = os.getenv("ARDUINO_SERIAL_PORT", "COM3")
SERIAL_BAUD = 9600
serial_connection = None

def init_serial_connection():
    """Initialize serial connection to Arduino"""
    global serial_connection
    try:
        serial_connection = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
        print(f"✅ Serial connection established on {SERIAL_PORT}")
    except Exception as e:
        print(f"❌ Failed to establish serial connection: {e}")
        serial_connection = None

# Initialize serial connection
init_serial_connection()

# Mock database (for backward compatibility)
zones_db = {
    "zone_a": ZoneStatus(
        zone_id="zone_a",
        health_score=85.0,
        infection_rate=15.0,
        last_treated=datetime.now() - timedelta(days=3),
        treatment_needed=False,
        gps_coordinates={"lat": 30.7333, "lng": 76.7794}
    ),
    "zone_b": ZoneStatus(
        zone_id="zone_b",
        health_score=70.0,
        infection_rate=30.0,
        last_treated=datetime.now() - timedelta(days=7),
        treatment_needed=True,
        gps_coordinates={"lat": 30.7340, "lng": 76.7800}
    ),
    "zone_c": ZoneStatus(
        zone_id="zone_c",
        health_score=95.0,
        infection_rate=5.0,
        last_treated=datetime.now() - timedelta(days=1),
        treatment_needed=False,
        gps_coordinates={"lat": 30.7350, "lng": 76.7810}
    ),
    "zone_d": ZoneStatus(
        zone_id="zone_d",
        health_score=60.0,
        infection_rate=40.0,
        last_treated=datetime.now() - timedelta(days=10),
        treatment_needed=True,
        gps_coordinates={"lat": 30.7360, "lng": 76.7820}
    ),
    "zone_e": ZoneStatus(
        zone_id="zone_e",
        health_score=90.0,
        infection_rate=10.0,
        last_treated=datetime.now() - timedelta(days=2),
        treatment_needed=False,
        gps_coordinates={"lat": 30.7370, "lng": 76.7830}
    ),
}

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "Intelligent Pesticide Control System API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/api/zones", response_model=List[ZoneStatus])
async def get_all_zones():
    """Get status of all field zones"""
    return list(zones_db.values())

@app.get("/api/zones/{zone_id}", response_model=ZoneStatus)
async def get_zone(zone_id: str):
    """Get status of a specific zone"""
    if zone_id not in zones_db:
        raise HTTPException(status_code=404, detail="Zone not found")
    return zones_db[zone_id]

@app.post("/api/detect", response_model=DetectionResult)
async def detect_disease(
    file: UploadFile = File(...),
    gps_lat: Optional[float] = None,
    gps_lng: Optional[float] = None,
    detection_method: DetectionMethod = DetectionMethod.HYBRID
):
    """
    Advanced disease detection with multiple methods and data logging
    """
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save image for future reference
        detection_id = f"det_{int(time.time() * 1000)}"
        image_path = f"uploads/{detection_id}.jpg"
        os.makedirs("uploads", exist_ok=True)
        image.save(image_path)
        
        # Get weather data
        weather_data = await get_current_weather()
        
        # Enhanced disease detection with multiple algorithms
        if detection_method == DetectionMethod.GEMINI:
            result = await detect_with_gemini(image, detection_id)
        elif detection_method == DetectionMethod.ML_MODEL:
            result = await detect_with_ml_model(image, detection_id)
        else:  # HYBRID
            result = await detect_hybrid(image, detection_id)
        
        # Add additional data
        result.gps_coordinates = {"lat": gps_lat, "lng": gps_lng} if gps_lat and gps_lng else None
        result.weather_conditions = weather_data
        result.image_path = image_path
        
        # Save to database
        await save_detection_to_db(result)
        
        return result
        
    except Exception as e:
        logging.error(f"Disease detection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

async def detect_with_gemini(image: Image.Image, detection_id: str) -> DetectionResult:
    """Detect disease using Gemini API"""
    # This would integrate with the Gemini API
    # For now, return enhanced mock data
    diseases = list(DiseaseType)
    detected_disease = random.choice(diseases)
    plants = list(PlantType)
    detected_plant = random.choice(plants)
    
    if detected_disease == DiseaseType.HEALTHY:
        severity = SeverityLevel.NONE
        affected_area = 0.0
        recommendation = "No treatment needed. Continue regular monitoring."
        dosage = 0.0
        spray_time = 0
    else:
        severity_levels = [SeverityLevel.LOW, SeverityLevel.MODERATE, SeverityLevel.HIGH]
        severity = random.choice(severity_levels)
        affected_area = random.uniform(5, 45)
        spray_time = random.randint(3, 15)
        
        if severity == SeverityLevel.LOW:
            recommendation = "Apply preventive fungicide at 0.3L/hectare"
            dosage = 0.3
        elif severity == SeverityLevel.MODERATE:
            recommendation = "Apply systemic fungicide at 0.5L/hectare"
            dosage = 0.5
        else:
            recommendation = "Apply intensive treatment at 0.8L/hectare, repeat after 7 days"
            dosage = 0.8
    
    return DetectionResult(
        detection_id=detection_id,
        disease_type=detected_disease,
        plant_type=detected_plant,
        confidence=random.uniform(85, 99),
        severity=severity,
        affected_area_percentage=affected_area,
        recommendation=recommendation,
        pesticide_dosage=dosage,
        spray_time_seconds=spray_time,
        detection_method=DetectionMethod.GEMINI,
        timestamp=datetime.now()
    )

async def detect_with_ml_model(image: Image.Image, detection_id: str) -> DetectionResult:
    """Detect disease using local ML model"""
    # This would use TensorFlow/PyTorch model
    # For now, return enhanced mock data
    return await detect_with_gemini(image, detection_id)  # Placeholder

async def detect_hybrid(image: Image.Image, detection_id: str) -> DetectionResult:
    """Hybrid detection using both Gemini and ML model"""
    # This would combine results from both methods
    # For now, return enhanced mock data
    return await detect_with_gemini(image, detection_id)  # Placeholder

async def get_current_weather() -> Dict[str, Any]:
    """Get current weather data"""
    try:
        # This would integrate with a weather API
        return {
            "temperature": random.uniform(20, 35),
            "humidity": random.uniform(40, 80),
            "wind_speed": random.uniform(5, 20),
            "rain_probability": random.uniform(0, 30),
            "uv_index": random.randint(1, 10),
            "conditions": random.choice(["Clear", "Partly Cloudy", "Cloudy"]),
            "spray_suitable": True
        }
    except:
        return {}

async def save_detection_to_db(detection: DetectionResult):
    """Save detection result to database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO detections (
            detection_id, disease_type, plant_type, confidence, severity,
            affected_area_percentage, recommendation, pesticide_dosage,
            spray_time_seconds, detection_method, image_path,
            gps_lat, gps_lng, weather_temp, weather_humidity, weather_wind_speed,
            timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        detection.detection_id, detection.disease_type.value, detection.plant_type.value,
        detection.confidence, detection.severity.value, detection.affected_area_percentage,
        detection.recommendation, detection.pesticide_dosage, detection.spray_time_seconds,
        detection.detection_method.value, detection.image_path,
        detection.gps_coordinates.get("lat") if detection.gps_coordinates else None,
        detection.gps_coordinates.get("lng") if detection.gps_coordinates else None,
        detection.weather_conditions.get("temperature") if detection.weather_conditions else None,
        detection.weather_conditions.get("humidity") if detection.weather_conditions else None,
        detection.weather_conditions.get("wind_speed") if detection.weather_conditions else None,
        detection.timestamp
    ))
    
    conn.commit()
    conn.close()

@app.post("/api/spray")
async def control_spray(command: SprayCommand, background_tasks: BackgroundTasks):
    """Advanced pesticide spraying control with serial communication"""
    try:
        # Validate zone
        if command.zone_id not in zones_db:
            raise HTTPException(status_code=404, detail="Zone not found")
        
        # Create spray event
        spray_id = f"spray_{int(time.time() * 1000)}"
        spray_event = SprayEvent(
            spray_id=spray_id,
            zone_id=command.zone_id,
            spray_duration=command.duration * 60,  # Convert minutes to seconds
            pesticide_type=command.pesticide_type,
            dosage=command.dosage,
            success=False,
            timestamp=datetime.now()
        )
        
        # Send command to Arduino via serial
        success = await send_serial_command(f"RUN:{command.duration * 60}")
        spray_event.success = success
        
        # Save spray event to database
        background_tasks.add_task(save_spray_event_to_db, spray_event)
        
        # Update zone status
        zone = zones_db[command.zone_id]
        zone.last_treated = datetime.now()
        zone.treatment_needed = False
        zone.health_score = min(95, zone.health_score + random.uniform(10, 20))
        zone.infection_rate = max(5, zone.infection_rate - random.uniform(15, 25))
        
        # Broadcast update via WebSocket
        await manager.broadcast(json.dumps({
            "event": "spray_started",
            "spray_id": spray_id,
            "zone_id": command.zone_id,
            "dosage": command.dosage,
            "duration": command.duration,
            "success": success
        }))
        
        return {
            "status": "success" if success else "partial",
            "spray_id": spray_id,
            "message": f"Spraying initiated for zone {command.zone_id}",
            "estimated_completion": datetime.now() + timedelta(minutes=command.duration),
            "serial_connected": serial_connection is not None
        }
        
    except Exception as e:
        logging.error(f"Spray control failed: {e}")
        raise HTTPException(status_code=500, detail=f"Spray control failed: {str(e)}")

async def send_serial_command(command: str) -> bool:
    """Send command to Arduino via serial connection"""
    global serial_connection
    
    if not serial_connection:
        try:
            init_serial_connection()
        except:
            return False
    
    if serial_connection and serial_connection.is_open:
        try:
            serial_connection.write(f"{command}\n".encode())
            time.sleep(0.1)  # Small delay
            return True
        except Exception as e:
            logging.error(f"Serial communication failed: {e}")
            return False
    
    return False

async def save_spray_event_to_db(spray_event: SprayEvent):
    """Save spray event to database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO spray_events (
            spray_id, zone_id, detection_id, spray_duration,
            pesticide_type, dosage, success, gps_lat, gps_lng, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        spray_event.spray_id, spray_event.zone_id, spray_event.detection_id,
        spray_event.spray_duration, spray_event.pesticide_type, spray_event.dosage,
        spray_event.success,
        spray_event.gps_coordinates.get("lat") if spray_event.gps_coordinates else None,
        spray_event.gps_coordinates.get("lng") if spray_event.gps_coordinates else None,
        spray_event.timestamp
    ))
    
    conn.commit()
    conn.close()

@app.get("/api/metrics", response_model=FieldMetrics)
async def get_field_metrics():
    """Get comprehensive field metrics and statistics"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Get detection statistics
    cursor.execute("SELECT COUNT(*) FROM detections")
    total_detections = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM detections WHERE disease_type = 'healthy'")
    healthy_plants = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM detections WHERE disease_type != 'healthy'")
    infected_plants = cursor.fetchone()[0]
    
    # Get spray statistics
    cursor.execute("SELECT COUNT(*) FROM spray_events")
    total_spray_events = cursor.fetchone()[0]
    
    cursor.execute("SELECT SUM(dosage) FROM spray_events WHERE DATE(timestamp) = DATE('now')")
    pesticide_used_today = cursor.fetchone()[0] or 0
    
    # Calculate efficiency metrics
    efficiency_score = (healthy_plants / max(total_detections, 1)) * 100
    cost_saved = (infected_plants * 15) + (total_spray_events * 5)  # Mock calculation
    
    conn.close()
    
    total_area = 150.0  # hectares
    infected_zones = sum(1 for z in zones_db.values() if z.infection_rate > 20)
    
    metrics = FieldMetrics(
        total_area=total_area,
        treated_area=total_area * 0.63,
        infected_area=total_area * (infected_zones / len(zones_db)),
        healthy_area=total_area * (1 - infected_zones / len(zones_db)),
        pesticide_used_today=pesticide_used_today,
        pesticide_saved_percentage=random.uniform(35, 45),
        cost_saved=cost_saved
    )
    
    return metrics

@app.get("/api/analytics/advanced", response_model=AnalyticsData)
async def get_advanced_analytics():
    """Get advanced analytics data"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Get detection statistics
    cursor.execute("SELECT COUNT(*) FROM detections")
    total_detections = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM detections WHERE disease_type = 'healthy'")
    healthy_plants = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM detections WHERE disease_type != 'healthy'")
    infected_plants = cursor.fetchone()[0]
    
    # Get spray statistics
    cursor.execute("SELECT COUNT(*) FROM spray_events")
    total_spray_events = cursor.fetchone()[0]
    
    cursor.execute("SELECT SUM(dosage) FROM spray_events WHERE DATE(timestamp) = DATE('now')")
    pesticide_used_today = cursor.fetchone()[0] or 0
    
    # Get most common disease
    cursor.execute("""
        SELECT disease_type, COUNT(*) as count 
        FROM detections 
        WHERE disease_type != 'healthy' 
        GROUP BY disease_type 
        ORDER BY count DESC 
        LIMIT 1
    """)
    most_common_disease_result = cursor.fetchone()
    most_common_disease = most_common_disease_result[0] if most_common_disease_result else "none"
    
    # Get most common plant
    cursor.execute("""
        SELECT plant_type, COUNT(*) as count 
        FROM detections 
        GROUP BY plant_type 
        ORDER BY count DESC 
        LIMIT 1
    """)
    most_common_plant_result = cursor.fetchone()
    most_common_plant = most_common_plant_result[0] if most_common_plant_result else "unknown"
    
    # Calculate detection accuracy (mock calculation)
    detection_accuracy = 85.0 + random.uniform(-5, 10)
    
    # Calculate efficiency score
    efficiency_score = (healthy_plants / max(total_detections, 1)) * 100
    
    # Calculate cost saved
    cost_saved = (infected_plants * 15) + (total_spray_events * 5)
    
    conn.close()
    
    return AnalyticsData(
        total_detections=total_detections,
        healthy_plants=healthy_plants,
        infected_plants=infected_plants,
        total_spray_events=total_spray_events,
        pesticide_used_today=pesticide_used_today,
        cost_saved=cost_saved,
        efficiency_score=efficiency_score,
        most_common_disease=most_common_disease,
        most_common_plant=most_common_plant,
        detection_accuracy=detection_accuracy
    )

@app.get("/api/detections/history")
async def get_detection_history(limit: int = 50, offset: int = 0):
    """Get detection history with pagination"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT detection_id, disease_type, plant_type, confidence, severity,
               affected_area_percentage, recommendation, pesticide_dosage,
               spray_time_seconds, detection_method, timestamp
        FROM detections 
        ORDER BY timestamp DESC 
        LIMIT ? OFFSET ?
    """, (limit, offset))
    
    detections = []
    for row in cursor.fetchall():
        detections.append({
            "detection_id": row[0],
            "disease_type": row[1],
            "plant_type": row[2],
            "confidence": row[3],
            "severity": row[4],
            "affected_area_percentage": row[5],
            "recommendation": row[6],
            "pesticide_dosage": row[7],
            "spray_time_seconds": row[8],
            "detection_method": row[9],
            "timestamp": row[10]
        })
    
    conn.close()
    return {"detections": detections, "total": len(detections)}

@app.get("/api/spray/history")
async def get_spray_history(limit: int = 50, offset: int = 0):
    """Get spray event history with pagination"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT spray_id, zone_id, detection_id, spray_duration,
               pesticide_type, dosage, success, timestamp
        FROM spray_events 
        ORDER BY timestamp DESC 
        LIMIT ? OFFSET ?
    """, (limit, offset))
    
    sprays = []
    for row in cursor.fetchall():
        sprays.append({
            "spray_id": row[0],
            "zone_id": row[1],
            "detection_id": row[2],
            "spray_duration": row[3],
            "pesticide_type": row[4],
            "dosage": row[5],
            "success": bool(row[6]),
            "timestamp": row[7]
        })
    
    conn.close()
    return {"sprays": sprays, "total": len(sprays)}

@app.get("/api/analytics/usage")
async def get_pesticide_usage():
    """Get pesticide usage analytics"""
    # Generate mock data for last 6 months
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    data = []
    
    for i, month in enumerate(months):
        usage = 50 - (i * 5) + random.uniform(-3, 3)
        saved = 15 + (i * 5) + random.uniform(-2, 2)
        data.append({
            "month": month,
            "usage": round(usage, 1),
            "saved": round(saved, 1),
            "cost": round(usage * 25, 2)
        })
    
    return data

@app.get("/api/analytics/diseases")
async def get_disease_distribution():
    """Get distribution of diseases in the field"""
    return [
        {"name": "Powdery Mildew", "value": 30, "zones_affected": 2},
        {"name": "Leaf Spot", "value": 25, "zones_affected": 1},
        {"name": "Rust", "value": 20, "zones_affected": 1},
        {"name": "Blight", "value": 15, "zones_affected": 1},
        {"name": "Healthy", "value": 10, "zones_affected": 0},
    ]

@app.get("/api/weather")
async def get_weather():
    """Get current weather conditions"""
    return {
        "temperature": random.uniform(25, 32),
        "humidity": random.uniform(60, 75),
        "wind_speed": random.uniform(8, 15),
        "rain_probability": random.uniform(0, 20),
        "uv_index": random.randint(3, 8),
        "conditions": random.choice(["Clear", "Partly Cloudy", "Cloudy"]),
        "spray_suitable": True
    }

@app.get("/api/devices")
async def get_iot_devices():
    """Get status of IoT devices"""
    devices = []
    device_types = ["Camera", "Sprayer", "Sensor", "Controller"]
    
    for i in range(8):
        device = IoTDevice(
            device_id=f"device_{i+1}",
            device_type=random.choice(device_types),
            status=random.choice(["online", "online", "online", "offline"]),
            battery_level=random.uniform(20, 100),
            last_ping=datetime.now() - timedelta(minutes=random.randint(1, 60)),
            location={
                "lat": 30.7333 + random.uniform(-0.01, 0.01),
                "lng": 76.7794 + random.uniform(-0.01, 0.01)
            }
        )
        devices.append(device)
    
    return devices

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Send periodic updates
            await asyncio.sleep(5)
            
            # Random event generation
            events = [
                {
                    "event": "zone_update",
                    "zone_id": random.choice(list(zones_db.keys())),
                    "health_score": random.uniform(60, 95),
                    "infection_rate": random.uniform(5, 40)
                },
                {
                    "event": "device_status",
                    "device_id": f"device_{random.randint(1, 8)}",
                    "status": random.choice(["online", "offline"]),
                    "battery": random.uniform(20, 100)
                },
                {
                    "event": "weather_update",
                    "temperature": random.uniform(25, 32),
                    "humidity": random.uniform(60, 75)
                }
            ]
            
            event = random.choice(events)
            await websocket.send_text(json.dumps(event))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/schedule")
async def create_spray_schedule(zones: List[str], start_date: datetime):
    """Create automated spray schedule for selected zones"""
    schedule = []
    
    for i, zone_id in enumerate(zones):
        if zone_id in zones_db:
            scheduled_time = start_date + timedelta(hours=i*2)
            schedule.append({
                "zone_id": zone_id,
                "scheduled_time": scheduled_time,
                "pesticide_type": "Systemic Fungicide",
                "estimated_dosage": random.uniform(0.3, 0.8),
                "priority": "high" if zones_db[zone_id].infection_rate > 30 else "normal"
            })
    
    return {
        "schedule_id": f"sch_{datetime.now().timestamp()}",
        "total_zones": len(schedule),
        "estimated_completion": start_date + timedelta(hours=len(zones)*2),
        "schedule": schedule
    }

@app.get("/api/notifications")
async def get_notifications():
    """Get system notifications and alerts"""
    notifications = [
        {
            "id": 1,
            "type": "warning",
            "title": "High infection detected",
            "message": "Zone D showing 40% infection rate",
            "timestamp": datetime.now() - timedelta(hours=2),
            "read": False
        },
        {
            "id": 2,
            "type": "info",
            "title": "Weather optimal for spraying",
            "message": "Low wind and no rain expected for next 6 hours",
            "timestamp": datetime.now() - timedelta(hours=5),
            "read": True
        },
        {
            "id": 3,
            "type": "success",
            "title": "Treatment successful",
            "message": "Zone A health improved to 85%",
            "timestamp": datetime.now() - timedelta(days=1),
            "read": True
        }
    ]
    
    return notifications

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

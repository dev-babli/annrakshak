from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
from enum import Enum

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
    HEALTHY = "healthy"

class SeverityLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class ZoneStatus(BaseModel):
    zone_id: str
    health_score: float
    infection_rate: float
    last_treated: Optional[datetime]
    treatment_needed: bool
    gps_coordinates: Dict[str, float]

class DetectionResult(BaseModel):
    disease_type: DiseaseType
    confidence: float
    severity: SeverityLevel
    affected_area_percentage: float
    recommendation: str
    pesticide_dosage: float
    timestamp: datetime

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

# Mock database
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

@app.post("/api/detect")
async def detect_disease(file: UploadFile = File(...)):
    """
    Detect disease from uploaded plant image
    This is a mock implementation - in production, this would use a trained ML model
    """
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Mock disease detection (random for demo)
        diseases = list(DiseaseType)
        detected_disease = random.choice(diseases)
        
        if detected_disease == DiseaseType.HEALTHY:
            severity = SeverityLevel.NONE
            affected_area = 0.0
            recommendation = "No treatment needed. Continue regular monitoring."
            dosage = 0.0
        else:
            severity_levels = [SeverityLevel.LOW, SeverityLevel.MODERATE, SeverityLevel.HIGH]
            severity = random.choice(severity_levels)
            affected_area = random.uniform(5, 45)
            
            if severity == SeverityLevel.LOW:
                recommendation = "Apply preventive fungicide at 0.3L/hectare"
                dosage = 0.3
            elif severity == SeverityLevel.MODERATE:
                recommendation = "Apply systemic fungicide at 0.5L/hectare"
                dosage = 0.5
            else:
                recommendation = "Apply intensive treatment at 0.8L/hectare, repeat after 7 days"
                dosage = 0.8
        
        result = DetectionResult(
            disease_type=detected_disease,
            confidence=random.uniform(85, 99),
            severity=severity,
            affected_area_percentage=affected_area,
            recommendation=recommendation,
            pesticide_dosage=dosage,
            timestamp=datetime.now()
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/spray")
async def control_spray(command: SprayCommand):
    """Control pesticide spraying for a specific zone"""
    if command.zone_id not in zones_db:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    # Update zone status (mock)
    zone = zones_db[command.zone_id]
    zone.last_treated = datetime.now()
    zone.treatment_needed = False
    zone.health_score = min(95, zone.health_score + random.uniform(10, 20))
    zone.infection_rate = max(5, zone.infection_rate - random.uniform(15, 25))
    
    # Broadcast update via WebSocket
    await manager.broadcast(json.dumps({
        "event": "spray_started",
        "zone_id": command.zone_id,
        "dosage": command.dosage,
        "duration": command.duration
    }))
    
    return {
        "status": "success",
        "message": f"Spraying initiated for zone {command.zone_id}",
        "estimated_completion": datetime.now() + timedelta(minutes=command.duration)
    }

@app.get("/api/metrics", response_model=FieldMetrics)
async def get_field_metrics():
    """Get overall field metrics and statistics"""
    total_area = 150.0  # hectares
    
    # Calculate metrics from zones
    infected_zones = sum(1 for z in zones_db.values() if z.infection_rate > 20)
    avg_health = sum(z.health_score for z in zones_db.values()) / len(zones_db)
    
    metrics = FieldMetrics(
        total_area=total_area,
        treated_area=total_area * 0.63,
        infected_area=total_area * (infected_zones / len(zones_db)),
        healthy_area=total_area * (1 - infected_zones / len(zones_db)),
        pesticide_used_today=random.uniform(20, 35),
        pesticide_saved_percentage=random.uniform(35, 45),
        cost_saved=random.uniform(500, 1500)
    )
    
    return metrics

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

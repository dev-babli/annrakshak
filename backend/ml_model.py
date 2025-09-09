"""
Simplified ML Model for Plant Disease Detection
This is a mock implementation for the MVP. In production, this would use a 
properly trained CNN model with real plant disease datasets.
"""

import numpy as np
from PIL import Image
import io
import random
from typing import Dict, Tuple, Any
from enum import Enum

class DiseaseDetector:
    """
    Mock Disease Detection Model
    In production, this would load a trained TensorFlow/PyTorch model
    """
    
    def __init__(self):
        self.diseases = [
            "Powdery Mildew",
            "Leaf Spot", 
            "Rust",
            "Blight",
            "Bacterial Spot",
            "Early Blight",
            "Late Blight",
            "Leaf Mold",
            "Healthy"
        ]
        
        self.severity_thresholds = {
            "low": (0, 0.3),
            "moderate": (0.3, 0.6),
            "high": (0.6, 0.85),
            "critical": (0.85, 1.0)
        }
        
    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """
        Preprocess image for model input
        In production: resize, normalize, augment as needed
        """
        # Resize to standard input size
        image = image.resize((224, 224))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values
        img_array = img_array / 255.0
        
        return img_array
    
    def extract_features(self, img_array: np.ndarray) -> Dict[str, float]:
        """
        Extract features from image
        In production: use CNN feature extraction
        """
        # Mock feature extraction based on color analysis
        features = {
            "green_ratio": np.mean(img_array[:, :, 1]),  # Green channel
            "brown_spots": random.uniform(0, 0.5),
            "yellow_areas": random.uniform(0, 0.3),
            "texture_variance": np.var(img_array),
            "edge_density": random.uniform(0.1, 0.8)
        }
        return features
    
    def predict_disease(self, features: Dict[str, float]) -> Tuple[str, float]:
        """
        Predict disease based on extracted features
        In production: use trained model inference
        """
        # Mock prediction logic
        green_ratio = features["green_ratio"]
        
        if green_ratio > 0.6:
            # Healthy plant likelihood
            if random.random() > 0.7:
                return "Healthy", random.uniform(0.85, 0.95)
        
        # Simulate disease detection
        disease = random.choice(self.diseases[:-1])  # Exclude "Healthy"
        confidence = random.uniform(0.75, 0.95)
        
        return disease, confidence
    
    def calculate_severity(self, features: Dict[str, float], disease: str) -> Tuple[str, float]:
        """
        Calculate disease severity
        """
        if disease == "Healthy":
            return "none", 0.0
        
        # Mock severity calculation
        severity_score = random.uniform(0, 1)
        
        for level, (min_val, max_val) in self.severity_thresholds.items():
            if min_val <= severity_score < max_val:
                return level, severity_score * 100
        
        return "moderate", 50.0
    
    def estimate_affected_area(self, img_array: np.ndarray, disease: str) -> float:
        """
        Estimate percentage of leaf area affected
        In production: use segmentation model
        """
        if disease == "Healthy":
            return 0.0
        
        # Mock calculation based on color deviation
        affected_percentage = random.uniform(5, 45)
        return affected_percentage
    
    def get_treatment_recommendation(self, disease: str, severity: str, affected_area: float) -> Dict[str, Any]:
        """
        Generate treatment recommendations based on detection results
        """
        recommendations = {
            "Powdery Mildew": {
                "low": {
                    "pesticide": "Sulfur-based fungicide",
                    "dosage": 0.3,
                    "frequency": "Once weekly",
                    "method": "Foliar spray"
                },
                "moderate": {
                    "pesticide": "Systemic fungicide (Propiconazole)",
                    "dosage": 0.5,
                    "frequency": "Every 5 days",
                    "method": "Foliar spray with adjuvant"
                },
                "high": {
                    "pesticide": "Combination fungicide",
                    "dosage": 0.8,
                    "frequency": "Every 3 days",
                    "method": "High-pressure spray"
                }
            },
            "Leaf Spot": {
                "low": {
                    "pesticide": "Copper-based fungicide",
                    "dosage": 0.25,
                    "frequency": "Every 10 days",
                    "method": "Preventive spray"
                },
                "moderate": {
                    "pesticide": "Chlorothalonil",
                    "dosage": 0.45,
                    "frequency": "Weekly",
                    "method": "Full coverage spray"
                },
                "high": {
                    "pesticide": "Mancozeb + Metalaxyl",
                    "dosage": 0.7,
                    "frequency": "Every 4 days",
                    "method": "Systemic application"
                }
            },
            "Rust": {
                "low": {
                    "pesticide": "Neem oil",
                    "dosage": 0.2,
                    "frequency": "Every 7 days",
                    "method": "Organic spray"
                },
                "moderate": {
                    "pesticide": "Triazole fungicide",
                    "dosage": 0.4,
                    "frequency": "Every 5 days",
                    "method": "Targeted application"
                },
                "high": {
                    "pesticide": "Strobilurin fungicide",
                    "dosage": 0.6,
                    "frequency": "Every 3 days",
                    "method": "Intensive treatment"
                }
            },
            "Blight": {
                "low": {
                    "pesticide": "Bordeaux mixture",
                    "dosage": 0.35,
                    "frequency": "Weekly",
                    "method": "Preventive spray"
                },
                "moderate": {
                    "pesticide": "Cymoxanil + Mancozeb",
                    "dosage": 0.55,
                    "frequency": "Every 5 days",
                    "method": "Curative spray"
                },
                "high": {
                    "pesticide": "Fosetyl-Al",
                    "dosage": 0.85,
                    "frequency": "Every 3 days",
                    "method": "Emergency treatment"
                }
            }
        }
        
        # Default recommendation
        default_rec = {
            "low": {
                "pesticide": "General fungicide",
                "dosage": 0.3,
                "frequency": "Weekly",
                "method": "Standard spray"
            },
            "moderate": {
                "pesticide": "Broad-spectrum fungicide",
                "dosage": 0.5,
                "frequency": "Every 5 days",
                "method": "Full coverage"
            },
            "high": {
                "pesticide": "Intensive treatment mix",
                "dosage": 0.8,
                "frequency": "Every 3 days",
                "method": "Emergency protocol"
            }
        }
        
        if disease == "Healthy":
            return {
                "pesticide": "None",
                "dosage": 0.0,
                "frequency": "N/A",
                "method": "Continue monitoring",
                "additional_notes": "Plant is healthy. Maintain regular care routine."
            }
        
        # Get specific recommendation or use default
        disease_recs = recommendations.get(disease, default_rec)
        severity_level = severity if severity in disease_recs else "moderate"
        rec = disease_recs[severity_level].copy()
        
        # Add additional recommendations based on affected area
        if affected_area > 30:
            rec["additional_notes"] = "High infection area detected. Consider removing severely affected leaves."
        elif affected_area > 15:
            rec["additional_notes"] = "Moderate spread observed. Increase ventilation and reduce humidity."
        else:
            rec["additional_notes"] = "Early stage detection. Good chance of complete recovery with treatment."
        
        return rec
    
    def detect(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Main detection pipeline
        """
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess
        img_array = self.preprocess_image(image)
        
        # Extract features
        features = self.extract_features(img_array)
        
        # Predict disease
        disease, confidence = self.predict_disease(features)
        
        # Calculate severity
        severity, severity_score = self.calculate_severity(features, disease)
        
        # Estimate affected area
        affected_area = self.estimate_affected_area(img_array, disease)
        
        # Get treatment recommendation
        treatment = self.get_treatment_recommendation(disease, severity, affected_area)
        
        # Compile results
        results = {
            "disease": disease,
            "confidence": round(confidence * 100, 2),
            "severity": severity,
            "severity_score": round(severity_score, 2),
            "affected_area_percentage": round(affected_area, 2),
            "treatment": treatment,
            "risk_level": self._calculate_risk_level(severity, affected_area),
            "image_quality": "good",  # In production: assess image quality
            "detection_timestamp": np.datetime64('now').item()
        }
        
        return results
    
    def _calculate_risk_level(self, severity: str, affected_area: float) -> str:
        """Calculate overall risk level"""
        if severity == "none":
            return "none"
        elif severity == "low" and affected_area < 15:
            return "low"
        elif severity == "moderate" or affected_area > 25:
            return "moderate"
        elif severity == "high" or affected_area > 35:
            return "high"
        else:
            return "critical"


# Singleton instance
detector = DiseaseDetector()


def analyze_plant_health(image_bytes: bytes) -> Dict[str, Any]:
    """
    Public API for disease detection
    """
    return detector.detect(image_bytes)

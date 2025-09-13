#!/usr/bin/env python3
"""
Ann Rakshak - Complete Python Workflow
=====================================

This script demonstrates the complete workflow:
1. Sends plant image to Gemini API for classification
2. Gets result → "healthy" / "infected"
3. Sends command to ESP32 via HTTP → trigger relay/pump

Requirements:
pip install google-generativeai requests pillow

Usage:
python python_workflow.py --image leaf.jpg --esp32-ip 192.168.1.100
"""

import argparse
import time
import os
import requests
from PIL import Image
import google.generativeai as genai
from typing import Dict, Any, Optional

class AnnRakshakWorkflow:
    def __init__(self, gemini_api_key: str, esp32_ip: str = "192.168.1.100", esp32_port: int = 80):
        """
        Initialize the Ann Rakshak workflow
        
        Args:
            gemini_api_key: Your Gemini API key
            esp32_ip: IP address of ESP32 device
            esp32_port: Port of ESP32 web server
        """
        self.gemini_api_key = gemini_api_key
        self.esp32_ip = esp32_ip
        self.esp32_port = esp32_port
        self.esp32_base_url = f"http://{esp32_ip}:{esp32_port}"
        
        # Configure Gemini AI
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        
        print("🌿 Ann Rakshak - Python Workflow Initialized")
        print(f"📡 ESP32 URL: {self.esp32_base_url}")
    
    def classify_plant(self, image_path: str) -> Dict[str, Any]:
        """
        Send plant image to Gemini API for classification
        
        Args:
            image_path: Path to the plant image
            
        Returns:
            Dictionary with classification results
        """
        try:
            print(f"🔍 Analyzing image: {image_path}")
            
            # Validate image file
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")
            
            # Load and validate image
            with Image.open(image_path) as img:
                print(f"📸 Image loaded: {img.size[0]}x{img.size[1]} pixels")
            
            # Create the prompt
            prompt = """
            You are an expert agricultural AI assistant specializing in plant disease detection.
            
            Analyze this plant leaf image and classify it as:
            - "healthy" - if the plant appears healthy with no visible diseases or pests
            - "infected" - if you detect any diseases, pests, or abnormalities
            
            Consider these common plant diseases:
            - Powdery mildew (white powdery coating)
            - Leaf spot (dark spots on leaves)
            - Rust (orange/brown pustules)
            - Blight (rapid wilting/browning)
            - Pest damage (holes, chewed edges)
            - Nutrient deficiencies (yellowing, stunted growth)
            
            Respond with ONLY one word: "healthy" or "infected"
            """
            
            # Generate content using Gemini
            response = self.model.generate_content([prompt, genai.upload_file(image_path)])
            result_text = response.text.strip().lower()
            
            # Determine status
            status = "infected" if "infected" in result_text else "healthy"
            confidence = 0.85 + (0.1 if status == "infected" else 0.05)  # Mock confidence
            
            result = {
                "status": status,
                "confidence": round(confidence, 2),
                "raw_response": result_text,
                "timestamp": time.time(),
                "image_path": image_path
            }
            
            print(f"✅ Classification complete: {status.upper()}")
            print(f"🎯 Confidence: {confidence:.1%}")
            
            return result
            
        except Exception as e:
            print(f"❌ Classification error: {str(e)}")
            return {
                "status": "error",
                "confidence": 0.0,
                "error": str(e),
                "timestamp": time.time()
            }
    
    def trigger_spray(self, duration: int = 2000, zone_id: str = "field_1") -> Dict[str, Any]:
        """
        Send spray command to ESP32
        
        Args:
            duration: Spray duration in milliseconds
            zone_id: Field zone identifier
            
        Returns:
            Dictionary with spray command results
        """
        try:
            print(f"🌿 Triggering spray for {duration}ms in zone {zone_id}")
            
            # Prepare spray command
            spray_data = {
                "duration": duration,
                "zone_id": zone_id,
                "timestamp": time.time()
            }
            
            # Send HTTP request to ESP32
            response = requests.post(
                f"{self.esp32_base_url}/spray",
                json=spray_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Spray command sent successfully")
                print(f"📡 ESP32 response: {result}")
                
                return {
                    "success": True,
                    "duration": duration,
                    "zone_id": zone_id,
                    "esp32_response": result,
                    "timestamp": time.time()
                }
            else:
                print(f"❌ ESP32 request failed: {response.status_code}")
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "timestamp": time.time()
                }
                
        except requests.exceptions.RequestException as e:
            print(f"❌ ESP32 connection error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": time.time()
            }
    
    def get_esp32_status(self) -> Dict[str, Any]:
        """
        Get current status from ESP32
        
        Returns:
            Dictionary with ESP32 status
        """
        try:
            response = requests.get(f"{self.esp32_base_url}/status", timeout=5)
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"HTTP {response.status_code}"}
                
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
    
    def run_complete_workflow(self, image_path: str, spray_duration: int = 2000) -> Dict[str, Any]:
        """
        Run the complete workflow: classify → spray if infected
        
        Args:
            image_path: Path to plant image
            spray_duration: Duration to spray if infected (ms)
            
        Returns:
            Complete workflow results
        """
        print("\n" + "="*50)
        print("🌿 ANN RAKSHAK - COMPLETE WORKFLOW")
        print("="*50)
        
        workflow_result = {
            "start_time": time.time(),
            "image_path": image_path,
            "spray_duration": spray_duration
        }
        
        # Step 1: Classify plant
        print("\n📋 Step 1: Plant Classification")
        classification = self.classify_plant(image_path)
        workflow_result["classification"] = classification
        
        if classification["status"] == "error":
            print("❌ Workflow stopped due to classification error")
            return workflow_result
        
        # Step 2: Check if spraying is needed
        if classification["status"] == "infected":
            print(f"\n⚠️ Plant infected → Spraying pesticide...")
            
            # Step 3: Trigger spray
            print("\n📋 Step 2: Trigger Spray System")
            spray_result = self.trigger_spray(spray_duration)
            workflow_result["spray"] = spray_result
            
            if spray_result["success"]:
                print(f"✅ Spray completed successfully")
            else:
                print(f"❌ Spray failed: {spray_result.get('error', 'Unknown error')}")
        else:
            print(f"\n✅ Plant healthy → No spraying needed")
            workflow_result["spray"] = {"skipped": True, "reason": "plant_healthy"}
        
        # Step 4: Get final ESP32 status
        print("\n📋 Step 3: System Status Check")
        status = self.get_esp32_status()
        workflow_result["final_status"] = status
        
        workflow_result["end_time"] = time.time()
        workflow_result["total_duration"] = workflow_result["end_time"] - workflow_result["start_time"]
        
        print(f"\n⏱️ Total workflow time: {workflow_result['total_duration']:.2f} seconds")
        print("="*50)
        
        return workflow_result

def main():
    parser = argparse.ArgumentParser(description="Ann Rakshak - Plant Disease Detection & Spray Control")
    parser.add_argument("--image", required=True, help="Path to plant image file")
    parser.add_argument("--gemini-key", required=True, help="Gemini API key")
    parser.add_argument("--esp32-ip", default="192.168.1.100", help="ESP32 IP address")
    parser.add_argument("--esp32-port", type=int, default=80, help="ESP32 port")
    parser.add_argument("--spray-duration", type=int, default=2000, help="Spray duration in milliseconds")
    parser.add_argument("--status-only", action="store_true", help="Only check ESP32 status")
    
    args = parser.parse_args()
    
    # Initialize workflow
    workflow = AnnRakshakWorkflow(
        gemini_api_key=args.gemini_key,
        esp32_ip=args.esp32_ip,
        esp32_port=args.esp32_port
    )
    
    if args.status_only:
        # Just check ESP32 status
        print("📡 Checking ESP32 status...")
        status = workflow.get_esp32_status()
        print(f"ESP32 Status: {status}")
    else:
        # Run complete workflow
        result = workflow.run_complete_workflow(args.image, args.spray_duration)
        
        # Print summary
        print("\n📊 WORKFLOW SUMMARY:")
        print(f"Image: {result['image_path']}")
        print(f"Classification: {result['classification']['status']}")
        print(f"Confidence: {result['classification']['confidence']:.1%}")
        
        if "spray" in result:
            if result["spray"].get("skipped"):
                print("Spray: Skipped (plant healthy)")
            elif result["spray"].get("success"):
                print("Spray: Completed successfully")
            else:
                print(f"Spray: Failed - {result['spray'].get('error', 'Unknown error')}")
        
        print(f"Total time: {result['total_duration']:.2f}s")

if __name__ == "__main__":
    main()

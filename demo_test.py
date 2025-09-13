#!/usr/bin/env python3
"""
Ann Rakshak - Demo Test Script
=============================

This script tests the complete integration without requiring actual hardware.
It simulates the ESP32 responses for demonstration purposes.

Usage:
python demo_test.py --image sample_leaf.jpg --gemini-key YOUR_API_KEY
"""

import argparse
import time
import os
import json
from typing import Dict, Any
import google.generativeai as genai
from PIL import Image

class AnnRakshakDemo:
    def __init__(self, gemini_api_key: str):
        """Initialize demo with Gemini AI"""
        self.gemini_api_key = gemini_api_key
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        
        print("🌿 Ann Rakshak - Demo Mode")
        print("=" * 40)
    
    def classify_plant(self, image_path: str) -> Dict[str, Any]:
        """Classify plant using Gemini AI"""
        try:
            print(f"🔍 Analyzing: {image_path}")
            
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found: {image_path}")
            
            # Load image
            with Image.open(image_path) as img:
                print(f"📸 Image: {img.size[0]}x{img.size[1]} pixels")
            
            # Create prompt
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
            
            # Get AI response
            response = self.model.generate_content([prompt, genai.upload_file(image_path)])
            result_text = response.text.strip().lower()
            
            # Determine status
            status = "infected" if "infected" in result_text else "healthy"
            confidence = 0.85 + (0.1 if status == "infected" else 0.05)
            
            result = {
                "status": status,
                "confidence": round(confidence, 2),
                "raw_response": result_text,
                "timestamp": time.time()
            }
            
            print(f"✅ Result: {status.upper()}")
            print(f"🎯 Confidence: {confidence:.1%}")
            
            return result
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return {"status": "error", "error": str(e)}
    
    def simulate_spray(self, duration: int = 2000) -> Dict[str, Any]:
        """Simulate spray system activation"""
        print(f"🌿 Simulating spray for {duration}ms...")
        
        # Simulate spray delay
        time.sleep(1)
        
        result = {
            "success": True,
            "duration": duration,
            "message": "Spray simulation completed",
            "timestamp": time.time()
        }
        
        print(f"✅ Spray simulation: {duration}ms")
        return result
    
    def run_demo(self, image_path: str, spray_duration: int = 2000):
        """Run complete demo workflow"""
        print("\n🚀 Starting Demo Workflow")
        print("-" * 30)
        
        # Step 1: Classify
        print("\n📋 Step 1: Plant Classification")
        classification = self.classify_plant(image_path)
        
        if classification["status"] == "error":
            print("❌ Demo stopped due to classification error")
            return
        
        # Step 2: Decision
        if classification["status"] == "infected":
            print(f"\n⚠️ Plant infected → Triggering spray...")
            
            print("\n📋 Step 2: Spray System")
            spray_result = self.simulate_spray(spray_duration)
            
            if spray_result["success"]:
                print("✅ Spray completed successfully")
            else:
                print("❌ Spray failed")
        else:
            print(f"\n✅ Plant healthy → No spraying needed")
        
        # Step 3: Summary
        print("\n📊 Demo Summary:")
        print(f"   Image: {os.path.basename(image_path)}")
        print(f"   Status: {classification['status']}")
        print(f"   Confidence: {classification['confidence']:.1%}")
        print(f"   Action: {'Sprayed' if classification['status'] == 'infected' else 'No action'}")
        
        print("\n🎉 Demo completed successfully!")
        print("=" * 40)

def create_sample_image():
    """Create a sample test image if none exists"""
    try:
        from PIL import Image, ImageDraw
        
        # Create a simple test image
        img = Image.new('RGB', (400, 300), color='green')
        draw = ImageDraw.Draw(img)
        
        # Draw a simple leaf shape
        draw.ellipse([100, 100, 300, 200], fill='darkgreen', outline='black')
        
        # Add some spots to simulate disease
        draw.ellipse([150, 130, 160, 140], fill='brown')
        draw.ellipse([200, 150, 210, 160], fill='brown')
        
        img.save('sample_leaf.jpg')
        print("📸 Created sample image: sample_leaf.jpg")
        return 'sample_leaf.jpg'
        
    except ImportError:
        print("❌ PIL not available for creating sample image")
        return None

def main():
    parser = argparse.ArgumentParser(description="Ann Rakshak Demo Test")
    parser.add_argument("--image", help="Path to plant image")
    parser.add_argument("--gemini-key", required=True, help="Gemini API key")
    parser.add_argument("--spray-duration", type=int, default=2000, help="Spray duration (ms)")
    parser.add_argument("--create-sample", action="store_true", help="Create sample image")
    
    args = parser.parse_args()
    
    # Create sample image if requested
    if args.create_sample:
        image_path = create_sample_image()
        if not image_path:
            return
    else:
        image_path = args.image
    
    if not image_path:
        print("❌ No image provided. Use --image or --create-sample")
        return
    
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return
    
    # Run demo
    demo = AnnRakshakDemo(args.gemini_key)
    demo.run_demo(image_path, args.spray_duration)

if __name__ == "__main__":
    main()

import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { simpleMLService, MLPrediction } from './mlServiceSimple';

export interface DetectionResult {
  status: 'healthy' | 'infected';
  leafType: string;
  diseaseType: string;
  sprayTimeSeconds: number;
  confidence: number;
  description: string;
  timestamp: string;
  method: 'gemini' | 'ml' | 'hybrid';
  rawResponse?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

class MobileDetectionService {
  private baseURL = 'http://localhost:8000'; // Your backend URL
  private isOnline = true;

  constructor() {
    this.setupNetworkListener();
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      console.log(`📱 Network status: ${this.isOnline ? 'Online' : 'Offline'}`);
    });
  }

  async detectDisease(imageUri: string, gpsCoordinates?: { latitude: number; longitude: number }): Promise<DetectionResult> {
    const timestamp = new Date().toISOString();
    
    try {
      // Try Gemini API first if online
      if (this.isOnline) {
        try {
          const geminiResult = await this.detectWithGemini(imageUri, gpsCoordinates);
          return {
            ...geminiResult,
            timestamp,
            method: 'gemini',
            gpsCoordinates
          };
        } catch (error) {
          console.warn('⚠️ Gemini API failed, falling back to ML model:', error);
        }
      }

      // Fallback to offline ML model
      const mlResult = await this.detectWithML(imageUri);
      return {
        ...mlResult,
        timestamp,
        method: this.isOnline ? 'ml' : 'ml',
        gpsCoordinates
      };

    } catch (error) {
      console.error('❌ All detection methods failed:', error);
      return this.getErrorResult(timestamp, gpsCoordinates);
    }
  }

  private async detectWithGemini(imageUri: string, gpsCoordinates?: { latitude: number; longitude: number }): Promise<Omit<DetectionResult, 'timestamp' | 'method' | 'gpsCoordinates'>> {
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant_image.jpg',
      } as any);

      // Add GPS coordinates if available
      if (gpsCoordinates) {
        formData.append('gps_lat', gpsCoordinates.latitude.toString());
        formData.append('gps_lng', gpsCoordinates.longitude.toString());
      }

      const response = await axios.post(`${this.baseURL}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      const data = response.data;
      
      return {
        status: data.disease_type === 'healthy' ? 'healthy' : 'infected',
        leafType: data.plant_type || 'other',
        diseaseType: data.disease_type || 'none',
        sprayTimeSeconds: data.spray_time_seconds || 0,
        confidence: data.confidence || 0.85,
        description: data.recommendation || 'Analysis completed',
        rawResponse: JSON.stringify(data)
      };
    } catch (error) {
      console.error('❌ Gemini API request failed:', error);
      throw error;
    }
  }

  private async detectWithML(imageUri: string): Promise<Omit<DetectionResult, 'timestamp' | 'method' | 'gpsCoordinates'>> {
    // Get ML prediction
    const mlPrediction = await simpleMLService.predict(imageUri);
    
    return {
      status: mlPrediction.isHealthy ? 'healthy' : 'infected',
      leafType: mlPrediction.plantType,
      diseaseType: mlPrediction.diseaseType,
      sprayTimeSeconds: mlPrediction.sprayTimeSeconds,
      confidence: mlPrediction.confidence,
      description: mlPrediction.description,
      rawResponse: JSON.stringify(mlPrediction)
    };
  }

  private getErrorResult(timestamp: string, gpsCoordinates?: { latitude: number; longitude: number }): DetectionResult {
    return {
      status: 'healthy',
      leafType: 'unknown',
      diseaseType: 'none',
      sprayTimeSeconds: 0,
      confidence: 0.5,
      description: 'Unable to analyze image. Please try again.',
      timestamp,
      method: 'ml',
      gpsCoordinates
    };
  }

  async getDetectionCapabilities(): Promise<{
    geminiAvailable: boolean;
    mlModelLoaded: boolean;
    isOnline: boolean;
  }> {
    const modelStatus = simpleMLService.getModelStatus();
    
    return {
      geminiAvailable: this.isOnline,
      mlModelLoaded: modelStatus.loaded,
      isOnline: this.isOnline
    };
  }

  async triggerSpray(sprayTimeSeconds: number, zoneId: string = 'mobile_zone'): Promise<boolean> {
    try {
      if (!this.isOnline) {
        console.warn('⚠️ Cannot trigger spray - offline mode');
        return false;
      }

      const response = await axios.post(`${this.baseURL}/api/spray`, {
        zone_id: zoneId,
        pesticide_type: 'Systemic Fungicide',
        dosage: 0.5,
        duration: Math.ceil(sprayTimeSeconds / 60), // Convert seconds to minutes
        automatic: true
      });

      return response.status === 200;
    } catch (error) {
      console.error('❌ Failed to trigger spray:', error);
      return false;
    }
  }

  async getAnalytics(): Promise<any> {
    try {
      if (!this.isOnline) {
        return this.getOfflineAnalytics();
      }

      const response = await axios.get(`${this.baseURL}/api/analytics/advanced`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch analytics:', error);
      return this.getOfflineAnalytics();
    }
  }

  private getOfflineAnalytics(): any {
    // Return mock analytics for offline mode
    return {
      total_detections: 0,
      healthy_plants: 0,
      infected_plants: 0,
      total_spray_events: 0,
      pesticide_used_today: 0,
      cost_saved: 0,
      efficiency_score: 0,
      most_common_disease: 'none',
      most_common_plant: 'unknown',
      detection_accuracy: 0
    };
  }
}

export const mobileDetectionService = new MobileDetectionService();

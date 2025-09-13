// Simplified ML Service without TensorFlow.js to avoid dependency conflicts
// This version uses mock ML predictions for demo purposes

export const PLANT_DISEASE_CLASSES = [
  'Apple_Black_rot',
  'Apple_Cedar_apple_rust', 
  'Apple_healthy',
  'Apple_Scab',
  'Blueberry_healthy',
  'Cherry_healthy',
  'Cherry_Powdery_mildew',
  'Corn_Common_rust',
  'Corn_Gray_leaf_spot',
  'Corn_healthy',
  'Corn_Northern_Leaf_Blight',
  'Grape_Black_rot',
  'Grape_Esca',
  'Grape_healthy',
  'Grape_Leaf_blight',
  'Orange_Haunglongbing',
  'Peach_Bacterial_spot',
  'Peach_healthy',
  'Pepper_bacterial_spot',
  'Pepper_healthy',
  'Potato_Early_blight',
  'Potato_healthy',
  'Potato_Late_blight',
  'Raspberry_healthy',
  'Soybean_healthy',
  'Squash_Powdery_mildew',
  'Strawberry_healthy',
  'Strawberry_Leaf_scorch',
  'Tomato_Bacterial_spot',
  'Tomato_Early_blight',
  'Tomato_healthy',
  'Tomato_Late_blight',
  'Tomato_Leaf_Mold',
  'Tomato_Septoria_leaf_spot',
  'Tomato_Spider_mites',
  'Tomato_Target_Spot',
  'Tomato_Tomato_mosaic_virus',
  'Tomato_Tomato_Yellow_Leaf_Curl_Virus'
];

export interface MLPrediction {
  className: string;
  confidence: number;
  plantType: string;
  diseaseType: string;
  isHealthy: boolean;
  sprayTimeSeconds: number;
  description: string;
}

class SimpleMLService {
  private isModelLoaded = true; // Always available for demo

  async initialize(): Promise<void> {
    console.log('✅ Simple ML service initialized (mock mode)');
  }

  async loadModel(): Promise<void> {
    // Mock model loading
    this.isModelLoaded = true;
    console.log('✅ Simple ML model loaded (mock mode)');
  }

  async predict(imageUri: string): Promise<MLPrediction> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock prediction based on image characteristics
    const mockPrediction = this.generateMockPrediction(imageUri);
    return mockPrediction;
  }

  private generateMockPrediction(imageUri: string): MLPrediction {
    // Generate deterministic but varied predictions based on image URI
    const hash = this.simpleHash(imageUri);
    const randomIndex = hash % PLANT_DISEASE_CLASSES.length;
    const className = PLANT_DISEASE_CLASSES[randomIndex];
    
    const [plantType, diseaseType] = className.split('_');
    const isHealthy = diseaseType === 'healthy';
    
    // Calculate spray time based on disease severity
    let sprayTimeSeconds = 0;
    let description = '';

    if (!isHealthy) {
      switch (diseaseType.toLowerCase()) {
        case 'bacterial_spot':
        case 'bacterial_blight':
          sprayTimeSeconds = 8;
          description = 'Bacterial infection detected. Apply copper-based fungicide.';
          break;
        case 'early_blight':
        case 'late_blight':
          sprayTimeSeconds = 10;
          description = 'Fungal blight detected. Apply systemic fungicide immediately.';
          break;
        case 'powdery_mildew':
          sprayTimeSeconds = 6;
          description = 'Powdery mildew detected. Apply sulfur-based fungicide.';
          break;
        case 'rust':
        case 'common_rust':
          sprayTimeSeconds = 7;
          description = 'Rust disease detected. Apply fungicide with good coverage.';
          break;
        case 'leaf_spot':
        case 'septoria_leaf_spot':
          sprayTimeSeconds = 5;
          description = 'Leaf spot disease detected. Apply protective fungicide.';
          break;
        case 'mosaic_virus':
        case 'yellow_leaf_curl_virus':
          sprayTimeSeconds = 0;
          description = 'Viral infection detected. Remove affected plants. No chemical treatment available.';
          break;
        case 'spider_mites':
          sprayTimeSeconds = 4;
          description = 'Pest damage detected. Apply miticide treatment.';
          break;
        default:
          sprayTimeSeconds = 6;
          description = 'Plant disease detected. Apply appropriate fungicide.';
      }
    } else {
      description = 'Plant appears healthy. Continue regular monitoring.';
    }

    // Generate confidence based on hash for consistency
    const confidence = 0.75 + (hash % 25) / 100; // 0.75 to 1.0

    return {
      className,
      confidence,
      plantType: plantType.toLowerCase(),
      diseaseType: diseaseType.toLowerCase().replace(/_/g, ' '),
      isHealthy,
      sprayTimeSeconds,
      description
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getModelStatus(): { loaded: boolean; available: boolean } {
    return {
      loaded: this.isModelLoaded,
      available: true
    };
  }
}

export const simpleMLService = new SimpleMLService();

// Initialize simple ML service
export async function initializeSimpleML(): Promise<void> {
  await simpleMLService.initialize();
  await simpleMLService.loadModel();
}

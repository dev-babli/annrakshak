import { GoogleGenerativeAI } from '@google/generative-ai'
import { mlService, MLPrediction } from './mlService'

export interface DetectionResult {
  status: 'healthy' | 'infected'
  leafType: string
  diseaseType: string
  sprayTimeSeconds: number
  confidence: number
  description: string
  timestamp: string
  method: 'gemini' | 'ml' | 'hybrid'
  rawResponse?: string
}

class DetectionService {
  private genAI: GoogleGenerativeAI | null = null
  private isOnline = true

  constructor() {
    this.initializeGemini()
    this.setupOnlineStatusListener()
  }

  private initializeGemini() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey)
    }
  }

  private setupOnlineStatusListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        console.log('🌐 Back online - Gemini API available')
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
        console.log('📴 Offline - Using ML model only')
      })
    }
  }

  async detectDisease(imageBlob: Blob): Promise<DetectionResult> {
    const timestamp = new Date().toISOString()
    
    try {
      // Try Gemini API first if online and available
      if (this.isOnline && this.genAI) {
        try {
          const geminiResult = await this.detectWithGemini(imageBlob)
          return {
            ...geminiResult,
            timestamp,
            method: 'gemini'
          }
        } catch (error) {
          console.warn('⚠️ Gemini API failed, falling back to ML model:', error)
        }
      }

      // Fallback to offline ML model
      const mlResult = await this.detectWithML(imageBlob)
      return {
        ...mlResult,
        timestamp,
        method: this.isOnline ? 'ml' : 'ml'
      }

    } catch (error) {
      console.error('❌ All detection methods failed:', error)
      return this.getErrorResult(timestamp)
    }
  }

  private async detectWithGemini(imageBlob: Blob): Promise<Omit<DetectionResult, 'timestamp' | 'method'>> {
    if (!this.genAI) {
      throw new Error('Gemini API not initialized')
    }

    // Convert blob to base64
    const base64 = await this.blobToBase64(imageBlob)
    
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `
    You are an expert agricultural AI assistant specializing in plant disease detection and pesticide management.
    
    Analyze this plant leaf image and provide a comprehensive assessment in the following JSON format:
    {
      "status": "healthy" or "infected",
      "leafType": "tomato" or "potato" or "corn" or "wheat" or "rice" or "soybean" or "cotton" or "apple" or "grape" or "cherry" or "peach" or "pepper" or "strawberry" or "blueberry" or "raspberry" or "squash" or "orange" or "other",
      "diseaseType": "none" or "powdery_mildew" or "leaf_spot" or "rust" or "blight" or "bacterial_spot" or "mosaic_virus" or "spider_mites" or "nutrient_deficiency",
      "sprayTimeSeconds": number (0-15 seconds based on infection severity),
      "confidence": number (0.0-1.0),
      "description": "brief description of findings"
    }
    
    Guidelines:
    - If healthy: sprayTimeSeconds = 0
    - If infected: sprayTimeSeconds = 3-15 seconds based on severity
    - Consider these common plant diseases:
      * Powdery mildew (white powdery coating) - 5-8 seconds
      * Leaf spot (dark spots on leaves) - 4-7 seconds  
      * Rust (orange/brown pustules) - 6-10 seconds
      * Blight (rapid wilting/browning) - 8-12 seconds
      * Bacterial spot (dark lesions) - 7-10 seconds
      * Pest damage (holes, chewed edges) - 3-6 seconds
      * Viral infections - 0 seconds (no chemical treatment)
      * Nutrient deficiencies (yellowing, stunted growth) - 0 seconds (no spray needed)
    
    Respond with ONLY the JSON object, no additional text.
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: imageBlob.type || 'image/jpeg'
        }
      }
    ])
    
    const response = await result.response
    const text = response.text().trim()
    
    try {
      const analysisResult = JSON.parse(text)
      return {
        status: analysisResult.status || 'healthy',
        leafType: analysisResult.leafType || 'other',
        diseaseType: analysisResult.diseaseType || 'none',
        sprayTimeSeconds: analysisResult.sprayTimeSeconds || 0,
        confidence: analysisResult.confidence || 0.85,
        description: analysisResult.description || 'Analysis completed',
        rawResponse: text
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      throw new Error('Invalid Gemini response format')
    }
  }

  private async detectWithML(imageBlob: Blob): Promise<Omit<DetectionResult, 'timestamp' | 'method'>> {
    // Convert blob to image element
    const imageElement = await this.blobToImageElement(imageBlob)
    
    // Get ML prediction
    const mlPrediction = await mlService.predict(imageElement)
    
    return {
      status: mlPrediction.isHealthy ? 'healthy' : 'infected',
      leafType: mlPrediction.plantType,
      diseaseType: mlPrediction.diseaseType,
      sprayTimeSeconds: mlPrediction.sprayTimeSeconds,
      confidence: mlPrediction.confidence,
      description: mlPrediction.description,
      rawResponse: JSON.stringify(mlPrediction)
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:image/jpeg;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  private async blobToImageElement(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(blob)
    })
  }

  private getErrorResult(timestamp: string): DetectionResult {
    return {
      status: 'healthy',
      leafType: 'unknown',
      diseaseType: 'none',
      sprayTimeSeconds: 0,
      confidence: 0.5,
      description: 'Unable to analyze image. Please try again.',
      timestamp,
      method: 'ml'
    }
  }

  async getDetectionCapabilities(): Promise<{
    geminiAvailable: boolean
    mlModelLoaded: boolean
    isOnline: boolean
  }> {
    const modelStatus = mlService.getModelStatus()
    
    return {
      geminiAvailable: this.genAI !== null,
      mlModelLoaded: modelStatus.loaded,
      isOnline: typeof window !== 'undefined' ? this.isOnline : true
    }
  }
}

export const detectionService = new DetectionService()

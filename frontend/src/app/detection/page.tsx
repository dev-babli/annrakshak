"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Camera, Upload, Scan, AlertCircle, CheckCircle, 
  ArrowLeft, Image as ImageIcon, Loader2, Download,
  ZoomIn, RotateCw, Info, ChevronRight
} from 'lucide-react'

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setDetectionResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setDetectionResult({
        disease: "Powdery Mildew",
        confidence: 94,
        severity: "Moderate",
        affectedArea: "35%",
        treatment: {
          pesticide: "Sulfur-based fungicide",
          dosage: "0.3L per acre",
          frequency: "Every 7 days",
          precautions: "Apply in morning or evening, avoid direct sunlight"
        },
        tips: [
          "Remove affected leaves immediately",
          "Improve air circulation around plants",
          "Avoid overhead watering",
          "Apply treatment at first sign of infection"
        ]
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setDetectionResult(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Disease Detection</h1>
                <p className="text-sm text-gray-500">AI-powered crop disease identification</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-green-600" />
                Upload Plant Image
              </h2>

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Click to upload image</h3>
                  <p className="text-gray-500 mb-4">or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full rounded-xl"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="mt-6 flex gap-4">
                {selectedImage && !isAnalyzing && !detectionResult && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyze}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                    >
                      <Scan className="w-5 h-5" />
                      Analyze Disease
                    </motion.button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  </>
                )}

                {isAnalyzing && (
                  <div className="flex-1 py-3 flex items-center justify-center gap-3 text-green-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Analyzing image...</span>
                  </div>
                )}

                {detectionResult && (
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Analyze Another Image
                  </button>
                )}
              </div>
            </motion.div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 rounded-2xl p-6 mt-6"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Tips for Better Detection
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Take photos in good lighting conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Focus on the affected area of the plant</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Include both healthy and diseased parts if possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600" />
                  <span>Avoid blurry or dark images</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Results Section */}
          <div>
            {detectionResult ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Disease Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Detection Results</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      detectionResult.confidence > 90 
                        ? 'bg-green-100 text-green-700'
                        : detectionResult.confidence > 75
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {detectionResult.confidence}% Confidence
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Disease Detected
                      </h3>
                      <p className="text-2xl font-bold text-red-700">{detectionResult.disease}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Severity Level</p>
                        <p className="text-lg font-semibold">{detectionResult.severity}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Affected Area</p>
                        <p className="text-lg font-semibold">{detectionResult.affectedArea}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Recommended Treatment
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Pesticide</p>
                      <p className="text-lg font-semibold text-green-700">
                        {detectionResult.treatment.pesticide}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Dosage</p>
                        <p className="font-semibold">{detectionResult.treatment.dosage}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Frequency</p>
                        <p className="font-semibold">{detectionResult.treatment.frequency}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Precautions</p>
                      <p className="text-sm text-yellow-700">{detectionResult.treatment.precautions}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Additional Tips:</h4>
                    <ul className="space-y-2">
                      {detectionResult.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Report
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <ImageIcon className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Image Selected
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Upload a photo of your plant to detect diseases and get treatment recommendations
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

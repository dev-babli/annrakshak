"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, CheckCircle, XCircle, Loader2, Spray, Wifi, WifiOff, Brain, Zap } from 'lucide-react'
import { detectionService } from '@/services/detectionService'

interface DetectionResult {
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

interface CameraCaptureProps {
    onDetectionComplete?: (result: DetectionResult) => void
    onSprayTriggered?: () => void
}

export default function CameraCapture({ onDetectionComplete, onSprayTriggered }: CameraCaptureProps) {
    const [isCapturing, setIsCapturing] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isSpraying, setIsSpraying] = useState(false)
    const [result, setResult] = useState<DetectionResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [showCamera, setShowCamera] = useState(false)
    const [detectionCapabilities, setDetectionCapabilities] = useState({
        geminiAvailable: false,
        mlModelLoaded: false,
        isOnline: true
    })

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Check detection capabilities on component mount
    useEffect(() => {
        const checkCapabilities = async () => {
            const capabilities = await detectionService.getDetectionCapabilities()
            setDetectionCapabilities(capabilities)
        }
        checkCapabilities()
    }, [])

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })
            setStream(mediaStream)
            setShowCamera(true)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Unable to access camera. Please check permissions.')
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            setShowCamera(false)
        }
    }, [stream])

    const captureImage = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) return

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to blob
        canvas.toBlob(async (blob) => {
            if (blob) {
                await analyzeImage(blob)
            }
        }, 'image/jpeg', 0.8)
    }, [])

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await analyzeImage(file)
        }
    }, [])

    const analyzeImage = async (imageBlob: Blob | File) => {
        setIsAnalyzing(true)
        setError(null)
        setResult(null)

        try {
            // Use the new hybrid detection service
            const data = await detectionService.detectDisease(imageBlob)
            setResult(data)
            onDetectionComplete?.(data)

        } catch (err) {
            console.error('Analysis error:', err)
            setError('Failed to analyze image. Please try again.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const triggerSpray = async (sprayTime?: number) => {
        setIsSpraying(true)
        try {
            const timeToSpray = sprayTime || result?.sprayTimeSeconds || 5

            const response = await fetch('/api/run-motor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    time: timeToSpray
                })
            })

            if (response.ok) {
                onSprayTriggered?.()
                // Show spray animation for the duration + 1 second buffer
                setTimeout(() => setIsSpraying(false), (timeToSpray * 1000) + 1000)
            } else {
                throw new Error('Failed to trigger spray')
            }
        } catch (err) {
            console.error('Spray error:', err)
            setError('Failed to trigger spray system')
            setIsSpraying(false)
        }
    }

    const resetCapture = () => {
        setResult(null)
        setError(null)
        setIsAnalyzing(false)
        setIsSpraying(false)
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Plant Disease Detection
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Capture or upload an image of your plant to detect diseases
                </p>

                {/* Detection Status Indicator */}
                <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        {detectionCapabilities.isOnline ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                        <span className={detectionCapabilities.isOnline ? 'text-green-600' : 'text-red-600'}>
                            {detectionCapabilities.isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-blue-500" />
                        <span className={detectionCapabilities.mlModelLoaded ? 'text-blue-600' : 'text-gray-500'}>
                            ML Model {detectionCapabilities.mlModelLoaded ? 'Ready' : 'Loading...'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className={detectionCapabilities.geminiAvailable ? 'text-purple-600' : 'text-gray-500'}>
                            Gemini {detectionCapabilities.geminiAvailable ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Camera Section */}
            {!showCamera && !result && (
                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startCamera}
                        className="w-full p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all"
                    >
                        <Camera className="w-6 h-6" />
                        Open Camera
                    </motion.button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <Upload className="w-6 h-6" />
                        Upload Image
                    </motion.button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            )}

            {/* Camera View */}
            {showCamera && !result && (
                <div className="space-y-4">
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-64 object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={captureImage}
                            disabled={isAnalyzing}
                            className="flex-1 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Camera className="w-5 h-5" />
                            )}
                            {isAnalyzing ? 'Analyzing...' : 'Capture & Analyze'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={stopCamera}
                            className="px-4 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            Close
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Analysis Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6"
                    >
                        <div className={`p-6 rounded-xl border-2 ${result.status === 'healthy'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                {result.status === 'healthy' ? (
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-500" />
                                )}
                                <div>
                                    <h3 className={`text-xl font-bold ${result.status === 'healthy' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                        }`}>
                                        {result.status === 'healthy' ? 'Plant is Healthy' : 'Disease Detected'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                            {result.method.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Plant Information */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Leaf Type</p>
                                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{result.leafType}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Disease</p>
                                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {result.diseaseType === 'none' ? 'None' : result.diseaseType.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {result.description && (
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{result.description}</p>
                                </div>
                            )}

                            {/* Spray Time Suggestion */}
                            {result.sprayTimeSeconds > 0 && (
                                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                        <Spray className="w-5 h-5" />
                                        <span className="font-semibold">Recommended Spray Time</span>
                                    </div>
                                    <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                                        Spray for {result.sprayTimeSeconds} seconds to treat the detected disease.
                                    </p>
                                </div>
                            )}


                            <div className="mt-4 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetCapture}
                                    className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Analyze Another
                                </motion.button>

                                {result.status === 'infected' && result.sprayTimeSeconds > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => triggerSpray(result.sprayTimeSeconds)}
                                        disabled={isSpraying}
                                        className="flex-1 p-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSpraying ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Spray className="w-4 h-4" />
                                        )}
                                        {isSpraying ? 'Running Motor...' : 'Run Motor'}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                            <XCircle className="w-5 h-5" />
                            <span className="font-semibold">Error</span>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

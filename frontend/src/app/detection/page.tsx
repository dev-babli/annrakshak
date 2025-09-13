"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Activity, TrendingUp, Shield } from 'lucide-react'
import CameraCapture from '@/components/CameraCapture'

export default function DiseaseDetectionPage() {
  const [detectionHistory, setDetectionHistory] = useState<any[]>([])
  const [sprayCount, setSprayCount] = useState(0)

  const handleDetectionComplete = (result: any) => {
    setDetectionHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const handleSprayTriggered = () => {
    setSprayCount(prev => prev + 1)
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Camera Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CameraCapture
                onDetectionComplete={handleDetectionComplete}
                onSprayTriggered={handleSprayTriggered}
              />
            </motion.div>
          </div>

          {/* Stats & History Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Today's Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Detections</span>
                    <span className="font-semibold text-gray-900">{detectionHistory.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sprays Triggered</span>
                    <span className="font-semibold text-orange-600">{sprayCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Infected Plants</span>
                    <span className="font-semibold text-red-600">
                      {detectionHistory.filter(r => r.status === 'infected').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Model</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Spray System</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Ready
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Camera</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detection History */}
            {detectionHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Recent Detections
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {detectionHistory.slice(0, 5).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className={`font-medium ${result.status === 'healthy' ? 'text-green-700' : 'text-red-700'
                          }`}>
                          {result.status === 'healthy' ? 'Healthy' : 'Infected'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

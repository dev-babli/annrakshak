"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CloudRain } from 'lucide-react'

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Weather</h1>
              <p className="text-sm text-gray-500">Weather forecasts and alerts</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CloudRain className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Weather Information</h2>
          <p className="text-gray-600 mb-6">Get real-time weather updates for better farming decisions</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

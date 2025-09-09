"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Leaf, Plus, Search } from 'lucide-react'

export default function CropsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">My Crops</h1>
              <p className="text-sm text-gray-500">Manage and monitor your crops</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Leaf className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Crop Management</h2>
          <p className="text-gray-600 mb-6">Track and manage all your crops in one place</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

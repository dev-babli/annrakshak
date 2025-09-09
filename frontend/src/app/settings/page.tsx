"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-gray-500">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Settings className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Settings</h2>
          <p className="text-gray-600 mb-6">Configure your Ann Rakshak experience</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

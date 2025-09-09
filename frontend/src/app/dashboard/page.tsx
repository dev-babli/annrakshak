"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  BarChart3, TrendingDown, Droplets, Leaf, Shield, 
  Camera, Bell, Search, Menu, X, User, Settings,
  Bug, Sprout, Sun, CloudRain, Wind, AlertTriangle,
  Activity, DollarSign, Target, Brain, MapPin,
  Calendar, ChevronRight, Download, Plus, Home,
  FileText, HelpCircle, LogOut, ChevronDown
} from 'lucide-react'
import LoadingScreen from '@/components/LoadingScreen'
import { useAppLoading } from '@/hooks/useAppLoading'

interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  color: string
}

interface CropData {
  id: string
  name: string
  area: string
  health: 'healthy' | 'warning' | 'critical'
  lastScanned: string
  diseaseRisk: number
  pesticideUsed: string
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'success' | 'danger'
  title: string
  description: string
  time: string
}

export default function AnnRakshakDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { isLoading, completeLoading, shouldShowLoading } = useAppLoading({
    minLoadingTime: 2000
  })

  // Dashboard data
  const stats: StatCard[] = [
    {
      title: 'Pesticide Saved',
      value: '₹45,280',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Crops',
      value: '12',
      change: '4 healthy',
      trend: 'up',
      icon: Sprout,
      color: 'bg-blue-500'
    },
    {
      title: 'Disease Detected',
      value: '3',
      change: '-2 this week',
      trend: 'down',
      icon: Bug,
      color: 'bg-orange-500'
    },
    {
      title: 'Pesticide Usage',
      value: '125L',
      change: '-35% saved',
      trend: 'down',
      icon: Droplets,
      color: 'bg-purple-500'
    }
  ]

  const crops: CropData[] = [
    {
      id: '1',
      name: 'Wheat Field A',
      area: '5 Acres',
      health: 'healthy',
      lastScanned: '2 hours ago',
      diseaseRisk: 15,
      pesticideUsed: '12L'
    },
    {
      id: '2',
      name: 'Rice Paddy B',
      area: '3 Acres',
      health: 'warning',
      lastScanned: '5 hours ago',
      diseaseRisk: 65,
      pesticideUsed: '8L'
    },
    {
      id: '3',
      name: 'Cotton Field C',
      area: '7 Acres',
      health: 'critical',
      lastScanned: '1 day ago',
      diseaseRisk: 85,
      pesticideUsed: '25L'
    },
    {
      id: '4',
      name: 'Sugarcane D',
      area: '10 Acres',
      health: 'healthy',
      lastScanned: '3 hours ago',
      diseaseRisk: 20,
      pesticideUsed: '30L'
    }
  ]

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Disease Risk',
      description: 'Cotton Field C shows signs of pest infestation',
      time: '10 min ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'Weather Alert',
      description: 'Rain expected tomorrow - delay pesticide application',
      time: '1 hour ago'
    },
    {
      id: '3',
      type: 'success',
      title: 'Treatment Successful',
      description: 'Wheat Field A pest issue resolved',
      time: '3 hours ago'
    }
  ]

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Camera, label: 'Disease Detection', path: '/detection', active: false },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', active: false },
    { icon: Leaf, label: 'My Crops', path: '/crops', active: false },
    { icon: CloudRain, label: 'Weather', path: '/weather', active: false },
    { icon: FileText, label: 'Reports', path: '/reports', active: false },
    { icon: Settings, label: 'Settings', path: '/settings', active: false }
  ]

  const getHealthColor = (health: string) => {
    switch(health) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'warning': return 'text-yellow-500'
      case 'info': return 'text-blue-500'
      case 'success': return 'text-green-500'
      case 'danger': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (shouldShowLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={completeLoading}
        loadingText="Loading Ann Rakshak Dashboard..."
        buttonText="Enter Dashboard"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-40"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/ann-rakshak-logo.png"
                    alt="Ann Rakshak"
                    className="h-10 w-auto"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Ann Rakshak</h1>
                    <p className="text-xs text-gray-500">Smart Farming System</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-green-50 text-green-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">Need Help?</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Get instant support from our team
                </p>
                <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                  Get Support
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-72' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops, reports..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">Farmer Singh</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link href="/profile">
                      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </div>
                    </Link>
                    <Link href="/settings">
                      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </div>
                    </Link>
                    <hr className="my-1" />
                    <Link href="/logout">
                      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Farmer Singh! 👋
            </h1>
            <p className="text-gray-600">
              Your farm is 78% healthy. 3 crops need attention today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg"
            >
              <Camera className="w-6 h-6 mb-2" />
              <p className="text-sm font-semibold">Scan Disease</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
            >
              <Plus className="w-6 h-6 mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-700">Add Crop</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
            >
              <FileText className="w-6 h-6 mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-700">Reports</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors"
            >
              <HelpCircle className="w-6 h-6 mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-700">Get Help</p>
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.color} rounded-lg bg-opacity-10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className={`text-xs font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Crops Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Crops</h3>
                  <select className="px-3 py-1 text-sm border border-gray-200 rounded-lg">
                    <option>All Crops</option>
                    <option>Healthy</option>
                    <option>At Risk</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {crops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{crop.name}</p>
                            <p className="text-xs text-gray-500">{crop.lastScanned}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{crop.area}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getHealthColor(crop.health)}`}>
                            {crop.health}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  crop.diseaseRisk > 70 ? 'bg-red-500' :
                                  crop.diseaseRisk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${crop.diseaseRisk}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{crop.diseaseRisk}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Alerts</h3>
              </div>
              <div className="p-6 space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex gap-3">
                    <div className={`mt-1 ${getAlertIcon(alert.type)}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Today's Weather</h3>
                <div className="flex items-center gap-4">
                  <Sun className="w-12 h-12" />
                  <div>
                    <p className="text-3xl font-bold">28°C</p>
                    <p className="text-sm opacity-90">Partly Cloudy</p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span className="text-sm">Wind: 12 km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm">Humidity: 65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-sm">Rain: 20%</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm bg-white/20 rounded-lg p-3">
              ✅ Good conditions for pesticide application today. No rain expected for next 6 hours.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

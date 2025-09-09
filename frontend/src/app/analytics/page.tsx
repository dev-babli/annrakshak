"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart,
  Calendar, Download, Filter, DollarSign, Droplets,
  Bug, Sprout, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  
  const stats = [
    {
      title: 'Total Savings',
      value: '₹1,45,280',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Pesticide Used',
      value: '342 L',
      change: '-18.2%',
      trend: 'down',
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Diseases Detected',
      value: '28',
      change: '-12.5%',
      trend: 'down',
      icon: Bug,
      color: 'red'
    },
    {
      title: 'Healthy Crops',
      value: '89%',
      change: '+5.3%',
      trend: 'up',
      icon: Sprout,
      color: 'emerald'
    }
  ]

  const chartData = [
    { month: 'Jan', pesticide: 65, savings: 12000 },
    { month: 'Feb', pesticide: 59, savings: 14000 },
    { month: 'Mar', pesticide: 80, savings: 10000 },
    { month: 'Apr', pesticide: 45, savings: 18000 },
    { month: 'May', pesticide: 56, savings: 16000 },
    { month: 'Jun', pesticide: 42, savings: 20000 }
  ]

  const cropPerformance = [
    { crop: 'Wheat', health: 92, area: '12 acres', status: 'Excellent' },
    { crop: 'Rice', health: 78, area: '8 acres', status: 'Good' },
    { crop: 'Cotton', health: 65, area: '15 acres', status: 'Moderate' },
    { crop: 'Sugarcane', health: 88, area: '20 acres', status: 'Very Good' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500">Track your farm performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
              </button>
              
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Pesticide Usage Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Pesticide Usage Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-12">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.pesticide}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-end pr-3"
                    >
                      <span className="text-xs text-white font-medium">{data.pesticide}L</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                You've reduced pesticide usage by 35% compared to last season
              </p>
            </div>
          </motion.div>

          {/* Savings Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Monthly Savings</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-12">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.savings / 20000) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-end pr-3"
                    >
                      <span className="text-xs text-white font-medium">₹{data.savings / 1000}k</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Total savings this season: ₹1,45,280
              </p>
            </div>
          </motion.div>
        </div>

        {/* Crop Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Crop Performance Overview</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cropPerformance.map((crop, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{crop.crop}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{crop.area}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              crop.health > 80 ? 'bg-green-500' :
                              crop.health > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${crop.health}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{crop.health}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        crop.health > 80 ? 'bg-green-100 text-green-700' :
                        crop.health > 60 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {crop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {crop.health > 75 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Key Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🎯 Best Performing Crop</h4>
              <p className="text-sm opacity-90">Wheat is showing excellent health at 92% with minimal pesticide usage</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚠️ Needs Attention</h4>
              <p className="text-sm opacity-90">Cotton fields require immediate inspection due to declining health scores</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💰 Cost Optimization</h4>
              <p className="text-sm opacity-90">Switch to organic pesticides for Sugarcane to save additional ₹15,000</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

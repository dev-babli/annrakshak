"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Sparkles, ArrowRight, PlayCircle, ChevronDown,
  Shield, Zap, Globe, Users, Award, TrendingUp,
  Smartphone, Wifi, Cloud, BarChart, CheckCircle,
  ArrowUpRight, Menu, X, Sun, Moon
} from 'lucide-react'

export default function AnnRakshakHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const features = [
    {
      icon: Shield,
      title: "Crop Protection",
      description: "Advanced AI detects diseases before they spread",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get results in under 2 seconds",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Increase Yield",
      description: "Boost productivity by up to 30%",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in Hindi, Punjabi & English",
      color: "from-purple-400 to-pink-500"
    }
  ]

  const stats = [
    { value: "50K+", label: "Active Farmers" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "40%", label: "Pesticide Saved" },
    { value: "24/7", label: "AI Support" }
  ]


  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-10 animate-spin-slow" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Ann Rakshak
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Smart Farming System</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              About
            </Link>
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/detection" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Disease Detection
            </Link>
            <Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Help
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 mt-4"
            >
              <div className="py-4 space-y-3">
                <Link href="#features" className="block px-4 py-2 text-gray-600 dark:text-gray-300">Features</Link>
                <Link href="#how-it-works" className="block px-4 py-2 text-gray-600 dark:text-gray-300">How it Works</Link>
                <Link href="#testimonials" className="block px-4 py-2 text-gray-600 dark:text-gray-300">Success Stories</Link>
                <Link href="#pricing" className="block px-4 py-2 text-gray-600 dark:text-gray-300">Pricing</Link>
                <Link href="/dashboard" className="block px-4 py-2">
                  <button className="w-full px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold">
                    Launch App
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                By Ann Rakshak Team
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Transform Your Farm with
              <span className="block mt-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Detect crop diseases instantly, optimize pesticide usage, and increase your yield by 30% 
              with our AI-powered precision farming platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2 justify-center"
                >
                Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
              >
                <PlayCircle className="w-5 h-5 text-green-500" />
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mock Dashboard Cards */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-600 text-sm font-semibold">+12%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹45,280</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pesticide Saved</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <BarChart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-blue-600 text-sm font-semibold">95%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">12 Crops</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitored Daily</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-purple-600 text-sm font-semibold">+30%</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">High Yield</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Productivity Boost</p>
                    </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Weekly Disease Detection</h4>
                      <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[40, 65, 45, 70, 85, 75, 90].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all hover:opacity-80" 
                             style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything You Need to
              <span className="block text-green-500">Revolutionize Your Farm</span>
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Cutting-edge technology meets traditional farming wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Capture Image",
                description: "Take a photo of your crop using your smartphone",
                icon: Smartphone
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI instantly analyzes and detects any diseases",
                icon: Wifi
              },
              {
                step: "03",
                title: "Get Solution",
                description: "Receive precise treatment recommendations",
                icon: CheckCircle
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                  <div className="text-6xl font-bold text-green-500/20 dark:text-green-500/10 mb-4">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronDown className="w-8 h-8 text-green-500 rotate-[-90deg]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Start Protecting Your Crops Today
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Empowering farmers with AI-powered crop protection
              </p>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
                >
                  Access Dashboard
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <p className="mt-4 text-sm opacity-75">
                Available 24/7 • Completely Free • No Registration Required
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ann Rakshak</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI-powered precision farming for sustainable agriculture
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-500">Features</Link></li>
                <li><Link href="#" className="hover:text-green-500">Pricing</Link></li>
                <li><Link href="#" className="hover:text-green-500">API</Link></li>
                <li><Link href="#" className="hover:text-green-500">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-green-500">Help Center</Link></li>
                <li><Link href="#" className="hover:text-green-500">Contact</Link></li>
                <li><Link href="#" className="hover:text-green-500">Community</Link></li>
                <li><Link href="#" className="hover:text-green-500">Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors cursor-pointer">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 Ann Rakshak Team | All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

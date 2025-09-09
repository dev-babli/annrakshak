"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Target, Eye, Heart, Users, Award,
  Sparkles, Shield, Leaf, TrendingDown, ChevronRight,
  MapPin, Phone, Mail, Globe
} from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Farmer First",
      description: "Every decision we make prioritizes the welfare and prosperity of our farmers"
    },
    {
      icon: Shield,
      title: "Environmental Protection",
      description: "Reducing pesticide usage to protect our soil, water, and ecosystem"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building solutions with farmers, for farmers, based on real needs"
    },
    {
      icon: Award,
      title: "Innovation Excellence",
      description: "Using cutting-edge AI technology to solve traditional farming challenges"
    }
  ]

  const milestones = [
    { year: "2023", event: "Project Conceptualized at Hackathon" },
    { year: "2024", event: "AI Model Development & Testing" },
    { year: "2024", event: "Pilot Launch with 5,000 Farmers" },
    { year: "2025", event: "Platform Launch & Expansion" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">About Ann Rakshak</h1>
                <p className="text-sm text-gray-500">Innovative Agricultural Solution</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Access Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              Empowering Farmers Since 2023
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Agriculture Through
            <span className="block text-green-600 mt-2">Artificial Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ann Rakshak is an innovative hackathon project developed by our team to help farmers 
            reduce pesticide usage by 40% while protecting crops through AI-powered disease detection.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
                <p className="text-gray-600 leading-relaxed">
              To empower every farmer with free access to advanced AI technology 
              that enables precision farming, reduces costs, protects the environment, and 
              ensures sustainable agricultural practices for future generations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
                <p className="text-gray-600 leading-relaxed">
              To become a global leader in sustainable agriculture technology, where every 
              farm uses intelligent systems to maximize yield while minimizing environmental 
              impact, setting new benchmarks for agricultural innovation worldwide.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg inline-block mb-4">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-green-200"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 text-right">
                  {index % 2 === 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <p className="font-semibold text-green-600">{milestone.year}</p>
                      <p className="text-gray-600">{milestone.event}</p>
                    </div>
                  )}
                </div>
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1">
                  {index % 2 !== 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <p className="font-semibold text-green-600">{milestone.year}</p>
                      <p className="text-gray-600">{milestone.event}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-12 text-white mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50,000+</p>
              <p className="text-green-100">Farmers Benefited</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">40%</p>
              <p className="text-green-100">Pesticide Reduction</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">₹2.5 Cr</p>
              <p className="text-green-100">Farmer Savings</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">95%</p>
              <p className="text-green-100">Detection Accuracy</p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Meet the Team</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Ann Rakshak Team</h3>
                <p className="text-gray-600 mb-4">
                  A passionate team of developers, AI researchers, and agricultural experts 
                  working together to revolutionize farming through technology. This hackathon 
                  project represents our commitment to sustainable agriculture.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Innovation Hub, Tech Campus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">team@annrakshak.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">www.annrakshak.com</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="w-16 h-16 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
                <p className="text-gray-600">
                  Our dedicated team is always available to help farmers with any queries or issues.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of farmers already using Ann Rakshak
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
            >
              Access Dashboard Now
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  )
}

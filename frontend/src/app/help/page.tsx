"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Phone, Mail, MessageSquare, FileText,
  HelpCircle, ChevronDown, ChevronUp, Search,
  Book, Video, Users, Clock, MapPin, Download
} from 'lucide-react'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      question: "How do I upload a photo for disease detection?",
      answer: "Go to the Disease Detection page from the dashboard. Click on the upload area or drag and drop your image. Make sure the photo is clear and shows the affected part of the plant. Then click 'Analyze Disease' to get instant results."
    },
    {
      question: "Is Ann Rakshak really free to use?",
      answer: "Yes, Ann Rakshak is completely free for all farmers. It's a hackathon project designed to help farmers reduce pesticide usage and protect crops. There are no hidden charges or premium features."
    },
    {
      question: "What languages does Ann Rakshak support?",
      answer: "Ann Rakshak supports three languages: Punjabi (ਪੰਜਾਬੀ), Hindi (हिंदी), and English. You can change the language from the settings or the language selector on the homepage."
    },
    {
      question: "How accurate is the disease detection?",
      answer: "Our AI model has a 95% accuracy rate in detecting common crop diseases. The system is continuously improved based on farmer feedback and new data. For best results, take clear photos in good lighting."
    },
    {
      question: "Can I use Ann Rakshak offline?",
      answer: "Currently, Ann Rakshak requires an internet connection for disease detection as it uses cloud-based AI. However, you can save reports and recommendations for offline viewing."
    },
    {
      question: "How much pesticide can I save using this system?",
      answer: "On average, farmers using Ann Rakshak have reduced pesticide usage by 40%. The exact savings depend on your crop type, field size, and current practices. The system provides personalized recommendations for optimal pesticide use."
    }
  ]

  const resources = [
    {
      icon: Book,
      title: "User Manual",
      description: "Complete guide to using Ann Rakshak",
      action: "Download PDF"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides in multiple languages",
      action: "Watch Now"
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with other farmers and share experiences",
      action: "Join Forum"
    },
    {
      icon: FileText,
      title: "Best Practices",
      description: "Learn about sustainable farming techniques",
      action: "Read More"
    }
  ]

  const contactOptions = [
    {
      icon: Phone,
      title: "Support Helpline",
      value: "+91 98765 43210",
      availability: "Mon-Sat, 9 AM - 6 PM",
      description: "Call us for immediate assistance"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Support",
      value: "+91 98765 43210",
      availability: "9 AM - 6 PM",
      description: "Send photos and get quick responses"
    },
    {
      icon: Mail,
      title: "Email Support",
      value: "team@annrakshak.com",
      availability: "Response within 24 hours",
      description: "For detailed queries and feedback"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "Innovation Hub, Tech Campus",
      availability: "Mon-Sat, 10 AM - 5 PM",
      description: "Get in-person assistance at our center"
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-sm text-gray-500">Get assistance with Ann Rakshak</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Go to Dashboard
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, access resources, or contact our support team
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Contact Support</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <option.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs text-green-600 font-semibold">
                    {option.availability}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-blue-600 font-medium mb-2">{option.value}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Helpful Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                  <resource.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <button className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1">
                  {resource.action}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Emergency Crop Support</h2>
          <p className="text-lg mb-6 opacity-90">
            If you're facing a severe crop disease outbreak or pest infestation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Emergency Helpline
            </button>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chat with Expert Now
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

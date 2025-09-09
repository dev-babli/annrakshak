"use client"

import { useState, useEffect } from 'react'
import AnnRakshakHomepage from './homepage'
import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => setIsLoading(false)}
        loadingText="Welcome to Ann Rakshak"
        buttonText="Enter Application"
      />
    )
  }

  return <AnnRakshakHomepage />
}

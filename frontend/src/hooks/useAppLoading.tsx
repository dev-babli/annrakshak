'use client';

import { useState, useEffect } from 'react';

interface UseAppLoadingOptions {
  minLoadingTime?: number;
  checkAuthStatus?: () => Promise<boolean>;
  preloadData?: () => Promise<any>;
}

export const useAppLoading = (options: UseAppLoadingOptions = {}) => {
  const {
    minLoadingTime = 2000,
    checkAuthStatus,
    preloadData
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoadingMessage('Starting up...');
        setLoadingProgress(10);

        // Simulate minimum loading time
        const minTimePromise = new Promise(resolve => 
          setTimeout(resolve, minLoadingTime)
        );

        // Check authentication if provided
        if (checkAuthStatus) {
          setLoadingMessage('Checking authentication...');
          setLoadingProgress(30);
          await checkAuthStatus();
        }

        setLoadingProgress(50);

        // Preload data if provided
        if (preloadData) {
          setLoadingMessage('Loading your data...');
          setLoadingProgress(70);
          await preloadData();
        }

        setLoadingMessage('Almost ready...');
        setLoadingProgress(90);

        // Wait for minimum time to complete
        await minTimePromise;
        
        setLoadingProgress(100);
        setLoadingMessage('Welcome!');
        
        // Small delay before marking as initialized
        setTimeout(() => {
          setIsInitialized(true);
        }, 300);

      } catch (error) {
        console.error('App initialization error:', error);
        // Even on error, continue to load the app
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [minLoadingTime, checkAuthStatus, preloadData]);

  const completeLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    isInitialized,
    loadingProgress,
    loadingMessage,
    completeLoading,
    shouldShowLoading: isLoading || !isInitialized
  };
};

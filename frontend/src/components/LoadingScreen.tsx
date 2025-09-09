import { useState } from 'react';
import { motion } from 'motion/react';
import BlurText from './BlurText';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  loadingText?: string;
  buttonText?: string;
  className?: string;
}

const LoadingScreen = ({ 
  onLoadingComplete, 
  loadingText = "Welcome to Ann Rakshak",
  buttonText = "Enter System",
  className = ""
}: LoadingScreenProps) => {
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);

  const handleTextAnimationComplete = () => {
    setTextAnimationComplete(true);
    // Optional: Add a small delay before calling onLoadingComplete
    setTimeout(() => {
      onLoadingComplete?.();
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900 ${className}`}>
      {/* Logo with animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="mb-8"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          <img
            src="/ann-rakshak-logo.png"
            alt="Ann Rakshak Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>

      {/* Animated text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center"
      >
        <BlurText
          text={loadingText}
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleTextAnimationComplete}
          className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
        />
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8"
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Optional progress bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ delay: 1.5, duration: 2 }}
        className="mt-8 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading percentage or status text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: textAnimationComplete ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 text-sm text-gray-600 dark:text-gray-400"
      >
        Loading your dashboard...
      </motion.p>

      {/* Go to Homepage Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: textAnimationComplete ? 1 : 0, y: textAnimationComplete ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={onLoadingComplete}
          className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          <span className="relative z-10 flex items-center gap-2">
            {buttonText}
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </motion.svg>
          </span>
          
          {/* Button background animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.02 }}
          />
        </button>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Download, X } from 'lucide-react';
import Image from 'next/image';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.globalDeferredPrompt = e;
    };

    if (window.globalDeferredPrompt) {
      setDeferredPrompt(window.globalDeferredPrompt);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // Automatically show the prompt shortly after page load/refresh
    const initialTimer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(initialTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.globalDeferredPrompt;
    if (!promptEvent) {
      if (isIOS) {
        alert('To install the app on iOS, tap the Share button at the bottom of your screen and select "Add to Home Screen".');
      } else {
        alert('Please use Chrome or Safari and click "Install" from the browser menu.');
      }
      handleDismiss();
      return;
    }

    setShowPrompt(false);
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      window.globalDeferredPrompt = null;
      setIsInstalled(true);
    } else {
      // User cancelled the prompt dialog itself, handle as dismiss
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // As requested: wait exactly 2 minutes (120,000ms) and pop it back up!
    setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    }, 120000);
  };

  // Don't render popup on admin or login routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  if (!showPrompt || isInstalled) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:p-6 sm:pb-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={handleDismiss}
        />
        
        {/* Bottom Sheet Content */}
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="relative w-full max-w-[500px] bg-[#f8f9fa] dark:bg-[#120a1f] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden mx-auto pt-3 pb-8 px-6 sm:px-8 pointer-events-auto"
        >
          {/* Drag Handle */}
          <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>

          {/* Close Button */}
          <button 
            onClick={handleDismiss}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="text-center relative z-10 flex flex-col items-center">
            {/* App Icon */}
            <div className="w-[72px] h-[72px] bg-black rounded-[18px] flex items-center justify-center mb-5 shadow-md overflow-hidden p-0.5">
               <Image src="/logo-192.jpg" alt="Hariram Motors Logo" width={68} height={68} className="rounded-[14px] object-cover w-full h-full" unoptimized />
            </div>

            <h2 className="font-['Outfit'] font-bold text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 tracking-tight">
              Hariram Motors App
            </h2>
            
            <p className="text-gray-500 dark:text-purple-200/70 text-[14px] sm:text-[15px] mb-8 leading-relaxed max-w-[300px] mx-auto">
              Install our app for faster access, offline browsing, and a native experience.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 w-full">
              <button 
                onClick={handleDismiss}
                className="flex-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold py-3.5 px-4 rounded-2xl transition-colors text-[14px] sm:text-[15px]"
              >
                Maybe Later
              </button>
              
              <button 
                onClick={handleInstallClick}
                className="flex-1 bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] text-[14px] sm:text-[15px]"
              >
                Install Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

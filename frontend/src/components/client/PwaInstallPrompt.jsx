'use client';

import { useState, useEffect } from 'react';
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
    // Detect iOS for specific install instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed via localStorage or standalone mode
    const isAlreadyInstalled = localStorage.getItem('pwaInstalled') === 'true';
    if (isAlreadyInstalled || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)) {
      setIsInstalled(true);
      localStorage.setItem('pwaInstalled', 'true');
      return;
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem('pwaPromptDismissed') === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwaInstalled', 'true');
    });

    // Initial show after 3 seconds
    const timeoutId = setTimeout(() => {
      if (!isInstalled && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    }, 3000);

    // Show every 2 minutes
    const intervalId = setInterval(() => {
      if (!isInstalled && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    }, 120000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert('To install the app on iOS, tap the Share button at the bottom of your screen and select "Add to Home Screen".');
      } else {
        alert('Please use Chrome or Safari and click "Install" from the browser menu.');
      }
      setShowPrompt(false);
      return;
    }

    setShowPrompt(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    }
  };

  const handleLaterClick = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwaPromptDismissed', 'true');
  };

  // Don't render popup on admin or login routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  if (!showPrompt || isInstalled) return null;

  // Do not show the prompt if the browser didn't fire an install event (meaning it's already installed) and it's not iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleLaterClick}
        />
        
        {/* Popup Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#12121a] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        >
          {/* Header Area */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 overflow-hidden shadow-lg p-1">
              <Image src="/logo-192.jpg" alt="App Logo" width={56} height={56} className="object-cover rounded-xl" />
            </div>
            <h2 className="font-['Outfit'] font-bold text-2xl mb-1">Hariram Motors App</h2>
            
            {/* Close Button */}
            <button 
              onClick={handleLaterClick}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-center text-[15px] font-medium mb-6 leading-relaxed">
              Install our app for faster access, offline browsing, and a native experience.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
              >
                <Download size={20} />
                Install Now
              </button>
              
              <button 
                onClick={handleLaterClick}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-6 rounded-xl transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

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
  const promptRef = useRef(showPrompt);
  promptRef.current = showPrompt;

  useEffect(() => {
    // Detect iOS for specific install instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // If they are currently using the installed app, don't do anything
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      window.globalDeferredPrompt = e;
    };

    if (window.globalDeferredPrompt) {
      setDeferredPrompt(window.globalDeferredPrompt);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // If the user previously dismissed it, and they just refreshed the page,
    // we want to restart the 2-minute countdown from NOW.
    if (localStorage.getItem('pwaDismissedAt')) {
      localStorage.setItem('pwaDismissedAt', Date.now().toString());
    }

    const checkAndShowPrompt = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        return;
      }

      const lastDismissedAt = localStorage.getItem('pwaDismissedAt');
      const now = Date.now();
      
      // Only show prompt if we have a deferred prompt (for Android/Desktop) or if it's iOS
      if (!window.globalDeferredPrompt && !isIosDevice) {
        return;
      }

      if (lastDismissedAt) {
        const timeSince = now - parseInt(lastDismissedAt);
        if (timeSince >= 120000) { // 2 minutes (120,000 ms)
          setShowPrompt(true);
          localStorage.removeItem('pwaDismissedAt'); // Reset so it can be dismissed again
        }
      } else {
        setShowPrompt(true);
      }
    };

    // Initial show after 3 seconds
    const timeoutId = setTimeout(() => {
      checkAndShowPrompt();
    }, 3000);

    // Constantly check every 10 seconds if it's time to show the prompt again
    const intervalId = setInterval(() => {
      if (!promptRef.current) { // Only check if not currently showing
        checkAndShowPrompt();
      }
    }, 10000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
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
      setShowPrompt(false);
      localStorage.setItem('pwaDismissedAt', Date.now().toString());
      return;
    }

    setShowPrompt(false);
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
      window.globalDeferredPrompt = null;
      setIsInstalled(true);
    } else {
      // User cancelled the prompt, wait 2 mins before asking again
      localStorage.setItem('pwaDismissedAt', Date.now().toString());
    }
  };

  const handleLaterClick = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaDismissedAt', Date.now().toString());
  };

  // Don't render popup on admin or login routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  if (!showPrompt || isInstalled) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6 pb-6 sm:pb-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleLaterClick}
        />
        
        {/* Popup Content */}
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="relative w-full max-w-[400px] bg-white dark:bg-[#0c0c11] rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 mx-auto"
        >
          {/* Subtle top glow in dark mode */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent hidden dark:block"></div>
          
          <div className="p-8 pt-10 text-center relative z-10">
            {/* Close Button */}
            <button 
              onClick={handleLaterClick}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-2 transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* App Icon */}
            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-gray-100/50 dark:border-white/5 overflow-hidden p-1 relative">
               <Image src="/logo-192.jpg" alt="Hariram Motors Logo" width={72} height={72} className="object-cover rounded-[18px]" unoptimized />
            </div>

            <h2 className="font-['Outfit'] font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white mb-2.5 tracking-tight">
              Hariram Motors
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 text-[15px] font-medium mb-8 leading-relaxed max-w-[280px] mx-auto">
              Get the ultimate experience. Faster access, offline browsing, and exclusive car deals.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              <button 
                onClick={handleInstallClick}
                className="w-full bg-[#1a1a24] hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#1a1a24] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 dark:shadow-white/10 transition-all active:scale-[0.98]"
              >
                <Download size={20} strokeWidth={2.5} />
                <span className="text-[16px]">Install App</span>
              </button>
              
              <button 
                onClick={handleLaterClick}
                className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-[15px]"
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

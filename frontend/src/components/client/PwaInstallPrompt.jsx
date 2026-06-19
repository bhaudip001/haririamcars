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
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="pointer-events-auto w-full max-w-md bg-gradient-to-r from-[#4c1d95] to-[#2e1065] border border-purple-500/40 rounded-[20px] shadow-[0_-10px_40px_-10px_rgba(109,40,217,0.4)] overflow-hidden flex items-center p-3 sm:p-4 gap-3 sm:gap-4 relative"
        >
          {/* Top Edge Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50"></div>

          {/* App Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-[14px] flex-shrink-0 flex items-center justify-center p-1 shadow-inner">
             <Image src="/logo-192.jpg" alt="Logo" width={48} height={48} className="rounded-[10px] object-cover w-full h-full" unoptimized />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-[15px] sm:text-[16px] truncate tracking-tight">Hariram Motors App</h3>
            <p className="text-purple-200 text-[12px] sm:text-[13px] truncate font-medium">Faster, offline, exclusive deals</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button 
              onClick={handleInstallClick}
              className="bg-white hover:bg-gray-100 text-purple-900 font-bold py-2 px-4 rounded-xl text-[13px] sm:text-[14px] shadow-sm transition-transform active:scale-95 flex items-center gap-1"
            >
              <Download size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Install</span>
            </button>
            <button 
              onClick={handleDismiss}
              className="text-purple-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

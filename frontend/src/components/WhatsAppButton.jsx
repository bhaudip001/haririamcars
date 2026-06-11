'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { IconBrandWhatsapp, IconChevronUp } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-purple-600 text-white flex items-center justify-center pointer-events-auto"
            aria-label="Scroll to top"
          >
            <IconChevronUp size={22} className="md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.4, type: 'spring', stiffness: 200 }}
        className="fixed bottom-5 md:bottom-6 right-4 md:right-6 z-50"
      >
        <div className="relative">
          {/* Pulse rings */}
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full bg-[#25d366]"
              animate={{
                scale: [1, 1.6, 1.6],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
          
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/919373482016"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-[52px] h-[52px] md:w-14 md:h-14 bg-[#25d366] text-white rounded-full z-10"
            aria-label="Chat on WhatsApp"
          >
            <IconBrandWhatsapp size={28} className="md:w-8 md:h-8" />
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}

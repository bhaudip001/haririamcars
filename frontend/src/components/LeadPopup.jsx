'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconCar, IconArrowRight, IconChecks } from '@tabler/icons-react';
import api from '@/lib/api';

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const pathname = usePathname();

  // Don't render popup on admin or login routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s+/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  useEffect(() => {
    // Check if they've already filled the form permanently
    const hasFilled = localStorage.getItem('hariram_lead_popup_filled');
    // Check if they closed it during this specific browsing session
    const hasClosed = sessionStorage.getItem('hariram_lead_popup_closed');
    
    if (!hasFilled && !hasClosed) {
      // Show popup after 2 seconds of page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (!isSuccess) {
      setIsOpen(false);
      sessionStorage.setItem('hariram_lead_popup_closed', 'true'); // Only hide for this session
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.name || !formData.phone) return;

    if (!validatePhone(formData.phone)) {
      alert('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/messages', {
        name: formData.name,
        phone: formData.phone.replace(/\s+/g, ''),
        message: 'Lead generated from Welcome Popup Form.',
      });
      setIsSuccess(true);
      localStorage.setItem('hariram_lead_popup_filled', 'true'); // Never show again once filled
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (error) {
      console.error('Failed to submit lead.');
      console.error('Error details:', error.response?.data || error.message);
      if (error.code === 'ERR_NETWORK') {
         alert('Network Error: The backend API is unreachable or blocking the request (CORS).');
      } else {
         alert(error.response?.data?.error || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => handleClose()}
          />
          
          {/* Popup Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#12121a] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
          >
            {/* Header Area */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <IconCar size={32} className="text-white" />
              </div>
              <h2 className="font-['Outfit'] font-bold text-2xl mb-1">Find Your Dream Car</h2>
              <p className="text-white/80 text-sm font-['Inter']">Get exclusive offers directly from our experts.</p>
              
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Form Area */}
            <div className="p-6 md:p-8">
              {isSuccess ? (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-200 dark:border-green-500/30">
                    <IconChecks size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-2">Thank You!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/30 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/30 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Instant Callback'}
                    {!isSubmitting && <IconArrowRight size={20} />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconStarFilled, IconQuote } from '@tabler/icons-react';
import { staggerContainer, scaleIn } from '@/lib/animations';

const REVIEWS = [
  {
    "author_name": "JASH KANTARIYA",
    "rating": 5,
    "text": "I recently purchased a used Honda City from this dealership, and I’m extremely satisfied. The car was fully inspected, well-maintained, and delivered on time. The team explained all details clearly and handled documentation professionally. Definitely the best pre-owned car experience I’ve had.",
    "relative_time_description": "7 months ago"
  },
  {
    "author_name": "RWn. Laxman Prajapati",
    "rating": 5,
    "text": "Best Car Deal Service. Thank You for Support and Suggesting proper car into my perfect Budget. Greatly Thanks to whole team. I hope every customer will take car from your hariram motors. I will recommend to all. Thank You",
    "relative_time_description": "7 months ago"
  },
  {
    "author_name": "NIMESH JAYANI",
    "rating": 5,
    "text": "Bought a pre-owned creta from hariram motors amazing experience",
    "relative_time_description": "7 months ago"
  },
  {
    "author_name": "Afeel Sojitra",
    "rating": 5,
    "text": "Great experience buying my pre-owned car here! The condition was exactly as promised and the staff was very helpful throughout the process",
    "relative_time_description": "7 months ago"
  },
  {
    "author_name": "#BB#BHARAT BHANUSHALI",
    "rating": 5,
    "text": "Staff is very co operating, also booked a car very well maintained and perfect condition",
    "relative_time_description": "8 months ago"
  },
  {
    "author_name": "Uttam Patel (UB & Company)",
    "rating": 4,
    "text": "Nice Place For Buy Second Hand Cars",
    "relative_time_description": "5 years ago"
  },
  {
    "author_name": "Chiren Bhorniya",
    "rating": 5,
    "text": "Awesome car.. Good service i am satisfied",
    "relative_time_description": "5 years ago"
  },
  {
    "author_name": "Abhay Kothiya",
    "rating": 4,
    "text": "Good collection and offer",
    "relative_time_description": "3 years ago"
  },
  {
    "author_name": "Aakib Dharar",
    "rating": 5,
    "text": "Getting a best deal on hariram moters owner was very friendly😊",
    "relative_time_description": "1 year ago"
  },
  {
    "author_name": "YOGESHSANGHANI GALAXYINSURANCE",
    "rating": 5,
    "text": "It's good old car delar and genuine car sell with commitment for a best car deal",
    "relative_time_description": "3 years ago"
  },
  {
    "author_name": "Srushti Italiya",
    "rating": 5,
    "text": "Good response 😇",
    "relative_time_description": "8 months ago"
  },
  {
    "author_name": "Niraj Btc",
    "rating": 5,
    "text": "Nice negotiation price",
    "relative_time_description": "3 years ago"
  },
  {
    "author_name": "SHREE GRAPHICS",
    "rating": 5,
    "text": "Very good",
    "relative_time_description": "4 years ago"
  },
  {
    "author_name": "Kevin Desai",
    "rating": 5,
    "text": "Great",
    "relative_time_description": "2 years ago"
  },
  {
    "author_name": "AppleWood Short Movie",
    "rating": 5,
    "text": "Absolutely fine",
    "relative_time_description": "5 years ago"
  },
  {
    "author_name": "Samjibhai Kapadi",
    "rating": 5,
    "text": "Ok",
    "relative_time_description": "2 years ago"
  }
];

export default function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 6000); // 6 seconds per review
    return () => clearInterval(timer);
  }, []);

  const currentReview = REVIEWS[currentIndex];

  return (
    <section className="py-8 md:py-12 px-4 relative overflow-hidden bg-transparent transition-colors duration-500">
      {/* Premium Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Side: Stats and Info */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-10 h-10 drop-shadow-[0_0_15px_rgba(66,133,244,0.4)]" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h2 className="font-['Outfit'] font-bold text-3xl md:text-4xl text-black dark:text-white tracking-wide transition-colors">
                Google
              </h2>
            </div>

            <div className="mb-2">
              <span className="font-['Outfit'] text-[64px] font-bold text-black dark:text-white leading-none transition-colors">4.3</span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-1 text-yellow-400 mb-4"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} variants={scaleIn}>
                  <IconStarFilled size={24} className="drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]" />
                </motion.div>
              ))}
            </motion.div>

            <p className="font-medium text-gray-600 dark:text-gray-400 text-lg mb-8 transition-colors">
              Based on <strong className="text-black dark:text-white">60 reviews</strong> from our satisfied customers.
            </p>

            <a
              href="https://maps.app.goo.gl/MQEDgMYX1C7fbQdY6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full lg:w-auto rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white font-['Outfit'] font-bold hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-lg backdrop-blur-md group"
            >
              View All Reviews on Google
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right Side: Animated Spotlight Review */}
          <div className="lg:col-span-8 relative">
            <div className="relative min-h-[420px] md:min-h-[380px] w-full flex items-stretch justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full bg-white dark:bg-[#12121c] border border-gray-200 dark:border-white/10 rounded-[40px] p-8 md:p-10 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-colors"
                >
                  <IconQuote size={60} className="text-purple-600/10 dark:text-purple-500/20 absolute top-8 left-8 pointer-events-none" />

                  <div className="relative z-10 flex-grow flex items-center justify-center my-4">
                    <p className="font-medium text-[18px] md:text-[22px] text-black dark:text-white leading-relaxed text-center lg:text-left w-full transition-colors">
                      "{currentReview.text}"
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-['Outfit'] font-bold text-white text-xl shadow-lg shrink-0"
                      >
                        {currentReview.author_name.charAt(0)}
                      </motion.div>
                      <div className="text-center sm:text-left">
                        <h4 className="font-['Outfit'] font-bold text-base md:text-lg text-black dark:text-white transition-colors">{currentReview.author_name}</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{currentReview.relative_time_description}</span>
                      </div>
                    </div>

                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="flex gap-1 text-yellow-500 shrink-0 mt-2 sm:mt-0"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i} variants={scaleIn}>
                          <IconStarFilled
                            size={18}
                            className={i < currentReview.rating ? 'opacity-100' : 'opacity-20'}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {REVIEWS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-10 bg-purple-600 dark:bg-purple-500' : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/20 dark:hover:bg-white/40'
                    }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

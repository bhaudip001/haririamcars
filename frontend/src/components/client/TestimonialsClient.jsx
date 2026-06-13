'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeInDown } from '@/lib/animations';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function TestimonialsClient({ testimonials }) {
  const [testiRef, testiApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 3500, stopOnInteraction: false })]);

  const scrollTestiPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollTestiNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <motion.p variants={fadeInDown} className="text-purple-600 dark:text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 transition-colors">OUR FAMILY</motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-[40px] text-black dark:text-white font-bold leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
            Happy Customers
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-400 mt-2 text-sm transition-colors">
            Seeing our customers drive away with a smile is our greatest reward.
          </motion.p>
        </div>
        <motion.div variants={fadeInUp} className="hidden md:flex gap-3">
          <button aria-label="Previous Testimonial" onClick={scrollTestiPrev} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <IconChevronLeft size={20} />
          </button>
          <button aria-label="Next Testimonial" onClick={scrollTestiNext} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <IconChevronRight size={20} />
          </button>
        </motion.div>
      </motion.div>

      <div className="overflow-visible w-full pt-4" ref={testiRef}>
        <div className="flex gap-4 sm:gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, index) => (
            <div key={`${t._id}-${index}`} className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] shrink-0 rounded-2xl overflow-hidden group shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 cursor-grab active:cursor-grabbing border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-[#12121f]">

              {/* Full Card Photo */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {t.photo?.url ? (
                  <Image src={t.photo.url} alt={t.customerName} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-500/30">No Photo</div>
                )}
              </div>

              {/* Protective Dark Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none z-10 transition-all duration-500 group-hover:h-[60%]"></div>

              {/* Hover Content Section (Review Text) */}
              <div className="absolute inset-x-0 bottom-[60px] px-6 pb-2 pt-10 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 pointer-events-none">
                <p className="text-white text-[14px] leading-relaxed font-medium line-clamp-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  "{t.review || t.description || "Had a fantastic experience purchasing my dream car. Highly recommended!"}"
                </p>
              </div>

              {/* Customer Name Area (Matches Reference Image) */}
              <div className="absolute bottom-5 left-6 right-6 z-30 pointer-events-auto flex flex-col items-start">
                <span className="text-white font-black text-[14px] sm:text-[16px] tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {t.customerName}
                </span>
                <div className="w-8 h-[3px] bg-gradient-to-r from-purple-600 to-red-600 rounded-full mt-1"></div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

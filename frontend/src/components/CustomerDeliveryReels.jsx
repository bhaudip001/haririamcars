'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ReelVideo from '@/components/ReelVideo';

const videos = [
  { src: '/car delivery/IMG_5502.MP4', name: 'Bhimabhai shamla', car: 'Creta 2020' },
  { src: '/car delivery/IMG_5506.MOV', name: 'Ajudiya Rameshbhai', car: 'Endeavour 2018' },
  { src: '/car delivery/IMG_5509.MOV', name: 'Arjunbhai Kavithiya', car: 'Slavia 2022' },
  { src: '/car delivery/IMG_5510.MOV', name: 'Natha Ram', car: 'Brezza 2020' },
  { src: '/car delivery/IMG_5514.MOV', name: 'Der Rajubhai', car: 'Verna 2021' }
];

export default function CustomerDeliveryReels() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="py-24 relative overflow-hidden bg-transparent transition-colors duration-500">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-pink-500/[0.04] rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Happy Moments</span>
            </div>
            <h2 className="font-['Outfit'] font-bold text-[36px] md:text-[42px] text-black dark:text-white leading-tight transition-colors">
              Customer <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Delivery Reels</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-[15px] font-['Inter'] leading-relaxed transition-colors">
              Watch the exciting moments when our customers drive home their dream cars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all shadow-sm"
            >
              <IconChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all shadow-sm"
            >
              <IconChevronRight size={24} />
            </button>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {videos.map((video, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] pl-6"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 group bg-black">
                    <div className="aspect-[9/16] relative">
                      <ReelVideo 
                        src={video.src} 
                        customerName={video.name}
                        carModel={video.car}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

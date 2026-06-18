'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ReelVideo from '@/components/ReelVideo';

const videos = [
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5503.mp4', name: 'Raithatha Sagarbhai', car: 'Polo 2016' },
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5504.mp4', name: 'Jogani Sandipbhai', car: '2021 Venue' },
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5505.mp4', name: 'Rathod Siddhrajsinh', car: 'Hexa 2018' },
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5507.mp4', name: 'Mehrotra Rajatbhai', car: '2017 Honda city' },
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5511.mp4', name: 'Durgeshbhai Santram Marathe', car: 'Ecosport 2017' },
  { src: 'https://res.cloudinary.com/dvo48lu7g/video/upload/hariram-motors-reviews/IMG_5513.mp4', name: 'Joy Anjirwala', car: '2012 Innova' }
];

export default function CustomerReviewReels() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="py-24 relative overflow-hidden bg-transparent transition-colors duration-500">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Testimonials</span>
            </div>
            <h2 className="font-['Outfit'] font-bold text-[36px] md:text-[42px] text-black dark:text-white leading-tight transition-colors">
              Customer <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Review Reels</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-[15px] font-['Inter'] leading-relaxed transition-colors">
              Hear straight from our happy customers about their smooth and transparent car buying journey with Hariram Motors.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all shadow-sm"
              aria-label="Previous reviews"
            >
              <IconChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all shadow-sm"
              aria-label="Next reviews"
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

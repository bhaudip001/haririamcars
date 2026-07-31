'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ShowroomVideo() {
  return (
    <section className="py-10 md:pt-28 md:pb-16 relative overflow-hidden bg-white dark:bg-[#0a0a12] transition-colors duration-500">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Inside Our Showroom</span>
          </div>

          <h2 className="font-['Outfit'] font-bold text-[36px] md:text-[46px] text-black dark:text-white leading-tight mb-4 transition-colors">
            Experience <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Hariram Motors</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-[16px] md:text-[18px] font-['Inter'] leading-relaxed transition-colors">
            Step inside our verified showroom in Surat. Discover our exceptional collection of certified pre-owned cars, meticulously prepared for you.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-black/50 border border-gray-200 dark:border-white/10 group bg-black aspect-video pointer-events-none"
        >
          <iframe
            className="w-full h-full absolute top-0 left-0 scale-[1.1]"
            src="https://www.youtube.com/embed/Y2ZcHOgOJN0?autoplay=1&mute=1&loop=1&playlist=Y2ZcHOgOJN0&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3"
            title="Hariram Motors Showroom"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInLeft, scaleIn } from '@/lib/animations';
import { IconArrowRight } from '@tabler/icons-react';

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-14 lg:py-20 bg-[#0f0f1e]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="lg:col-span-5">
            <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 transition-colors">WHY HARIRAM MOTORS</p>
            <h2 className="text-3xl md:text-[40px] text-white font-bold leading-tight mb-6 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
              Why Thousands <br /> Trust Us
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed transition-colors">
              We've been serving Surat for over 10 years with honest pricing, genuine cars, and a no-pressure buying experience. Our commitment is to quality and customer satisfaction.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white rounded-full px-6 py-3 transition-colors font-medium">
              Meet Our Team <IconArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 relative">

            {/* CARD 1 (01) - Top Left */}
            <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-[#1a0e2e] border border-gray-200 dark:border-white/10 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 rounded-[2rem] p-8 relative shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 group">
              {/* Outward Right Arrow */}
              <div className="hidden sm:block absolute top-1/2 -right-[16px] w-8 h-8 bg-white dark:bg-[#1a0e2e] rotate-45 transform -translate-y-1/2 z-30 border-t border-r border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>

              <h3 className="font-['Outfit'] font-bold text-4xl text-purple-600 dark:text-white mb-3 transition-colors">01</h3>
              <h4 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-4 transition-colors">Verified Cars</h4>
              <div className="w-12 border-b-2 border-dashed border-gray-300 dark:border-white/20 mb-5 transition-colors"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-['Inter'] transition-colors">Every car undergoes a 100-point inspection before listing.</p>
            </motion.div>

            {/* CARD 2 (02) - Top Right */}
            <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-[#1a0e2e] border border-gray-200 dark:border-white/10 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 rounded-[2rem] p-8 relative shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 group">
              {/* Inward Left Cutout */}
              <div className="hidden sm:block absolute top-1/2 -left-[17px] w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-y-1/2 z-20 border-t border-r border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>
              {/* Outward Bottom Arrow */}
              <div className="hidden sm:block absolute -bottom-[16px] left-1/2 w-8 h-8 bg-white dark:bg-[#1a0e2e] rotate-45 transform -translate-x-1/2 z-30 border-r border-b border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>

              <h3 className="font-['Outfit'] font-bold text-4xl text-purple-600 dark:text-white mb-3 transition-colors">02</h3>
              <h4 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-4 transition-colors">Transparent Pricing</h4>
              <div className="w-12 border-b-2 border-dashed border-gray-300 dark:border-white/20 mb-5 transition-colors"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-['Inter'] transition-colors">No hidden charges. Price you see is price you pay.</p>
            </motion.div>

            {/* CARD 4 (04) - Bottom Left */}
            <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-[#1a0e2e] border border-gray-200 dark:border-white/10 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 rounded-[2rem] p-8 relative shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 group order-4 sm:order-3">
              {/* Inward Right Cutout */}
              <div className="hidden sm:block absolute top-1/2 -right-[17px] w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-y-1/2 z-20 border-b border-l border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>

              <h3 className="font-['Outfit'] font-bold text-4xl text-purple-600 dark:text-white mb-3 transition-colors">04</h3>
              <h4 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-4 transition-colors">Extended Warranty</h4>
              <div className="w-12 border-b-2 border-dashed border-gray-300 dark:border-white/20 mb-5 transition-colors"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-['Inter'] transition-colors">Exclusive 1-2 years extended warranty available on our certified pre-owned cars.</p>
            </motion.div>

            {/* CARD 3 (03) - Bottom Right */}
            <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-[#1a0e2e] border border-gray-200 dark:border-white/10 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 rounded-[2rem] p-8 relative shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 group order-3 sm:order-4">
              {/* Inward Top Cutout */}
              <div className="hidden sm:block absolute -top-[17px] left-1/2 w-[34px] h-[34px] bg-[#0f0f1e] rotate-45 transform -translate-x-1/2 z-20 border-r border-b border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>
              {/* Outward Left Arrow */}
              <div className="hidden sm:block absolute top-1/2 -left-[16px] w-8 h-8 bg-white dark:bg-[#1a0e2e] rotate-45 transform -translate-y-1/2 z-30 border-b border-l border-gray-200 dark:border-white/10 rounded-[4px] transition-colors"></div>

              <h3 className="font-['Outfit'] font-bold text-4xl text-purple-600 dark:text-white mb-3 transition-colors">03</h3>
              <h4 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-4 transition-colors">Full Documentation</h4>
              <div className="w-12 border-b-2 border-dashed border-gray-300 dark:border-white/20 mb-5 transition-colors"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-['Inter'] transition-colors">RC transfer, insurance, NOC — we handle everything.</p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeInDown } from '@/lib/animations';
import { IconCar, IconCurrencyRupee, IconArrowsExchange, IconArrowRight } from '@tabler/icons-react';

export default function DealershipServices() {
  return (
    <section className="pt-24 md:pt-44 pb-20 relative z-10 overflow-hidden transition-colors duration-500 dark:bg-transparent">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 dark:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.8)] z-10"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-purple-600/10 dark:bg-purple-600/20 blur-[80px] z-10"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center max-w-3xl mx-auto mb-16">
          <motion.p variants={fadeInDown} className="text-purple-600 dark:text-purple-400 text-sm font-bold tracking-widest uppercase mb-3 transition-colors">Verified Dealership Services</motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-[40px] text-black dark:text-white font-bold mb-6 leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
            Surat's Complete Automotive Solution for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500">Buy, Sell & Exchange</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 dark:text-gray-400 text-[16px] leading-relaxed transition-colors">
            We are dedicated to elevating your car experience through transparent and reliable services. As Surat's premier automotive destination, our goal is to provide you with the finest facilities built on unwavering trust and customer satisfaction.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buy Card */}
          <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-xl dark:shadow-none hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <IconCar size={32} />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Buy Certified Cars</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow transition-colors">
              150+ verified certified cars you can trust. Every car undergoes rigorous inspection for your complete security and peace of mind.
            </p>
            <Link href="/catalog" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Let's do It <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Sell Card */}
          <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-xl dark:shadow-none hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <IconCurrencyRupee size={32} />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Sell Your Car Instantly</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow transition-colors">
              Get the best market value for your car through our transparent evaluation process and receive secure, instant payment.
            </p>
            <Link href="/sell-your-car" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Let's do It <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Exchange Card */}
          <div className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-xl dark:shadow-none hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col group">
            <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-600/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <IconArrowsExchange size={32} />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4 transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Best Exchange Value</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 flex-grow transition-colors">
              Upgrade effortlessly! Get your favorite car with the absolute best exchange value for your old vehicle along with attractive benefits.
            </p>
            <Link href="/sell-your-car?mode=exchange" className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              Let's do It <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

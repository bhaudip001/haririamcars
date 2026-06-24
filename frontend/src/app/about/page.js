'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import Image from 'next/image';
import { IconShieldCheck, IconReceipt, IconFileText, IconCar, IconCurrencyRupee, IconArrowsExchange, IconCheck, IconChevronLeft, IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import dynamic from 'next/dynamic';
import AboutHero from '@/components/AboutHero';
import CustomerDeliveryReels from '@/components/CustomerDeliveryReels';

const GoogleReviews = dynamic(() => import('@/components/GoogleReviews'), { ssr: false });
import api from '@/lib/api';

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(value) || 0;
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span>{count}<span className="text-purple-400">{suffix}</span></span>;
}

export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testiRef, testiApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 3500, stopOnInteraction: false })]);
  const scrollTestiPrev = useCallback(() => testiApi && testiApi.scrollPrev(), [testiApi]);
  const scrollTestiNext = useCallback(() => testiApi && testiApi.scrollNext(), [testiApi]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/happy-customers?limit=6');
        setTestimonials(res.data || []);
      } catch (err) {
        console.error('Error fetching testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="bg-[#f4f4f8] dark:bg-transparent min-h-screen pb-0 relative transition-colors duration-500 w-full flex flex-col" style={{ paddingTop: 0 }}>
      {/* Light Mode: Massive Unified Verified Background */}
      <div className="fixed inset-0 dark:hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f8] via-white to-[#f4f4f8] opacity-80"></div>
        <div className="absolute inset-0 opacity-[0.03] blueprint-grid"></div>
        
        {/* Sweeping Showroom Lights */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-white/80 to-transparent rotate-[35deg] transform-gpu blur-[20px] shadow-[0_0_120px_rgba(255,255,255,0.8)] opacity-90"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-white/60 to-transparent -rotate-[15deg] transform-gpu blur-[30px] opacity-70"></div>

        {/* Majestic Glow Orbs */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px] mix-blend-multiply animate-pulse-ring"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] bg-pink-100/40 rounded-full blur-[150px] mix-blend-multiply animate-float-card"></div>
      </div>

      {/* Dark Mode: Massive Unified Verified Background */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-[#0a0a12]"></div>
        
        {/* Neon Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.05] blueprint-grid"></div>
        
        {/* Sweeping Showroom Lights (Dark) */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-purple-600/10 to-transparent rotate-[35deg] transform-gpu blur-[30px] shadow-[0_0_120px_rgba(168,85,247,0.15)] z-0"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-blue-600/10 to-transparent -rotate-[15deg] transform-gpu blur-[40px] z-0"></div>

        {/* Majestic Glow Orbs */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse-ring"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen animate-float-card"></div>
      </div>

      {/* ═══ THE WALL OF TRUST — HERO ═══ */}
      <div className="relative z-10">
        <AboutHero />
      </div>

      {/* Anchor for "Explore Our Story" CTA */}
      <div id="our-story" />

      {/* OUR STORY — VERIFIED EDITORIAL REDESIGN */}
      <section className="relative pt-28 pb-12 overflow-hidden transition-colors duration-500 z-10 dark:bg-[#0a0a12]">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-600/[0.03] dark:bg-purple-600/[0.05] rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-600/[0.02] dark:bg-purple-600/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">

            {/* ── LEFT: Text Content (50%) ── */}
            <div className="lg:w-[50%] flex flex-col justify-center">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 w-max bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Our Story</span>
              </div>

              <h2 className="font-['Outfit'] font-bold text-[42px] text-black dark:text-white leading-tight mb-4 transition-colors">
                A Legacy of <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Honest Deals</span>
              </h2>

              <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-8" />

              <div className="space-y-5 mb-10">
                <p className="font-['Inter'] text-[16px] text-gray-600 dark:text-[#a0a0b8] leading-8 transition-colors">
                  What started in 2020 as a small lot with big dreams has evolved into Surat&apos;s most trusted pre-owned car dealership. Our foundation was simple: <strong className="text-black dark:text-white transition-colors">treat every customer like family.</strong>
                </p>
                <p className="font-['Inter'] text-[16px] text-gray-600 dark:text-[#a0a0b8] leading-8 transition-colors">
                  Through sheer trust and word of mouth, we&apos;ve grown exponentially. We&apos;ve proudly served over <strong className="text-black dark:text-white transition-colors">3,600+ families</strong>, ensuring each one drives away with a smile and total peace of mind.
                </p>
                <p className="font-['Inter'] text-[16px] text-gray-600 dark:text-[#a0a0b8] leading-8 transition-colors">
                  Today, with a constantly refreshed inventory of over 150 meticulously inspected cars, full documentation support, and a commitment to transparency, we are Surat&apos;s go-to automotive destination.
                </p>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full px-4 py-2 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-700 dark:text-green-400 text-[13px] font-medium font-['Inter'] transition-colors">100-Point Inspection</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full px-4 py-2 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-700 dark:text-green-400 text-[13px] font-medium font-['Inter'] transition-colors">RC Transfer Support</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-full px-4 py-2 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-700 dark:text-green-400 text-[13px] font-medium font-['Inter'] transition-colors">Non-Accidental Guarantee</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Timeline (50%) ── */}
            <div className="lg:w-[50%] flex flex-col justify-center">

              {/* Vertical Timeline */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative pl-8"
              >
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-500 via-purple-400 to-transparent" />

                {/* Milestone 1 */}
                <motion.div variants={fadeInUp} className="relative mb-8 group">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-[#0a0a12] border-2 border-purple-500 flex items-center justify-center transition-colors group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(124,58,237,0.06)] dark:hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-['Outfit'] font-black text-[28px] text-purple-600 dark:text-purple-400 transition-colors">2020</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 to-transparent" />
                    </div>
                    <h4 className="font-['Outfit'] font-bold text-[17px] text-black dark:text-white transition-colors">The Beginning</h4>
                    <p className="font-['Inter'] text-[13px] text-gray-500 dark:text-[#6b6b80] leading-6 mt-1 transition-colors">Started with a small lot, a big dream, and one promise — honesty above all.</p>
                  </div>
                </motion.div>

                {/* Milestone 2 */}
                <motion.div variants={fadeInUp} className="relative mb-8 group">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-[#0a0a12] border-2 border-purple-500 flex items-center justify-center transition-colors group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(124,58,237,0.06)] dark:hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-['Outfit'] font-black text-[28px] text-purple-600 dark:text-purple-400 transition-colors">2023</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 to-transparent" />
                    </div>
                    <h4 className="font-['Outfit'] font-bold text-[17px] text-black dark:text-white transition-colors">400+ Annual Sales</h4>
                    <p className="font-['Inter'] text-[13px] text-gray-500 dark:text-[#6b6b80] leading-6 mt-1 transition-colors">Achieved a milestone of 400+ cars sold in a single year, entirely through word-of-mouth referrals.</p>
                  </div>
                </motion.div>

                {/* Milestone 3 */}
                <motion.div variants={fadeInUp} className="relative group">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-[#0a0a12] border-2 border-purple-500 flex items-center justify-center transition-colors group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_10px_30px_rgba(124,58,237,0.06)] dark:hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-['Outfit'] font-black text-[28px] text-purple-600 dark:text-purple-400 transition-colors">2026</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-purple-500/30 to-transparent" />
                    </div>
                    <h4 className="font-['Outfit'] font-bold text-[17px] text-black dark:text-white transition-colors">3,600+ Cars Delivered</h4>
                    <p className="font-['Inter'] text-[13px] text-gray-500 dark:text-[#6b6b80] leading-6 mt-1 transition-colors">Recognized as Surat's most trusted destination, proudly delivering over 3,600+ cars to happy families.</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* MISSION & VISION — VERIFIED REDESIGN */}
      <section className="relative pt-12 pb-28 overflow-hidden transition-colors duration-500 z-10 dark:bg-[#0a0a12]">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Large faint "01 02" watermark numbers */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 font-['Outfit'] font-black text-[280px] leading-none text-gray-100 dark:text-white/[0.02] select-none tracking-tighter" style={{ transform: 'translateY(-50%) translateX(-15%)' }}>01</div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 font-['Outfit'] font-black text-[280px] leading-none text-gray-100 dark:text-white/[0.02] select-none tracking-tighter" style={{ transform: 'translateY(-50%) translateX(15%)' }}>02</div>
          {/* Purple glow center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.04] dark:bg-purple-600/[0.06] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">What Drives Us</span>
            </div>
            <h2 className="font-['Outfit'] font-bold text-[42px] text-black dark:text-white leading-tight transition-colors">
              Built on Two <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Promises</span>
            </h2>
            <p className="font-['Inter'] text-gray-500 dark:text-[#6b6b80] text-[15px] mt-4 max-w-lg mx-auto transition-colors">
              Every decision we make comes back to these two commitments — they&apos;re not just words on a wall, they&apos;re how we operate.
            </p>
          </div>

          {/* Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >

            {/* MISSION Card */}
            <motion.div variants={fadeInUp} className="group relative">
              {/* Dashed decorative border behind */}
              <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-purple-300/30 dark:border-purple-500/15 translate-x-3 translate-y-3 transition-colors" aria-hidden="true" />
              <div className="relative rounded-3xl p-10 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] backdrop-blur-sm transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]">
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-['Outfit'] font-black text-[64px] leading-none bg-gradient-to-b from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">01</span>
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-600/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400 transition-colors">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                </div>

                {/* Label */}
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-purple-100 dark:bg-purple-600/10 transition-colors">
                  <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-widest font-bold transition-colors">Our Mission</span>
                </div>

                {/* Title */}
                <h3 className="font-['Outfit'] font-bold text-[26px] text-black dark:text-white mb-4 leading-snug transition-colors">
                  Give every customer<br />the best deal possible
                </h3>

                {/* Divider */}
                <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-5" />

                {/* Description */}
                <p className="font-['Inter'] text-[15px] text-gray-600 dark:text-[#a0a0b8] leading-7 transition-colors">
                  We are dedicated to providing the finest quality pre-owned vehicles at the most competitive prices. Complete transparency, zero hidden costs — our customers always win. Unbeatable deals on certified cars.
                </p>
              </div>
            </motion.div>

            {/* VISION Card */}
            <motion.div variants={fadeInUp} className="group relative">
              {/* Dashed decorative border behind */}
              <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-purple-300/30 dark:border-purple-500/15 translate-x-3 translate-y-3 transition-colors" aria-hidden="true" />
              <div className="relative rounded-3xl p-10 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] backdrop-blur-sm transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]">
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-['Outfit'] font-black text-[64px] leading-none bg-gradient-to-b from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">02</span>
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-600/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400 transition-colors">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>

                {/* Label */}
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 bg-purple-100 dark:bg-purple-600/10 transition-colors">
                  <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-widest font-bold transition-colors">Our Vision</span>
                </div>

                {/* Title */}
                <h3 className="font-['Outfit'] font-bold text-[26px] text-black dark:text-white mb-4 leading-snug transition-colors">
                  Be Gujarat&apos;s most<br />trusted car brand
                </h3>

                {/* Divider */}
                <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-5" />

                {/* Description */}
                <p className="font-['Inter'] text-[15px] text-gray-600 dark:text-[#a0a0b8] leading-7 transition-colors">
                  To expand our footprint across Gujarat while maintaining the intimacy and trust of a family business. We aim to set the gold standard in the pre-owned automobile industry through uncompromised integrity.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CUSTOMER DELIVERY REELS */}
      <CustomerDeliveryReels />

      {/* SERVICES SECTION (Glowing SaaS Style) */}
      <section className="py-24 w-full relative overflow-hidden" style={{ background: '#0a0a12', color: '#e8dfee' }}>
        {/* Top title glow like the image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-blue-600/20 blur-[80px]"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] font-bold text-[32px] md:text-[42px] text-text-primary tracking-wide">
              Every Automotive Service in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">One Place</span>
            </h2>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >

            {/* CARD 1: BUY */}
            <motion.div variants={fadeInUp} className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  1
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Buy Verified <br /> Pre-owned Cars
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Drive home a pristine vehicle. Every car undergoes a strict 100-point inspection, ensuring total peace of mind and non-accidental guarantees. We offer the best competitive prices in Surat.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> 100-Point Quality Inspection
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Non-Accidental Guarantee
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Easy & Fast Financing
                </li>
              </ul>

              {/* Graphic 1: Car Inspection Checklist */}
              <div className="h-44 w-full mt-auto relative rounded-xl border border-blue-500/15 bg-[#0d0d1a] p-5 flex flex-col overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <div className="text-[10px] uppercase tracking-widest text-blue-400/60 mb-3 font-bold">Inspection Report</div>
                {/* Check items */}
                <div className="space-y-2.5 flex-grow">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <div className="flex-grow h-1.5 bg-white/8 rounded" />
                    <span className="text-[10px] text-green-400 font-bold">PASS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <div className="flex-grow h-1.5 bg-white/8 rounded" />
                    <span className="text-[10px] text-green-400 font-bold">PASS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <div className="flex-grow h-1.5 bg-white/8 rounded" />
                    <span className="text-[10px] text-green-400 font-bold">PASS</span>
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-blue-300/60">100 / 100 points cleared</span>
                  <div className="px-2.5 py-1 rounded bg-green-500/20 border border-green-500/30 text-[9px] text-green-400 font-bold tracking-wider">CERTIFIED</div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: SELL */}
            <motion.div variants={fadeInUp} className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  2
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Sell Your Car <br /> Instantly
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Get the best market value in 24 hours. Enjoy free doorstep evaluation and 100% free RC transfer without the traditional dealership hassle.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Instant Payment in 24 Hrs
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Free Doorstep Evaluation
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> 100% Free RC Transfer
                </li>
              </ul>

              {/* Graphic 2: Valuation Price Offer */}
              <div className="h-44 w-full mt-auto relative rounded-xl border border-blue-500/15 bg-[#0d0d1a] p-5 flex flex-col overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <div className="text-[10px] uppercase tracking-widest text-blue-400/60 mb-3 font-bold">Valuation Result</div>
                {/* Car Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <IconCar size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-['Outfit']">Hyundai Creta</div>
                    <div className="text-white/40 text-[10px]">2021 · Petrol · 32,000 km</div>
                  </div>
                </div>
                {/* Price offer */}
                <div className="flex-grow flex items-center">
                  <div className="w-full rounded-lg bg-blue-500/10 border border-blue-500/25 p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-blue-300/50 uppercase tracking-wider mb-0.5">Best Offer</div>
                      <div className="text-blue-300 text-[22px] font-black font-['Outfit']">₹8,45,000</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                      Accept →
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: EXCHANGE */}
            <motion.div variants={fadeInUp} className="bg-bg-secondary rounded-2xl p-8 border border-blue-500/20 flex flex-col group hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-9 h-9 rounded-full border-2 border-blue-400 text-blue-400 flex items-center justify-center font-['Outfit'] font-bold text-lg flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all">
                  3
                </div>
                <h3 className="font-['Outfit'] font-bold text-[22px] text-text-primary leading-tight mt-1">
                  Seamless Vehicle <br /> Exchange
                </h3>
              </div>

              <p className="font-['Inter'] text-[14px] text-text-muted leading-relaxed mb-4">
                Upgrade your lifestyle seamlessly by trading in your old vehicle for a new verified ride. We provide the most lucrative exchange offers in the market.
              </p>

              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Highest Market Value
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Seamless Vehicle Upgrades
                </li>
                <li className="flex items-center gap-2 text-[13px] text-blue-100/70">
                  <span className="text-blue-400 font-bold">✓</span> Zero Paperwork Hassle
                </li>
              </ul>

              {/* Graphic 3: Car Exchange Swap */}
              <div className="h-46 w-full mt-auto relative rounded-xl border border-blue-500/15 bg-[#0d0d1a] p-5 flex flex-col overflow-hidden group-hover:border-blue-500/30 transition-colors">
                <div className="text-[10px] uppercase tracking-widest text-blue-400/60 mb-3 font-bold">Exchange Summary</div>
                <div className="flex-grow flex items-center justify-center gap-4">
                  {/* Old car */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                      <IconCar size={24} className="text-red-400" />
                    </div>
                    <span className="text-[10px] text-white/50 font-medium">Your Car</span>
                    <span className="text-[9px] text-red-400/70 mt-0.5">Old Model</span>
                  </div>
                  {/* Swap Arrows */}
                  <div className="flex flex-col items-center gap-1">
                    <IconArrowsExchange size={22} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    <span className="text-[8px] text-cyan-400/60 uppercase tracking-widest font-bold">Swap</span>
                  </div>
                  {/* New car */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                      <IconCar size={24} className="text-green-400" />
                    </div>
                    <span className="text-[10px] text-white/50 font-medium">Dream Car</span>
                    <span className="text-[9px] text-green-400/70 mt-0.5">Upgrade</span>
                  </div>
                </div>
                {/* Bottom savings */}
                <div className="mt-2 pt-2.5 border-t border-white/5 flex items-center justify-center gap-2">
                  <span className="text-[10px] text-blue-300/60">You save upto</span>
                  <span className="text-[12px] text-cyan-300 font-bold font-['Outfit']">₹1,50,000+</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* OUR PROMISE — VERIFIED REDESIGN */}
      <section className="relative py-28 overflow-hidden transition-colors duration-500 z-10 dark:bg-[#0c0c18]">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/[0.03] dark:bg-purple-600/[0.05] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/[0.02] dark:bg-purple-600/[0.04] rounded-full blur-[80px]" />
          {/* Horizontal decorative line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 dark:via-purple-500/15 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header — left aligned for editorial feel */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Our Promise</span>
              </div>
              <h2 className="font-['Outfit'] font-bold text-[42px] text-black dark:text-white leading-tight transition-colors">
                Why Customers <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Keep Coming Back</span>
              </h2>
            </div>
            <p className="font-['Inter'] text-gray-500 dark:text-[#6b6b80] text-[15px] max-w-sm leading-7 transition-colors">
              Three pillars that define every transaction at Hariram Motors. No compromises, no exceptions.
            </p>
          </div>

          {/* 3 Verified Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >

            {/* Card 1: Verified Stock */}
            <motion.div variants={fadeInUp} className="group relative">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)]">
                {/* Gradient top border accent */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500" />

                <div className="p-8 pt-7">
                  {/* Number + Icon row */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit'] font-black text-[48px] leading-none text-gray-100 dark:text-white/[0.06] transition-colors group-hover:text-purple-100 dark:group-hover:text-purple-500/10">01</span>
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-600/15 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300">
                      <IconShieldCheck size={28} className="text-purple-600 dark:text-purple-400 transition-colors" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-['Outfit'] font-bold text-[22px] text-black dark:text-white mb-3 transition-colors">
                    Verified Stock Only
                  </h3>
                  <div className="w-10 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-4" />
                  <p className="font-['Inter'] text-[14px] text-gray-600 dark:text-[#a0a0b8] leading-7 transition-colors">
                    Every car is rigorously inspected on mechanical and cosmetic parameters before listing. Non-accidental guarantee on every vehicle we sell.
                  </p>

                  {/* Bottom decorative tag */}
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="font-['Inter'] text-[12px] text-gray-400 dark:text-[#6b6b80] uppercase tracking-wider transition-colors">100-Point Inspection</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Honest Pricing */}
            <motion.div variants={fadeInUp} className="group relative">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)]">
                <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-purple-500" />

                <div className="p-8 pt-7">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit'] font-black text-[48px] leading-none text-gray-100 dark:text-white/[0.06] transition-colors group-hover:text-purple-100 dark:group-hover:text-purple-500/10">02</span>
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-600/15 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300">
                      <IconReceipt size={28} className="text-purple-600 dark:text-purple-400 transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-['Outfit'] font-bold text-[22px] text-black dark:text-white mb-3 transition-colors">
                    Honest Pricing
                  </h3>
                  <div className="w-10 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-4" />
                  <p className="font-['Inter'] text-[14px] text-gray-600 dark:text-[#a0a0b8] leading-7 transition-colors">
                    No hidden charges, no last-minute surprises. The price you see is the price you pay. Complete transparency is our standard, not an exception.
                  </p>

                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="font-['Inter'] text-[12px] text-gray-400 dark:text-[#6b6b80] uppercase tracking-wider transition-colors">Zero Hidden Costs</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Full Paperwork */}
            <motion.div variants={fadeInUp} className="group relative">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.08)] dark:hover:shadow-[0_20px_60px_rgba(124,58,237,0.15)]">
                <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500" />

                <div className="p-8 pt-7">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-['Outfit'] font-black text-[48px] leading-none text-gray-100 dark:text-white/[0.06] transition-colors group-hover:text-purple-100 dark:group-hover:text-purple-500/10">03</span>
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-600/15 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300">
                      <IconFileText size={28} className="text-purple-600 dark:text-purple-400 transition-colors" />
                    </div>
                  </div>

                  <h3 className="font-['Outfit'] font-bold text-[22px] text-black dark:text-white mb-3 transition-colors">
                    Full Paperwork
                  </h3>
                  <div className="w-10 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-4" />
                  <p className="font-['Inter'] text-[14px] text-gray-600 dark:text-[#a0a0b8] leading-7 transition-colors">
                    We handle the RC transfer, NOC, insurance, and every bit of documentation so you can focus on what matters — driving your new car.
                  </p>

                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="font-['Inter'] text-[12px] text-gray-400 dark:text-[#6b6b80] uppercase tracking-wider transition-colors">End-to-End Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ═══ HAPPY CUSTOMERS (Delivery Photos) ═══ */}
      {testimonials.length > 0 && (
        <section className="py-10 md:py-14 lg:py-20 overflow-hidden transition-colors duration-500 z-10 dark:bg-[#0a0a12]">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 transition-colors">OUR FAMILY</p>
                <h2 className="text-3xl md:text-[40px] text-black dark:text-white font-bold leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
                  Happy Customers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm transition-colors">
                  Seeing our customers drive away with a smile is our greatest reward.
                </p>
              </div>
              <div className="hidden md:flex gap-3">
                <button onClick={scrollTestiPrev} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                  <IconChevronLeft size={20} />
                </button>
                <button onClick={scrollTestiNext} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                  <IconChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-visible w-full pt-4" ref={testiRef}>
              <div className="flex gap-4 sm:gap-6 -ml-4 pl-4 pr-4 sm:pr-0">
                {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, index) => (
                  <div key={`${t._id}-${index}`} className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] shrink-0 rounded-2xl overflow-hidden group shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-[#12121f] transition-colors duration-500 cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.customerName} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-500/30">No Photo</div>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none z-10 transition-all duration-500 group-hover:h-[60%]" />
                    <div className="absolute inset-x-0 bottom-[60px] px-6 pb-2 pt-10 flex flex-col justify-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 pointer-events-none">
                      <p className="text-white text-[14px] leading-relaxed font-medium line-clamp-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        &quot;{t.review || t.description || "Had a fantastic experience purchasing my dream car. Highly recommended!"}&quot;
                      </p>
                    </div>
                    <div className="absolute bottom-5 left-6 right-6 z-30 pointer-events-auto flex flex-col items-start">
                      <span className="text-white font-black text-[14px] sm:text-[16px] tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {t.customerName}
                      </span>
                      <div className="w-8 h-[3px] bg-gradient-to-r from-purple-600 to-red-600 rounded-full mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ GOOGLE REVIEWS ═══ */}
      <div className="relative z-10 dark:bg-[#0a0a12]">
        <GoogleReviews />
      </div>

      {/* ═══ FREQUENTLY ASKED QUESTIONS (VERIFIED REDESIGN) ═══ */}
      <section className="relative py-28 z-10 bg-[#f4f4f8] dark:bg-[#0a0a12] overflow-hidden transition-colors duration-500">
        {/* Background Decorative Glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.04] dark:bg-purple-600/[0.08] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/[0.03] dark:bg-blue-600/[0.06] rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 dark:via-purple-500/15 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Got Questions?</span>
            </div>
            <h2 className="font-['Outfit'] font-bold text-[42px] text-black dark:text-white leading-tight">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-500 dark:text-[#a0a0b8] mt-5 font-['Inter'] text-[16px] max-w-xl mx-auto">
              Everything you need to know about buying, selling, or financing a pre-owned car with Hariram Motors.
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {[
              {
                question: "Why should I buy a used car from Hariram Motors?",
                answer: "Hariram Motors offers a verified buying experience with our \"Hariram Certified\" guarantee. Every vehicle undergoes a strict 150-point mechanical and structural inspection to ensure the highest quality standards before it reaches our showroom. We provide a 100% non-accidental history guarantee, verify genuine odometer readings, and ensure clear legal titles without any pending challans or hypothecation issues. Our comprehensive service includes handling all RTO transfers on your behalf and providing on-the-spot finance options through leading banking partners. By prioritizing transparency, competitive pricing, and total customer satisfaction, we make the process of buying a pre-owned car in Surat seamless and completely trustworthy."
              },
              {
                question: "Does Hariram Motors provide loans on used cars?",
                answer: "Yes, Hariram Motors has established direct tie-ups with leading private and nationalized banks, as well as verified NBFCs, to provide quick and hassle-free car loans for pre-owned vehicles. Our dedicated in-house finance team works to secure the lowest possible interest rates and highly flexible EMI options tailored precisely to your financial profile. We require minimal documentation and manage the entire loan processing workflow, ensuring that loan approvals are often available within just a few hours. This seamless financing integration means you can finalize your vehicle purchase and drive home the very same day without visiting a bank branch."
              },
              {
                question: "Can I sell or exchange my current car at Hariram Motors?",
                answer: "Absolutely. Hariram Motors offers immediate, transparent, and highly competitive market valuations for your old car through a free doorstep or showroom evaluation process. You have the total flexibility to either sell your car directly to us for instant, secure payment within 24 hours, or you can use its highest market value as an upfront down payment for seamlessly upgrading to another verified vehicle from our extensive inventory. We take complete responsibility for all paperwork, including the 100% free RC transfer process, ensuring you face absolutely zero legal liabilities after handing over your vehicle to our team."
              }
            ].map((faq, index) => (
              <motion.div variants={fadeInUp} key={index}>
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${activeFaq === index ? 'bg-white dark:bg-white/[0.05] border-purple-400 dark:border-purple-500/50 shadow-[0_10px_30px_rgba(124,58,237,0.1)]' : 'bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.05] hover:border-purple-300 dark:hover:border-purple-500/30'}`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className={`text-[18px] md:text-[20px] font-bold font-['Outfit'] transition-colors ${activeFaq === index ? 'text-purple-600 dark:text-purple-400' : 'text-black dark:text-white'}`}>
                      {faq.question}
                    </h3>
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${activeFaq === index ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 rotate-180' : 'bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                      <IconChevronDown size={20} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="w-12 h-[2px] bg-gradient-to-r from-purple-500 to-transparent mb-4" />
                        <p className="text-gray-600 dark:text-[#a0a0b8] font-['Inter'] text-[15px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

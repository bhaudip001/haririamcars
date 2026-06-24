'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeInLeft } from '@/lib/animations';
import { IconShieldCheck, IconSettings, IconTool, IconCertificate, IconPhoneCall, IconBrandWhatsapp, IconCheck, IconChevronDown, IconStarFilled, IconCircleCheckFilled } from '@tabler/icons-react';
import Image from 'next/image';

const FAQS = [
  {
    question: "What exactly does the extended warranty cover?",
    answer: "Our extended warranty provides comprehensive coverage for major mechanical and electrical components including the Engine, Transmission, AC systems, and complex electrical sensors. It ensures you are protected from unexpected heavy repair bills."
  },
  {
    question: "Why should I buy a warranty for a pre-owned car?",
    answer: "Most dealers sell cars 'as-is' with no guarantee. We offer this exclusive extended warranty to give you new-car-like peace of mind. If a covered part fails, we fix it at no cost to you."
  },
  {
    question: "Is the extended warranty cashless?",
    answer: "Yes! Repairs under the extended warranty are 100% cashless when performed at our authorized service network using genuine spare parts."
  },
  {
    question: "Is the warranty transferable if I sell the car?",
    answer: "Absolutely. The extended warranty stays with the car, which significantly increases the resale value of your vehicle when you decide to sell it."
  }
];

export default function WarrantyPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#fcfaf8] dark:bg-[#070505] min-h-screen pb-0 relative transition-colors duration-500 w-full flex flex-col overflow-hidden" style={{ paddingTop: 0 }}>
      {/* Light Mode: Background */}
      <div className="fixed inset-0 dark:hidden pointer-events-none z-0">
        <div className="absolute inset-0 blueprint-grid opacity-[0.04]"></div>
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-amber-100/60 rounded-full blur-[120px] mix-blend-multiply animate-pulse-ring"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-yellow-100/50 rounded-full blur-[150px] mix-blend-multiply animate-float-card"></div>
      </div>

      {/* Dark Mode: Background */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0808]"></div>
        <div className="absolute inset-0 blueprint-grid opacity-[0.03] invert"></div>
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[140px] mix-blend-screen animate-pulse-ring"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-yellow-900/10 rounded-full blur-[150px] mix-blend-screen animate-float-card"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 lg:pt-48 pb-20 lg:pb-32 overflow-hidden z-10 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Hero Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:w-1/2 text-left"
            >
              <motion.div variants={fadeInLeft} className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-700 dark:text-amber-400 text-xs uppercase tracking-widest font-bold">Hariram Exclusive Feature</span>
              </motion.div>
              
              <motion.h1 variants={fadeInLeft} className="font-['Outfit'] font-black text-5xl sm:text-6xl lg:text-7xl text-black dark:text-white leading-[1.1] mb-6">
                We Provide <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 bg-300% animate-gradient">
                  Extended Warranty.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInLeft} className="font-['Inter'] text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-xl leading-relaxed">
                Most dealers sell you a car and disappear. We stand by our vehicles. Enjoy new-car-like peace of mind with our comprehensive extended warranty on pre-owned cars.
              </motion.p>

              <motion.div variants={fadeInLeft} className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-xl text-sm font-bold mb-10 border border-amber-200 dark:border-amber-700/50">
                ⭐ An exclusive service other dealers don't provide.
              </motion.div>
              
              <motion.div variants={fadeInLeft} className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+919898558222" className="group flex items-center justify-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-full font-['Outfit'] font-bold text-lg transition-all shadow-[0_10px_40px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.6)] hover:-translate-y-1">
                  <IconPhoneCall size={22} className="group-hover:rotate-12 transition-transform" />
                  Claim Your Warranty
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Interactive Card Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
              className="lg:w-1/2 relative perspective-1000"
            >
              <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-[#1a1814] to-[#0d0c0a] backdrop-blur-2xl border border-amber-500/30 shadow-[0_20px_60px_rgba(245,158,11,0.15)] p-8 flex flex-col overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/30 transition-colors duration-700"></div>
                
                <div className="flex items-center justify-between mb-8 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <IconCertificate size={28} className="text-amber-400" />
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase border border-amber-500/30 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Verified Protection
                  </div>
                </div>

                <div className="z-10 mb-auto">
                  <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Hariram Gold Cover</div>
                  <div className="font-['Outfit'] font-black text-4xl text-white mb-6">Up to 2 Years</div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <IconSettings size={20} className="text-amber-500" /> Engine & Gearbox
                      </div>
                      <div className="text-sm font-bold text-white">Covered</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <IconTool size={20} className="text-amber-500" /> Free Labor Cost
                      </div>
                      <div className="text-sm font-bold text-white">100%</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3 text-gray-300 font-medium">
                        <IconShieldCheck size={20} className="text-amber-500" /> Genuine Parts
                      </div>
                      <div className="text-sm font-bold text-white">Assured</div>
                    </div>
                  </div>
                </div>

                <div className="z-10 w-full mt-6 flex justify-center">
                  <div className="w-16 h-1.5 rounded-full bg-white/10"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-['Outfit'] font-black text-4xl md:text-5xl text-black dark:text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">Hariram Promise.</span>
            </h2>
            <p className="font-['Inter'] text-gray-600 dark:text-gray-400 text-lg">
              We don't just inspect our cars; we guarantee their performance. This is why we are Surat's most trusted pre-owned car dealer.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: IconSettings, title: "Major Components", desc: "Covers engine, manual/automatic transmission, and critical drivetrain parts." },
              { icon: IconTool, title: "Zero Labor Charges", desc: "No labor fees for replacing or repairing any of the covered components." },
              { icon: IconShieldCheck, title: "Genuine Spares", desc: "We only use 100% genuine OEM spare parts for any required replacements." },
              { icon: IconCertificate, title: "Higher Resale Value", desc: "The warranty is fully transferable, drastically improving your car's future resale value." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group relative p-8 rounded-[2rem] bg-white dark:bg-[#12100e] border border-amber-100 dark:border-amber-900/30 shadow-[0_10px_30px_rgba(245,158,11,0.05)] dark:shadow-none hover:shadow-[0_20px_60px_rgba(245,158,11,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/10 flex items-center justify-center mb-8 border border-amber-200/50 dark:border-amber-700/30 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={32} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-2xl text-black dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="font-['Inter'] text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="py-24 bg-white/50 dark:bg-[#080706]/80 backdrop-blur-md border-y border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] font-black text-4xl text-black dark:text-white mb-4">Why We Stand Out</h2>
            <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white dark:bg-[#12100e] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl">
            <div className="grid grid-cols-3 bg-gray-50 dark:bg-[#1a1814] p-6 border-b border-gray-200 dark:border-white/10 font-['Outfit'] font-bold text-lg text-black dark:text-white">
              <div>Features</div>
              <div className="text-center text-gray-500 dark:text-gray-400">Other Dealers</div>
              <div className="text-center text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2"><IconStarFilled size={18} /> Hariram Motors</div>
            </div>
            
            {[
              "Engine Coverage", "Transmission Coverage", "Electrical Sensors", "Free Labor on Repairs", "Transferable Warranty"
            ].map((feature, idx) => (
              <div key={idx} className="grid grid-cols-3 p-6 border-b border-gray-100 dark:border-white/5 last:border-0 font-['Inter'] text-gray-700 dark:text-gray-300 items-center">
                <div className="font-medium">{feature}</div>
                <div className="flex justify-center"><div className="w-6 h-0.5 bg-red-400/50 rounded-full"></div></div>
                <div className="flex justify-center"><IconCircleCheckFilled size={24} className="text-amber-500" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] font-black text-4xl text-black dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#12100e] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-['Outfit'] font-bold text-lg text-black dark:text-white">{faq.question}</span>
                  <IconChevronDown size={24} className={`text-amber-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-gray-600 dark:text-gray-400 font-['Inter'] leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[3rem] overflow-hidden relative p-12 md:p-20 bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-md mb-8 border border-amber-500/30">
                <IconCertificate size={40} className="text-amber-400" />
              </div>
              <h2 className="font-['Outfit'] font-black text-4xl md:text-5xl mb-6 leading-tight max-w-2xl">
                Upgrade to Hariram Gold Coverage Today.
              </h2>
              <p className="font-['Inter'] text-gray-300 text-lg mb-10 max-w-xl">
                Don't leave your car's health to chance. Secure your vehicle with Surat's best pre-owned extended warranty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a href="tel:+919898558222" className="flex items-center justify-center gap-2 bg-amber-500 text-white px-10 py-4 rounded-full font-['Outfit'] font-bold text-lg hover:bg-amber-600 transition-colors shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:-translate-y-1">
                  <IconPhoneCall size={20} />
                  Call Experts
                </a>
                <a href="https://wa.me/919898558222" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 px-10 py-4 rounded-full font-['Outfit'] font-bold text-lg hover:bg-white/20 transition-colors hover:-translate-y-1">
                  <IconBrandWhatsapp size={20} className="text-[#25D366]" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

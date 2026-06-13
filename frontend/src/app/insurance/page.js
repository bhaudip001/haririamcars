'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import { IconShieldCheck, IconCarCrash, IconFileText, IconCash, IconPhoneCall, IconBrandWhatsapp, IconCheck, IconChevronDown, IconStarFilled, IconCircleCheckFilled } from '@tabler/icons-react';
import Image from 'next/image';

const FAQS = [
  {
    question: "What types of car insurance do you offer?",
    answer: "We offer both Third-Party Liability (mandatory by law) and Comprehensive Car Insurance which covers both third-party liabilities and damages to your own vehicle."
  },
  {
    question: "Do you offer Zero Depreciation cover?",
    answer: "Yes, we strongly recommend our Zero Depreciation add-on, which ensures you receive full claim settlement without any deductions for part depreciation."
  },
  {
    question: "How long does the claim process take?",
    answer: "With our cashless garage network, minor repairs and claims are approved within 24-48 hours. Our dedicated team assists you throughout the entire process."
  },
  {
    question: "Can I renew my expired policy?",
    answer: "Yes, you can renew an expired policy. However, the vehicle might require a quick physical or digital inspection before the new policy is issued."
  }
];

const PARTNERS = ["HDFC ERGO", "ICICI Lombard", "Tata AIG", "Bajaj Allianz", "Digit Insurance", "SBI General"];

export default function InsurancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#f4f4f8] dark:bg-[#050508] min-h-screen pb-0 relative transition-colors duration-500 w-full flex flex-col overflow-hidden" style={{ paddingTop: 0 }}>
      {/* Light Mode: Background */}
      <div className="fixed inset-0 dark:hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/blueprint-grid.png')] opacity-[0.03]"></div>
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[120px] mix-blend-multiply animate-pulse-ring"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-cyan-100/50 rounded-full blur-[150px] mix-blend-multiply animate-float-card"></div>
      </div>

      {/* Dark Mode: Background */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0a12]"></div>
        <div className="absolute inset-0 bg-[url('/blueprint-grid.png')] opacity-[0.03] invert"></div>
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[140px] mix-blend-screen animate-pulse-ring"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px] mix-blend-screen animate-float-card"></div>
      </div>

      {/* HERO SECTION - Premium Split Layout */}
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
              <motion.div variants={fadeInLeft} className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-blue-200/50 dark:border-blue-500/20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-700 dark:text-blue-300 text-xs uppercase tracking-widest font-bold">Hariram Insurance Services</span>
              </motion.div>
              
              <motion.h1 variants={fadeInLeft} className="font-['Outfit'] font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-black dark:text-white leading-[1.1] mb-6">
                Protect Your Drive with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 bg-300% animate-gradient">
                  Absolute Trust.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeInLeft} className="font-['Inter'] text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
                Experience cashless repairs across 5000+ garages, zero depreciation benefits, and instant claim settlements. Your peace of mind is our priority.
              </motion.p>
              
              <motion.div variants={fadeInLeft} className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+919898558222" className="group flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-['Outfit'] font-bold text-lg transition-all shadow-[0_10px_40px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_50px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                  <IconPhoneCall size={22} className="group-hover:rotate-12 transition-transform" />
                  Get Instant Quote
                </a>
                <a href="https://wa.me/919898558222" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white px-8 py-4 rounded-full font-['Outfit'] font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm hover:-translate-y-1">
                  <IconBrandWhatsapp size={22} className="text-[#25D366] group-hover:scale-110 transition-transform" />
                  Chat on WhatsApp
                </a>
              </motion.div>

              <motion.div variants={fadeInLeft} className="mt-12 flex items-center gap-6 pt-8 border-t border-black/5 dark:border-white/5">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#f4f4f8] dark:border-[#0a0a12] flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 z-${50-i*10}`}>
                      <IconStarFilled size={14} className="text-yellow-500" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-black dark:text-white font-bold font-['Outfit'] text-lg">
                    4.9/5 <IconStarFilled size={16} className="text-yellow-500" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Trusted by 2000+ Customers</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Interactive Card Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
              className="lg:w-1/2 relative perspective-1000"
            >
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto min-h-[420px] sm:min-h-0 sm:aspect-[4/5] h-auto rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 sm:p-8 flex flex-col overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/30 transition-colors duration-700"></div>
                
                <div className="flex items-center justify-between mb-6 sm:mb-8 z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <IconShieldCheck size={24} className="text-blue-600 dark:text-blue-400 sm:w-7 sm:h-7" />
                  </div>
                  <div className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-green-200 dark:border-green-500/30 flex items-center gap-1.5 whitespace-nowrap ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                    Active Cover
                  </div>
                </div>

                <div className="z-10 mb-auto">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">Comprehensive Plan</div>
                  <div className="font-['Outfit'] font-black text-3xl sm:text-4xl text-black dark:text-white mb-5 sm:mb-6">₹18,50,000</div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                        <IconCircleCheckFilled size={18} className="text-blue-500 shrink-0 sm:w-5 sm:h-5" /> Zero Dep Cover
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-black dark:text-white shrink-0">Included</div>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                        <IconCircleCheckFilled size={18} className="text-blue-500 shrink-0 sm:w-5 sm:h-5" /> Cashless Garage
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-black dark:text-white shrink-0">5000+</div>
                    </div>
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                        <IconCircleCheckFilled size={18} className="text-blue-500 shrink-0 sm:w-5 sm:h-5" /> Roadside Assist
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-black dark:text-white shrink-0">24x7</div>
                    </div>
                  </div>
                </div>

                <div className="z-10 w-full mt-5 sm:mt-6 flex justify-center">
                  <div className="w-12 sm:w-16 h-1.5 rounded-full bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-12 border-b border-black/5 dark:border-white/5 relative z-10 bg-white/30 dark:bg-[#0a0a12]/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by Premium Insurance Partners</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {PARTNERS.map((partner, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="font-['Outfit'] font-black text-2xl text-gray-800 dark:text-white"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl md:text-5xl text-black dark:text-white mb-6">
              Why Compromise on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Coverage?</span>
            </h2>
            <p className="font-['Inter'] text-gray-600 dark:text-gray-400 text-lg">
              We provide policies that actually protect you when you need it most. No hidden clauses, just complete financial security for your vehicle.
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
              { icon: IconShieldCheck, title: "Zero Depreciation", desc: "Get full claim settlement without any deduction for depreciation on rubber, plastic, or glass parts." },
              { icon: IconCash, title: "Cashless Repairs", desc: "Access a wide network of 5000+ partner garages for hassle-free cashless accident repairs." },
              { icon: IconFileText, title: "Instant Issuance", desc: "Digital first approach. Get your policy document in your WhatsApp within 5 minutes of payment." },
              { icon: IconCarCrash, title: "24/7 Roadside Assist", desc: "Flat tire, dead battery, or towing needs? Get round-the-clock emergency assistance anywhere." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group relative p-8 rounded-[2rem] bg-white dark:bg-[#12121a] border border-gray-100 dark:border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_20px_60px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center mb-8 border border-blue-200/50 dark:border-blue-700/30 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={32} className="text-blue-600 dark:text-blue-400" />
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

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-white/50 dark:bg-[#080810]/80 backdrop-blur-md border-y border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3">
              <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl text-black dark:text-white mb-6">
                Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">3-Step</span> Process
              </h2>
              <p className="font-['Inter'] text-gray-600 dark:text-gray-400 text-lg mb-8">
                Buying or renewing your car insurance has never been this fast. Skip the paperwork and the long waits.
              </p>
              <a href="tel:+919898558222" className="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-['Outfit'] font-bold text-lg hover:scale-105 transition-transform shadow-lg">
                Start Now <IconCheck size={20} />
              </a>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-500 dark:to-blue-900 -translate-y-1/2 z-0" />
              
              {[
                { step: "01", title: "Share Details", desc: "Provide your car number and basic details via Call or WhatsApp." },
                { step: "02", title: "Compare Plans", desc: "We generate the best quotes from multiple premium insurers for you." },
                { step: "03", title: "Instant Policy", desc: "Make the payment securely and receive your policy document instantly." }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 bg-white dark:bg-[#12121a] p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-['Outfit'] font-black text-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-black dark:text-white mb-3">{item.title}</h3>
                  <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-32 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl text-black dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#12121a] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-['Outfit'] font-bold text-lg text-black dark:text-white">{faq.question}</span>
                  <IconChevronDown size={24} className={`text-blue-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
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
          <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative p-8 sm:p-12 md:p-20 bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mb-8 border border-white/20">
                <IconShieldCheck size={40} className="text-blue-400" />
              </div>
              <h2 className="font-['Outfit'] font-black text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight max-w-2xl">
                Don't Wait for an Accident to Value Your Insurance.
              </h2>
              <p className="font-['Inter'] text-gray-300 text-lg mb-10 max-w-xl">
                Get the best comprehensive quotes from top insurers tailored for your car through Hariram Motors today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a href="tel:+919898558222" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-full font-['Outfit'] font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:-translate-y-1">
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

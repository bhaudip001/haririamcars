'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  IconBrandFacebook, 
  IconBrandInstagram, 
  IconBrandYoutube, 
  IconMapPin, 
  IconPhone, 
  IconClock
} from '@tabler/icons-react';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#05050a] text-gray-400 border-t border-white/10 pt-20 pb-8 relative z-10 overflow-hidden"
    >
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Wider) */}
          <div className="lg:col-span-4">
            <Link className="hover:opacity-90 transition-opacity flex flex-col group mb-6" href="/">
              <div className="relative w-56 h-14 overflow-hidden flex items-center">
                <Image 
                  src="/without_background_logo.png" 
                  alt="Hariram Motors Logo" 
                  fill 
                  className="object-contain object-left mix-blend-lighten"
                  sizes="224px"
                />
              </div>
              <span className="text-[8px] uppercase tracking-wide text-gray-500 mt-0.5 font-medium ml-6">Drive Your Own Dreams</span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 text-gray-400 pr-4">
              Surat&apos;s premier destination for curated luxury and certified pre-owned vehicles. Built on trust, driven by absolute quality.
            </p>
            <div className="flex gap-4 mt-2">
              <motion.a 
                whileHover={{ scale: 1.15, y: -4 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                href="https://www.facebook.com/share/192ndW3BAW/?mibextid=wwXIfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[0_0_15px_rgba(24,119,242,0.5)] hover:text-white transition-all duration-300 text-white shadow-sm"
                aria-label="Facebook"
              >
                <IconBrandFacebook size={20} stroke={1.5} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, y: -4 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                href="https://www.instagram.com/hariram_motors?igsh=MTljZmdmOXFvbHRncQ%3D%3D&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group hover:border-transparent hover:shadow-[0_0_15px_rgba(225,48,108,0.5)] transition-all duration-300 text-white shadow-sm"
                aria-label="Instagram"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <IconBrandInstagram size={20} stroke={1.5} className="relative z-10" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, y: -4 }} 
                whileTap={{ scale: 0.95 }} 
                transition={{ type: "spring", stiffness: 400, damping: 17 }} 
                href="https://youtube.com/@harirammotors?si=QgG9YbGyDO2HbCGS" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:text-white transition-all duration-300 text-white shadow-sm"
                aria-label="YouTube"
              >
                <IconBrandYoutube size={20} stroke={1.5} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div className="lg:col-span-5 lg:col-start-5 grid grid-cols-2 gap-4 lg:gap-8 px-0 lg:px-8">
            <div>
              <h4 className="font-['Outfit'] text-white text-lg font-bold mb-6 tracking-wide relative inline-block">
                Navigation
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-purple-500 rounded-full"></span>
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/" className="hover:text-white transition-colors inline-block">Home</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/catalog" className="hover:text-white transition-colors inline-block">Our Inventory</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/about" className="hover:text-white transition-colors inline-block">About Us</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/sell-your-car" className="hover:text-white transition-colors inline-block">Sell Your Car</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/contact" className="hover:text-white transition-colors inline-block">Contact</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/insurance" className="hover:text-white transition-colors inline-block">Insurance</Link></motion.div></li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Outfit'] text-white text-lg font-bold mb-6 tracking-wide relative inline-block">
                Services
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-purple-500 rounded-full"></span>
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/catalog" className="hover:text-white transition-colors inline-block">Buy Car</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/sell-your-car" className="hover:text-white transition-colors inline-block">Sell Car</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/sell-your-car?mode=exchange" className="hover:text-white transition-colors inline-block">Exchange Car</Link></motion.div></li>
                <li><motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}><Link href="/contact" className="hover:text-white transition-colors inline-block">Test Drive Booking</Link></motion.div></li>
              </ul>
            </div>
          </div>

          {/* Visit Us */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h4 className="font-['Outfit'] text-white text-lg font-bold mb-6 tracking-wide relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-purple-500 rounded-full"></span>
            </h4>
            <ul className="flex flex-col gap-5 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <IconMapPin size={16} className="text-purple-400" />
                </div>
                <span className="leading-relaxed mt-1 group-hover:text-white transition-colors">
                  Simada Canal, BRTS Rd,<br />near Setubandh Hills,<br />Surat, Gujarat 395006
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <IconPhone size={16} className="text-purple-400" />
                </div>
                <span className="group-hover:text-white transition-colors">+91 98985 58222</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <IconClock size={16} className="text-purple-400" />
                </div>
                <span className="group-hover:text-white transition-colors">Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-sm flex flex-col md:flex-row justify-center md:justify-start items-center gap-4">
          <p className="text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Hariram Motors. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

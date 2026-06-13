"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInLeft } from '@/lib/animations';
import { IconPhoneCall, IconBrandWhatsapp, IconMenu2, IconX, IconChevronRight, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Sell Your Car', path: '/sell-your-car' },
    { name: 'Insurance', path: '/insurance' }
    // { name: 'Warranty', path: '/warranty' }
  ];

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-40 transition-all duration-500 border-b ${scrolled
          ? 'bg-[#0a0a12]/90 backdrop-blur-2xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] py-2 md:py-3'
          : 'bg-[#0a0a12] backdrop-blur-md border-transparent shadow-none py-4 md:py-5'
          }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Real Logo & Tagline */}
          <Link className="flex flex-col justify-center group shrink-0 relative" href="/">
            <div className={`relative w-40 h-10 md:w-52 md:h-11 overflow-hidden flex items-center transition-transform duration-300 ${scrolled ? 'scale-95' : 'scale-100'} group-hover:scale-105`}>
              <Image
                src="/without_background_logo.png"
                alt="Hariram Motors Logo"
                fill
                className="object-contain object-left mix-blend-lighten transition-all duration-300"
                sizes="(max-width: 768px) 160px, 208px"
                priority
              />
            </div>
            <span className={`text-[7px] md:text-[8px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-0.5 ml-5 transition-opacity duration-300 font-medium ${scrolled ? 'opacity-80' : 'opacity-100'}`}>
              Drive Your Own Dreams
            </span>
          </Link>

          {/* Navigation Links (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-['Outfit'] text-[15px] px-4 py-2 rounded-full transition-all duration-300 relative group overflow-hidden ${isActive
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {!isActive && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 transform origin-left scale-x-0 transition-transform duration-250 ease-out group-hover:scale-x-100"></span>}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center p-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 group overflow-hidden"
                aria-label="Toggle Theme"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: theme === 'dark' ? 1 : 0.8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {theme === 'dark' ? <IconSun size={20} className="group-hover:text-yellow-400 transition-colors" /> : <IconMoon size={20} className="group-hover:text-purple-600 transition-colors" />}
                </motion.div>
              </button>
            )}

            {/* Call Us Button */}
            <a
              href="tel:+919898558222"
              className="hidden md:flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-4 h-[44px] rounded-full font-['Outfit'] font-bold text-sm hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-300 shadow-sm"
            >
              <IconPhoneCall size={18} className="text-blue-400" />
              <span>Call Us</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/919898558222"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-4 h-[44px] rounded-full font-['Outfit'] font-bold text-sm hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all duration-300 shadow-sm"
            >
              <IconBrandWhatsapp size={18} className="text-[#25D366]" stroke={2} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Mobile Menu Toggle (Visible < lg) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center h-[44px] w-[44px] border border-transparent hover:border-white/10"
              aria-label="Open Menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <IconMenu2 size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* FULL SCREEN MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-[#050508]/80"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-[#0a0a12]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col pt-24 px-6 pb-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-white/70 p-2.5 hover:bg-white/10 rounded-full transition-colors bg-white/5 border border-white/10 shadow-sm"
                aria-label="Close Menu"
              >
                <IconX size={20} />
              </button>

              {/* Navigation Links */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-3 mt-4">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                  return (
                    <motion.div variants={fadeInLeft} key={link.path}>
                      <Link
                        href={link.path}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isActive
                          ? "bg-purple-500/10 border-purple-500/30 text-white shadow-sm"
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        <span className="font-['Outfit'] font-bold text-lg tracking-wide">{link.name}</span>
                        <motion.div
                          initial={false}
                          animate={{ x: isActive ? 4 : 0 }}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <IconChevronRight size={20} className={isActive ? "text-purple-400" : "text-white/30 group-hover:text-white/60"} />
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Mobile CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto flex flex-col gap-4 pt-8 border-t border-white/10"
              >
                <a
                  href="tel:+919898558222"
                  className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-3 font-['Outfit'] font-bold text-lg text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-sm"
                >
                  <IconPhoneCall size={22} className="text-blue-400" />
                  Call +91 98985 58222
                </a>
                <a
                  href="https://wa.me/919898558222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[56px] rounded-2xl flex items-center justify-center gap-3 font-['Outfit'] font-bold text-lg text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-sm"
                >
                  <IconBrandWhatsapp size={22} className="text-[#25D366]" stroke={2} />
                  Chat on WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

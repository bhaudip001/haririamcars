'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  IconArrowLeft, IconMaximize, IconCalendarMonth, IconDashboard,
  IconGasStation, IconManualGearbox, IconUser, IconMapPin,
  IconShieldCheck, IconBrandWhatsapp, IconPhoneCall, IconInfoCircle,
  IconArrowRight, IconX, IconChevronLeft, IconChevronRight
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink, generateBlurPlaceholder } from '@/lib/utils';
import { staggerContainer, fadeInLeft } from '@/lib/animations';
import CarCard from '@/components/CarCard';
import dynamic from 'next/dynamic';
const EmiCalculator = dynamic(() => import('@/components/EmiCalculator'), { ssr: false });

export default function CarDetailPageClient({ initialCar, initialSimilarCars }) {
  const router = useRouter();

  const [car, setCar] = useState(initialCar);
  const [similarCars, setSimilarCars] = useState(initialSimilarCars || []);
  const [loading, setLoading] = useState(!initialCar);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // Smart Sticky State
  const rightColumnRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('120px');

  useEffect(() => {
    const handleResize = () => {
      if (!rightColumnRef.current) return;
      const elementHeight = rightColumnRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (elementHeight > windowHeight - 144) {
        const top = windowHeight - elementHeight - 24;
        setStickyTop(`${top}px`);
      } else {
        setStickyTop('120px');
      }
    };

    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);

    let observer;
    if (window.ResizeObserver && rightColumnRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(rightColumnRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [car]);

  // Swipe Handlers
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  if (loading) {
    return (
      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Car Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The vehicle you are looking for may have been sold or removed.</p>
        <Link href="/catalog" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors">
          Back to Catalog
        </Link>
      </main>
    );
  }

  const displayYear = car.registerYear || car.year;
  const yearText = displayYear ? `(${displayYear})` : '';
  const title = `${car.make} ${car.model} ${yearText}`.trim();
  const images = car.images || [];

  const hasBadges = car.badges && car.badges.length > 0;
  const isSold = car.status === 'sold';

  const specialBadgeNames = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  let isLoanAvailable = car.loanAvailable;

  const hasExplicitBadges = Array.isArray(car.badges) && car.badges.length > 0;
  if (hasExplicitBadges) {
    photoBadges.push(...car.badges.filter(b => specialBadgeNames.includes(b)));
  } else {
    // Legacy support for badges stored in features
    (car.features || []).forEach(feat => {
      if (typeof feat === 'string') {
        if (specialBadgeNames.some(b => feat.toLowerCase().includes(b.toLowerCase()))) {
          if (!photoBadges.includes(feat)) photoBadges.push(feat);
        } else if (feat.toLowerCase().includes('loan available')) {
          isLoanAvailable = true;
        }
      }
    });
  }

  // Normalize regular features to [{key, value}]
  const normalizedFeatures = [];
  (car.features || []).forEach(feat => {
    if (typeof feat === 'string') {
      const isBadge = specialBadgeNames.some(b => feat.toLowerCase().includes(b.toLowerCase())) || feat.toLowerCase().includes('loan available');
      if (!isBadge) {
        normalizedFeatures.push({ key: feat, value: '' });
      }
    } else if (typeof feat === 'object' && feat.key) {
      normalizedFeatures.push(feat);
    }
  });

  return (
    <div className="min-h-screen bg-[#f4f4f8] dark:bg-transparent relative transition-colors duration-500 w-full flex flex-col">
      {/* Light Mode: Massive Unified Premium Background */}
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

      {/* Dark Mode: Massive Unified Premium Background */}
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

      <main className="flex-grow pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <button onClick={() => router.back()} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1 group">
            <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Catalog
          </button>
        </nav>

        {/* 2 Column Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8">

          {/* ════ 1. GALLERY (Mobile: Top, Desktop: Top-Left) ════ */}
          <div className="order-1 lg:col-span-7 lg:row-start-1 flex flex-col gap-5">

            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#12121f] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group"
              >
                {images.length > 0 ? (
                  <>
                    {images.map((img, idx) => {
                      const isAdjacent = Math.abs(idx - activeImageIdx) <= 1 ||
                        (activeImageIdx === 0 && idx === images.length - 1) ||
                        (activeImageIdx === images.length - 1 && idx === 0);

                      if (!isAdjacent && idx !== activeImageIdx) return null;

                      return (
                        <Image
                          key={idx}
                          src={getOptimizedImage(img.url, 1200)}
                          alt={`${title} ${idx + 1}`}
                          fill
                          placeholder="blur"
                          blurDataURL={generateBlurPlaceholder()}
                          className={`object-contain transition-all duration-500 ${idx === activeImageIdx ? 'opacity-100 z-10 group-hover:scale-105' : 'opacity-0 z-0 pointer-events-none'}`}
                          priority={isAdjacent}
                        />
                      );
                    })}
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg border border-white/20"
                    >
                      <IconMaximize size={24} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">No Image Available</div>
                )}



                {isSold && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] pointer-events-none z-10">
                    <div className="border-4 border-red-500 text-red-500 font-bold text-5xl md:text-7xl tracking-widest px-8 py-2 rounded-lg bg-[#0a0a12]/60 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                      SOLD
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-2xl shadow-sm flex gap-3 overflow-x-auto custom-scrollbar snap-x">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start relative ${activeImageIdx === idx ? 'border-purple-500 opacity-100 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <Image src={getOptimizedImage(img.url, 300)} alt={`${title} ${idx + 1}`} fill sizes="(max-width: 768px) 33vw, 20vw" placeholder="blur" blurDataURL={generateBlurPlaceholder()} className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ════ 3. DESCRIPTION & EMI (Mobile: Bottom, Desktop: Bottom-Left) ════ */}
          <div className="order-3 lg:col-span-7 lg:row-start-2 flex flex-col gap-5">
            {/* Description Section */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-[20px] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-5 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>About this Car</h2>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
                {car.description || `Experience the pinnacle of automotive engineering with this meticulously maintained ${title}. This vehicle blends everyday usability with unparalleled performance.`}
              </div>

              {normalizedFeatures.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5" style={{ fontFamily: 'var(--font-outfit)' }}>Key Features (Specifications)</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {normalizedFeatures.map((feat, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-center text-center hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-sm transition-all group">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{feat.key}</span>
                        <span className="text-sm sm:text-base text-gray-900 dark:text-white font-bold">{feat.value || 'Yes'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EMI Calculator */}
            <EmiCalculator carPrice={car.price || 1000000} />
          </div>

          {/* ════ 2. INFO (Mobile: Middle, Desktop: Right column spanning full height) ════ */}
          <div className="order-2 lg:col-span-5 lg:row-start-1 lg:row-span-2 relative">
            <div
              ref={rightColumnRef}
              className="lg:sticky flex flex-col gap-6"
              style={{ top: stickyTop }}
            >

              {/* Title & Price */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase border border-gray-200 dark:border-white/10">
                    Pre-Owned
                  </span>
                  {(car.registration || car.registrationState) && (
                    <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium uppercase">
                      RTO: {car.registration || car.registrationState}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-[32px] text-gray-900 dark:text-white font-bold mb-2 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {title}
                </h1>
                <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
                  {formatPrice(car.price)}
                </p>

                {/* Badges & Loan Info */}
                {(photoBadges.length > 0 || isLoanAvailable) && (
                  <div className="flex flex-wrap gap-2.5">
                    {photoBadges.map((badge, i) => (
                      <div key={`special-badge-${i}`} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-white dark:from-purple-600/20 dark:to-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-lg py-1.5 px-3 shadow-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <IconShieldCheck className="text-purple-600 dark:text-purple-400" size={16} />
                        <span className="text-xs font-bold text-purple-900 dark:text-white uppercase tracking-wider">
                          {badge}
                        </span>
                      </div>
                    ))}

                    {isLoanAvailable && (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:emerald-500/30 rounded-lg py-1.5 px-3 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <IconShieldCheck className="text-emerald-600 dark:text-emerald-400" size={16} />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Loan Available
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Specs Card (Bento Grid) */}
              <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[20px] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-[0_0_30px_rgba(124,58,237,0.05)]">
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconCalendarMonth size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Mfg. Year</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.year || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconDashboard size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Kilometers</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.kms ? formatKms(car.kms) : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconGasStation size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Fuel Type</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.fuelType || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconManualGearbox size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Transmission</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.transmission || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconUser size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Owners</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.owners || '1st Owner'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                      <IconShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Insurance</p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold">{car.insurance || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mt-1">
                <a
                  href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-sm md:text-base font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] ${isSold
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-[#25D366] text-black hover:bg-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]'
                    }`}
                  onClick={(e) => isSold && e.preventDefault()}
                >
                  <IconBrandWhatsapp size={20} />
                  {isSold ? 'Vehicle Sold' : 'Chat on WhatsApp'}
                </a>

                <a
                  href="tel:+9198985 58222"
                  className="w-full text-sm md:text-base bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 backdrop-blur-md transform active:scale-[0.98] shadow-sm dark:shadow-none"
                >
                  <IconPhoneCall size={20} />
                  Call Us Now
                </a>
              </div>

              {/* Trust Indicator */}
              <div className="flex items-center gap-3 bg-purple-50 dark:bg-[#12121f] border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 mt-1 shadow-sm dark:shadow-lg">
                <IconShieldCheck size={28} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Hariram Certified Pre-Owned</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">150-Point Inspection Completed</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ════ Similar Cars Section ════ */}
        {similarCars.length > 0 && (
          <section className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Similar Vehicles</h2>
              <Link href={`/catalog?make=${car.make}`} className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 group">
                View All {car.make} <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {similarCars.map((similarCar, i) => (
                <CarCard key={similarCar._id} car={similarCar} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ════ Lightbox ════ */}
        {isLightboxOpen && images.length > 0 && (
          <div
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center backdrop-blur-xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              aria-label="Close Lightbox"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md"
            >
              <IconX size={28} stroke={1.5} />
            </button>

            <button
              aria-label="Previous Image"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="hidden md:flex absolute left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-all z-50 backdrop-blur-md"
            >
              <IconChevronLeft size={28} stroke={1.5} />
            </button>

            <button
              aria-label="Next Image"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-all z-50 backdrop-blur-md"
            >
              <IconChevronRight size={28} stroke={1.5} />
            </button>

            <div className="relative w-full h-full max-w-7xl max-h-[85vh] p-4 md:p-12">
              {images.map((img, idx) => {
                const isAdjacent = Math.abs(idx - activeImageIdx) <= 1 ||
                  (activeImageIdx === 0 && idx === images.length - 1) ||
                  (activeImageIdx === images.length - 1 && idx === 0);

                if (!isAdjacent && idx !== activeImageIdx) return null;

                return (
                  <div key={idx} className={`absolute inset-0 transition-opacity duration-300 ${idx === activeImageIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    {!loadedImages[idx] && (
                      <div className="absolute inset-0 flex items-center justify-center z-0">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white/90 rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Image
                      src={getOptimizedImage(img.url, 1920)}
                      alt={`${title} fullscreen ${idx + 1}`}
                      fill
                      placeholder="blur"
                      blurDataURL={generateBlurPlaceholder()}
                      className="object-contain relative z-10"
                      quality={95}
                      priority={isAdjacent}
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [idx]: true }))}
                    />
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center px-4 z-50 pointer-events-none">
              <div className="w-full max-w-[400px] flex items-center justify-between md:justify-center pointer-events-auto">
                <button
                  aria-label="Previous Image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="md:hidden text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2.5 backdrop-blur-md transition-colors"
                >
                  <IconChevronLeft size={24} stroke={1.5} />
                </button>
                
                <div className="text-white text-xs md:text-sm font-medium tracking-wide whitespace-nowrap bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg mx-2 flex-shrink">
                  {activeImageIdx + 1} / {images.length} <span className="hidden sm:inline">— swipe or use arrows</span>
                </div>
                
                <button
                  aria-label="Next Image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="md:hidden text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2.5 backdrop-blur-md transition-colors"
                >
                  <IconChevronRight size={24} stroke={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

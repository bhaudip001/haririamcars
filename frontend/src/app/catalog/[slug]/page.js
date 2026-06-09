'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  IconArrowLeft, IconMaximize, IconCalendarMonth, IconDashboard, 
  IconGasStation, IconManualGearbox, IconUser, IconMapPin, 
  IconShieldCheck, IconBrandWhatsapp, IconPhoneCall, IconInfoCircle,
  IconArrowRight, IconX, IconChevronLeft, IconChevronRight
} from '@tabler/icons-react';
import api from '@/lib/api';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink } from '@/lib/utils';
import CarCard from '@/components/CarCard';
import EmiCalculator from '@/components/EmiCalculator';

export default function CarDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Smart Sticky State
  const rightColumnRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('120px');

  useEffect(() => {
    const handleResize = () => {
      if (!rightColumnRef.current) return;
      const elementHeight = rightColumnRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      if (elementHeight > windowHeight - 144) {
        // Taller than screen -> Stick to the bottom (negative top)
        const top = windowHeight - elementHeight - 24;
        setStickyTop(`${top}px`);
      } else {
        // Shorter than screen -> Stick to top
        setStickyTop('120px');
      }
    };

    // Delay slighty to ensure fonts/images are rendered
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

  useEffect(() => {
    const fetchCarAndSimilar = async () => {
      try {
        const res = await api.get(`/cars/${slug}`);
        const fetchedCar = res.data;
        setCar(fetchedCar);
        
        // Fetch similar cars
        const similarRes = await api.get(`/cars?make=${fetchedCar.make}&status=available&limit=4`);
        if (similarRes.data?.cars) {
          // Filter out the current car and limit to 3
          setSimilarCars(similarRes.data.cars.filter(c => c._id !== fetchedCar._id).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch car details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCarAndSimilar();
  }, [slug]);

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

  // Extract special badges from features/badges to show on photo and EMI section
  const specialBadgeNames = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  const regularFeatures = [];
  let isLoanAvailable = car.loanAvailable;

  const hasExplicitBadges = Array.isArray(car.badges) && car.badges.length > 0;
  if (hasExplicitBadges) {
    photoBadges.push(...car.badges.filter(b => specialBadgeNames.includes(b)));
  }

  const allFeatures = [...(car.badges || []), ...(car.features || [])];
  allFeatures.forEach(feat => {
    const isSpecialBadge = specialBadgeNames.some(b => feat.toLowerCase().includes(b.toLowerCase()));
    if (isSpecialBadge) {
      if (!hasExplicitBadges && !photoBadges.includes(feat)) photoBadges.push(feat);
    } else if (feat.toLowerCase().includes('loan available')) {
      isLoanAvailable = true;
    } else {
      if (!regularFeatures.includes(feat)) regularFeatures.push(feat);
    }
  });

  // Categorize features
  const featureCategories = {
    EXTERIOR: ['alloy', 'fog', 'sunroof', 'led', 'headlight', 'wiper', 'roof', 'spoiler', 'drl', 'mirror'],
    INTERIOR: ['leather', 'seat', 'ambient', 'ac', 'cruise', 'steering', 'upholstery', 'wood', 'dashboard', 'trim'],
    SAFETY: ['abs', 'esc', 'camera', 'sensor', 'airbag', 'ebd', 'brake', 'traction', 'hill', 'isofix', 'security'],
    CONVENIENCE: ['android', 'apple', 'wireless', 'push', 'keyless', 'bluetooth', 'navigation', 'display', 'touch', 'auto', 'power', 'window']
  };

  const categorizeFeature = (feature) => {
    const f = feature.toLowerCase();
    for (const [cat, keywords] of Object.entries(featureCategories)) {
      if (keywords.some(kw => f.includes(kw))) {
        return cat;
      }
    }
    return 'OTHER';
  };

  const groupedFeatures = {};
  regularFeatures.forEach(feat => {
    const cat = categorizeFeature(feat);
    if (!groupedFeatures[cat]) groupedFeatures[cat] = [];
    groupedFeatures[cat].push(feat);
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
            <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#12121f] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group">
              {images.length > 0 ? (
                <>
                  <Image 
                    src={getOptimizedImage(images[activeImageIdx]?.url, 1200)} 
                    alt={title} 
                    fill 
                    className="object-contain group-hover:scale-105 transition-transform duration-700" 
                    priority
                  />
                  <button 
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
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
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-2xl shadow-sm flex gap-3 overflow-x-auto custom-scrollbar snap-x">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={`shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start relative ${activeImageIdx === idx ? 'border-purple-500 opacity-100 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-[0.98]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={getOptimizedImage(img.url, 300)} alt={`${title} ${idx+1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════ 3. DESCRIPTION & EMI (Mobile: Bottom, Desktop: Bottom-Left) ════ */}
        <div className="order-3 lg:col-span-7 lg:row-start-2 flex flex-col gap-5">
          {/* Description Section */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-[20px] border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-outfit)' }}>About this Car</h2>
            <div className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap">
              {car.description || `Experience the pinnacle of automotive engineering with this meticulously maintained ${title}. This vehicle blends everyday usability with unparalleled performance.`}
            </div>

            {regularFeatures.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between cursor-pointer group" onClick={() => {}}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Features</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-6">
                  {Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category}>
                      <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        {category}
                      </h4>
                      <ul className="space-y-3">
                        {features.map((feat, i) => (
                          <li key={`${category}-${i}`} className="flex items-start gap-3">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{feat}</span>
                          </li>
                        ))}
                      </ul>
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
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-gray-200 dark:border-white/10">
                  Pre-Owned
                </span>
                {(car.registration || car.registrationState) && (
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">
                    RTO: {car.registration || car.registrationState}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[40px] text-gray-900 dark:text-white font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                {title}
              </h1>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-5">
                {formatPrice(car.price)}
              </p>
              
              {/* Badges & Loan Info */}
              {(photoBadges.length > 0 || isLoanAvailable) && (
                <div className="flex flex-wrap gap-3">
                  {photoBadges.map((badge, i) => (
                    <div key={`special-badge-${i}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-white dark:from-purple-600/20 dark:to-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl py-2 px-4 shadow-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                      <IconShieldCheck className="text-purple-600 dark:text-purple-400" size={18} />
                      <span className="text-sm font-bold text-purple-900 dark:text-white uppercase tracking-wide">
                        {badge}
                      </span>
                    </div>
                  ))}

                  {isLoanAvailable && (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl py-2 px-4 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <IconShieldCheck className="text-emerald-600 dark:text-emerald-400" size={18} />
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                        Loan Available
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Specs Card (Bento Grid) */}
            <div className="bg-white dark:bg-white/[0.03] backdrop-blur-[20px] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-[0_0_30px_rgba(124,58,237,0.05)]">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconCalendarMonth size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Mfg. Year</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.year || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconDashboard size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Kilometers</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.kms ? formatKms(car.kms) : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconGasStation size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Fuel Type</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.fuelType || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconManualGearbox size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Transmission</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.transmission || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconUser size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Owners</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.owners || '1st Owner'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                    <IconShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">Insurance</p>
                    <p className="text-base text-gray-900 dark:text-white font-semibold">{car.insurance || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-4 bg-purple-50 dark:bg-[#12121f] border border-purple-200 dark:border-purple-500/30 rounded-xl p-5 mt-2 shadow-sm dark:shadow-lg">
              <IconShieldCheck size={32} className="text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Hariram Certified Pre-Owned</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">150-Point Inspection Completed</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 mt-2">
              <a 
                href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-[0.98] ${
                  isSold 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                  : 'bg-[#25D366] text-black hover:bg-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]'
                }`}
                onClick={(e) => isSold && e.preventDefault()}
              >
                <IconBrandWhatsapp size={22} />
                {isSold ? 'Vehicle Sold' : 'Chat on WhatsApp'}
              </a>
              
              <a 
                href="tel:+919373482016"
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 backdrop-blur-md transform active:scale-[0.98] shadow-sm dark:shadow-none"
              >
                <IconPhoneCall size={22} />
                Call Us Now
              </a>
            </div>
            
          </div>
        </div>
      </div>

      {/* ════ Similar Cars Section ════ */}
      {similarCars.length > 0 && (
        <section className="mt-32 border-t border-gray-200 dark:border-white/10 pt-16">
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
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center backdrop-blur-xl">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md"
          >
            <IconX size={28} stroke={1.5} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-all z-50 backdrop-blur-md"
          >
            <IconChevronLeft size={28} stroke={1.5} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-all z-50 backdrop-blur-md"
          >
            <IconChevronRight size={28} stroke={1.5} />
          </button>

          <div className="relative w-full h-full max-w-7xl max-h-[85vh] p-4 md:p-12">
            <Image 
              src={getOptimizedImage(images[activeImageIdx]?.url, 1920)} 
              alt={`${title} fullscreen`}
              fill
              className="object-contain"
              quality={95}
              priority
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-wide">
            {activeImageIdx + 1} / {images.length} — swipe or use arrows
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

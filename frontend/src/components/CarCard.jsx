'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconCalendarEvent,
  IconGasStation,
  IconManualGearbox,
  IconMapPin,
  IconHeart,
  IconDashboard,
  IconBrandWhatsapp
} from '@tabler/icons-react';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink, generateBlurPlaceholder } from '@/lib/utils';

export default function CarCard({ car, index = 0 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!car) return null;

  const title = `${car.make} ${car.model}${car.year ? ` (${car.year})` : ''}`.trim();
  const images = car.images || [];
  const imageUrl = images.length > 0 ? (images[0].url || images[0]) : null;

  const targetBadges = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  if (car.badges && Array.isArray(car.badges)) {
    photoBadges.push(...car.badges.filter(b => targetBadges.includes(b)));
  } else if (car.features && Array.isArray(car.features)) {
    photoBadges.push(...car.features.filter(f => targetBadges.some(tag => f.toLowerCase().includes(tag.toLowerCase()))));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col w-full h-full bg-white dark:bg-[rgba(18,18,31,0.95)] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-purple-900/20 hover:scale-[1.02] transition-all duration-300"
    >
      <Link href={`/catalog/${car.slug}`} className="absolute inset-0 z-10" aria-label={`View details of ${title}`} />

      <div className="flex flex-col h-full relative z-0">
        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-[#1a1a2e]">
          {!isLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gray-200 dark:bg-white/10" />
          )}
          <Image
            src={getOptimizedImage(imageUrl, 600)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={generateBlurPlaceholder()}
            onLoad={() => setIsLoaded(true)}
            className={`object-cover group-hover:scale-110 transition-all duration-700 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          />

          {/* Top Left Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 right-2 md:right-auto z-10 flex flex-wrap gap-1.5 md:gap-2">
            {car.status === 'sold' ? (
              <span className="bg-red-600/90 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm shadow-sm">
                Sold
              </span>
            ) : (
              photoBadges.map((badge, i) => (
                <span key={i} className="bg-purple-600/90 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm shadow-sm border border-purple-500/30 whitespace-nowrap">
                  {badge}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
          <h3 className="font-['Outfit'] font-bold text-sm sm:text-base md:text-lg text-black dark:text-white truncate mb-1.5 sm:mb-3 md:mb-4 transition-colors" title={title}>
            {title}
          </h3>

          {/* Specs Row */}
          <div className="flex flex-nowrap items-center gap-1 sm:gap-1.5 md:gap-2 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs md:text-sm mt-auto whitespace-nowrap overflow-hidden font-medium transition-colors">
            <span>{car.fuelType || 'N/A'}</span>
            <span className="text-gray-300 dark:text-gray-600 sm:hidden">|</span>
            <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
            <span>{car.transmission || 'N/A'}</span>
            <span className="text-gray-300 dark:text-gray-600 sm:hidden">|</span>
            <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
            <span className="truncate">{car.kms ? formatKms(car.kms) : 'N/A'}</span>
          </div>

          <hr className="border-gray-200 dark:border-white/10 mt-2 mb-2 sm:mt-3 sm:mb-3 transition-colors" />

          {/* Price & Action */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <div className="text-purple-600 dark:text-purple-400 font-bold text-lg sm:text-xl md:text-2xl tracking-wide transition-colors">
                {formatPrice(car.price)}
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 md:gap-3 relative z-20 mt-auto">
            <div className="w-full sm:flex-1 text-center border border-purple-600 dark:border-purple-600 text-purple-600 dark:text-purple-400 bg-transparent rounded-lg sm:rounded-xl py-2 sm:py-3 md:py-2.5 text-xs sm:text-sm md:text-base font-bold group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[36px] sm:min-h-[44px]">
              View Details
            </div>
            {car.status !== 'sold' && (
              <a
                href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-white dark:text-black rounded-lg sm:rounded-xl py-2 sm:py-3 md:py-2.5 text-xs sm:text-sm md:text-base font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all duration-200 cursor-pointer min-h-[36px] sm:min-h-[44px]"
                onClick={(e) => e.stopPropagation()}
                title="Chat on WhatsApp"
              >
                <IconBrandWhatsapp size={16} className="sm:w-[18px] sm:h-[18px]" stroke={2} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

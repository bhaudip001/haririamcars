'use client';
import Link from 'next/link';
import CarImage from './CarImage';
import { useState } from 'react';
import { IconBrandWhatsapp, IconShare, IconDownload, IconSend } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { formatPrice, formatKms, getOptimizedImage, getCarInquiryLink, generateBlurPlaceholder, extractImageUrl } from '@/lib/utils';

export default function CarCard({ car, index = 0, priority = false }) {
  if (!car) return null;

  const displayYear = car.registerYear || car.year;
  const title = `${car.make} ${car.model}${displayYear ? ` (${displayYear})` : ''}`.trim();
  const images = car.images || [];
  const imageUrl = images.length > 0 ? extractImageUrl(images[0]) : null;

  const targetBadges = ['Certified', 'Peti-pack', 'Valid Vimo'];
  const photoBadges = [];
  if (car.badges && Array.isArray(car.badges)) {
    photoBadges.push(...car.badges.filter(b => targetBadges.includes(b)));
  } else if (car.features && Array.isArray(car.features)) {
    photoBadges.push(...car.features.filter(f => targetBadges.some(tag => f.toLowerCase().includes(tag.toLowerCase()))));
  }

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/catalog/${car.slug}`;
    const shareTitle = `${car.make} ${car.model} (${displayYear})`;

    // Improved, highly professional text designed specifically for WhatsApp formatting
    const shareText = `🚗 ✨ *Hariram Motors Premium Inventory* ✨ 🚗\n\nCheck out this beautifully maintained *${shareTitle}*!\n💰 Price: *${formatPrice(car.price)}*\n\nClick the link below for full details and more photos:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl, // WhatsApp will automatically pull the car's photo for the preview thumbnail using this URL
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyFallback(shareUrl);
        }
      }
    } else {
      copyFallback(shareUrl);
    }
  };

  const copyFallback = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Link Copied!', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleShareImages = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!car.images || car.images.length === 0) {
      toast.error('No images available');
      return;
    }

    const toastId = toast.loading('Preparing images for sharing...');
    const shareTitle = `${car.make} ${car.model} (${displayYear})`;

    try {
      const filesArray = [];
      // Limit to 10 images for share API to prevent payload too large errors
      const numImages = Math.min(car.images.length, 10);

      for (let i = 0; i < numImages; i++) {
        const url = extractImageUrl(car.images[i]);
        // Use optimized image for sharing to save bandwidth and prevent memory issues
        const optimizedUrl = getOptimizedImage(url, 800);
        const response = await fetch(optimizedUrl);
        const blob = await response.blob();
        const file = new File([blob], `${car.make}-${car.model}-image-${i + 1}.jpg`, {
          type: blob.type || 'image/jpeg',
        });
        filesArray.push(file);
      }

      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
          title: shareTitle,
          text: `Check out this ${shareTitle}!`,
        });
        toast.success('Shared successfully!', { id: toastId });
      } else {
        toast.error('Direct image sharing not supported on this device. Use the download button instead.', { id: toastId });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share images.', { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    }
  };

  const handleDownloadImages = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!car.images || car.images.length === 0) {
      toast.error('No images available');
      return;
    }

    toast.success('Downloading images... Please allow multiple downloads if prompted.', { duration: 5000 });

    car.images.forEach((img, i) => {
      setTimeout(async () => {
        try {
          const url = extractImageUrl(img);
          const response = await fetch(getOptimizedImage(url, 1200));
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${car.make}-${car.model}-${i + 1}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (err) {
          // Fallback if fetch fails (e.g. CORS)
          const url = extractImageUrl(img);
          const link = document.createElement('a');
          link.href = getOptimizedImage(url, 1200);
          link.download = `${car.make}-${car.model}-${i + 1}.jpg`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, i * 600); // Stagger downloads to prevent browser blocking
    });
  };

  return (
    <div
      className="group relative flex flex-col w-full h-full bg-white dark:bg-[rgba(18,18,31,0.95)] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-purple-900/20 hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300"
    >
      <Link href={`/catalog/${car.slug}`} className="absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#12121f] outline-none rounded-2xl" aria-label={`View details of ${title}`} />

      <div className="flex flex-col h-full relative">
        {/* Image Area */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl bg-black/10 dark:bg-[#1a1a2e]">
          {/* Main Image - Now using object-contain to prevent cutting off */}
          <CarImage
            src={imageUrl ? getOptimizedImage(imageUrl, 600) : null}
            alt={title}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-all duration-700"
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

          {/* Top Right Buttons */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 flex flex-col gap-2 pointer-events-auto">
            {/* Share Link */}
            <button
              onClick={handleShare}
              title="Share Link"
              className="bg-white/20 hover:bg-white/40 dark:bg-black/40 dark:hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-lg border border-white/30 flex items-center justify-center"
            >
              <IconShare size={18} stroke={2.5} />
            </button>
            {/* Share Images Directly (Hidden on mobile) */}
            <button
              onClick={handleShareImages}
              title="Share Images to WhatsApp/Others"
              className="hidden md:flex bg-white/20 hover:bg-white/40 dark:bg-black/40 dark:hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-lg border border-white/30 items-center justify-center"
            >
              <IconSend size={18} stroke={2.5} />
            </button>
            {/* Download Images (Hidden on mobile) */}
            <button
              onClick={handleDownloadImages}
              title="Download All Images"
              className="hidden md:flex bg-white/20 hover:bg-white/40 dark:bg-black/40 dark:hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all active:scale-95 shadow-lg border border-white/30 items-center justify-center"
            >
              <IconDownload size={18} stroke={2.5} />
            </button>
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
            <span>{car.transmission || 'N/A'}</span>
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
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 md:gap-3 relative z-20 mt-auto pointer-events-none">
            <div className="w-full sm:flex-1 text-center border border-purple-600 dark:border-purple-600 text-purple-600 dark:text-purple-400 bg-transparent rounded-lg sm:rounded-xl py-2 sm:py-3 md:py-2.5 text-xs sm:text-sm md:text-base font-bold group-hover:bg-purple-600 group-hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[36px] sm:min-h-[44px]">
              View Details
            </div>
            {car.status !== 'sold' && (
              <a
                href={getCarInquiryLink(car, process.env.NEXT_PUBLIC_WHATSAPP || '+919898558222')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-white dark:text-black rounded-lg sm:rounded-xl py-2 sm:py-3 md:py-2.5 text-xs sm:text-sm md:text-base font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all duration-200 cursor-pointer min-h-[36px] sm:min-h-[44px] pointer-events-auto"
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
    </div>
  );
}

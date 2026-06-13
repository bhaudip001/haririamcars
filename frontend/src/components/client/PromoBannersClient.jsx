'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function PromoBannersClient({ banners }) {
  const [bannerRef, bannerApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

  const scrollBannerPrev = useCallback(() => bannerApi && bannerApi.scrollPrev(), [bannerApi]);
  const scrollBannerNext = useCallback(() => bannerApi && bannerApi.scrollNext(), [bannerApi]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <p className="text-purple-600 dark:text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 text-center transition-colors">OFFERS & PROMOTIONS</p>
      <h2 className="text-3xl md:text-[36px] text-black dark:text-white font-bold leading-tight mb-10 text-center transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
        Latest Deals
      </h2>

      {banners.length === 1 ? (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full group">
          {banners[0].link ? (
            <a href={banners[0].link} className="block w-full h-full">
              <Image src={banners[0].desktopImageUrl} alt="Promo" width={1920} height={800} className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-105" />
              <Image src={banners[0].mobileImageUrl} alt="Promo" width={800} height={800} className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-105" />
            </a>
          ) : (
            <>
              <Image src={banners[0].desktopImageUrl} alt="Promo" width={1920} height={800} className="w-full h-auto hidden sm:block" />
              <Image src={banners[0].mobileImageUrl} alt="Promo" width={800} height={800} className="w-full h-auto sm:hidden" />
            </>
          )}
        </div>
      ) : banners.length === 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b._id} className="relative rounded-2xl overflow-hidden shadow-xl w-full group">
              {b.link ? (
                <a href={b.link} className="block w-full h-full">
                  <Image src={b.desktopImageUrl} alt="Promo" width={1200} height={500} className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-[1.02]" />
                  <Image src={b.mobileImageUrl} alt="Promo" width={600} height={600} className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-[1.02]" />
                </a>
              ) : (
                <>
                  <Image src={b.desktopImageUrl} alt="Promo" width={1200} height={500} className="w-full h-auto hidden sm:block" />
                  <Image src={b.mobileImageUrl} alt="Promo" width={600} height={600} className="w-full h-auto sm:hidden" />
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative group/carousel">
          <div className="overflow-hidden rounded-2xl" ref={bannerRef}>
            <div className="flex">
              {banners.map((b) => (
                <div key={b._id} className="flex-[0_0_100%] min-w-0 relative w-full group">
                  {b.link ? (
                    <a href={b.link} className="block w-full h-full">
                      <Image src={b.desktopImageUrl} alt="Promo" width={1200} height={500} className="w-full h-auto hidden sm:block transition-transform duration-700 group-hover:scale-[1.02]" />
                      <Image src={b.mobileImageUrl} alt="Promo" width={600} height={600} className="w-full h-auto sm:hidden transition-transform duration-700 group-hover:scale-[1.02]" />
                    </a>
                  ) : (
                    <>
                      <Image src={b.desktopImageUrl} alt="Promo" width={1200} height={500} className="w-full h-auto hidden sm:block" />
                      <Image src={b.mobileImageUrl} alt="Promo" width={600} height={600} className="w-full h-auto sm:hidden" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button aria-label="Previous Banner" onClick={scrollBannerPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur border border-gray-200 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white dark:hover:bg-black/80 shadow-md dark:shadow-none">
            <IconChevronLeft size={20} />
          </button>
          <button aria-label="Next Banner" onClick={scrollBannerNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur border border-gray-200 dark:border-white/10 flex items-center justify-center text-black dark:text-white opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white dark:hover:bg-black/80 shadow-md dark:shadow-none">
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

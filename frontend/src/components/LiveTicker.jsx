'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import api from '@/lib/api';
import { formatPrice, extractImageUrl, getOptimizedImage } from '@/lib/utils';

export default function LiveTicker() {
  const [latestCar, setLatestCar] = useState(null);

  useEffect(() => {
    const fetchLatestCar = async () => {
      try {
        const response = await api.get('/cars?limit=1');
        if (response.data && response.data.cars && response.data.cars.length > 0) {
          setLatestCar(response.data.cars[0]);
        }
      } catch (error) {
        console.error('Failed to fetch latest car for ticker:', error);
      }
    };
    fetchLatestCar();
  }, []);

  if (!latestCar) return null;

  const targetUrl = latestCar.slug ? `/catalog/${latestCar.slug}` : '/catalog';
  const rawImage = latestCar.images && latestCar.images.length > 0 ? latestCar.images[0] : null;
  const imageUrl = rawImage ? extractImageUrl(rawImage) : null;
  const thumbUrl = imageUrl ? getOptimizedImage(imageUrl, 200) : null;
  const displayYear = latestCar.registerYear || latestCar.year;
  const carTitle = `${latestCar.make} ${latestCar.model}${displayYear ? ` (${displayYear})` : ''}`;

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { left: -150%; }
          15% { left: 150%; }
          100% { left: 150%; }
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          transform: skewX(-25deg);
          animation: shine 6s infinite;
          pointer-events: none;
          z-index: 30;
        }
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 4s linear infinite;
        }
      `}</style>

      <div className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-8 relative z-20">
        <Link
          href={targetUrl}
          className="group block relative max-w-6xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl sm:rounded-3xl"
        >
          {/* Multi-tone ambient backlight aura matching Showroom Video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-indigo-600/30 rounded-[24px] sm:rounded-[30px] blur-xl opacity-60 dark:opacity-75 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 pointer-events-none" />

          {/* Main Card */}
          <div className="relative flex w-full min-h-[64px] sm:min-h-[76px] bg-gradient-to-r from-[#0d0d18]/95 via-[#131126]/95 to-[#0d0d18]/95 backdrop-blur-xl overflow-hidden items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-white/15 group-hover:border-purple-500/50 shadow-2xl shadow-purple-950/20 dark:shadow-black/70 shimmer-effect transition-all duration-300 group-hover:scale-[1.008]">

            {/* Glowing background gradient orb in center */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
              <div className="absolute w-[60%] sm:w-[40%] h-[200%] bg-purple-900/25 blur-[40px] rounded-[100%]"></div>
              <div className="absolute w-[30%] sm:w-[20%] h-full bg-purple-500/15 blur-[25px] rounded-[100%] animate-pulse mix-blend-screen"></div>
            </div>

            {/* Left: Live Pulse Status Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 z-10 flex-shrink-0">
              <div className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="text-[10px] sm:text-[12px] font-black tracking-wider uppercase text-white drop-shadow-sm whitespace-nowrap">
                  Just Arrived
                </span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-purple-300/70">
                <IconSparkles size={13} className="text-purple-400" />
                Showroom
              </span>
            </div>

            {/* Center: Car Details with Thumbnail */}
            <div className="flex-1 flex items-center justify-center px-2 sm:px-4 z-10 min-w-0">
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-3.5">
                {thumbUrl && (
                  <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-white/20 shadow-md flex-shrink-0 group-hover:border-purple-400/80 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbUrl} alt={carTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap justify-center leading-tight">
                  <span className="text-white/70 text-sm font-medium">
                    We&apos;ve just added
                  </span>
                  <span className="text-white font-extrabold text-base lg:text-lg tracking-tight drop-shadow-sm">
                    {latestCar.make} {latestCar.model}
                  </span>
                  {displayYear && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-xs font-semibold tracking-wide border border-white/10">
                      {displayYear}
                    </span>
                  )}
                  <span className="text-white/70 text-sm font-medium">
                    to our showroom!
                  </span>
                  {latestCar.price && (
                    <span className="ml-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-sm lg:text-base drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
                      {formatPrice(latestCar.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Layout (Clean & Balanced) */}
              <div className="flex sm:hidden flex-col items-center justify-center text-center px-1 truncate">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 font-extrabold text-[13px] leading-tight truncate max-w-[190px] drop-shadow-[0_0_10px_rgba(168,85,247,0.7)] animate-text-shimmer">
                  {latestCar.make} {latestCar.model} {displayYear ? `(${displayYear})` : ''}
                </span>
                {latestCar.price && (
                  <span className="text-emerald-400 font-black text-[12px] leading-tight mt-0.5 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                    {formatPrice(latestCar.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Elegant Circular Action Cue (NO "View Detail" text) */}
            <div className="flex items-center gap-2 z-10 flex-shrink-0 pl-1">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 text-purple-300 group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-all duration-300">
                <IconArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

          </div>
        </Link>
      </div>
    </>
  );
}

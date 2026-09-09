'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { IconCalendar, IconTag } from '@tabler/icons-react';

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

  const carYear = latestCar.year || latestCar.registerYear;

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { left: -150%; }
          18% { left: 150%; }
          100% { left: 150%; }
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
          transform: skewX(-20deg);
          animation: shine 5.5s infinite;
          pointer-events: none;
          z-index: 30;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes bar-wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.45; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .animate-bar-1 { animation: bar-wave 1.2s ease-in-out infinite; }
        .animate-bar-2 { animation: bar-wave 1.2s ease-in-out infinite 0.2s; }
        .animate-bar-3 { animation: bar-wave 1.2s ease-in-out infinite 0.4s; }

        @keyframes star-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 8px #fbbf24); }
        }
        .animate-star {
          animation: star-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MOBILE VIEW (< 768px): Compact Image-Mockup Showcase with Decreased Height
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full py-2.5 px-3 relative z-20">
        <div className="relative max-w-lg mx-auto">
          {/* Ambient background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-amber-500/15 to-blue-600/20 rounded-2xl blur-lg opacity-70 pointer-events-none" />

          {/* Compact Main Card (Slim Height) */}
          <div className="relative w-full rounded-2xl bg-[#030712] border border-blue-900/30 shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden shimmer-effect select-none py-3.5 px-3">

            {/* Bottom-Left Wing: Golden-Amber Fluid Wave with Cobalt Blue Flare */}
            <div className="absolute bottom-0 left-0 w-24 h-16 pointer-events-none z-0 overflow-hidden">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blGoldGradMobile" x1="0%" y1="100%" x2="80%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <filter id="blGlowMobile" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                  </filter>
                </defs>
                <path d="M -10 30 Q 60 75 160 170" stroke="#2563eb" strokeWidth="12" opacity="0.6" filter="url(#blGlowMobile)" />
                <path d="M -10 30 Q 60 75 160 170" stroke="#38bdf8" strokeWidth="2" opacity="0.85" />
                <path d="M -10 65 Q 45 110 125 170 L -10 170 Z" fill="url(#blGoldGradMobile)" opacity="0.95" />
                <path d="M -10 65 Q 45 110 125 170" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" />
              </svg>
            </div>

            {/* Top-Right Wing: Golden-Amber Fluid Wave with Cobalt Blue Flare */}
            <div className="absolute top-0 right-0 w-24 h-16 pointer-events-none z-0 overflow-hidden">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trGoldGradMobile" x1="100%" y1="0%" x2="20%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <filter id="trGlowMobile" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                  </filter>
                </defs>
                <path d="M 210 130 Q 140 85 40 -10" stroke="#2563eb" strokeWidth="12" opacity="0.6" filter="url(#trGlowMobile)" />
                <path d="M 210 130 Q 140 85 40 -10" stroke="#38bdf8" strokeWidth="2" opacity="0.85" />
                <path d="M 210 95 Q 155 50 75 -10 L 210 -10 Z" fill="url(#trGoldGradMobile)" opacity="0.95" />
                <path d="M 210 95 Q 155 50 75 -10" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" />
              </svg>
            </div>

            {/* Dot Matrix (Top-Left 6x3) */}
            <div className="absolute top-2.5 left-3 grid grid-cols-6 gap-1 opacity-20 pointer-events-none z-0">
              {[...Array(18)].map((_, i) => (
                <span key={`tl-m-${i}`} className="w-0.5 h-0.5 rounded-full bg-slate-300" />
              ))}
            </div>

            {/* Dot Matrix (Bottom-Right 6x3) */}
            <div className="absolute bottom-2.5 right-3 grid grid-cols-6 gap-1 opacity-20 pointer-events-none z-0">
              {[...Array(18)].map((_, i) => (
                <span key={`br-m-${i}`} className="w-0.5 h-0.5 rounded-full bg-slate-300" />
              ))}
            </div>

            {/* Compact Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">

              {/* 1. Header: Inline Sparkle + "— JUST ARRIVED —" */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <svg
                  className="w-3.5 h-3.5 text-amber-400 animate-star drop-shadow-[0_0_6px_#fbbf24]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                </svg>
                <span className="w-4 h-[1px] bg-gradient-to-r from-transparent to-amber-400"></span>
                <span className="text-amber-400 font-extrabold text-[10.5px] tracking-[0.25em] uppercase drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
                  Just Arrived
                </span>
                <span className="w-4 h-[1px] bg-gradient-to-l from-transparent to-amber-400"></span>
              </div>

              {/* 2. Car Name: Suzuki Ertiga */}
              <h3 className="font-['Outfit'] font-black text-2xl tracking-tight leading-tight my-0.5 text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                {latestCar.make} {latestCar.model}
              </h3>

              {/* 3. Bottom Badges: [ 📅 2018 ] | [ 🏷️ | ₹7.50 Lakh ] */}
              <div className="flex items-center justify-center gap-2 mt-2">
                {/* Year Badge */}
                {carYear && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050c20]/90 border border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <IconCalendar size={14} className="text-amber-400 flex-shrink-0" stroke={2.2} />
                    <span className="text-white font-black text-xs tracking-tight">
                      {carYear}
                    </span>
                  </div>
                )}

                {/* Subtle Divider */}
                {carYear && latestCar.price && (
                  <span className="w-px h-3.5 bg-slate-700/80"></span>
                )}

                {/* Price Badge */}
                {latestCar.price && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs tracking-tight shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300">
                    <IconTag size={13} className="text-slate-950 flex-shrink-0" stroke={2.5} />
                    <span className="w-px h-3 bg-slate-950/30 mx-0.5"></span>
                    <span>{formatPrice(latestCar.price)}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          LAPTOP / DESKTOP VIEW (>= 768px): Original Panoramic Luxury Ribbon Design
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block w-full py-4 sm:py-5 px-6 lg:px-8 relative z-20">
        <div className="relative max-w-5xl mx-auto">
          {/* Multi-tone ambient atmosphere aura matching Showroom Video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-fuchsia-500/20 to-indigo-600/30 rounded-full blur-xl opacity-80 pointer-events-none" />

          {/* Main Panoramic Card Container */}
          <div className="relative flex items-center w-full rounded-full bg-gradient-to-r from-[#090815] via-[#100c22] to-[#090815] border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden shimmer-effect select-none">

            {/* Glowing background gradient core in center */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
              <div className="absolute w-[45%] h-[200%] bg-purple-900/30 blur-[45px] rounded-[100%]"></div>
              <div className="absolute w-[22%] h-full bg-fuchsia-500/15 blur-[28px] rounded-[100%] animate-pulse-slow mix-blend-screen"></div>
            </div>

            {/* Precision Laser Top Highlight */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent pointer-events-none" />

            {/* Panoramic Content Ribbon */}
            <div className="flex items-center justify-between gap-6 px-8 py-3.5 relative z-10 w-full">
              {/* Left Side: Live Radar Beacon & Frequency Telemetry */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                  </span>
                  {/* Live Frequency bars */}
                  <div className="flex items-center gap-[2.5px] h-3.5">
                    <span className="w-[2px] h-3 rounded-full bg-emerald-400/70 animate-bar-1 origin-bottom"></span>
                    <span className="w-[2px] h-4 rounded-full bg-emerald-400 animate-bar-2 origin-bottom"></span>
                    <span className="w-[2px] h-2.5 rounded-full bg-emerald-400/80 animate-bar-3 origin-bottom"></span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">
                    Just Arrived
                  </span>
                </div>
              </div>

              {/* Center: Car Details with Premium Typography */}
              <div className="flex-1 flex items-center justify-center text-center px-2">
                <p className="text-white/70 text-[15px] font-normal tracking-wide">
                  We&apos;ve just added a{' '}
                  <span className="text-white font-black text-[18px] lg:text-[19px] tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.35)] px-1">
                    {latestCar.make} {latestCar.model}
                  </span>{' '}
                  {carYear && (
                    <span className="text-purple-300 font-bold text-[14px] mx-0.5">
                      ({carYear})
                    </span>
                  )}{' '}
                  to our showroom!
                </p>
              </div>

              {/* Right: Gemstone Emerald Price */}
              {latestCar.price && (
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-black text-[15px] shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                    {formatPrice(latestCar.price)}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

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
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 10px #fbbf24); }
        }
        .animate-star {
          animation: star-pulse 2.5s ease-in-out infinite;
        }
        @keyframes subtle-shimmer {
          0% { left: -150%; }
          25% { left: 150%; }
          100% { left: 150%; }
        }
        .card-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transform: skewX(-20deg);
          animation: subtle-shimmer 7s infinite ease-in-out;
          pointer-events: none;
          z-index: 20;
        }
      `}</style>

      <div className="w-full py-4 sm:py-6 px-3 sm:px-6 lg:px-8 relative z-20">
        <div className="relative max-w-4xl mx-auto">
          {/* Ambient background glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/20 via-amber-500/15 to-blue-600/20 rounded-[28px] sm:rounded-[36px] blur-xl opacity-70 pointer-events-none" />

          {/* Main Card */}
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] bg-[#030712] border border-blue-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden card-shimmer select-none py-6 sm:py-8 px-4 sm:px-10">

            {/* ══════════════ CORNER DECORATIVE WINGS (SVG) ══════════════ */}

            {/* Bottom-Left Wing: Golden-Amber Fluid Wave with Cobalt Blue Flare */}
            <div className="absolute bottom-0 left-0 w-36 sm:w-56 h-28 sm:h-44 pointer-events-none z-0 overflow-hidden">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blGoldGrad" x1="0%" y1="100%" x2="80%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="blBlueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                  </linearGradient>
                  <filter id="blGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Sapphire Blue Outer Glow Flare */}
                <path
                  d="M -10 30 Q 60 75 160 170"
                  stroke="#2563eb"
                  strokeWidth="14"
                  opacity="0.65"
                  filter="url(#blGlow)"
                />
                <path
                  d="M -10 30 Q 60 75 160 170"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Golden Fluid Aerodynamic Wing */}
                <path
                  d="M -10 65 Q 45 110 125 170 L -10 170 Z"
                  fill="url(#blGoldGrad)"
                  opacity="0.98"
                />
                {/* Luminous Top Edge Stroke on Gold Wing */}
                <path
                  d="M -10 65 Q 45 110 125 170"
                  stroke="#fef08a"
                  strokeWidth="3"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* Top-Right Wing: Golden-Amber Fluid Wave with Cobalt Blue Flare */}
            <div className="absolute top-0 right-0 w-36 sm:w-56 h-28 sm:h-44 pointer-events-none z-0 overflow-hidden">
              <svg viewBox="0 0 200 160" fill="none" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trGoldGrad" x1="100%" y1="0%" x2="20%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <filter id="trGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Sapphire Blue Outer Glow Flare */}
                <path
                  d="M 210 130 Q 140 85 40 -10"
                  stroke="#2563eb"
                  strokeWidth="14"
                  opacity="0.65"
                  filter="url(#trGlow)"
                />
                <path
                  d="M 210 130 Q 140 85 40 -10"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  opacity="0.9"
                />

                {/* Golden Fluid Aerodynamic Wing */}
                <path
                  d="M 210 95 Q 155 50 75 -10 L 210 -10 Z"
                  fill="url(#trGoldGrad)"
                  opacity="0.98"
                />
                {/* Luminous Top Edge Stroke on Gold Wing */}
                <path
                  d="M 210 95 Q 155 50 75 -10"
                  stroke="#fef08a"
                  strokeWidth="3"
                  opacity="0.9"
                />
              </svg>
            </div>

            {/* ══════════════ DOT MATRIX PATTERNS (TOP-LEFT & BOTTOM-RIGHT) ══════════════ */}
            {/* Top-Left Dot Matrix (6x3) */}
            <div className="absolute top-4 sm:top-5 left-5 sm:left-7 grid grid-cols-6 gap-1.5 sm:gap-2 opacity-25 pointer-events-none z-0">
              {[...Array(18)].map((_, i) => (
                <span key={`tl-${i}`} className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-300" />
              ))}
            </div>

            {/* Bottom-Right Dot Matrix (6x3) */}
            <div className="absolute bottom-4 sm:bottom-5 right-5 sm:right-7 grid grid-cols-6 gap-1.5 sm:gap-2 opacity-25 pointer-events-none z-0">
              {[...Array(18)].map((_, i) => (
                <span key={`br-${i}`} className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-300" />
              ))}
            </div>

            {/* ══════════════ CONTENT LAYER ══════════════ */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center">

              {/* 1. Header: 4-Point Star + "— JUST ARRIVED —" */}
              <div className="flex flex-col items-center justify-center mb-2 sm:mb-3">
                {/* Golden 4-point sparkle star */}
                <div className="mb-1.5">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400 animate-star drop-shadow-[0_0_8px_#fbbf24]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                  </svg>
                </div>

                {/* Wing Lines + Text */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="w-6 sm:w-10 h-[1.5px] bg-gradient-to-r from-transparent to-amber-400"></span>
                  <span className="text-amber-400 font-extrabold text-[11px] sm:text-xs md:text-[13px] tracking-[0.25em] sm:tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    Just Arrived
                  </span>
                  <span className="w-6 sm:w-10 h-[1.5px] bg-gradient-to-l from-transparent to-amber-400"></span>
                </div>
              </div>

              {/* 2. Main Vehicle Title (Suzuki Ertiga) */}
              <h3 className="font-['Outfit'] font-black text-3xl sm:text-5xl md:text-[54px] text-white tracking-tight leading-tight my-1 sm:my-2 drop-shadow-[0_4px_20px_rgba(255,255,255,0.25)]">
                {latestCar.make} {latestCar.model}
              </h3>

              {/* 3. Bottom Badges: [ 📅 2018 ] | [ 🏷️ | ₹7.50 Lakh ] */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap mt-3 sm:mt-5">
                {/* Year Pill: Dark Navy Glass + Gold Border */}
                {carYear && (
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-[#050c20]/90 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
                    <IconCalendar size={18} className="text-amber-400 flex-shrink-0" stroke={2.2} />
                    <span className="text-white font-black text-sm sm:text-lg tracking-tight">
                      {carYear}
                    </span>
                  </div>
                )}

                {/* Subtle Divider (Desktop/Tablet) */}
                {carYear && latestCar.price && (
                  <span className="hidden sm:block w-px h-6 bg-slate-700/80 mx-0.5"></span>
                )}

                {/* Price Pill: Radiant Glowing Amber-Gold Gradient */}
                {latestCar.price && (
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm sm:text-lg tracking-tight shadow-[0_0_25px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-amber-300">
                    <IconTag size={18} className="text-slate-950 flex-shrink-0" stroke={2.5} />
                    <span className="w-px h-4 bg-slate-950/30 mx-0.5"></span>
                    <span>{formatPrice(latestCar.price)}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

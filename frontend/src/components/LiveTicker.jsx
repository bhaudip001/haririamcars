'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

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
      `}</style>

      <div className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="relative max-w-5xl mx-auto">
          {/* Multi-tone ambient atmosphere aura matching Showroom Video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-fuchsia-500/20 to-indigo-600/30 rounded-2xl md:rounded-full blur-xl opacity-80 pointer-events-none" />

          {/* Main Card Container */}
          <div className="relative flex items-center w-full rounded-2xl md:rounded-full bg-gradient-to-r from-[#090815] via-[#100c22] to-[#090815] border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden shimmer-effect select-none">

            {/* Glowing background gradient core in center */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
              <div className="absolute w-[65%] sm:w-[45%] h-[200%] bg-purple-900/30 blur-[45px] rounded-[100%]"></div>
              <div className="absolute w-[35%] sm:w-[22%] h-full bg-fuchsia-500/15 blur-[28px] rounded-[100%] animate-pulse-slow mix-blend-screen"></div>
            </div>

            {/* Precision Laser Top Highlight */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent pointer-events-none" />

            {/* ══════════════ MOBILE VIEW (< 768px): Executive Telemetry HUD ══════════════ */}
            <div className="flex md:hidden flex-col w-full px-4 py-3.5 relative z-10">
              {/* Telemetry Status Bar: Live Radar & Frequency Bars (Left) + Gemstone Price (Right) */}
              <div className="flex items-center justify-between w-full">
                {/* Left: Integrated Live Telemetry Beacon (No bulky pill button) */}
                <div className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  </span>
                  {/* Dynamic soundwave frequency bars */}
                  <div className="flex items-center gap-[2px] h-3">
                    <span className="w-[2px] h-2.5 rounded-full bg-emerald-400/70 animate-bar-1 origin-bottom"></span>
                    <span className="w-[2px] h-3.5 rounded-full bg-emerald-400 animate-bar-2 origin-bottom"></span>
                    <span className="w-[2px] h-2 rounded-full bg-emerald-400/80 animate-bar-3 origin-bottom"></span>
                  </div>
                  <span className="text-[10.5px] font-black uppercase tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-200">
                    Just Arrived
                  </span>
                </div>

                {/* Right: Radiant Emerald Gemstone Price */}
                {latestCar.price && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-extrabold text-xs shadow-[0_0_12px_rgba(16,185,129,0.2)] backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                    <span>{formatPrice(latestCar.price)}</span>
                  </div>
                )}
              </div>

              {/* Hero Announcement Copy: Natural flowing typography with zero awkward wrapping */}
              <div className="text-left mt-2 px-0.5">
                <p className="text-white/70 text-[13.5px] leading-snug font-normal">
                  We&apos;ve just added a{' '}
                  <span className="text-white font-extrabold text-[15.5px] tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                    {latestCar.make} {latestCar.model}
                  </span>{' '}
                  {carYear && (
                    <span className="text-purple-300 font-bold text-[13.5px]">
                      ({carYear})
                    </span>
                  )}{' '}
                  to our showroom!
                </p>
              </div>
            </div>

            {/* ══════════════ DESKTOP VIEW (>= 768px): Panoramic Luxury Ribbon ══════════════ */}
            <div className="hidden md:flex items-center justify-between gap-6 px-8 py-3.5 relative z-10 w-full">
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

'use client';

import { useState, useEffect } from 'react';
import { IconSparkles } from '@tabler/icons-react';
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
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
      `}</style>

      <div className="w-full py-3 sm:py-5 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="relative max-w-6xl mx-auto">
          {/* Multi-tone ambient backlight aura matching Showroom Video */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/35 via-fuchsia-500/25 to-indigo-600/35 rounded-[26px] sm:rounded-[32px] blur-xl opacity-70 dark:opacity-85 pointer-events-none" />

          {/* Main Card */}
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 w-full min-h-[64px] sm:min-h-[76px] px-4 sm:px-7 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0c0a18] via-[#141029] to-[#0c0a18] border border-purple-500/25 dark:border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.18)] overflow-hidden shimmer-effect select-none">

            {/* Glowing background gradient core in center */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
              <div className="absolute w-[65%] sm:w-[45%] h-[200%] bg-purple-900/30 blur-[45px] rounded-[100%]"></div>
              <div className="absolute w-[35%] sm:w-[22%] h-full bg-fuchsia-500/15 blur-[28px] rounded-[100%] animate-pulse-slow mix-blend-screen"></div>
            </div>

            {/* Left Side: Live Radar Beacon & Badge */}
            <div className="flex items-center gap-2.5 z-10 flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/25 via-fuchsia-600/20 to-purple-600/25 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white drop-shadow-sm">
                  Just Arrived
                </span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-purple-300/70">
                <IconSparkles size={13} className="text-purple-400" />
                To Showroom
              </span>
            </div>

            {/* Center: Car Details with Premium Typography & Glowing Price */}
            <div className="flex-1 flex items-center justify-center text-center z-10 min-w-0 px-2">
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center leading-relaxed">
                <span className="text-white/75 text-[15px] font-normal tracking-wide">
                  We&apos;ve just added a
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-50 to-white font-black text-lg lg:text-xl tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)] px-1">
                  {latestCar.make} {latestCar.model}
                </span>
                {carYear && (
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-purple-200 text-xs font-bold border border-white/10 shadow-sm">
                    ({carYear})
                  </span>
                )}
                <span className="text-white/75 text-[15px] font-normal tracking-wide pl-1">
                  to our showroom!
                </span>
                {latestCar.price && (
                  <span className="ml-2.5 inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-400 font-black text-sm lg:text-base shadow-[0_0_15px_rgba(52,211,153,0.35)] drop-shadow">
                    {formatPrice(latestCar.price)}
                  </span>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="flex sm:hidden flex-col items-center justify-center gap-1.5 py-0.5 text-center">
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <span className="text-white/70 text-xs font-medium">We&apos;ve just added a</span>
                  <span className="text-white font-black text-sm tracking-tight drop-shadow-sm">
                    {latestCar.make} {latestCar.model}
                  </span>
                  {carYear && (
                    <span className="text-purple-300/90 text-xs font-bold">
                      ({carYear})
                    </span>
                  )}
                </div>
                {latestCar.price && (
                  <span className="inline-flex items-center px-3.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-400 font-black text-xs shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                    {formatPrice(latestCar.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Subtle Automotive Glowing Pulse Bars (Telemetry Balance) */}
            <div className="hidden lg:flex items-center gap-1.5 z-10 flex-shrink-0 opacity-70">
              <span className="w-1 h-3.5 rounded-full bg-purple-400/50 animate-pulse"></span>
              <span className="w-1 h-5 rounded-full bg-purple-400/80 animate-pulse delay-75"></span>
              <span className="w-1 h-6 rounded-full bg-fuchsia-400 animate-pulse delay-150"></span>
              <span className="w-1 h-5 rounded-full bg-purple-400/80 animate-pulse delay-75"></span>
              <span className="w-1 h-3.5 rounded-full bg-purple-400/50 animate-pulse"></span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

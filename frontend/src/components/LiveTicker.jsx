'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

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

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-ticker {
          animation: ticker-scroll 20s linear infinite;
        }
        /* Pause animation on hover for better readability */
        .ticker-container:hover .animate-ticker {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-container bg-gradient-to-r from-[#6d28d9] via-[#4c1d95] to-[#6d28d9] text-white overflow-hidden relative flex items-center h-10 sm:h-12 w-full z-[60] shadow-md border-b border-white/10">
        {/* Live Badge Overlay */}
        <div className="absolute left-0 bg-red-600 text-white z-10 px-3 sm:px-5 h-full flex items-center font-['Outfit'] font-bold text-[11px] sm:text-sm uppercase tracking-wider shadow-[8px_0_15px_rgba(0,0,0,0.4)]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
          Live
        </div>
        
        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="animate-ticker flex whitespace-nowrap items-center w-max pl-4">
            <span className="text-[13px] sm:text-[15px] font-medium tracking-wide">
              🔥 Just Listed: <strong className="text-[#fde047] ml-1">{latestCar.make} {latestCar.model} {latestCar.year ? `(${latestCar.year})` : ''}</strong>
            </span>
            <span className="mx-3 text-white/50">•</span>
            <span className="text-[13px] sm:text-[15px] font-medium text-white/90">
              Hurry Up! This deal won't last long.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

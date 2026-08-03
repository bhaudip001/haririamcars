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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: skewX(-25deg);
          animation: shine 5s infinite;
          pointer-events: none;
          z-index: 20;
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(124, 58, 237, 0.3); border-bottom-color: rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 0 25px rgba(255, 183, 132, 0.4); border-bottom-color: rgba(255, 183, 132, 0.6); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3.5s infinite;
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-float-badge {
          animation: float-badge 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="relative flex justify-center items-center py-3 sm:py-3.5 w-full z-30 overflow-hidden bg-[#0a0a12] border-b animate-glow-pulse shimmer-effect group cursor-pointer">
        {/* Animated background gradient blob */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent blur-2xl transform group-hover:scale-125 transition-transform duration-700 animate-pulse"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-5xl gap-3 sm:gap-6 relative z-10 px-4">
          {/* Floating Glowing Badge */}
          <div className="animate-float-badge glass-card px-3.5 py-1.5 rounded-full text-[11px] sm:text-[13px] font-extrabold uppercase tracking-widest flex items-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-[#7c3aed]/60 bg-gradient-to-r from-[#7c3aed]/80 to-[#4f319c]/80 text-white">
            <span className="relative flex h-2 w-2 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb784] opacity-100"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb784]"></span>
            </span>
            <span>Just Arrived</span>
          </div>
          
          {/* Content */}
          <div className="flex items-center text-[14px] sm:text-[16px] group-hover:scale-[1.01] transition-transform duration-300">
            <span className="font-semibold text-white/90 tracking-wide text-center sm:text-left">
              We've just added a 
              <span className="text-[#ffb784] animate-pulse font-black mx-1.5 text-[15px] sm:text-[18px] drop-shadow-[0_0_10px_rgba(255,183,132,0.4)]">
                {latestCar.make} {latestCar.model} {latestCar.year ? `(${latestCar.year})` : ''}
              </span>
              to our showroom!
            </span>
            
            <Link href="/catalog" className="hidden sm:flex ml-5 items-center text-[#ffb784] text-[14px] font-bold hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
              View Details
              <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

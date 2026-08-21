'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function LiveTicker() {
  const [latestCar, setLatestCar] = useState(null);

  const formatPrice = (price) => {
    if (!price) return '';
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
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

      <div className="relative flex w-full h-[70px] sm:h-[84px] bg-[#0a0a12] overflow-hidden items-stretch border-b border-white/5 shimmer-effect">

        {/* Left Side: Geometric Block with Text and Button */}
        <div className="relative h-full w-[190px] sm:w-[340px] flex-shrink-0 z-20">

          {/* Dark Slate Base Layer (Slanted block) */}
          <div className="absolute inset-0 bg-[#1e293b]"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)' }}></div>

          {/* Purple Triangle Overlay Accent */}
          <div className="absolute top-0 right-[15px] sm:right-[30px] w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] bg-purple-600"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>

          {/* Content inside left block */}
          <div className="absolute inset-0 flex flex-col justify-center pl-4 sm:pl-8 z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)' }}>

            {/* Mobile Style: Large Text */}
            <span className="sm:hidden text-white text-[14px] font-black uppercase tracking-wider leading-none">Just Arrived</span>

            {/* Laptop Style: Old Style Pill Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-purple-600/90 px-3 py-1.5 rounded-full w-fit border border-purple-500/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#ffb784] shadow-[0_0_5px_#ffb784]"></div>
              <span className="text-white text-[13px] font-black uppercase tracking-wider leading-none">Just Arrived</span>
            </div>

            <span className="text-white/60 text-[9px] sm:text-[11px] font-bold uppercase tracking-widest leading-none mt-1.5 sm:mt-2 mb-1.5 sm:mb-0">To Showroom</span>

            {/* Button only visible on mobile in the left block */}
            <Link href="/catalog" className="sm:hidden mt-1.5 inline-flex items-center justify-center bg-purple-600 text-white w-fit px-2.5 py-1 rounded-sm font-bold uppercase tracking-wide text-[8px] hover:bg-white hover:text-black transition-all shadow-[0_2px_8px_rgba(147,51,234,0.4)]">
              View Detail
            </Link>
          </div>
        </div>

        {/* Middle: Car Details */}
        <div className="flex-1 flex justify-center items-center px-4 sm:px-6 relative z-10">
          {/* Impressive premium glowing background effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
            {/* Wide subtle glow */}
            <div className="absolute w-[80%] sm:w-[50%] h-[200%] bg-purple-900/40 blur-[30px] rounded-[100%]"></div>
            {/* Inner pulsing highlight */}
            <div className="absolute w-[40%] sm:w-[25%] h-full bg-purple-500/20 blur-[20px] rounded-[100%] animate-pulse mix-blend-screen"></div>
          </div>

          {/* Desktop Text */}
          <div className="hidden sm:flex flex-col items-center justify-center relative z-10 leading-tight">
            <span className="text-white/80 text-[16px] font-medium tracking-wide text-center">
              We've just added a
              <span className="text-white font-black mx-2 text-[20px] drop-shadow-md">
                {latestCar.make} {latestCar.model} {latestCar.year ? `(${latestCar.year})` : ''}
              </span>
              to our showroom!
            </span>
            {latestCar.price && (
              <span className="text-green-400 font-bold text-[18px] mt-0.5 drop-shadow-md">
                {formatPrice(latestCar.price)}
              </span>
            )}
          </div>

          {/* Mobile Text (Short & Impressive) */}
          <div className="flex sm:hidden flex-col items-center justify-center relative z-10 px-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 font-black text-[15px] leading-tight text-center drop-shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-text-shimmer">
              {latestCar.make} {latestCar.model} {latestCar.year ? `(${latestCar.year})` : ''}
            </span>
            {latestCar.price && (
              <span className="text-green-400 font-black text-[13px] mt-0.5 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]">
                {formatPrice(latestCar.price)}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Geometric Block with Button (Desktop Only) */}
        <div className="hidden sm:block relative h-full w-[220px] flex-shrink-0 z-20 group">
          {/* Dark Slate Base Layer (Slanted left block) */}
          <div className="absolute inset-0 bg-[#1e293b]"
            style={{ clipPath: 'polygon(40px 0, 100% 0, 100% 100%, 0 100%)' }}></div>

          {/* Purple Triangle Overlay Accent at Bottom Left */}
          <div className="absolute bottom-0 left-[15px] w-[35px] h-[35px] bg-purple-600"
            style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}></div>

          {/* Content inside right block */}
          <div className="absolute inset-0 flex items-center justify-center pr-6 pl-12 z-10"
            style={{ clipPath: 'polygon(40px 0, 100% 0, 100% 100%, 0 100%)' }}>
            <Link href="/catalog" className="inline-flex items-center justify-center bg-purple-600 text-white w-full max-w-[130px] py-2 rounded-sm font-bold uppercase tracking-wide text-[12px] hover:bg-white hover:text-black transition-all shadow-[0_4px_10px_rgba(147,51,234,0.3)]">
              View Detail
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}

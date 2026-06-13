import React from 'react';

export default function BannerSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl w-full h-[300px] md:h-[500px] bg-gray-200 dark:bg-white/5 animate-pulse transition-colors duration-500">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-white/10" />
      </div>
    </div>
  );
}

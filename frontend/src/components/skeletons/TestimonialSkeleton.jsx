import React from 'react';

export default function TestimonialSkeleton() {
  return (
    <div className="flex gap-4 sm:gap-6 -ml-4 pl-4 pr-4 sm:pr-0 overflow-hidden pt-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] shrink-0 rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/5 animate-pulse transition-colors duration-500">
          <div className="absolute inset-x-0 bottom-[60px] px-6 pb-2 pt-10">
            <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-5/6 mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-white/10 rounded w-4/6" />
          </div>
          <div className="absolute bottom-5 left-6 right-6 flex flex-col items-start">
            <div className="h-5 bg-gray-300 dark:bg-white/10 rounded w-1/2" />
            <div className="w-8 h-[3px] bg-gray-300 dark:bg-white/10 rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';

export default function CarGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-50 dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse transition-colors duration-500">
          <div className="aspect-[4/3] bg-gray-200 dark:bg-white/5 transition-colors" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-3/4 transition-colors" />
            <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full transition-colors" />
            <div className="h-10 bg-gray-200 dark:bg-white/5 rounded w-full mt-4 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}

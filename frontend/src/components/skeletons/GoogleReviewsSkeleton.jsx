import React from 'react';

export default function GoogleReviewsSkeleton() {
  return (
    <section className="py-10 md:py-14 lg:py-20 relative z-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded mb-3 animate-pulse" />
            <div className="h-10 w-64 bg-gray-200 dark:bg-white/5 rounded mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded mb-2" />
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

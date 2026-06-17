export default function DeliveryReelSkeleton() {
  return (
    <section className="py-10 md:py-14 lg:py-20 relative z-10 bg-[#0a0a12] transition-colors duration-500">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <div className="h-4 w-32 bg-gray-800 rounded mb-3 animate-pulse"></div>
            <div className="h-10 w-64 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-5 w-48 bg-gray-800 rounded mt-2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] w-[280px] h-[500px] sm:min-w-[320px] sm:w-[320px] sm:h-[568px] bg-gray-800 rounded-2xl animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

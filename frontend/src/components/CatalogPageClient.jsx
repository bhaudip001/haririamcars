'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconSearch, IconFilter, IconChevronDown, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import CarCard from '@/components/CarCard';
import api from '@/lib/api';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [makes, setMakes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']);
  const [bodyTypes, setBodyTypes] = useState([]);

  const [globalMinPrice, setGlobalMinPrice] = useState(100000);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(10000000);

  const [selectedMakes, setSelectedMakes] = useState(searchParams.get('make') ? searchParams.get('make').split(',') : []);
  const [selectedFuels, setSelectedFuels] = useState(searchParams.get('fuelType') ? searchParams.get('fuelType').split(',') : []);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState(searchParams.get('bodyType') ? searchParams.get('bodyType').split(',') : []);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortParam, setSortParam] = useState(searchParams.get('sort') || '-createdAt');

  // Data State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch Filters metadata
  useEffect(() => {
    api.get('/cars/filters').then(res => {
      if (res.data?.data) {
        setMakes(res.data.data.makes || []);
        if (res.data.data.fuelTypes?.length > 0) setFuelTypes(res.data.data.fuelTypes);
        setBodyTypes(res.data.data.bodyTypes || []);
        if (res.data.data.minPrice) setGlobalMinPrice(res.data.data.minPrice);
        if (res.data.data.maxPrice) setGlobalMaxPrice(res.data.data.maxPrice);
      }
    }).catch(console.error);
  }, []);

  // Fetch Cars
  const fetchCars = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNum);
      params.append('limit', 12);
      params.append('status', 'available'); // Only show available cars in catalog

      if (selectedMakes.length > 0) params.append('make', selectedMakes.join(','));
      if (selectedFuels.length > 0) params.append('fuelType', selectedFuels.join(','));
      if (selectedBodyTypes.length > 0) params.append('bodyType', selectedBodyTypes.join(','));
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (searchQuery) params.append('search', searchQuery);
      if (sortParam) params.append('sort', sortParam);

      // Update URL silently
      router.replace(`/catalog?${params.toString()}`, { scroll: false });

      const res = await api.get(`/cars?${params.toString()}`);
      if (res.data) {
        if (append) {
          setCars(prev => [...prev, ...(res.data.cars || [])]);
        } else {
          setCars(res.data.cars || []);
        }
        setTotal(res.data.total || 0);
        setHasMore(res.data.cars?.length === 12);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      fetchCars(1, false);
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMakes, selectedFuels, selectedBodyTypes, minPrice, maxPrice, searchQuery, sortParam]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCars(nextPage, true);
  };

const FiltersContent = ({
  globalMinPrice,
  globalMaxPrice,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  makes,
  selectedMakes,
  setSelectedMakes,
  bodyTypes,
  selectedBodyTypes,
  setSelectedBodyTypes,
  fuelTypes,
  selectedFuels,
  setSelectedFuels,
}) => {
  const exactMin = Number(globalMinPrice) || 0;
  // If globalMaxPrice is very low, make sure the slider at least goes to 50L (5000000) to allow flexible sliding just like sadguru
  const exactMax = Math.max(Number(globalMaxPrice) || 5000000, 5000000); 
  
  // Mathematically snap slider bounds beyond actual max so users can scale properly
  const minBound = Math.floor(exactMin / 10000) * 10000;
  const maxBound = Math.ceil(exactMax / 10000) * 10000;

  // Use filter's budget or fallback to overall bounds
  const currentMin = minPrice !== '' && minPrice !== null ? Number(minPrice) : minBound;
  const currentMax = maxPrice !== '' && maxPrice !== null ? Number(maxPrice) : maxBound;

  // Format currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getPercent = (value) => {
    if (maxBound === minBound) return 0;
    return Math.round(((value - minBound) / (maxBound - minBound)) * 100);
  };

  const currentMinPercent = getPercent(currentMin);
  const currentMaxPercent = getPercent(currentMax);

  const clearFilters = () => {
    setSelectedMakes([]);
    setSelectedBodyTypes([]);
    setSelectedFuels([]);
    setMinPrice('');
    setMaxPrice('');
  };

  const toggleArrayItem = (setter, item, arr) => {
    if (arr.includes(item)) setter(arr.filter(i => i !== item));
    else setter([...arr, item]);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0 transition-colors duration-500">
      <div className="hidden md:flex justify-between items-center border-b border-gray-200 dark:border-white/10 pb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'var(--font-outfit)' }}>Advanced Filters</h3>
        <button onClick={clearFilters} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors whitespace-nowrap">Clear All</button>
      </div>

      {/* Price Range / BUDGET */}
      <div className="flex flex-col gap-5 pt-2 md:pt-0 pb-2 transition-colors">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase">Budget</h3>
        </div>

        <div className="flex items-center justify-between font-bold text-[15px] text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
          <span>{formatINR(currentMin)}</span>
          <span className="text-gray-400">-</span>
          <span>{formatINR(currentMax)}</span>
        </div>

        <div className="relative w-full h-8 flex items-center group mt-2">
          {/* Track Background */}
          <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

          {/* Track Active Highlight */}
          <div
            className="absolute h-1.5 bg-purple-500 rounded-full transition-all duration-100"
            style={{
              left: `${currentMinPercent}%`,
              width: `${currentMaxPercent - currentMinPercent}%`
            }}
          ></div>

          {/* Min Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMin}
            step={10000}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), currentMax - 10000);
              setMinPrice(value);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/5 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform z-20 cursor-pointer"
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={currentMax}
            step={10000}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), currentMin + 10000);
              setMaxPrice(value);
            }}
            className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/5 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform z-20 cursor-pointer"
          />
        </div>
      </div>

      {/* Brand Filter */}
      {makes.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 pt-6 transition-colors">
          <h4 className="font-bold text-black dark:text-white mb-3 transition-colors">Brand</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMakes([])}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedMakes.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
            >
              All Brands
            </button>
            {makes.map(make => (
              <button
                key={make}
                onClick={() => toggleArrayItem(setSelectedMakes, make, selectedMakes)}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedMakes.includes(make) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                {make}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body Type Filter */}
      {bodyTypes.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 pt-6 transition-colors">
          <h4 className="font-bold text-black dark:text-white mb-3 transition-colors">Body Type</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBodyTypes([])}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedBodyTypes.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
            >
              All Types
            </button>
            {bodyTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleArrayItem(setSelectedBodyTypes, type, selectedBodyTypes)}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedBodyTypes.includes(type) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fuel Type */}
      <div className="border-t border-gray-200 dark:border-white/10 pt-6 transition-colors">
        <h4 className="font-bold text-black dark:text-white mb-3 transition-colors">Fuel Type</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFuels([])}
            className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuels.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
          >
            All
          </button>
          {fuelTypes.map(fuel => (
            <button
              key={fuel}
              onClick={() => toggleArrayItem(setSelectedFuels, fuel, selectedFuels)}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuels.includes(fuel) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-[#f4f4f8] dark:bg-transparent relative transition-colors duration-500 w-full flex flex-col">
      {/* Light Mode: Massive Unified Premium Background */}
      <div className="fixed inset-0 dark:hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f8] via-white to-[#f4f4f8] opacity-80"></div>
        <div className="absolute inset-0 opacity-[0.03] blueprint-grid"></div>

        {/* Sweeping Showroom Lights */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-white/80 to-transparent rotate-[35deg] transform-gpu blur-[20px] shadow-[0_0_120px_rgba(255,255,255,0.8)] opacity-90"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-white/60 to-transparent -rotate-[15deg] transform-gpu blur-[30px] opacity-70"></div>

        {/* Majestic Glow Orbs */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[140px] mix-blend-multiply animate-pulse-ring"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] bg-pink-100/40 rounded-full blur-[150px] mix-blend-multiply animate-float-card"></div>
      </div>

      {/* Dark Mode: Massive Unified Premium Background */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-[#0a0a12]"></div>

        {/* Neon Blueprint Grid */}
        <div className="absolute inset-0 opacity-[0.05] blueprint-grid"></div>

        {/* Sweeping Showroom Lights (Dark) */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-purple-600/10 to-transparent rotate-[35deg] transform-gpu blur-[30px] shadow-[0_0_120px_rgba(168,85,247,0.15)] z-0"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-blue-600/10 to-transparent -rotate-[15deg] transform-gpu blur-[40px] z-0"></div>

        {/* Majestic Glow Orbs */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse-ring"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen animate-float-card"></div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 flex flex-col md:flex-row gap-8 relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start bg-white dark:bg-transparent p-6 dark:p-0 rounded-2xl border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none transition-all duration-500">
          <FiltersContent
            globalMinPrice={globalMinPrice}
            globalMaxPrice={globalMaxPrice}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            makes={makes}
            selectedMakes={selectedMakes}
            setSelectedMakes={setSelectedMakes}
            bodyTypes={bodyTypes}
            selectedBodyTypes={selectedBodyTypes}
            setSelectedBodyTypes={setSelectedBodyTypes}
            fuelTypes={fuelTypes}
            selectedFuels={selectedFuels}
            setSelectedFuels={setSelectedFuels}
          />
        </aside>

        {/* Mobile Bottom Sheet Filters */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-white/95 dark:bg-[#0f0f1e]/95 backdrop-blur-xl rounded-t-3xl border-t border-gray-200 dark:border-white/20 shadow-2xl flex flex-col transition-colors duration-500"
              >
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full transition-colors" />
                </div>

                <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 transition-colors">
                  <h2 className="text-xl font-bold text-black dark:text-white tracking-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Filters</h2>
                  <button
                    aria-label="Close Filters"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <FiltersContent
                    globalMinPrice={globalMinPrice}
                    globalMaxPrice={globalMaxPrice}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    makes={makes}
                    selectedMakes={selectedMakes}
                    setSelectedMakes={setSelectedMakes}
                    bodyTypes={bodyTypes}
                    selectedBodyTypes={selectedBodyTypes}
                    setSelectedBodyTypes={setSelectedBodyTypes}
                    fuelTypes={fuelTypes}
                    selectedFuels={selectedFuels}
                    setSelectedFuels={setSelectedFuels}
                  />
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f1e] sticky bottom-0 transition-colors duration-500">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full h-[52px] bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Catalog Grid Area */}
        <div className="flex-grow flex flex-col space-y-6">
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
            <div className="w-full flex items-center justify-between lg:w-auto lg:block">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Premium Inventory</h1>
                <p className="text-purple-400 mt-2 font-medium">Showing {total} available vehicles</p>
              </div>
              {/* Mobile Filter Button */}
              <button
                aria-label="Open Filters"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center justify-center w-12 h-12 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl active:bg-gray-100 dark:active:bg-white/20 transition-colors shadow-sm dark:shadow-none"
              >
                <IconFilter className="text-black dark:text-white transition-colors" size={24} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-[14px] md:py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base md:text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors shadow-sm dark:shadow-none"
                  placeholder="Search models..."
                  type="text"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-gray-400 text-sm whitespace-nowrap">Sort by:</span>
                <div className="relative w-full sm:w-48">
                  <select
                    value={sortParam}
                    onChange={(e) => setSortParam(e.target.value)}
                    className="w-full appearance-none h-[52px] md:h-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-black dark:text-white font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer text-base md:text-sm transition-colors shadow-sm dark:shadow-none"
                  >
                    <option value="-createdAt" className="text-black">Recently Added</option>
                    <option value="price" className="text-black">Price: Low to High</option>
                    <option value="-price" className="text-black">Price: High to Low</option>
                    <option value="-year" className="text-black">Year: Newest First</option>
                    <option value="kms" className="text-black">Kilometers: Low to High</option>
                  </select>
                  <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading && page === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#12121f] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse h-[360px] transition-colors">
                  <div className="aspect-[4/3] bg-gray-100 dark:bg-white/5 transition-colors" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-3/4 transition-colors" />
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {cars.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl transition-colors shadow-sm dark:shadow-none">
              <IconSearch size={48} className="text-gray-400 dark:text-gray-500 mb-4 transition-colors" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-2 transition-colors">No vehicles found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md transition-colors">Try adjusting your filters or search criteria to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSelectedMake('');
                  setSelectedFuel('');
                  setSelectedBodyType('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchQuery('');
                }}
                className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {hasMore && cars.length > 0 && (
            <div className="w-full flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-transparent border border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 px-8 py-3 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-300 font-bold tracking-wide disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Vehicles'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CatalogContent />
    </Suspense>
  );
}

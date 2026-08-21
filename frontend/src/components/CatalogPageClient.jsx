'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconSearch, IconFilter, IconChevronDown, IconX, IconRefresh } from '@tabler/icons-react';
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
  const [transmissions, setTransmissions] = useState(['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']);
  const [selectedTransmissions, setSelectedTransmissions] = useState(searchParams.get('transmission') ? searchParams.get('transmission').split(',') : []);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState(searchParams.get('bodyType') ? searchParams.get('bodyType').split(',') : []);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortParam, setSortParam] = useState(searchParams.get('sort') || '-createdAt');

  // Data State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

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
  const fetchCars = async (signal = undefined) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('limit', 1000);
      params.append('status', 'available'); // Only show available cars in catalog

      if (selectedMakes.length > 0) params.append('make', selectedMakes.join(','));
      if (selectedFuels.length > 0) params.append('fuelType', selectedFuels.join(','));
      if (selectedTransmissions.length > 0) params.append('transmission', selectedTransmissions.join(','));
      if (selectedBodyTypes.length > 0) params.append('bodyType', selectedBodyTypes.join(','));
      if (minPrice !== '' && minPrice !== null) params.append('minPrice', minPrice);
      if (maxPrice !== '' && maxPrice !== null) params.append('maxPrice', maxPrice);
      if (searchQuery) params.append('search', searchQuery);
      if (sortParam) params.append('sort', sortParam);

      // Update URL silently
      router.replace(`/catalog?${params.toString()}`, { scroll: false });

      const res = await api.get(`/cars?${params.toString()}`, { signal });
      if (res.data) {
        setCars(res.data.cars || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        console.error(err);
        setError("Unable to connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      fetchCars(controller.signal);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMakes, selectedFuels, selectedTransmissions, selectedBodyTypes, minPrice, maxPrice, searchQuery, sortParam]);

  const hasHandledReload = useRef(false);

  // Sync state with URL if browser back/forward buttons are used
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasHandledReload.current) {
      hasHandledReload.current = true;
      const navEntries = performance.getEntriesByType('navigation');
      const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') ||
        (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

      if (isReload) {
        if (searchParams.toString() !== '') {
          // Synchronously clear states so the UI updates instantly
          setSelectedMakes([]);
          setSelectedFuels([]);
          setSelectedTransmissions([]);
          setSelectedBodyTypes([]);
          setMinPrice('');
          setMaxPrice('');
          setSearchQuery('');

          router.replace('/catalog', { scroll: false });
          return;
        }
      }
    }

    setSelectedMakes(searchParams.get('make') ? searchParams.get('make').split(',') : []);
    setSelectedFuels(searchParams.get('fuelType') ? searchParams.get('fuelType').split(',') : []);
    setSelectedTransmissions(searchParams.get('transmission') ? searchParams.get('transmission').split(',') : []);
    setSelectedBodyTypes(searchParams.get('bodyType') ? searchParams.get('bodyType').split(',') : []);
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSearchQuery(searchParams.get('search') || '');
    setSortParam(searchParams.get('sort') || '-createdAt');
  }, [searchParams, router]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);



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
    transmissions,
    selectedTransmissions,
    setSelectedTransmissions,
  }) => {
    const exactMin = Number(globalMinPrice) || 0;
    const exactMax = Number(globalMaxPrice) || 5000000;

    // Mathematically snap slider bounds beyond actual max so users can scale properly
    const minBound = Math.floor(exactMin / 10000) * 10000;
    const maxBound = Math.ceil(exactMax / 10000) * 10000;

    // Use filter's budget or fallback to overall bounds
    const parsedMin = Number(minPrice);
    const currentMin = !isNaN(parsedMin) && minPrice !== '' && minPrice !== null ? parsedMin : minBound;
    const parsedMax = Number(maxPrice);
    const currentMax = !isNaN(parsedMax) && maxPrice !== '' && maxPrice !== null ? parsedMax : maxBound;

    // Local state for ultra-smooth native scrolling without debounce lag
    const [localMin, setLocalMin] = useState(currentMin);
    const [localMax, setLocalMax] = useState(currentMax);

    // Sync local state when external state changes (e.g. clear filters)
    useEffect(() => {
      setLocalMin(currentMin);
      setLocalMax(currentMax);
    }, [currentMin, currentMax]);

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

    const localMinPercent = getPercent(localMin);
    const localMaxPercent = getPercent(localMax);

    const handleDragEnd = () => {
      setMinPrice(localMin);
      setMaxPrice(localMax);
    };

    const clearFilters = () => {
      setSelectedMakes([]);
      setSelectedBodyTypes([]);
      setSelectedFuels([]);
      setSelectedTransmissions([]);
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
            <span>{formatINR(localMin)}</span>
            <span className="text-gray-400">-</span>
            <span>{formatINR(localMax)}</span>
          </div>

          <div className="relative w-full h-8 flex items-center group mt-2">
            {/* Track Background */}
            <div className="absolute w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

            {/* Track Active Highlight */}
            <div
              className="absolute h-1.5 bg-purple-500 rounded-full transition-all duration-75"
              style={{
                left: `${localMinPercent}%`,
                width: `${localMaxPercent - localMinPercent}%`
              }}
            ></div>

            {/* Min Slider */}
            <input
              type="range"
              aria-label="Minimum Budget"
              min={minBound}
              max={maxBound}
              value={localMin}
              step={10000}
              onChange={(e) => {
                const value = Math.min(Number(e.target.value), localMax - 10000);
                setLocalMin(value);
              }}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-black/5 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform z-20 cursor-pointer"
            />

            {/* Max Slider */}
            <input
              type="range"
              aria-label="Maximum Budget"
              min={minBound}
              max={maxBound}
              value={localMax}
              step={10000}
              onChange={(e) => {
                const value = Math.max(Number(e.target.value), localMin + 10000);
                setLocalMax(value);
              }}
              onMouseUp={handleDragEnd}
              onTouchEnd={handleDragEnd}
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
                aria-pressed={selectedMakes.length === 0}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedMakes.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                All Brands
              </button>
              {makes.map(make => (
                <button
                  key={make}
                  onClick={() => toggleArrayItem(setSelectedMakes, make, selectedMakes)}
                  aria-pressed={selectedMakes.includes(make)}
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
                aria-pressed={selectedBodyTypes.length === 0}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedBodyTypes.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                All Types
              </button>
              {bodyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayItem(setSelectedBodyTypes, type, selectedBodyTypes)}
                  aria-pressed={selectedBodyTypes.includes(type)}
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
              aria-pressed={selectedFuels.length === 0}
              className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuels.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
            >
              All
            </button>
            {fuelTypes.map(fuel => (
              <button
                key={fuel}
                onClick={() => toggleArrayItem(setSelectedFuels, fuel, selectedFuels)}
                aria-pressed={selectedFuels.includes(fuel)}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedFuels.includes(fuel) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>

        {/* Transmission Type */}
        {transmissions && transmissions.length > 0 && (
          <div className="border-t border-gray-200 dark:border-white/10 pt-6 transition-colors">
            <h4 className="font-bold text-black dark:text-white mb-3 transition-colors">Transmission</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTransmissions([])}
                aria-pressed={selectedTransmissions.length === 0}
                className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedTransmissions.length === 0 ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
              >
                All
              </button>
              {transmissions.map(transmission => (
                <button
                  key={transmission}
                  onClick={() => toggleArrayItem(setSelectedTransmissions, transmission, selectedTransmissions)}
                  aria-pressed={selectedTransmissions.includes(transmission)}
                  className={`px-4 py-3 md:py-1.5 rounded-full text-sm md:text-xs font-bold tracking-wide transition-colors ${selectedTransmissions.includes(transmission) ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-white/20 hover:bg-purple-50 dark:hover:bg-white/10 hover:text-purple-700 dark:hover:text-white shadow-sm dark:shadow-none transition-all duration-300'}`}
                >
                  {transmission}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Wrapper for mobile filters to buffer state changes until "Apply Filters" is clicked
  const MobileFiltersWrapper = ({ onClose, ...props }) => {
    const [tempMakes, setTempMakes] = useState(props.selectedMakes);
    const [tempFuels, setTempFuels] = useState(props.selectedFuels);
    const [tempTransmissions, setTempTransmissions] = useState(props.selectedTransmissions);
    const [tempBodyTypes, setTempBodyTypes] = useState(props.selectedBodyTypes);
    const [tempMinPrice, setTempMinPrice] = useState(props.minPrice);
    const [tempMaxPrice, setTempMaxPrice] = useState(props.maxPrice);

    const handleApply = () => {
      props.setSelectedMakes(tempMakes);
      props.setSelectedFuels(tempFuels);
      props.setSelectedTransmissions(tempTransmissions);
      props.setSelectedBodyTypes(tempBodyTypes);
      props.setMinPrice(tempMinPrice);
      props.setMaxPrice(tempMaxPrice);
      onClose();
    };

    const handleClear = () => {
      setTempMakes([]);
      setTempFuels([]);
      setTempTransmissions([]);
      setTempBodyTypes([]);
      setTempMinPrice('');
      setTempMaxPrice('');
    };

    return (
      <div className="flex flex-col h-full max-h-[85dvh]">
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-white/20 rounded-full transition-colors" />
        </div>

        <div className="px-6 pb-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10 transition-colors flex-shrink-0">
          <h2 className="text-xl font-bold text-black dark:text-white tracking-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Filters</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
            >
              <IconRefresh size={16} />
              Clear All
            </button>
            <button
              aria-label="Close Filters"
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FiltersContent
            {...props}
            selectedMakes={tempMakes}
            setSelectedMakes={setTempMakes}
            selectedFuels={tempFuels}
            setSelectedFuels={setTempFuels}
            selectedTransmissions={tempTransmissions}
            setSelectedTransmissions={setTempTransmissions}
            selectedBodyTypes={tempBodyTypes}
            setSelectedBodyTypes={setTempBodyTypes}
            minPrice={tempMinPrice}
            setMinPrice={setTempMinPrice}
            maxPrice={tempMaxPrice}
            setMaxPrice={setTempMaxPrice}
          />
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f1e] flex-shrink-0 transition-colors duration-500" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 1rem))' }}>
          <button
            onClick={handleApply}
            className="w-full h-[52px] bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_10px_25px_rgba(147,51,234,0.4)]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#f4f4f8] dark:bg-transparent relative transition-colors duration-500 w-full flex flex-col">
      {/* Light Mode: Massive Unified Verified Background */}
      <div className="fixed inset-0 dark:hidden pointer-events-none z-0 bg-[#f4f4f8]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f8] via-white to-[#f4f4f8] opacity-80"></div>
        <div className="absolute inset-0 opacity-[0.03] blueprint-grid"></div>

        {/* Sweeping Showroom Lights */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-white/80 to-transparent rotate-[35deg] transform-gpu opacity-90"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-white/60 to-transparent -rotate-[15deg] transform-gpu opacity-70"></div>

        {/* Majestic Glow Orbs - Optimized with radial gradients instead of expensive blurs */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(233,213,255,0.4) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(252,231,243,0.5) 0%, transparent 70%)' }}></div>
      </div>

      {/* Dark Mode: Massive Unified Verified Background */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-0 bg-[#0a0a12]">
        <div className="absolute inset-0 bg-[#0a0a12]"></div>
        <div className="absolute inset-0 opacity-[0.05] blueprint-grid"></div>

        {/* Sweeping Showroom Lights (Dark) */}
        <div className="absolute top-[10%] -left-[20%] w-[140%] h-[400px] bg-gradient-to-r from-transparent via-purple-900/10 to-transparent rotate-[35deg] transform-gpu z-0"></div>
        <div className="absolute top-[60%] -right-[30%] w-[160%] h-[300px] bg-gradient-to-r from-transparent via-blue-900/10 to-transparent -rotate-[15deg] transform-gpu z-0"></div>

        {/* Majestic Glow Orbs - Optimized */}
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}></div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 flex flex-col md:flex-row gap-8 relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start bg-white dark:bg-transparent p-6 dark:p-0 rounded-2xl border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none transition-all duration-500 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
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
            transmissions={transmissions}
            selectedTransmissions={selectedTransmissions}
            setSelectedTransmissions={setSelectedTransmissions}
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
                className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-[#0f0f1e]/95 backdrop-blur-xl rounded-t-3xl border-t border-gray-200 dark:border-white/20 shadow-2xl transition-colors duration-500"
              >
                <MobileFiltersWrapper
                  onClose={() => setIsMobileFilterOpen(false)}
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
                  transmissions={transmissions}
                  selectedTransmissions={selectedTransmissions}
                  setSelectedTransmissions={setSelectedTransmissions}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Catalog Grid Area */}
        <div className="flex-grow flex flex-col space-y-6 relative">

          {/* Mobile Filter Button - Sticky like Sadguru */}
          <div className="md:hidden sticky top-[72px] z-40 w-full">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white/95 dark:bg-[#12121f]/95 backdrop-blur-md text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-500/30 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-900/5 dark:shadow-black/50 active:scale-[0.98] transition-all"
            >
              <IconFilter size={20} />
              Advanced Filters
            </button>
          </div>

          {/* Results Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4">
            <div className="w-full flex items-center justify-between lg:w-auto lg:block">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>Verified Inventory</h1>
                <p className="text-purple-400 mt-2 font-medium">Showing {total} available vehicles</p>
              </div>
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
          {loading ? (
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
              {error ? (
                <>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <IconX size={24} stroke={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 transition-colors">Connection Error</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">{error}</p>
                  <button
                    onClick={() => fetchCars(1, false)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <IconSearch size={48} className="text-gray-400 dark:text-gray-500 mb-4 transition-colors" />
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 transition-colors">No vehicles found</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md transition-colors">Try adjusting your filters or search criteria to find what you're looking for.</p>
                  <button
                    onClick={() => {
                      setSelectedMakes([]);
                      setSelectedFuels([]);
                      setSelectedBodyTypes([]);
                      setMinPrice('');
                      setMaxPrice('');
                      setSearchQuery('');
                    }}
                    className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                </>
              )}
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

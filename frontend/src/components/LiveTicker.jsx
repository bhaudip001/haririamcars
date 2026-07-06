'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';

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
    <div className="bg-primary/10 border-b border-primary/20 text-primary overflow-hidden relative flex items-center h-10 w-full z-50">
      <div className="absolute left-0 bg-background z-10 px-4 h-full flex items-center font-bold text-sm uppercase tracking-wider border-r border-primary/20">
        Live Updates
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <motion.div
          className="absolute flex items-center whitespace-nowrap"
          animate={{ x: [window?.innerWidth || 1000, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: 'linear',
          }}
        >
          <span className="mr-4">🚀 New {latestCar.make} {latestCar.model} just listed!! Hurry Up!!</span>
          <Link href={`/cars/${latestCar.slug}`} className="underline font-bold text-primary hover:text-primary/80">
            View Details
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

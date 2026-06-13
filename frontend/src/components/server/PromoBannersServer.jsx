import React from 'react';
import PromoBannersClient from '@/components/client/PromoBannersClient';

async function getBanners() {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://www.hariramcars.com/backend/server.js?path=api';
  }
  
  try {
    const res = await fetch(`${baseUrl}/promo-banners?active=true`, {
      next: { tags: ['banners'], revalidate: 300 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return [];
  }
}

export default async function PromoBannersServer() {
  const banners = await getBanners();

  if (!banners || banners.length === 0) return null;

  return (
    <section className="py-10 md:py-14 lg:py-20 relative z-10 transition-colors duration-500 dark:bg-transparent">
      <PromoBannersClient banners={banners} />
    </section>
  );
}

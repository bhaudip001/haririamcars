import React from 'react';
import TestimonialsClient from '@/components/client/TestimonialsClient';

async function getTestimonials() {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://www.hariramcars.com/backend/server.js?path=api';
  }
  
  try {
    const res = await fetch(`${baseUrl}/happy-customers?limit=6`, {
      next: { tags: ['testimonials'], revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export default async function TestimonialsServer() {
  const testimonials = await getTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-10 md:py-14 lg:py-20 overflow-hidden relative z-10 transition-colors duration-500 dark:bg-transparent">
      <TestimonialsClient testimonials={testimonials} />
    </section>
  );
}

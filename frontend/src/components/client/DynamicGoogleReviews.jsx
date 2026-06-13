'use client';
import dynamic from 'next/dynamic';

const GoogleReviews = dynamic(() => import('@/components/GoogleReviews'), { ssr: false });

export default GoogleReviews;

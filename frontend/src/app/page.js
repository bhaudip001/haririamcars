import HomePageClient from '@/components/HomePageClient';

export const metadata = {
  title: 'Hariram Motors | Used & New Cars in Surat',
  description: 'Browse 150+ certified pre-owned and new cars in Surat. Transparent pricing, full documentation, trusted since 2013. Hariram Motors, Varachha.',
  alternates: { canonical: 'https://www.hariramcars.com/' },
  openGraph: {
    title: 'Hariram Motors | Used & New Cars in Surat',
    description: 'Surat\'s #1 destination for certified pre-owned cars.',
    url: 'https://www.hariramcars.com/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export const revalidate = 3600; // Cache for 1 hour

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [carsRes, testRes, bannerRes] = await Promise.allSettled([
      fetch(`${apiUrl}/cars?limit=8&status=available&featured=true`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/happy-customers?limit=6`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/promo-banners?active=true`, { next: { revalidate: 3600 } }),
    ]);

    const initialCars = carsRes.status === 'fulfilled' && carsRes.value.ok ? (await carsRes.value.json()).cars || [] : [];
    const initialTestimonials = testRes.status === 'fulfilled' && testRes.value.ok ? (await testRes.value.json()) || [] : [];
    const initialBanners = bannerRes.status === 'fulfilled' && bannerRes.value.ok ? (await bannerRes.value.json()) || [] : [];

    return { initialCars, initialTestimonials, initialBanners };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return { initialCars: [], initialTestimonials: [], initialBanners: [] };
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  return <HomePageClient initialData={data} />;
}

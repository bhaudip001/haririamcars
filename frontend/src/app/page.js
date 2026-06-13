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

export default function HomePage() {
  return <HomePageClient />;
}

import CatalogPageClient from '@/components/CatalogPageClient';

export const metadata = {
  title: 'Browse Cars — Used & New Cars in Surat',
  description: 'Filter by brand, budget, fuel type and year. 150+ certified pre-owned and new cars available at Hariram Motors, Surat.',
  alternates: { canonical: 'https://www.hariramcars.com/catalog' },
  openGraph: {
    title: 'Browse Cars | Hariram Motors',
    description: '150+ certified cars. Filter by brand, budget, fuel.',
    url: 'https://www.hariramcars.com/catalog',
    type: 'website',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Browse Cars at Hariram Motors',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Cars | Hariram Motors',
    description: '150+ certified cars. Filter by brand, budget, fuel.',
    images: ['/og-image.jpg'],
  },
};

export default function CatalogPage() {
  return <CatalogPageClient />;
}

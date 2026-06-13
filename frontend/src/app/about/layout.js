export const metadata = {
  title: 'About Us — Trusted Car Dealer in Surat Since 2013',
  description: 'Learn about Hariram Motors — Surat\'s most trusted pre-owned car dealership since 2013. 500+ happy customers, transparent pricing, full documentation support.',
  alternates: { canonical: 'https://www.hariramcars.com/about' },
  openGraph: {
    title: 'About Hariram Motors | Trusted Since 2013',
    description: '500+ happy customers. Surat\'s most trusted car dealer.',
    url: 'https://www.hariramcars.com/about',
    type: 'website',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'About Hariram Motors',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Hariram Motors | Trusted Since 2013',
    description: '500+ happy customers. Surat\'s most trusted car dealer.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}

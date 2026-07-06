export const metadata = {
  title: 'About Hariram Motors | Trusted Car Dealer in Surat',
  description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020. 3600+ happy customers, transparent pricing, full documentation support.',
  alternates: { canonical: 'https://www.hariramcars.com/about' },
  openGraph: {
    title: 'About Hariram Motors | Trusted Car Dealer in Surat',
    description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020.',
    url: 'https://www.hariramcars.com/about',
    type: 'website',
    images: [{
      url: '/logo-192.jpg',
      alt: 'About Hariram Motors',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Hariram Motors | Trusted Car Dealer in Surat',
    description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020.',
    images: ['/logo-192.jpg'],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}

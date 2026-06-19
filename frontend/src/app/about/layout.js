export const metadata = {
  title: 'About Hariram Motors | Trusted Car Dealer in Surat',
  description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020. 500+ happy customers, transparent pricing, full documentation support.',
  alternates: { canonical: 'https://www.hariramcars.com/about' },
  openGraph: {
    title: 'About Hariram Motors | Trusted Car Dealer in Surat',
    description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020.',
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
    title: 'About Hariram Motors | Trusted Car Dealer in Surat',
    description: 'Learn about Hariram Motors (Hariram Cars) — Surat\'s most trusted pre-owned car dealer since 2020.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}

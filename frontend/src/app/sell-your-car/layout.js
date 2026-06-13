export const metadata = {
  title: 'Sell Your Car in Surat — Best Price Guaranteed',
  description: 'Sell your used car at the best price in Surat. Free inspection, instant quote, same-day payment at Hariram Motors. Call +91 93734 82016.',
  alternates: { canonical: 'https://www.hariramcars.com/sell-your-car' },
  openGraph: {
    title: 'Sell Your Car | Hariram Motors Surat',
    description: 'Best price. Free inspection. Same-day payment.',
    url: 'https://www.hariramcars.com/sell-your-car',
    type: 'website',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Sell Your Car at Hariram Motors',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Your Car | Hariram Motors Surat',
    description: 'Best price. Free inspection. Same-day payment.',
    images: ['/og-image.jpg'],
  },
};

export default function SellYourCarLayout({ children }) {
  return <>{children}</>;
}

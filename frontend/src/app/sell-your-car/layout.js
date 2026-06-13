export const metadata = {
  title: 'Sell Car in Surat | Best Price for Second-Hand Cars | Hariram Motors',
  description: 'Looking to sell your car? Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
  alternates: { canonical: 'https://www.hariramcars.com/sell-your-car' },
  openGraph: {
    title: 'Sell Car in Surat | Best Price for Second-Hand Cars | Hariram Motors',
    description: 'Looking to sell your car? Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
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
    title: 'Sell Car in Surat | Best Price for Second-Hand Cars | Hariram Motors',
    description: 'Looking to sell your car? Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
    images: ['/og-image.jpg'],
  },
};

export default function SellYourCarLayout({ children }) {
  return <>{children}</>;
}

export const metadata = {
  title: 'Sell your car in just 29 Minutes in Surat | Hariram Motors',
  description: 'Sell your car in just 29 minutes! Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
  keywords: 'sell car surat, second hand car buyers, used car valuation, instant payment car sale, sell car in 29 minutes, hariram motors',
  alternates: { canonical: 'https://www.hariramcars.com/sell-your-car' },
  openGraph: {
    title: 'Sell your car in just 29 Minutes in Surat | Hariram Motors',
    description: 'Sell your car in just 29 minutes! Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
    url: 'https://www.hariramcars.com/sell-your-car',
    type: 'website',
    images: [{
      url: '/3.png',
      width: 1200,
      height: 630,
      alt: 'Sell your car in just 29 Minutes',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell your car in just 29 Minutes in Surat | Hariram Motors',
    description: 'Sell your car in just 29 minutes! Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.',
    images: ['/3.png'],
  },
};

export default function SellYourCarLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sell Your Car - Hariram Motors",
    "description": "Sell your car in just 29 minutes! Hariram Motors offers the best market price for second-hand motors in Surat with instant payment and zero paperwork.",
    "url": "https://www.hariramcars.com/sell-your-car",
    "provider": {
      "@type": "AutoDealer",
      "name": "Hariram Motors",
      "image": "https://www.hariramcars.com/without_background_logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Simada Canal, BRTS Rd, near Setubandh Hills",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "postalCode": "395006",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

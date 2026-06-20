export const metadata = {
  title: 'Best Car Insurance in Surat | Hariram Motors',
  description: 'Get the best comprehensive and third-party car insurance quotes in Surat. Zero depreciation cover, cashless repairs at 5000+ garages. Instant policy issuance!',
  keywords: 'car insurance surat, best car insurance policy, zero depreciation car insurance, cashless garage repair surat, third party car insurance, comprehensive car insurance',
  alternates: { canonical: 'https://www.hariramcars.com/insurance' },
  openGraph: {
    title: 'Best Car Insurance in Surat | Hariram Motors',
    description: 'Get the best comprehensive and third-party car insurance quotes in Surat. Zero depreciation cover, cashless repairs at 5000+ garages.',
    url: 'https://www.hariramcars.com/insurance',
    type: 'website',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Best Car Insurance in Surat',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Car Insurance in Surat | Hariram Motors',
    description: 'Get the best comprehensive and third-party car insurance quotes in Surat. Zero depreciation cover, cashless repairs at 5000+ garages.',
    images: ['/og-image.jpg'],
  },
};

export default function InsuranceLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Car Insurance - Hariram Motors",
    "description": "Get the best comprehensive and third-party car insurance quotes in Surat. Zero depreciation cover, cashless repairs at 5000+ garages. Instant policy issuance!",
    "url": "https://www.hariramcars.com/insurance",
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

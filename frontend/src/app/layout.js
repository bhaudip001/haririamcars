import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import DynamicLeadPopup from '@/components/client/DynamicLeadPopup';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  metadataBase: new URL('https://www.hariramcars.com/'),
  title: {
    default: 'Hariram Motors | Premium Pre-Owned & New Cars in Surat',
    template: '%s | Hariram Motors',
  },
  description: 'Buy or sell certified pre-owned and new cars at Hariram Motors, Surat. 150+ verified vehicles, transparent pricing, trusted since 2013.',
  keywords: [
    'hariram motor',
    'hariram motors',
    'hariram cars',
    'sell car',
    'second-hand motor',
    'second-hand car',
    'car dealer',
    'used cars surat',
    'second hand cars surat',
    'pre-owned cars surat',
    'buy used car surat',
    'car dealership surat',
    'varachha used cars',
    'certified pre-owned surat',
    'new cars surat',
  ],
  authors: [{ name: 'Hariram Motors' }],
  creator: 'Hariram Motors',
  publisher: 'Hariram Motors',
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.hariramcars.com/',
    siteName: 'Hariram Motors',
    title: 'Hariram Motors | Premium Cars in Surat',
    description: 'Surat\'s most trusted destination for pre-owned and new cars.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Hariram Motors — Premium Cars in Surat',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hariram Motors | Premium Cars in Surat',
    description: 'Buy or sell certified pre-owned cars in Surat.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    canonical: 'https://www.hariramcars.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://www.hariramcars.com/#organization",
                "name": "Hariram Motors",
                "alternateName": ["Hariram Cars", "Hariram Motor"],
                "url": "https://www.hariramcars.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.hariramcars.com/logo.jpeg"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+919898558222",
                  "contactType": "sales"
                },
                "sameAs": [
                  "https://www.instagram.com/hariram_motors?igsh=MTljZmdmOXFvbHRncQ%3D%3D&utm_source=qr",
                  "https://www.facebook.com/share/192ndW3BAW/?mibextid=wwXIfr",
                  "https://youtube.com/@harirammotors?si=QgG9YbGyDO2HbCGS"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "AutoDealer",
                "@id": "https://www.hariramcars.com/#localbusiness",
                "name": "Hariram Motors",
                "alternateName": ["Hariram Cars", "Hariram Motor"],
                "description": "Top car dealer for second-hand motors and certified pre-owned cars in Surat, Gujarat.",
                "url": "https://www.hariramcars.com/",
                "telephone": "+919898558222",
                "email": "info@harimotors.com",
                "foundingDate": "2020",
                "priceRange": "₹₹",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Simada to, Canal, BRTS Rd, near Setubandh Hills",
                  "addressLocality": "Surat",
                  "addressRegion": "Gujarat",
                  "postalCode": "395006",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "21.2091",
                  "longitude": "72.8873"
                },
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                      "Monday","Tuesday","Wednesday",
                      "Thursday","Friday","Saturday"
                    ],
                    "opens": "09:00",
                    "closes": "20:00"
                  }
                ],
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "500"
                }
              }
            ])
          }}
        />
      </head>
      <body className="bg-[#f5f5f7] dark:bg-background text-black dark:text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container transition-colors duration-500">
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                border: '1px solid var(--color-outline)',
                borderRadius: '12px',
              },
            }}
          />
          <DynamicLeadPopup />
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

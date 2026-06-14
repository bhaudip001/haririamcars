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
    default: 'Hariram Motors | Used & pre-owned cars in Surat',
    template: '%s | Hariram Motors',
  },
  description: 'Browse 150+ certified used & pre-owned cars in Surat. Transparent pricing, full documentation, trusted since 2013. Hariram Motors, Varachha.',
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
    'Second hand cars in Surat',
    'Used cars for sale near me',
    'Best pre-owned car dealer in Surat',
    'Used cars under 5 lakhs in Surat',
    'Certified second hand cars',
    'Buy used Maruti Swift Surat',
    'Used car showroom in Surat',
    'Second hand cars on loan',
    'Second hand cars on EMI',
    'Top used car dealers in Gujarat',
    'Sell my car in Surat',
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
    title: 'Hariram Motors | Used & pre-owned cars in Surat',
    description: 'Surat\'s most trusted destination for used & pre-owned cars.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Hariram Motors — Premium Cars in Surat',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hariram Motors | Used & pre-owned cars in Surat',
    description: 'Buy or sell certified used & pre-owned cars in Surat.',
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
  icons: {
    icon: [
      { url: '/logo-32.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/logo-48.jpg', sizes: '48x48', type: 'image/jpeg' },
      { url: '/logo-96.jpg', sizes: '96x96', type: 'image/jpeg' },
      { url: '/logo-192.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    shortcut: '/logo-48.jpg',
    apple: '/logo-192.jpg',
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

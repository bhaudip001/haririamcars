export const metadata = {
  title: 'Contact Us — Hariram Motors Surat',
  description: 'Contact Hariram Motors in Surat. Visit our showroom at Simada to, Canal, BRTS Rd, near Setubandh Hills. Call +91 98985 58222.',
  alternates: { canonical: 'https://www.hariramcars.com/contact' },
  openGraph: {
    title: 'Contact Hariram Motors | Surat',
    description: 'Call, WhatsApp or visit us in Surat.',
    url: 'https://www.hariramcars.com/contact',
    type: 'website',
    images: [{
      url: '/3.png',
      width: 1200,
      height: 630,
      alt: 'Contact Hariram Motors',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Hariram Motors | Surat',
    description: 'Call, WhatsApp or visit us in Surat.',
    images: ['/3.png'],
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}

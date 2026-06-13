'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import dynamic from 'next/dynamic';
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "" : "min-h-screen"}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}

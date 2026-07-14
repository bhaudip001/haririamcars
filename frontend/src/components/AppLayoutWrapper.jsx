'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import PushNotificationManager from './PushNotificationManager';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');


  return (
    <>
      <PushNotificationManager />
      {!isAdmin && (
        <>
          <Navbar />
        </>
      )}
      <main className={isAdmin ? "" : "min-h-screen"}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}

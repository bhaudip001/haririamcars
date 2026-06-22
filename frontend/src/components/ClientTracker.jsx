'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientTracker() {
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    // We only want to track once per session/page load to avoid double counting on hydration
    if (tracked.current) return;
    
    // We can also let the backend handle duplicates based on IP and daily date,
    // but tracking once here is cleaner.
    const trackVisit = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // We don't need body, IP is captured by backend from request headers
        });
        tracked.current = true;
      } catch (err) {
        console.error('Failed to track visit', err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // Silent component
}

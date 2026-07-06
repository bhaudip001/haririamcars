'use client';

import { useEffect, useState } from 'react';
import { urlBase64ToUint8Array } from '@/lib/utils';
import { api } from '@/lib/api';

export default function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    const initPush = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          setIsSubscribed(true);
          // Sync with backend
          await api.post('/notifications/subscribe', subscription);
        } else {
          // Check if permission is already granted, if so subscribe
          if (Notification.permission === 'granted') {
            subscribeUser(registration);
          } else if (Notification.permission === 'default') {
            // Wait a bit before asking so it's not instantly on load
            setTimeout(() => {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  subscribeUser(registration);
                }
              });
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    const subscribeUser = async (registration) => {
      try {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) return;
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await api.post('/notifications/subscribe', subscription);
        setIsSubscribed(true);
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
      }
    };

    initPush();
  }, []);

  return null; // This component doesn't render anything
}

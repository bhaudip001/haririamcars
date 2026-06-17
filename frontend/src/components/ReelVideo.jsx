'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function ReelVideo({ src, customerName, carModel, className = "" }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Lazy load video element when it comes within viewport, with a fallback
  useEffect(() => {
    let isLoaded = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            isLoaded = true;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100%', threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback: If observer fails or user doesn't scroll, load anyway after 3s
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Handle global mute
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail.src !== src) {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };

    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);
    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
    };
  }, [src]);

  // Handle auto-play only when visible to prevent website hanging
  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }

    if (!newMutedState) {
      window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src } }));
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-black ${className}`}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover transition-opacity duration-700"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center absolute inset-0">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 pointer-events-none transition-opacity duration-300" />
      
      {/* Customer Info Overlay */}
      {(customerName || carModel) && (
        <div className="absolute bottom-6 left-4 right-4 z-20 text-white pointer-events-none">
          {customerName && (
            <h4 className="font-['Outfit'] font-bold text-lg leading-tight mb-1 drop-shadow-md">
              {customerName}
            </h4>
          )}
          {carModel && (
            <p className="text-white/80 text-sm font-medium drop-shadow-md">
              {carModel}
            </p>
          )}
        </div>
      )}
      
      {/* Mute Button - Top Right */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/60 transition shadow-sm opacity-100"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
}

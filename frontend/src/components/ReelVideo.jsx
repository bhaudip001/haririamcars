'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

export default function ReelVideo({ src, customerName, carModel, className = "" }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check if it's a YouTube URL
  const isYouTube = src && (src.includes('youtube.com') || src.includes('youtu.be'));
  let youtubeId = '';
  if (isYouTube) {
    if (src.includes('/shorts/')) {
      youtubeId = src.split('/shorts/')[1].split('?')[0];
    } else if (src.includes('youtu.be/')) {
      youtubeId = src.split('youtu.be/')[1].split('?')[0];
    } else if (src.includes('v=')) {
      youtubeId = src.split('v=')[1].split('&')[0];
    }
  }

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

  const iframeRef = useRef(null);

  // Handle auto-play only when visible to prevent website hanging
  useEffect(() => {
    if (!shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (isYouTube && iframeRef.current) {
              iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } else if (!isYouTube && videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            setIsPlaying(true);
            window.dispatchEvent(new CustomEvent('global-video-play', { detail: { id: src } }));
          } else {
            if (isYouTube && iframeRef.current) {
              iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } else if (!isYouTube && videoRef.current) {
              videoRef.current.pause();
            }
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [shouldLoad, isYouTube, src]);

  // Handle global mute and global play
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail.src !== src) {
        setIsMuted(true);
        if (isYouTube && iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
        } else if (!isYouTube && videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };

    const handleGlobalPlay = (e) => {
      if (e.detail.id !== src) {
        if (isYouTube && iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } else if (!isYouTube && videoRef.current) {
          videoRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);
    window.addEventListener('global-video-play', handleGlobalPlay);
    
    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
      window.removeEventListener('global-video-play', handleGlobalPlay);
    };
  }, [src, isYouTube]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (isYouTube && iframeRef.current) {
      if (newMutedState) {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      } else {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      }
    } else if (!isYouTube && videoRef.current) {
      videoRef.current.muted = newMutedState;
    }

    if (!newMutedState) {
      window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src } }));
    }
  };

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      if (isYouTube && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else if (!isYouTube && videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (isYouTube && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        window.dispatchEvent(new CustomEvent('global-video-play', { detail: { id: src } }));
      } else if (!isYouTube && videoRef.current) {
        videoRef.current.play().catch(() => {});
        window.dispatchEvent(new CustomEvent('global-video-play', { detail: { id: src } }));
      }
      setIsPlaying(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-black ${className}`} onClick={togglePlay}>
      {shouldLoad ? (
        isYouTube ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full object-contain absolute inset-0 pointer-events-none"
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
            title={customerName || "Customer Review"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <video
            ref={videoRef}
            src={src.includes('cloudinary.com') ? src.replace('f_auto', 'f_mp4') + '?sw_ignore=true' : src}
            className="w-full h-full object-contain transition-opacity duration-700"
            muted={isMuted}
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster={src && src.includes('cloudinary.com') ? src.replace('f_auto', 'f_auto,so_1').replace(/\.(mp4|MOV|mov)$/i, '.jpg') : undefined}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center absolute inset-0">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 pointer-events-none transition-opacity duration-300" />
      
      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}
      
      {/* Customer Info Overlay */}
      {/*
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
      */}
      
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

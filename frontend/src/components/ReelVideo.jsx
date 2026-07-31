'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function ReelVideo({ src, customerName, carModel, className = "" }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null); // For HTML5
  const ytPlayerRef = useRef(null); // For YouTube
  const ytContainerRef = useRef(null); // For YouTube Div injection
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isYTReady, setIsYTReady] = useState(false);

  // Robust YouTube ID extraction
  const isYouTube = src && (src.includes('youtube.com') || src.includes('youtu.be'));
  let youtubeId = '';
  if (isYouTube) {
    const match = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^"&?\/\s]{11})/);
    if (match && match[1]) {
      youtubeId = match[1];
    }
  }

  // 1. Intersection Observer to Lazy Load
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

    if (containerRef.current) observer.observe(containerRef.current);

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

  // 2. YouTube API Initialization (if it's YouTube and shouldLoad is true)
  useEffect(() => {
    if (!isYouTube || !shouldLoad || !youtubeId) return;
    
    let intervalId;
    let isDestroyed = false;

    const initPlayer = () => {
      if (isDestroyed) return true;
      if (!window.YT || !window.YT.Player) return false;
      if (!ytContainerRef.current) return false;
      
      if (ytPlayerRef.current) {
         try { ytPlayerRef.current.destroy(); } catch(e) {}
      }

      const playerId = 'reel-yt-' + Math.random().toString(36).substring(7);
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.className = 'w-full h-full';
      ytContainerRef.current.innerHTML = '';
      ytContainerRef.current.appendChild(playerDiv);

      ytPlayerRef.current = new window.YT.Player(playerId, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          mute: 1,
          loop: 1,
          playlist: youtubeId,
          playsinline: 1,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            if (isDestroyed) return;
            setIsYTReady(true);
            event.target.playVideo();
          }
        }
      });
      return true; // Successfully started initialization
    };

    if (!window.YT && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript);
      } else {
        document.head.appendChild(tag);
      }
    }
    
    intervalId = setInterval(() => {
      if (initPlayer()) clearInterval(intervalId);
    }, 250);

    return () => {
      isDestroyed = true;
      clearInterval(intervalId);
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch(e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [isYouTube, shouldLoad, youtubeId]);

  // 3. Handle Auto-Play/Pause on scroll visibility (For both YT and HTML5)
  useEffect(() => {
    if (!shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (isYouTube && ytPlayerRef.current && ytPlayerRef.current.playVideo) {
               try { ytPlayerRef.current.playVideo(); } catch(e){}
            } else if (!isYouTube && videoRef.current) {
               videoRef.current.play().catch(() => {});
            }
          } else {
            if (isYouTube && ytPlayerRef.current && ytPlayerRef.current.pauseVideo) {
               try { ytPlayerRef.current.pauseVideo(); } catch(e){}
            } else if (!isYouTube && videoRef.current) {
               videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldLoad, isYouTube, isYTReady]);

  // 4. Handle Global Mute Sync
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail.src !== src) {
        setIsMuted(true);
        if (isYouTube && ytPlayerRef.current && ytPlayerRef.current.mute) {
          try { ytPlayerRef.current.mute(); } catch(e){}
        } else if (!isYouTube && videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };

    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);
    return () => window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
  }, [src, isYouTube]);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (isYouTube && ytPlayerRef.current) {
      if (newMutedState) {
         try { ytPlayerRef.current.mute(); } catch(e){}
      } else {
         try { ytPlayerRef.current.unMute(); } catch(e){}
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
     if (isYouTube && ytPlayerRef.current) {
        try {
           const state = ytPlayerRef.current.getPlayerState();
           if (state === 1) ytPlayerRef.current.pauseVideo();
           else ytPlayerRef.current.playVideo();
        } catch(e){}
     } else if (!isYouTube && videoRef.current) {
        if (videoRef.current.paused) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
     }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-black cursor-pointer ${className}`} onClick={togglePlay}>
      {shouldLoad ? (
        isYouTube ? (
          <div className="w-full h-full absolute inset-0 pointer-events-none scale-[1.35]" ref={ytContainerRef}></div>
        ) : (
          <video
            ref={videoRef}
            src={src && src.includes('cloudinary.com') ? src.replace('f_auto', 'f_mp4') + '?sw_ignore=true' : src}
            className="w-full h-full object-cover transition-opacity duration-700"
            muted={isMuted}
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster={src && src.includes('cloudinary.com') ? src.replace('f_auto', 'f_auto,so_1').replace(/\.(mp4|MOV|mov)$/i, '.jpg') : undefined}
          />
        )
      ) : null}

      {/* Loading Spinner */}
      {(!shouldLoad || (isYouTube && !isYTReady)) && (
        <div className="w-full h-full flex items-center justify-center absolute inset-0 z-10 bg-black">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 pointer-events-none transition-opacity duration-300 z-10" />
      
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
      
      {/* Global Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/70 transition shadow-sm"
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

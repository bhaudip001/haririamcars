'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play } from 'lucide-react';

export default function ReelVideo({ src, customerName, carModel, className = '' }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Extract YouTube ID if it's a YouTube URL
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

  // Safe helper to send postMessage with array args to prevent YouTube apply() crashes
  const sendYouTubeCommand = useCallback((func, args = []) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (_) {}
    }
  }, []);

  // Safe pause and mute helper
  const pauseAndMute = useCallback(() => {
    if (isYouTube) {
      sendYouTubeCommand('pauseVideo');
      sendYouTubeCommand('mute');
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
    setIsPlaying(false);
    setIsMuted(true);
  }, [isYouTube, sendYouTubeCommand]);

  // 1. Auto pause and mute when scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying) {
            pauseAndMute();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying, pauseAndMute]);

  // 2. Global event listeners: Pause when carousel changes slide or another video plays
  useEffect(() => {
    const handleGlobalPlay = (e) => {
      if (e.detail?.id !== src) {
        pauseAndMute();
      }
    };

    const handleStopAll = () => {
      pauseAndMute();
    };

    window.addEventListener('global-video-play', handleGlobalPlay);
    window.addEventListener('stop-all-reels', handleStopAll);

    return () => {
      window.removeEventListener('global-video-play', handleGlobalPlay);
      window.removeEventListener('stop-all-reels', handleStopAll);
    };
  }, [src, pauseAndMute]);

  // Click handler: Single click plays with audio / pauses
  const handleTogglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isPlaying) {
      // Pause
      if (isYouTube) {
        sendYouTubeCommand('pauseVideo');
      } else if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Start with sound
      if (!hasStarted) {
        setHasStarted(true);
      }

      if (isYouTube) {
        sendYouTubeCommand('unMute');
        sendYouTubeCommand('playVideo');
      } else if (!isYouTube && videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }

      setIsPlaying(true);
      setIsMuted(false);

      // Stop any other playing reel
      window.dispatchEvent(new CustomEvent('global-video-play', { detail: { id: src } }));
    }
  };

  // Sound toggle (only toggles audio, strictly stops event bubbling so it NEVER pauses)
  const toggleMute = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (isYouTube) {
      sendYouTubeCommand(newMuted ? 'mute' : 'unMute');
    } else if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const posterUrl = isYouTube && youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : (src && src.includes('cloudinary.com') ? src.replace('f_auto', 'f_auto,so_1').replace(/\.(mp4|MOV|mov)$/i, '.jpg') : undefined);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden group cursor-pointer select-none ${className}`}
      onClick={handleTogglePlay}
    >
      {/* Video Content */}
      {hasStarted ? (
        isYouTube ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full object-contain absolute inset-0 pointer-events-none"
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&mute=0&loop=1&playlist=${youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
            title={customerName || 'Customer Reel'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => {
              sendYouTubeCommand('unMute');
              sendYouTubeCommand('playVideo');
            }}
          />
        ) : (
          <video
            ref={videoRef}
            src={src.includes('cloudinary.com') ? src.replace('f_auto', 'f_mp4') + '?sw_ignore=true' : src}
            className="w-full h-full object-contain transition-opacity duration-700"
            muted={isMuted}
            autoPlay
            loop
            playsInline
            preload="auto"
          />
        )
      ) : (
        /* Poster Image before first play */
        posterUrl && (
          <Image
            src={posterUrl}
            alt={customerName || 'Reel preview'}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 28vw"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        )
      )}

      {/* Subtle Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Center Play Button Overlay (Visible ONLY when paused / idle) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px] z-10 transition-all group-hover:bg-black/15 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-white/30 transform group-hover:scale-110 transition-all duration-300">
            <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Mute/Sound Toggle Button (Visible ONLY while playing, isolated from pause handler) */}
      {isPlaying && (
        <button
          type="button"
          onClick={toggleMute}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/25 text-white hover:bg-black/90 transition-all shadow-xl active:scale-90 pointer-events-auto"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
          )}
        </button>
      )}

      {/* Customer Info Overlay */}
      {(customerName || carModel) && (
        <div className="absolute bottom-4 left-3 right-3 z-20 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg inline-block max-w-full">
            {customerName && (
              <p className="font-bold text-xs sm:text-sm leading-tight text-white drop-shadow truncate">
                {customerName}
              </p>
            )}
            {carModel && (
              <p className="text-[11px] text-purple-300 font-medium drop-shadow truncate">
                {carModel}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

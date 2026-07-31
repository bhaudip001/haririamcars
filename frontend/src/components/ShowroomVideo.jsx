'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

export default function ShowroomVideo() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const playerContainerRef = useRef(null);

  useEffect(() => {
    let intervalId;
    let isDestroyed = false;

    const initPlayer = () => {
      if (isDestroyed) return true; // Stop if unmounted
      if (!window.YT || !window.YT.Player) return false;
      if (!playerContainerRef.current) return false;
      
      // If we already have a player, clean it up
      if (playerRef.current) {
         try { playerRef.current.destroy(); } catch(e) {}
      }

      // Create a fresh div for the player to replace
      const playerId = 'showroom-yt-' + Math.random().toString(36).substring(7);
      const playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      playerDiv.className = 'w-full h-full';
      playerContainerRef.current.innerHTML = '';
      playerContainerRef.current.appendChild(playerDiv);

      playerRef.current = new window.YT.Player(playerId, {
        videoId: 'Y2ZcHOgOJN0',
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          mute: 1,
          loop: 1,
          playlist: 'Y2ZcHOgOJN0',
          playsinline: 1,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            if (isDestroyed) return;
            setIsReady(true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          }
        }
      });
      return true; // Successfully started initialization
    };

    // Inject script if not present
    if (!window.YT && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
    
    // Continuously poll until it successfully initializes
    intervalId = setInterval(() => {
      if (initPlayer()) {
        clearInterval(intervalId);
      }
    }, 250);

    return () => {
      isDestroyed = true;
      clearInterval(intervalId);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch(e) {}
        playerRef.current = null;
      }
    };
  }, []);

  // Play video on intersection and handle global mute
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail.src !== "showroom-video") {
        setIsMuted(true);
        if (playerRef.current && playerRef.current.mute) {
          playerRef.current.mute();
        }
      }
    };
    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!playerRef.current || !playerRef.current.playVideo) return;
          if (entry.isIntersecting) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
      observer.disconnect();
    };
  }, [isReady]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    
    const newMutedState = !isMuted;
    
    if (newMutedState) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
    setIsMuted(newMutedState);

    if (!newMutedState) {
      window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src: "showroom-video" } }));
    }
  };

  return (
    <section className="py-10 md:pt-28 md:pb-16 relative overflow-hidden bg-white dark:bg-[#0a0a12] transition-colors duration-500">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-[0.15em] font-bold transition-colors">Inside Our Showroom</span>
          </div>

          <h2 className="font-['Outfit'] font-bold text-[36px] md:text-[46px] text-black dark:text-white leading-tight mb-4 transition-colors">
            Experience <span className="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Hariram Motors</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-[16px] md:text-[18px] font-['Inter'] leading-relaxed transition-colors">
            Step inside our verified showroom in Surat. Discover our exceptional collection of certified pre-owned cars, meticulously prepared for you.
          </p>
        </div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-black/50 border border-gray-200 dark:border-white/10 group bg-black cursor-pointer aspect-video"
          onClick={togglePlay}
        >
          <div className="w-full h-full absolute inset-0 pointer-events-none scale-[1.2]" ref={playerContainerRef}>
          </div>

          {/* Fallback Poster (shown while loading) */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isReady ? 'opacity-0 pointer-events-none' : 'opacity-100 z-10'}`}>
            <img src="https://img.youtube.com/vi/Y2ZcHOgOJN0/maxresdefault.jpg" alt="Showroom" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-8 h-8 md:w-12 md:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/60 transition shadow-lg opacity-100"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 md:w-6 md:h-6 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 md:w-6 md:h-6 text-white" />
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

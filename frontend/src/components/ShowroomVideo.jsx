'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export default function ShowroomVideo() {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Measure container dimensions for perfect dynamic 16:9 edge-to-edge crop
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 2. YouTube IFrame API initialization for guaranteed continuous non-stop playback
  useEffect(() => {
    let player = null;

    const initYT = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        player = new window.YT.Player('showroom-yt-iframe', {
          events: {
            onReady: (e) => {
              playerRef.current = e.target;
              e.target.mute();
              e.target.playVideo();
            },
            onStateChange: (e) => {
              // State 2 = PAUSED: auto-resume immediately so it plays continuously with ZERO pause icons
              if (e.data === 2) {
                e.target.playVideo();
              }
              // State 0 = ENDED: seek to 0 and loop immediately
              if (e.data === 0) {
                e.target.seekTo(0);
                e.target.playVideo();
              }
            },
          },
        });
      } catch (_) {}
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYT();
      };

      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript?.parentNode?.insertBefore(tag, firstScript);
      }
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        try { player.destroy(); } catch (_) {}
      }
    };
  }, []);

  // 3. Keep video playing when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            } else if (iframeRef.current) {
              iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 4. Audio sync: mute when another audio source is unmuted
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail?.src !== 'showroom-video') {
        setIsMuted(true);
        if (playerRef.current && typeof playerRef.current.mute === 'function') {
          playerRef.current.mute();
        } else if (iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle Mute / Unmute
  const toggleMute = (e) => {
    if (e) e.stopPropagation();

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (newMutedState) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src: 'showroom-video' } }));
      }
    } else if (iframeRef.current) {
      if (newMutedState) {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      } else {
        iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src: 'showroom-video' } }));
      }
    }
  };

  // Toggle Fullscreen / Exit Fullscreen
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => console.log(err));
    } else {
      document.exitFullscreen?.().catch((err) => console.log(err));
    }
  };

  // 5. Calculate dynamic cover dimensions
  // On mobile (W < 640px), YouTube mobile chrome is ~60px, so 1.65x scale is applied to push the top title
  // and bottom "More videos" / YouTube logo completely outside the clipped container.
  // On desktop (W >= 640px), 1.40x scale is applied.
  const getIframeStyle = useCallback(() => {
    if (!dimensions.width || !dimensions.height) {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1.65)',
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none',
      };
    }

    const { width: W, height: H } = dimensions;
    const videoRatio = 16 / 9;
    const containerRatio = W / H;

    let baseW, baseH;
    if (containerRatio > videoRatio) {
      baseW = W;
      baseH = W / videoRatio;
    } else {
      baseH = H;
      baseW = H * videoRatio;
    }

    const scaleFactor = W < 640 ? 1.65 : 1.40;
    const finalW = Math.ceil(baseW * scaleFactor);
    const finalH = Math.ceil(baseH * scaleFactor);

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${finalW}px`,
      height: `${finalH}px`,
      maxWidth: 'none',
      maxHeight: 'none',
      border: 'none',
      pointerEvents: 'none',
    };
  }, [dimensions]);

  return (
    <section className="py-12 md:pt-28 md:pb-20 relative overflow-hidden bg-white dark:bg-[#07070d] transition-colors duration-500">
      {/* Ambient background showroom spotlight glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 shadow-sm transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
            </span>
            <span className="text-purple-700 dark:text-purple-300 text-[11px] md:text-xs uppercase tracking-[0.18em] font-bold transition-colors">
              Inside Our Showroom
            </span>
          </div>

          <h2 className="font-['Outfit'] font-bold text-[32px] sm:text-[42px] md:text-[48px] text-gray-950 dark:text-white leading-[1.15] mb-4 tracking-tight transition-colors">
            Experience <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent">Hariram Motors</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-[15px] sm:text-[17px] md:text-[18px] font-['Inter'] leading-relaxed max-w-2xl mx-auto transition-colors">
            Step inside Surat&apos;s certified pre-owned showroom. Browse pristine luxury vehicles inspected with meticulous precision.
          </p>
        </div>

        {/* Video Player Card with Ambient Backlight */}
        <div className="relative group max-w-6xl mx-auto">
          {/* Multi-tone ambient backlight aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-indigo-600/30 rounded-[34px] blur-2xl opacity-60 dark:opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Main Video Container (Normal 16:9 aspect-video on mobile and desktop) */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/20 dark:shadow-black/70 border border-gray-200/80 dark:border-white/15 bg-black w-full aspect-video select-none"
          >
            {/* YouTube Iframe Layer (Cropped to hide top title and bottom watermark) */}
            <div className="w-full h-full absolute inset-0 pointer-events-none overflow-hidden bg-black flex items-center justify-center">
              <iframe
                id="showroom-yt-iframe"
                ref={iframeRef}
                style={getIframeStyle()}
                src="https://www.youtube.com/embed/Y2ZcHOgOJN0?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=Y2ZcHOgOJN0&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0"
                title="Hariram Motors Showroom Virtual Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Transparent Touch Shield to prevent accidental mobile touches invoking YouTube native touch controls */}
            <div className="absolute inset-0 z-10 bg-transparent cursor-default pointer-events-auto" />

            {/* ══ ESSENTIAL CONTROLS: MUTE / UNMUTE & FULLSCREEN / CLOSE SCREEN ══ */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 sm:gap-2.5 md:gap-3 pointer-events-auto">
              {/* Mute / Unmute Button */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Unmute video' : 'Mute video'}
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 shadow-xl ${
                  isMuted
                    ? 'bg-black/60 hover:bg-black/80 border-white/20 text-white'
                    : 'bg-purple-600/90 hover:bg-purple-600 border-purple-400 text-white shadow-purple-600/40'
                }`}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                )}
              </button>

              {/* Fullscreen / Close Screen Button */}
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center border border-white/20 text-white transition-all duration-300 shadow-xl"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

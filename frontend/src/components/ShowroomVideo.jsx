'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Maximize2, Minimize2, RotateCw } from 'lucide-react';

export default function ShowroomVideo() {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Measure container/screen dimensions dynamically
  useEffect(() => {
    const updateSize = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } else if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);

    let ro = null;
    if (containerRef.current) {
      ro = new ResizeObserver(updateSize);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
      ro?.disconnect();
    };
  }, [isFullscreen]);

  // 2. Body scroll lock when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullscreen]);

  // 3. YouTube IFrame API initialization for continuous non-stop playback
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

  // 4. Keep video playing when scrolled into view
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

  // 5. Audio sync: mute when another audio source is unmuted
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

    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);
    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
    };
  }, []);

  // 6. Enter Fullscreen (Native API + CSS fallback for iOS Safari + Landscape Lock)
  const enterFullscreenMode = useCallback(async () => {
    const elem = containerRef.current;
    if (!elem) return;

    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (_) {
      // Graceful fallback for iOS Safari / restricted environments
    }

    setIsFullscreen(true);
    setShowControls(true);

    // Auto-lock landscape on supported mobile browsers
    try {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        await screen.orientation.lock('landscape');
      }
    } catch (_) {}
  }, []);

  // 7. Exit Fullscreen
  const exitFullscreenMode = useCallback(async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (_) {}

    setIsFullscreen(false);
    setIsRotated(false);
    setShowControls(true);

    try {
      if (screen.orientation && typeof screen.orientation.unlock === 'function') {
        screen.orientation.unlock();
      }
    } catch (_) {}
  }, []);

  // 8. Native fullscreen change and escape key handlers
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
        setIsRotated(false);
        try {
          if (screen.orientation && typeof screen.orientation.unlock === 'function') {
            screen.orientation.unlock();
          }
        } catch (_) {}
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreenMode();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, exitFullscreenMode]);

  // 9. Auto-hide controls timer in fullscreen mode
  const resetControlsTimer = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      resetControlsTimer();
    } else if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen, resetControlsTimer]);

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
    if (isFullscreen) {
      exitFullscreenMode();
    } else {
      enterFullscreenMode();
    }
  };

  // Toggle Landscape 90deg Flip (Ideal for mobile phones locked in portrait)
  const toggleRotate = (e) => {
    if (e) e.stopPropagation();
    setIsRotated((prev) => !prev);
    setShowControls(true);
    resetControlsTimer();
  };

  // 8. Calculate dynamic dimensions
  // INLINE: Subtle 1.25x - 1.35x cover scale to conceal YouTube top title & watermark.
  // FULLSCREEN: Letterbox contain or rotated contain to show 100% of the showroom video with ZERO cropping!
  const getIframeStyle = useCallback(() => {
    const { width: W, height: H } = dimensions;
    const videoRatio = 16 / 9;

    if (!W || !H) {
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none',
      };
    }

    // ══ FULLSCREEN DISPLAY LOGIC ══
    if (isFullscreen) {
      const isPortrait = H > W;

      // Case A: Mobile Portrait with 90° Landscape Flip Enabled
      if (isPortrait && isRotated) {
        let targetW = H;
        let targetH = Math.ceil(H / videoRatio);

        if (targetH > W) {
          targetH = W;
          targetW = Math.ceil(W * videoRatio);
        }

        return {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          width: `${targetW}px`,
          height: `${targetH}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          border: 'none',
          pointerEvents: 'none',
          transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
        };
      }

      // Case B: Mobile Portrait (Normal Vertical Orientation - Clean Letterbox Fit)
      if (isPortrait) {
        const targetW = W;
        const targetH = Math.ceil(W / videoRatio);

        return {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${targetW}px`,
          height: `${targetH}px`,
          maxWidth: 'none',
          maxHeight: 'none',
          border: 'none',
          pointerEvents: 'none',
          transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
        };
      }

      // Case C: Landscape Mode (Desktop, Laptop, or Mobile Turned Sideways)
      const containerRatio = W / H;
      let targetW, targetH;

      if (containerRatio >= videoRatio) {
        targetH = H;
        targetW = Math.ceil(H * videoRatio);
      } else {
        targetW = W;
        targetH = Math.ceil(W / videoRatio);
      }

      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${targetW}px`,
        height: `${targetH}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        border: 'none',
        pointerEvents: 'none',
      };
    }

    // ══ INLINE DISPLAY LOGIC ══
    const containerRatio = W / H;
    let baseW, baseH;
    if (containerRatio > videoRatio) {
      baseW = W;
      baseH = W / videoRatio;
    } else {
      baseH = H;
      baseW = H * videoRatio;
    }

    const scaleFactor = W < 640 ? 1.35 : 1.25;
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
  }, [dimensions, isFullscreen, isRotated]);

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

          {/* Main Video Container (Adaptive: Normal aspect-video inline vs Fullscreen fixed overlay) */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`overflow-hidden select-none transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 z-[99999] w-screen h-screen rounded-none border-none bg-black flex items-center justify-center'
                : 'relative rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-950/20 dark:shadow-black/70 border border-gray-200/80 dark:border-white/15 bg-black w-full aspect-video'
            }`}
          >
            {/* YouTube Iframe Layer */}
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

            {/* Interactive Touch Shield: tap anywhere to reveal/toggle controls in fullscreen */}
            <div
              onClick={() => {
                if (isFullscreen) {
                  setShowControls((prev) => !prev);
                  resetControlsTimer();
                }
              }}
              onMouseMove={() => {
                if (isFullscreen) {
                  setShowControls(true);
                  resetControlsTimer();
                }
              }}
              className="absolute inset-0 z-10 bg-transparent cursor-default pointer-events-auto"
            />

            {/* ══ FULLSCREEN TOP BAR CONTROLS ══ */}
            {isFullscreen ? (
              <div
                className={`absolute top-0 inset-x-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 pointer-events-auto ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Left: Branding Badge */}
                <div className="flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-white text-xs sm:text-sm font-semibold tracking-wide font-['Outfit']">
                    Hariram Motors Showroom
                  </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Rotate / Flip Button (Available on Portrait mobile screens) */}
                  {dimensions.height > dimensions.width && (
                    <button
                      onClick={toggleRotate}
                      aria-label={isRotated ? 'Switch to portrait view' : 'Rotate to landscape'}
                      title={isRotated ? 'Switch to portrait' : 'Rotate to landscape'}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 shadow-xl ${
                        isRotated
                          ? 'bg-purple-600 hover:bg-purple-500 border-purple-300 text-white shadow-purple-600/50 scale-105'
                          : 'bg-black/70 hover:bg-black/90 border-white/20 text-white'
                      }`}
                    >
                      <RotateCw
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                          isRotated ? 'rotate-90 text-white' : 'text-white/90'
                        }`}
                      />
                    </button>
                  )}

                  {/* Mute / Unmute Button */}
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    title={isMuted ? 'Unmute video' : 'Mute video'}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center border transition-all duration-300 shadow-xl ${
                      isMuted
                        ? 'bg-black/70 hover:bg-black/90 border-white/20 text-white'
                        : 'bg-purple-600 hover:bg-purple-500 border-purple-300 text-white shadow-purple-600/50'
                    }`}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </button>

                  {/* Close / Exit Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    aria-label="Exit Fullscreen"
                    title="Exit Fullscreen"
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transition-all duration-300 shadow-xl active:scale-95"
                  >
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* ══ INLINE ESSENTIAL CONTROLS: MUTE / UNMUTE & FULLSCREEN ══ */
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 sm:gap-2.5 md:gap-3 pointer-events-auto">
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

                <button
                  onClick={toggleFullscreen}
                  aria-label="Enter Fullscreen"
                  title="Fullscreen"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center border border-white/20 text-white transition-all duration-300 shadow-xl active:scale-95"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </button>
              </div>
            )}

            {/* Hint pill for mobile portrait mode in fullscreen */}
            {isFullscreen && dimensions.height > dimensions.width && !isRotated && showControls && (
              <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
                <div className="bg-black/75 backdrop-blur-md text-white/90 text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full border border-white/15 shadow-2xl flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Tap rotate or turn phone for full landscape</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

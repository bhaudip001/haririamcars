'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

export default function ShowroomVideo() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Play video on intersection and handle global mute
  useEffect(() => {
    const handleOtherVideoUnmuted = (e) => {
      if (e.detail.src !== "https://res.cloudinary.com/dvo48lu7g/video/upload/q_auto,f_auto/v1781839047/hariram-motors-videos/showroom_video.mp4") {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };
    window.addEventListener('video-unmuted', handleOtherVideoUnmuted);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      window.removeEventListener('video-unmuted', handleOtherVideoUnmuted);
      observer.disconnect();
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const newMutedState = !isMuted;

    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }

    if (!newMutedState) {
      window.dispatchEvent(new CustomEvent('video-unmuted', { detail: { src: "https://res.cloudinary.com/dvo48lu7g/video/upload/q_auto,f_auto/v1781839047/hariram-motors-videos/showroom_video.mp4" } }));
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white dark:bg-[#0a0a12] transition-colors duration-500">
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
            Step inside our premium showroom in Surat. Discover our exceptional collection of certified pre-owned cars, meticulously prepared for you.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-black/50 border border-gray-200 dark:border-white/10 group bg-black cursor-pointer aspect-video"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dvo48lu7g/video/upload/q_auto,f_mp4/v1781839047/hariram-motors-videos/showroom_video.mp4"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            defaultMuted={true}
            playsInline
            preload="metadata"
            poster="https://res.cloudinary.com/dvo48lu7g/video/upload/q_auto,f_auto,so_1/v1781839047/hariram-motors-videos/showroom_video.jpg"
          />

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

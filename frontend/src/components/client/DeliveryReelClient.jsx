'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { Play, Volume2, VolumeX, Star, Quote } from 'lucide-react';
import 'swiper/css';

export default function DeliveryReelClient({ initialReels }) {
  // Since we only have one video for now, let's duplicate it so the slider looks full.
  const reels = initialReels && initialReels.length > 0 ? initialReels : [
    {
      id: 1,
      videoSrc: 'https://res.cloudinary.com/dvo48lu7g/video/upload/v1781787590/IMG_5502_zo5slm.mp4',
      customerName: 'Bhimabhai shamla',
      carModel: 'Creta 2020',
      review: '',
    },
    {
      id: 2,
      videoSrc: 'https://res.cloudinary.com/dvo48lu7g/video/upload/v1781787957/hariram-motors-videos/IMG_5506.mp4',
      customerName: 'Ajudiya Rameshbhai',
      carModel: 'Endeavour 2018',
      review: '',
    },
    {
      id: 3,
      videoSrc: 'https://res.cloudinary.com/dvo48lu7g/video/upload/v1781788203/hariram-motors-videos/IMG_5509.mp4',
      customerName: 'Arjunbhai Kavithiya',
      carModel: 'Slavia 2022',
      review: '',
    },
    {
      id: 4,
      videoSrc: 'https://res.cloudinary.com/dvo48lu7g/video/upload/v1781788441/hariram-motors-videos/IMG_5510.mp4',
      customerName: 'Natha Ram',
      carModel: 'Brezza 2020',
      review: '',
    },
    {
      id: 5,
      videoSrc: 'https://res.cloudinary.com/dvo48lu7g/video/upload/v1781788601/hariram-motors-videos/IMG_5514.mp4',
      customerName: 'Der Rajubhai',
      carModel: 'Verna 2021',
      review: '',
    }
  ];

  return (
    <section className="py-10 md:py-14 lg:py-20 relative z-10 bg-[#f4f4f8] dark:bg-[#0a0a12] transition-colors duration-500 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-200/40 dark:bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <div>
            <p className="text-purple-600 dark:text-purple-400 text-xs font-bold tracking-widest uppercase mb-3 transition-colors">CUSTOMER EXPERIENCES</p>
            <h2 className="text-3xl md:text-[40px] text-black dark:text-white font-bold leading-tight transition-colors" style={{ fontFamily: 'var(--font-outfit)' }}>
              Customer Delivery Reels
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Watch the exciting moments when our customers drive home their dream cars.</p>
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0">
          <Swiper
            modules={[Mousewheel]}
            slidesPerView={'auto'}
            spaceBetween={16}
            mousewheel={{ forceToAxis: true }}
            className="!overflow-visible"
            breakpoints={{
              640: { spaceBetween: 24 }
            }}
          >
            {reels.map((reel) => (
              <SwiperSlide key={reel.id} className="!w-[280px] sm:!w-[320px]">
                <ReelCard reel={reel} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

function ReelCard({ reel }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Play video on intersection (when it comes into view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {
               // Auto-play might be blocked, that's fine
               setIsPlaying(false);
            });
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
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
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="relative w-full h-[500px] sm:h-[568px] rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer shadow-xl shadow-black/50 border border-white/10"
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={reel.videoSrc}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      ></video>

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Mute/Unmute Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/60 transition"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Content Overlay (Bottom gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10 flex flex-col justify-end p-5">
        <div className="mt-auto">
          <h4 className="text-white font-semibold text-sm md:text-base">{reel.customerName}</h4>
          <p className="text-gray-300 text-xs md:text-sm">{reel.carModel}</p>
        </div>
      </div>
    </div>
  );
}

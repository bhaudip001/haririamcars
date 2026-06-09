'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   Animated counter for micro-stat numbers
   ───────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const inc = target / steps;
          let cur = 0;
          const timer = setInterval(() => {
            cur += inc;
            if (cur >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(cur));
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}<span className="text-purple-400">{suffix}</span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Star icon (inline SVG for amber stars)
   ───────────────────────────────────────────── */
function StarIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Verified check icon
   ───────────────────────────────────────────── */
function VerifiedIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

/* ═════════════════════════════════════════════
   ABOUT HERO — "THE WALL OF TRUST"
   ═════════════════════════════════════════════ */
export default function AboutHero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Ticker content */
  const tickerItems = [
    { name: 'Rahul D.', action: 'bought a Hyundai Creta' },
    { name: 'Priya S.', action: 'sold her Swift' },
    { name: 'Amit P.', action: 'upgraded to Fortuner' },
    { name: 'Neha M.', action: 'found her first car here' },
    { name: 'Vikram T.', action: 'exchanged his i20' },
    { name: 'Sneha K.', action: 'bought a Honda City' },
  ];

  return (
    <section
      id="about-hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh', background: '#0a0a12' }}
    >
      {/* ══════════════ BACKGROUND LAYER (z-0) ══════════════ */}

      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 blueprint-grid hero-enter-grid"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* "TRUSTED" watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center hero-enter-grid"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <span className="trust-watermark">TRUSTED</span>
      </div>

      {/* Purple glow orb — top-right */}
      <div
        className="absolute hero-enter-orb animate-orb-breathe"
        style={{
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* Purple glow orb — bottom-left */}
      <div
        className="absolute hero-enter-orb animate-orb-breathe"
        style={{
          bottom: '-80px',
          left: '-80px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
          filter: 'blur(30px)',
          animationDelay: '3s',
        }}
        aria-hidden="true"
      />

      {/* ══════════════ FOREGROUND CONTENT (z-10) ══════════════ */}
      <div
        className="relative flex items-center"
        style={{ zIndex: 10, minHeight: '100vh', paddingTop: '60px', paddingBottom: '140px' }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

            {/* ━━━━━━━━━━━ LEFT COLUMN (55%) — TEXT ━━━━━━━━━━━ */}
            <div className="lg:w-[55%] w-full text-center lg:text-left">

              {/* Animated entry tag / pill badge */}
              <div className="hero-enter-badge flex justify-center lg:justify-start mb-8">
                <div
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
                  style={{
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.3)',
                  }}
                >
                  {/* Live pulse dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-live-pulse" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="text-purple-400 text-sm font-medium font-['Inter']">
                    Surat&apos;s Most Trusted Since 2013
                  </span>
                </div>
              </div>

              {/* Main heading */}
              <h1 className="font-['Outfit'] font-bold leading-[1.08] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(32px, 4.2vw, 54px)' }}
              >
                <span className="hero-enter-h1-1 block text-white whitespace-nowrap">We Don&apos;t Just Sell Cars.</span>
                <span className="hero-enter-h1-2 block text-white">We Build <span className="text-trust-gradient">Trust.</span></span>
              </h1>

              {/* Sub-headline */}
              <p
                className="hero-enter-sub font-['Inter'] text-[#a0a0b8] leading-8 max-w-md mx-auto lg:mx-0 mt-6"
                style={{ fontSize: '18px' }}
              >
                Over a decade, 500+ families in Surat have trusted us
                with one of the biggest decisions of their lives.
                That responsibility drives everything we do.
              </p>

              {/* Micro stats row */}
              <div className="hero-enter-stats flex items-center justify-center lg:justify-start gap-0 mt-10">
                {/* Stat 1 */}
                <div className="flex flex-col items-center lg:items-start px-5 first:pl-0">
                  <span className="font-['Outfit'] font-bold text-[28px] text-white leading-none">
                    <AnimatedNumber target={500} suffix="+" />
                  </span>
                  <span className="font-['Inter'] text-[12px] text-[#6b6b80] uppercase tracking-wider mt-1">
                    Happy Customers
                  </span>
                </div>
                {/* Separator */}
                <div className="h-8 w-px self-center" style={{ background: 'rgba(255,255,255,0.1)' }} />
                {/* Stat 2 */}
                <div className="flex flex-col items-center lg:items-start px-5">
                  <span className="font-['Outfit'] font-bold text-[28px] text-white leading-none">
                    <AnimatedNumber target={150} suffix="+" />
                  </span>
                  <span className="font-['Inter'] text-[12px] text-[#6b6b80] uppercase tracking-wider mt-1">
                    Cars in Stock
                  </span>
                </div>
                {/* Separator */}
                <div className="h-8 w-px self-center" style={{ background: 'rgba(255,255,255,0.1)' }} />
                {/* Stat 3 */}
                <div className="flex flex-col items-center lg:items-start px-5">
                  <span className="font-['Outfit'] font-bold text-[28px] text-white leading-none">
                    <AnimatedNumber target={10} suffix="+" />
                  </span>
                  <span className="font-['Inter'] text-[12px] text-[#6b6b80] uppercase tracking-wider mt-1">
                    Years of Trust
                  </span>
                </div>
              </div>

              {/* CTA row */}
              <div className="hero-enter-cta flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <a
                  href="#our-story"
                  className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white rounded-xl px-7 py-3.5 font-['Inter'] font-semibold text-[15px] transition-all duration-300 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)]"
                >
                  Explore Our Story ↓
                </a>
                <a
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-['Inter'] font-semibold text-[15px] text-white transition-all duration-300 hover:text-purple-300"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  View Inventory →
                </a>
              </div>
            </div>

            {/* ━━━━━━━━━━━ RIGHT COLUMN (45%) — VISUAL ━━━━━━━━━━━ */}
            <div className="lg:w-[45%] w-full mt-12 lg:mt-0 mb-16 lg:mb-0 relative z-10">
              <div className="relative" style={{ maxWidth: '520px', margin: '0 auto' }}>

                {/* Dashed decorative border behind card */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    border: '2px dashed rgba(124,58,237,0.2)',
                    transform: 'translate(12px, 12px)',
                    zIndex: 0,
                  }}
                  aria-hidden="true"
                />

                {/* Main showroom card */}
                <div
                  className="hero-enter-card relative overflow-hidden rounded-3xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(20px)',
                    transform: 'rotate(2deg)',
                    aspectRatio: '4/3',
                    zIndex: 1,
                  }}
                >
                  <Image
                    src="/hero_bg_real.jpg"
                    alt="Hariram Motors Showroom — Premium used car dealership in Surat"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{
                      background: 'linear-gradient(to top, rgba(10,10,18,0.85), transparent)',
                    }}
                  />
                  {/* Info strip over gradient */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between">
                    <div>
                      <div className="text-white font-bold text-[15px] font-['Outfit']">
                        Hariram Motors Showroom
                      </div>
                      <div className="text-[#a0a0b8] text-xs mt-1 font-['Inter']">
                        Varachha, Surat — Est. 2013
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── Floating Card 1: Google Rating (top-left) ── */}
                <div
                  className="hero-enter-float1 animate-float-card absolute -top-12 -left-2 sm:-top-16 sm:-left-8"
                  style={{
                    width: '180px',
                    zIndex: 5,
                  }}
                >
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(40px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <StarIcon size={16} />
                      <span className="text-white font-bold text-sm font-['Outfit']">4.3 Rating</span>
                    </div>
                    <div className="text-slate-300 text-xs mt-1 font-['Inter']">
                      from 500+ Google reviews
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <StarIcon size={12} />
                      <StarIcon size={12} />
                      <StarIcon size={12} />
                      <StarIcon size={12} />
                      <StarIcon size={12} />
                    </div>
                  </div>
                </div>

                {/* ── Floating Card 2: 100% Verified (bottom-right) ── */}
                <div
                  className="hero-enter-float2 animate-float-card-delayed absolute -bottom-16 -right-2 sm:-bottom-20 sm:-right-6"
                  style={{
                    width: '160px',
                    zIndex: 5,
                  }}
                >
                  <div
                    className="rounded-2xl p-4 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(40px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    }}
                  >
                    <VerifiedIcon />
                    <div className="text-white font-bold text-sm font-['Outfit']">100% Verified</div>
                    <div className="text-slate-300 text-xs font-['Inter']">Every car inspected</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>




      {/* ══════════════ SOCIAL PROOF TICKER ══════════════ */}
      <div
        className="hero-enter-ticker absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 15,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="relative overflow-hidden py-5">
          {/* Left fade edge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[120px] pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #0a0a12, transparent)',
              zIndex: 2,
            }}
          />
          {/* Right fade edge */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[120px] pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #0a0a12, transparent)',
              zIndex: 2,
            }}
          />

          {/* Scrolling ticker content — duplicated for seamless loop */}
          <div className="animate-ticker flex whitespace-nowrap" style={{ width: 'max-content' }}>
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="text-amber-400 mr-1.5">⭐</span>
                <span className="text-[#6b6b80] text-sm font-['Inter']">
                  {item.name} {item.action}
                </span>
                <span className="text-purple-600 mx-6">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

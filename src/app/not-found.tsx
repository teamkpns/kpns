'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ── Floating particle config ────────────────────────────────────────────────
const PARTICLES = [
  { emoji: '🏏', size: 32, x: 8,  y: 15, dur: 6,  delay: 0   },
  { emoji: '🏆', size: 28, x: 85, y: 10, dur: 8,  delay: 1   },
  { emoji: '🌸', size: 24, x: 20, y: 70, dur: 7,  delay: 2   },
  { emoji: '🎭', size: 26, x: 75, y: 65, dur: 9,  delay: 0.5 },
  { emoji: '🎶', size: 22, x: 50, y: 8,  dur: 5,  delay: 3   },
  { emoji: '🏅', size: 30, x: 90, y: 40, dur: 7,  delay: 1.5 },
  { emoji: '🌿', size: 20, x: 5,  y: 45, dur: 10, delay: 0.2 },
  { emoji: '⭐', size: 18, x: 60, y: 80, dur: 6,  delay: 2.5 },
  { emoji: '🎪', size: 24, x: 35, y: 88, dur: 8,  delay: 1.2 },
  { emoji: '🤝', size: 22, x: 15, y: 30, dur: 9,  delay: 3.5 },
  { emoji: '🌙', size: 20, x: 70, y: 20, dur: 7,  delay: 0.8 },
  { emoji: '🎯', size: 26, x: 45, y: 55, dur: 6,  delay: 4   },
];

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 50, y: 30 });
  const physicsRef = useRef({ x: 50, y: 30, dx: 1.2, dy: 0.8 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bouncing cricket ball physics via rAF to avoid stale closures
  useEffect(() => {
    if (!mounted) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(now - last, 50); // cap to 50ms
      last = now;
      const p = physicsRef.current;
      p.x += p.dx * (dt / 16);
      p.y += p.dy * (dt / 16);
      if (p.x <= 5 || p.x >= 95)  p.dx = -p.dx;
      if (p.y <= 5 || p.y >= 95)  p.dy = -p.dy;
      p.x = Math.max(5, Math.min(95, p.x));
      p.y = Math.max(5, Math.min(95, p.y));
      setBallPos({ x: p.x, y: p.y });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  return (
    <>
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50%  { transform: translateY(-24px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        }
        @keyframes glitch-1 {
          0%,100%{ clip-path: inset(0 0 98% 0); transform: translate(-4px, 0); }
          20%    { clip-path: inset(30% 0 50% 0); transform: translate(4px, 0); }
          40%    { clip-path: inset(65% 0 20% 0); transform: translate(-2px, 0); }
          60%    { clip-path: inset(80% 0 5%  0); transform: translate(3px,  0); }
          80%    { clip-path: inset(10% 0 75% 0); transform: translate(-3px, 0); }
        }
        @keyframes glitch-2 {
          0%,100%{ clip-path: inset(98% 0 0 0); transform: translate(4px, 0); color: #ff3366; }
          20%    { clip-path: inset(50% 0 30% 0); transform: translate(-4px, 0); color: #33ccff; }
          40%    { clip-path: inset(20% 0 65% 0); transform: translate(2px, 0); }
          60%    { clip-path: inset( 5% 0 80% 0); transform: translate(-3px, 0); color: #ff3366; }
          80%    { clip-path: inset(75% 0 10% 0); transform: translate(3px, 0);  color: #33ccff; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0%,100% { d: path("M0,40 C150,80 350,0 500,40 C650,80 850,0 1000,40 L1000,100 L0,100 Z"); }
          50%      { d: path("M0,60 C150,20 350,80 500,60 C650,20 850,80 1000,60 L1000,100 L0,100 Z"); }
        }
        @keyframes bounce-in {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .glitch-wrap { position: relative; }
        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          color: inherit;
        }
        .glitch-wrap::before {
          color: #33ccff;
          animation: glitch-1 3s infinite linear;
        }
        .glitch-wrap::after {
          color: #ff3366;
          animation: glitch-2 3s infinite linear;
        }
        .shimmer-btn {
          background: linear-gradient(90deg, #3447AA 25%, #5b72d4 50%, #3447AA 75%);
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      <div className="relative min-h-screen bg-gradient-to-br from-[#0f1535] via-[#1a2560] to-[#0f1535] overflow-hidden flex flex-col items-center justify-center px-4 select-none">

        {/* ── Star-field background ── */}
        {mounted && Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `pulse-ring ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}

        {/* ── Floating emoji particles ── */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: p.size,
              animation: `float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0.6,
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* ── Bouncing cricket ball ── */}
        {mounted && (
          <div
            className="absolute text-3xl pointer-events-none transition-none"
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 0 8px rgba(255,80,80,0.8))',
            }}
          >
            🔴
          </div>
        )}

        {/* ── Glow ring behind 404 ── */}
        <div
          className="absolute rounded-full border-4 border-[#3447AA]/30"
          style={{
            width: 380,
            height: 380,
            animation: 'pulse-ring 3s ease-in-out infinite',
            boxShadow: '0 0 80px 20px rgba(52,71,170,0.3)',
          }}
        />
        <div
          className="absolute rounded-full border border-[#FBEAEB]/20"
          style={{
            width: 480,
            height: 480,
            animation: 'spin-slow 20s linear infinite',
            borderStyle: 'dashed',
          }}
        />

        {/* ── Main content card ── */}
        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ animation: 'fade-slide-up 0.7s ease-out both' }}
        >
          {/* KPNS badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-pink-200 tracking-widest uppercase"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.1s both' }}
          >
            🏛️ KPNS — Official Portal
          </div>

          {/* 404 glitch number */}
          <div
            className="glitch-wrap font-black text-white leading-none mb-2"
            data-text="404"
            style={{
              fontSize: 'clamp(100px, 22vw, 200px)',
              letterSpacing: '-4px',
              textShadow: '0 0 40px rgba(52,71,170,0.8)',
              animation: 'bounce-in 0.8s cubic-bezier(.36,.07,.19,.97) 0.2s both',
            }}
          >
            404
          </div>

          {/* Divider cricket bat */}
          <div
            className="text-4xl mb-4"
            style={{ animation: 'float-up 3s ease-in-out infinite', filter: 'drop-shadow(0 0 10px rgba(255,200,50,0.8))' }}
          >
            🏏
          </div>

          {/* Headline */}
          <h1
            className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.4s both' }}
          >
            এই পৃষ্ঠাটি পাওয়া যাচ্ছে না!
          </h1>
          <p
            className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed mb-2"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.5s both' }}
          >
            Looks like this page went out of bounds — just like a cricket ball over the boundary!
          </p>
          <p
            className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.55s both' }}
          >
            মনে হচ্ছে আপনি ভুল পথে এসেছেন। নিচের বোতামে ক্লিক করে ঘরে ফিরুন।
          </p>

          {/* Action buttons */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 mb-10"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.65s both' }}
          >
            <Link
              href="/"
              className="shimmer-btn text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-transform no-underline flex items-center gap-2"
            >
              🏠 Back to Home
            </Link>
            <Link
              href="/about"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 no-underline flex items-center gap-2"
            >
              📖 About KPNS
            </Link>
            <Link
              href="/login"
              className="bg-[#FBEAEB]/10 hover:bg-[#FBEAEB]/20 border border-[#FBEAEB]/30 text-pink-200 font-bold text-sm px-7 py-3.5 rounded-2xl transition-all hover:scale-105 active:scale-95 no-underline flex items-center gap-2"
            >
              🔐 Member Login
            </Link>
          </div>

          {/* Quick-links grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full"
            style={{ animation: 'fade-slide-up 0.6s ease-out 0.75s both' }}
          >
            {[
              { href: '/team',    emoji: '👥', label: 'Our Team'    },
              { href: '/about?tab=kpnscup', emoji: '🏆', label: 'KPNS CUP' },
              { href: '/contact', emoji: '📬', label: 'Contact'     },
              { href: '/register',emoji: '📝', label: 'Join KPNS'   },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white rounded-2xl p-3 flex flex-col items-center gap-1 transition-all hover:scale-105 no-underline group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">{item.emoji}</span>
                <span className="text-[11px] font-bold text-slate-300">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom wave ── */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
            <path
              d="M0,40 C150,80 350,0 500,40 C650,80 850,0 1000,40 L1000,100 L0,100 Z"
              fill="rgba(52,71,170,0.3)"
            />
            <path
              d="M0,60 C200,20 400,80 600,50 C750,30 900,70 1000,50 L1000,100 L0,100 Z"
              fill="rgba(52,71,170,0.15)"
            />
          </svg>
          <div className="bg-[#3447AA]/10 py-3 text-center text-[11px] text-slate-500 font-semibold tracking-wider">
            খেজুরদা পল্লীউন্নয়ন নারায়ণ সংঘ (KPNS) • Est. 1935 • Reg. No. SO168946
          </div>
        </div>
      </div>
    </>
  );
}

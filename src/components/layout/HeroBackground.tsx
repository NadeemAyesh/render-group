"use client";

import React from "react";

export interface HeroBackgroundProps {
  /**
   * Style variant:
   * - 'studio-nexus': Precision grid + spotlight + orbital curves + ambient aurora (Recommended)
   * - 'aurora-glow': Soft fluid gradient glow + golden spotlights (Minimalist Luxury)
   * - 'cyber-grid': High-density tech matrix for futuristic AI vibe
   */
  variant?: "studio-nexus" | "aurora-glow" | "cyber-grid";
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ variant = "studio-nexus" }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. TOP SPOTLIGHT BEAM - Concentrated golden radiance from top center */}
      <div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] md:w-[1200px] h-[580px] pointer-events-none transition-opacity duration-700 opacity-80 dark:opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212, 175, 55, 0.28) 0%, rgba(212, 175, 55, 0.10) 45%, rgba(212, 175, 55, 0.02) 75%, transparent 100%)",
        }}
      />

      {/* 2. AMBIENT GLOW ORBS - Soft, warm breathing lights */}
      {/* Top-Right Warm Gold Orb */}
      <div className="absolute top-[10%] -right-24 md:right-[5%] w-[420px] md:w-[540px] h-[420px] md:h-[540px] bg-gradient-to-br from-gold-400/20 via-gold-500/10 to-transparent rounded-full blur-[110px] md:blur-[130px] animate-pulse duration-[7000ms] pointer-events-none" />

      {/* Bottom-Left Rich Amber Orb */}
      <div className="absolute -bottom-16 -left-24 md:left-[5%] w-[450px] md:w-[580px] h-[450px] md:h-[580px] bg-gradient-to-tr from-amber-600/15 via-gold-600/10 to-transparent rounded-full blur-[120px] md:blur-[140px] pointer-events-none" />

      {/* Subtle Center Underglow behind Title */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] md:w-[750px] h-[280px] bg-gold-500/8 dark:bg-gold-500/12 rounded-full blur-[90px] pointer-events-none" />

      {/* 3. ARCHITECTURAL STUDIO GRID - Geometric precision with radial fade mask */}
      {variant !== "aurora-glow" && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 dark:opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.22) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 175, 55, 0.22) 1px, transparent 1px)
            `,
            backgroundSize: variant === "cyber-grid" ? "32px 32px" : "48px 48px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, #000 25%, rgba(0,0,0,0.4) 60%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 30%, #000 25%, rgba(0,0,0,0.4) 60%, transparent 85%)",
          }}
        />
      )}

      {/* 4. VECTOR ART: ORBITAL TECH RINGS & FLOW WAVES */}
      {variant === "studio-nexus" && (
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] lg:w-[1400px] h-[650px] pointer-events-none opacity-40 dark:opacity-45"
          viewBox="0 0 1400 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbital Concentric Curves centered around the hero header */}
          <ellipse
            cx="700"
            cy="200"
            rx="460"
            ry="220"
            stroke="url(#goldRingGrad1)"
            strokeWidth="1.2"
            strokeDasharray="5 7"
          />
          <ellipse
            cx="700"
            cy="200"
            rx="620"
            ry="300"
            stroke="url(#goldRingGrad2)"
            strokeWidth="1.2"
          />
          <ellipse
            cx="700"
            cy="200"
            rx="780"
            ry="380"
            stroke="url(#goldRingGrad1)"
            strokeWidth="1"
            strokeDasharray="3 9"
          />

          {/* Flow Waves - Symbolizing Render frequency & AI data streams */}
          <path
            d="M -50 440 C 300 300, 550 500, 880 340 C 1100 230, 1300 400, 1500 280"
            stroke="url(#waveGrad1)"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M 0 500 C 350 360, 600 560, 930 400 C 1150 290, 1350 460, 1550 340"
            stroke="url(#waveGrad2)"
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="4 6"
          />

          <defs>
            <linearGradient id="goldRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B8860B" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="goldRingGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="30%" stopColor="#E5C07B" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#B8860B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="25%" stopColor="#D4AF37" stopOpacity="0.5" />
              <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#B8860B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* 5. LUXURY MICRO-SPARKS - Delicate golden glints at key focal points */}
      <div className="hidden sm:block absolute top-20 right-[12%] text-gold-500/50 dark:text-gold-400/40 text-base animate-pulse duration-[5000ms]">
        ✦
      </div>
      <div className="hidden sm:block absolute top-36 left-[14%] text-gold-600/45 dark:text-gold-300/35 text-xs animate-bounce duration-[7000ms]">
        ✦
      </div>
      <div className="hidden sm:block absolute bottom-28 right-[18%] text-amber-500/40 text-sm animate-pulse duration-[6000ms]">
        ✦
      </div>
      <div className="hidden sm:block absolute bottom-36 left-[10%] text-gold-500/45 text-xs">
        ✦
      </div>

      {/* 6. TOP & BOTTOM SEAMLESS EDGE FADE */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--background)] to-transparent pointer-events-none" />
    </div>
  );
};

"use client";

import React from "react";
import Link from "next/link";

export interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  categoryBadge: string;
  badgeStyle: string; // e.g. "bg-blue-500/15 text-blue-400 border-blue-500/30"
  client: string;
  clientLocation: string;
  summary: string;
  budget: string;
  location: string;
  rating?: number;
  metric: string;
  techStack: string[];
  visualType: "saas" | "cinema" | "fintech" | "legal" | "ecommerce";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  categoryBadge,
  badgeStyle,
  client,
  clientLocation,
  summary,
  budget,
  location,
  rating = 5.0,
  metric,
  techStack,
  visualType,
}) => {
  return (
    <div className="tool-card rounded-3xl border border-gold-500/25 p-0 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/15">
      {/* ================= CARD BACKGROUND MOTION & AURORA ================= */}
      {/* 1. Ambient Corner Aurora Glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-gold-500/20 via-gold-400/10 to-transparent blur-3xl animate-card-glow pointer-events-none group-hover:scale-130 group-hover:from-gold-500/35 transition-all duration-700" />
      
      {/* 2. Secondary Bottom Glow */}
      <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-gradient-to-tr from-amber-600/15 via-gold-500/8 to-transparent blur-2xl pointer-events-none group-hover:from-amber-600/25 transition-all duration-700" />
      
      {/* 3. Subtle Digital Pattern */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.18] pointer-events-none group-hover:opacity-40 transition-opacity duration-300"
        style={{
          backgroundImage: "radial-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 25%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, #000 25%, transparent 85%)",
        }}
      />

      {/* 4. Light Sweep Shimmer on Hover */}
      <div className="card-shimmer" />

      {/* ================= TOP VISUAL BANNER WITH TECH ANIMATION ================= */}
      <div className="relative h-44 w-full bg-gradient-to-b from-dark-900/90 to-dark-950/60 border-b border-gold-500/15 overflow-hidden flex items-center justify-center p-4">
        {/* Floating Category & Rating Badges */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-sm ${badgeStyle}`}>
            {categoryBadge}
          </span>
        </div>

        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-950/80 border border-gold-500/30 backdrop-blur-md text-gold-400 text-[11px] font-bold shadow-sm">
          <span className="text-amber-400">★</span>
          <span>{rating.toFixed(1)}</span>
          <span className="text-gray-400 font-normal text-[10px]">موثق</span>
        </div>

        {/* Dynamic Abstract Technical Visual according to project type */}
        {visualType === "saas" && (
          <div className="w-full h-full flex items-center justify-center relative">
            <svg className="w-48 h-32 opacity-85 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 200 130" fill="none">
              {/* Cloud Mesh Center */}
              <rect x="35" y="45" width="130" height="60" rx="10" fill="#0F172A" stroke="url(#saasG)" strokeWidth="1.6" />
              {/* Server Blades */}
              <line x1="50" y1="62" x2="150" y2="62" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50" y1="78" x2="150" y2="78" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50" y1="92" x2="150" y2="92" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              {/* Blinking LEDs */}
              <circle cx="56" cy="62" r="2.5" fill="#10B981" className="animate-pulse" />
              <circle cx="56" cy="78" r="2.5" fill="#3B82F6" className="animate-pulse" />
              <circle cx="56" cy="92" r="2.5" fill="#D4AF37" className="animate-pulse" />
              <circle cx="68" cy="62" r="1.5" fill="#10B981" />
              <circle cx="68" cy="78" r="1.5" fill="#3B82F6" />
              <circle cx="68" cy="92" r="1.5" fill="#D4AF37" />
              {/* Cloud top symbol */}
              <path d="M75 32a15 15 0 0 1 28-5 12 12 0 0 1 22 5h3a12 12 0 0 1 0 24H72a12 12 0 0 1 3-24z" fill="#1E293B" stroke="url(#saasG)" strokeWidth="1.5" />
              {/* Data stream lines */}
              <line x1="100" y1="36" x2="100" y2="45" stroke="#D4AF37" strokeWidth="1.8" strokeDasharray="2 3" className="animate-pulse" />
              <defs>
                <linearGradient id="saasG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {visualType === "cinema" && (
          <div className="w-full h-full flex items-center justify-center relative">
            <svg className="w-48 h-32 opacity-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 200 130" fill="none">
              {/* Cinema 16:9 Viewfinder */}
              <rect x="25" y="20" width="150" height="90" rx="8" fill="#0A0D14" stroke="url(#cinG)" strokeWidth="1.6" />
              {/* Crosshairs Corner Marks */}
              <path d="M35 30h8M35 30v8 M165 30h-8M165 30v8 M35 100h8M35 100v-8 M165 100h-8M165 100v-8" stroke="#D4AF37" strokeWidth="1.5" />
              {/* REC Indicator */}
              <circle cx="48" cy="40" r="3" fill="#EF4444" className="animate-pulse" />
              <text x="56" y="43" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="monospace">REC 4K</text>
              {/* Audio / Motion Spectrum Wave */}
              <path d="M40 75q15-15 30 0t30 0t30 0t30 0" stroke="url(#cinWave)" strokeWidth="1.8" fill="none" />
              {/* Holographic Play Button */}
              <circle cx="100" cy="65" r="14" fill="#D4AF37" fillOpacity="0.2" stroke="#D4AF37" strokeWidth="1.5" className="group-hover:scale-110 transition-transform origin-center" />
              <polygon points="96,58 108,65 96,72" fill="#FFFFFF" />
              <defs>
                <linearGradient id="cinG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="cinWave" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {visualType === "fintech" && (
          <div className="w-full h-full flex items-center justify-center relative">
            <svg className="w-48 h-32 opacity-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 200 130" fill="none">
              {/* Cryptographic Shield */}
              <path d="M100 22l38 12v32c0 24-22 42-38 48-16-6-38-24-38-48V34l38-12z" fill="#0F172A" stroke="url(#finG)" strokeWidth="1.8" />
              {/* Golden Escrow Core Lock */}
              <rect x="88" y="56" width="24" height="20" rx="4" fill="url(#goldL)" />
              <path d="M93 56v-6a7 7 0 0 1 14 0v6" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="100" cy="65" r="2.5" fill="#07090E" />
              {/* Currency Orbit Nodes */}
              <circle cx="48" cy="55" r="10" fill="#1E293B" stroke="#10B981" strokeWidth="1.4" />
              <text x="44" y="60" fill="#10B981" fontSize="11" fontWeight="bold">₮</text>
              <line x1="58" y1="58" x2="72" y2="65" stroke="#10B981" strokeWidth="1.4" strokeDasharray="3 3" />

              <circle cx="152" cy="55" r="10" fill="#1E293B" stroke="#D4AF37" strokeWidth="1.4" />
              <text x="149" y="60" fill="#D4AF37" fontSize="12" fontWeight="bold">$</text>
              <line x1="142" y1="58" x2="128" y2="65" stroke="#D4AF37" strokeWidth="1.4" strokeDasharray="3 3" />
              <defs>
                <linearGradient id="finG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="goldL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* ================= CARD BODY & CONTENT ================= */}
      <div className="p-6 flex-1 flex flex-col justify-between relative z-10 space-y-4">
        <div>
          {/* Client & Verification line */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="material-symbols-outlined text-gold-500 text-[14px]">apartment</span>
              <span>{client}</span>
            </span>
            <span className="text-[10px] text-gray-400">{clientLocation}</span>
          </div>

          {/* Project Title */}
          <h3 className="text-base font-bold text-white group-hover:text-gold-400 transition-colors leading-snug">
            {title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
            {summary}
          </p>

          {/* Key Metric Achievement Banner */}
          <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-between text-[11px]">
            <span className="text-gold-400 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              الإنجاز الرئيسي:
            </span>
            <span className="text-slate-800 dark:text-gray-200 font-semibold">{metric}</span>
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-dark-900 border border-gold-500/20 text-gray-400 text-[10px] font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Budget, Location & Action CTA */}
        <div className="pt-4 border-t border-gold-500/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400">الميزانية المعتمدة</span>
            <span className="font-mono text-emerald-400 font-bold text-base leading-tight">
              {budget}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 hidden sm:flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-gold-500">pin_drop</span>
              <span>{location}</span>
            </span>

            <Link
              href={`/projects#${id}`}
              className="px-3.5 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-dark-950 border border-gold-500/30 text-xs font-bold flex items-center gap-1 transition-all group/btn"
            >
              <span>التفاصيل</span>
              <span className="material-symbols-outlined text-[14px] group-hover/btn:-translate-x-1 transition-transform">
                arrow_back
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

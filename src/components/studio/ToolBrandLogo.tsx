"use client";

import React from "react";

interface ToolBrandLogoProps {
  toolId: string;
  className?: string;
  size?: number;
}

export const ToolBrandLogo: React.FC<ToolBrandLogoProps> = ({
  toolId,
  className = "",
  size = 32,
}) => {
  switch (toolId) {
    // 1. GPT Image 2 (OpenAI Signature Vortex Logo)
    case "gpt-image-2":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M21.5 10.2a6 6 0 0 0-.5-4.8 6.1 6.1 0 0 0-4-3 6.1 6.1 0 0 0-6.1.9 6 6 0 0 0-3.6.4 6 6 0 0 0-3 3.9 6.1 6.1 0 0 0 .5 6.2 6 6 0 0 0 .5 4.8 6.1 6.1 0 0 0 4 3 6.1 6.1 0 0 0 6.1-.9 6 6 0 0 0 3.6-.4 6 6 0 0 0 3-3.9 6.1 6.1 0 0 0-.5-6.2z"
            stroke="url(#gptGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 8.2v7.6l6-3.8-6-3.8z"
            fill="url(#gptGrad)"
            opacity="0.9"
          />
          <defs>
            <linearGradient id="gptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10A37F" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 2. Render Chat (Render Group Custom Dual AI Spark Logo)
    case "render-chat":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Main Chat Bubble */}
          <path
            d="M19 12c0 3.866-3.582 7-8 7-1.34 0-2.607-.29-3.714-.812L3 19l1.1-3.238C3.418 14.654 3 13.373 3 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
            stroke="url(#chatGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 4-point AI Star inside */}
          <path
            d="M11 8.5c0 1.38 1.12 2.5 2.5 2.5-1.38 0-2.5 1.12-2.5 2.5 0-1.38-1.12-2.5-2.5-2.5 1.38 0 2.5-1.12 2.5-2.5z"
            fill="url(#chatGrad)"
          />
          <circle cx="16.5" cy="8.5" r="1" fill="#6366F1" />
          <defs>
            <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 3. Virtual Try-on (Holographic 3D Fashion Hanger & Scanner)
    case "virtual-try-on":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Hanger Hook */}
          <path
            d="M12 4a2 2 0 0 0-2 2c0 .8.5 1.5 1.2 1.8L3 13.5c-.6.4-.3 1.5.5 1.5h17c.8 0 1.1-1.1.5-1.5L12.8 7.8A2 2 0 0 0 12 4z"
            stroke="url(#tryonGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Laser Grid Scanner */}
          <line x1="6" y1="18" x2="18" y2="18" stroke="url(#tryonGrad)" strokeWidth="1.8" strokeDasharray="2 3" />
          <line x1="8" y1="21" x2="16" y2="21" stroke="url(#tryonGrad)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="tryonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 4. Veo 3.1 (Google DeepMind Cinematic Radiant Prism Star)
    case "veo-3-1":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Google DeepMind Veo 4-point Radiant Star */}
          <path
            d="M12 2C12 7.52 7.52 12 2 12c5.52 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z"
            fill="url(#veoGrad)"
          />
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" opacity="0.9" />
          <defs>
            <linearGradient id="veoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="33%" stopColor="#EA4335" />
              <stop offset="66%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 5. Seedance 2.0 (ByteDance Iconic 4 Dynamic Equalizer Bars)
    case "seedance-2-0":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* ByteDance 4 Rhythm / Motion Bars */}
          <rect x="3.5" y="7" width="3.5" height="10" rx="1.75" fill="#00f0ff" />
          <rect x="8.5" y="4" width="3.5" height="16" rx="1.75" fill="#3b82f6" />
          <rect x="13.5" y="8" width="3.5" height="12" rx="1.75" fill="#ec4899" />
          <rect x="18.5" y="5" width="3.5" height="14" rx="1.75" fill="#f59e0b" />
        </svg>
      );

    // 6. Nano Banana Pro (Isometric 4K Cyber Banana Prism)
    case "nano-banana-pro":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M5 19c6 3 13 0 16-12-.5 0-2 1-3.5 1.5C15 13 10 16 5 19z"
            fill="url(#bananaGrad)"
          />
          <path
            d="M6 18c4.5-2 9.5-6.5 10.5-12.5-.8.5-2 1-3.5 1.5C9.5 11 6.5 15 6 18z"
            fill="#FFE169"
            opacity="0.9"
          />
          <circle cx="18" cy="6" r="1.5" fill="#D4AF37" />
          <defs>
            <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 7. Omni Transition (Dual Frames Morphing Waveform)
    case "omni-transition":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Left Frame */}
          <rect x="2" y="5" width="8" height="14" rx="2" stroke="#60A5FA" strokeWidth="1.6" />
          {/* Right Frame */}
          <rect x="14" y="5" width="8" height="14" rx="2" stroke="#D4AF37" strokeWidth="1.6" />
          {/* Morphing Infinity Wave Arrow */}
          <path
            d="M7 12c2.5-3 4.5 3 7 0"
            stroke="url(#omniGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M13 10l2 2-2 2" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="omniGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 8. Prompt Extractor (AI Reverse Engineering Scanner Lens)
    case "prompt-extractor":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="11" cy="11" r="7" stroke="url(#promptGrad)" strokeWidth="1.8" />
          <path d="M16 16l5 5" stroke="url(#promptGrad)" strokeWidth="2.2" strokeLinecap="round" />
          {/* Code Prompt Brackets </> inside */}
          <path d="M9 9.5l-2 1.5 2 1.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 9.5l2 1.5-2 1.5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="promptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 9. AI Avatar (Biometric Talking Face Mesh & Soundwave)
    case "ai-avatar":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Biometric Head Outline */}
          <path
            d="M12 3a7 7 0 0 0-7 7c0 5 4 8 7 11 3-3 7-6 7-11a7 7 0 0 0-7-7z"
            stroke="url(#avatarGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Talking Audio Spectrum inside */}
          <line x1="9" y1="10" x2="9" y2="12" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12" y2="14" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="15" y1="10" x2="15" y2="12" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 10. Face Swap (Dual Interlocking Biometric Masks)
    case "face-swap":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Mask 1 */}
          <path
            d="M9 5a4.5 4.5 0 0 0-4.5 4.5c0 3 2.5 5 4.5 7 2-2 4.5-4 4.5-7A4.5 4.5 0 0 0 9 5z"
            stroke="#38BDF8"
            strokeWidth="1.6"
          />
          {/* Mask 2 (Interlocking) */}
          <path
            d="M15 7.5a4.5 4.5 0 0 0-4.5 4.5c0 3 2.5 5 4.5 7 2-2 4.5-4 4.5-7A4.5 4.5 0 0 0 15 7.5z"
            stroke="#F59E0B"
            strokeWidth="1.6"
          />
          {/* Swap arrows */}
          <path d="M7 21h10M17 21l-2-2M7 21l2 2" stroke="url(#swapGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="swapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 11. Motion Master (Runway 3D Camera Bezier Vector)
    case "motion-master":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Camera icon */}
          <rect x="3" y="6" width="11" height="9" rx="2" stroke="url(#motionGrad)" strokeWidth="1.8" />
          <path d="M14 8.5l5-3v8.5l-5-3" stroke="url(#motionGrad)" strokeWidth="1.8" strokeLinejoin="round" />
          {/* 3D Motion Path with keyframe dots */}
          <path d="M3 19c4-4 10-1 15-4" stroke="#D4AF37" strokeWidth="1.6" strokeDasharray="3 3" />
          <circle cx="3" cy="19" r="1.5" fill="#8B5CF6" />
          <circle cx="10" cy="16.5" r="1.5" fill="#D4AF37" />
          <circle cx="18" cy="15" r="2" fill="#EC4899" />
          <defs>
            <linearGradient id="motionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 12. Virtual Studio (3D Softbox Aperture & Pedestal)
    case "virtual-studio":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Studio Camera Aperture */}
          <circle cx="12" cy="10" r="6" stroke="url(#studioGrad)" strokeWidth="1.8" />
          <path d="M12 4v4M12 12v4M6.8 7l3.5 2M13.7 11l3.5 2M6.8 13l3.5-2M13.7 9l3.5-2" stroke="url(#studioGrad)" strokeWidth="1.2" />
          {/* Lighting Stand / Pedestal */}
          <path d="M4 21h16M12 16v5" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="studioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#E5C07B" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return (
        <span className="material-symbols-outlined text-[26px] text-gold-400">
          token
        </span>
      );
  }
};

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AuthUser,
  getActiveSession,
  clearActiveSession,
  getRedirectUrlForRole,
  ROLE_LABELS,
} from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  onOpenActivation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenActivation }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentUser(getActiveSession());

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<AuthUser | null>;
      setCurrentUser(customEvent.detail ?? getActiveSession());
    };

    window.addEventListener("renderlancer_auth_change", handleAuthChange);
    return () => {
      window.removeEventListener("renderlancer_auth_change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    clearActiveSession();
    setCurrentUser(null);
  };

  return (
    <>
      {/* Top Ticker with Countdown */}
      <div className="bg-dark-900 border-b border-gold-500/20 py-2 px-6 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <span className="text-gold-400 font-semibold">
              {currentUser ? `مرحباً بك، ${currentUser.fullName}:` : "حسابك التجريبي نشط:"}
            </span>
            <span>
              الفترة التجريبية الشاملة لكافة الأدوات الـ 12 تنتهي خلال:{" "}
              <strong className="text-white font-mono bg-dark-800 px-2 py-0.5 rounded border border-gold-500/30">
                23 ساعة و 51 دقيقة
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenActivation}
              className="text-gold-400 hover:text-white underline font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">key</span>
              أدخل رمز التفعيل
            </button>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">
              رصيد محفظة العمل الحر:{" "}
              <strong className="text-emerald-400 font-mono">$120.00</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 w-full z-40 bg-dark-950/90 backdrop-blur-xl border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-lg shadow-gold-500/20">
                <span className="material-symbols-outlined text-[26px]">all_inclusive</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Render<span className="text-gold-500">Lancer</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-medium">
                    Studio Ecosystem
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block -mt-0.5">
                  منصة العمل الحر وترسانة أدوات الذكاء الاصطناعي الموحدة
                </span>
              </div>
            </Link>

            {/* Nav Links - Dedicated Pages */}
            <nav className="hidden xl:flex items-center gap-6 mr-8 text-sm font-medium text-gray-300">
              <Link href="/" className="hover:text-gold-400 transition-colors">
                الرئيسية
              </Link>
              <Link href="/cv-builder" className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-gold-400 font-semibold">
                <span className="material-symbols-outlined text-[18px]">description</span>
                صانع السيرة الذاتية (ATS)
              </Link>
              <Link href="/ai-studio" className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-gold-300 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-gold-500">token</span>
                استوديو أدوات الـ AI
              </Link>
              <Link href="/jobs" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-gold-500">work</span>
                الوظائف
              </Link>
              <Link href="/talents" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-gold-500">groups</span>
                المواهب والمستقلون
              </Link>
              <Link href="/companies" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-blue-400">corporate_fare</span>
                الشركات والجهات
              </Link>
              <Link href="/about" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-gold-500">info</span>
                من نحن
              </Link>
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Mode Switcher */}
            <ThemeToggle />

            {isMounted && currentUser ? (
              <div className="flex items-center gap-3">
                {/* Active User Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-gold-500/25">
                  <div className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold text-xs">
                    {currentUser.avatar || currentUser.fullName.slice(0, 2)}
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-white leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[9px] text-gold-400 font-medium">
                      {ROLE_LABELS[currentUser.role]?.ar || currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Dashboard Direct Shortcut Button */}
                <Link
                  href={getRedirectUrlForRole(currentUser.role)}
                  className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
                  <span>لوحة التحكم</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-2 rounded-xl bg-dark-900 hover:bg-dark-850 text-gray-400 hover:text-red-400 border border-gold-500/20 transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-gold-400 transition-colors"
                >
                  تسجيل الدخول
                </Link>

                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>انضم الآن</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AuthUser,
  getActiveSession,
  getRedirectUrlForRole,
} from "@/lib/auth-service";

interface MobileBottomNavProps {
  onOpenActivation?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenActivation }) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
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

  // Close "more" drawer on route changes
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  // Main primary tabs on the bottom navigation bar
  const mainNavItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: "home",
      exact: true,
    },
    {
      href: "/ai-studio",
      label: "استوديو الـ AI",
      icon: "token",
      badge: "12 أداة",
    },
    {
      href: "/courses",
      label: "الأكاديمية",
      icon: "school",
      badge: "جديد",
    },
    {
      href: "/pricing",
      label: "الأسعار",
      icon: "loyalty",
    },
  ];

  // Secondary items in the "More" bottom sheet
  const moreNavItems = [
    {
      href: "/jobs",
      label: "الوظائف والفرص",
      icon: "work",
      desc: "تصفح أحدث الوظائف والمشاريع المطروحة",
    },
    {
      href: "/talents",
      label: "المواهب والمستقلون",
      icon: "badge",
      desc: "نخبة الكفاءات والمبدعين المستقلين",
    },
    {
      href: "/companies",
      label: "الشركات والجهات",
      icon: "domain",
      desc: "شركاء النجاح وأصحاب الأعمال",
    },
    {
      href: "/projects",
      label: "المشاريع المنجزة",
      icon: "verified",
      desc: "أعمال حقيقية تم تسليمها وتوثيقها",
    },
    {
      href: "/cv-builder",
      label: "صانع السيرة الذاتية (ATS)",
      icon: "description",
      desc: "سيرة ذاتية متوافقة مع أنظمة الفرز الذكي",
    },
    {
      href: "/about",
      label: "من نحن",
      icon: "info",
      desc: "رؤية ورسالة ريندر لخدمة الكفاءات",
    },
    {
      href: "/faq",
      label: "الأسئلة الشائعة",
      icon: "help",
      desc: "إجابات على أكثر الاستفسارات تكراراً",
    },
    {
      href: "/contact",
      label: "تواصل معنا",
      icon: "support_agent",
      desc: "فريق الدعم الفني وخدمة العملاء",
    },
  ];

  const isMoreActive = moreNavItems.some((item) => pathname === item.href);

  return (
    <>
      {/* ================= BOTTOM SHEET OVERLAY ================= */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-200 xl:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* ================= "MORE" BOTTOM SHEET ================= */}
      <div
        className={`fixed inset-x-0 bottom-[68px] z-50 max-h-[75vh] bg-white dark:bg-dark-900 border-t border-gold-500/25 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-300 ease-out xl:hidden ${
          isMoreOpen ? "translate-y-0" : "translate-y-[120%] pointer-events-none"
        }`}
        dir="rtl"
      >
        {/* Handle bar & Header */}
        <div className="p-4 pb-2 border-b border-slate-100 dark:border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              جميع أقسام ريندر
            </h3>
          </div>
          <button
            onClick={() => setIsMoreOpen(false)}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* User Quick Bar inside Sheet */}
        {isMounted && currentUser && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-gold-500/10 to-amber-500/5 border border-gold-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-500 text-dark-950 font-black text-sm flex items-center justify-center shadow-xs">
                {currentUser.avatar || currentUser.fullName.slice(0, 2)}
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                  {currentUser.fullName}
                </span>
                <span className="block text-[10px] text-amber-700 dark:text-gold-400 font-semibold">
                  مرحباً بك مجدداً
                </span>
              </div>
            </div>
            <Link
              href={getRedirectUrlForRole(currentUser.role)}
              onClick={() => setIsMoreOpen(false)}
              className="px-3 py-1.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
              <span>لوحتي</span>
            </Link>
          </div>
        )}

        {/* Scrollable grid of links */}
        <div className="p-4 overflow-y-auto space-y-1.5 max-h-[calc(75vh-120px)] pb-6">
          <div className="grid grid-cols-2 gap-2">
            {moreNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex flex-col p-3 rounded-2xl border transition-all text-right ${
                    active
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-gold-300 font-bold"
                      : "bg-slate-50/70 dark:bg-dark-950/60 border-slate-200/70 dark:border-dark-800 text-slate-800 dark:text-gray-200 hover:border-gold-500/40 hover:bg-gold-500/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        active
                          ? "text-amber-600 dark:text-gold-400"
                          : "text-amber-600/80 dark:text-gold-400/80"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 leading-tight line-clamp-1">
                    {item.desc}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Quick Activation Shortcut Button if provided */}
          {onOpenActivation && (
            <button
              onClick={() => {
                setIsMoreOpen(false);
                onOpenActivation();
              }}
              className="w-full mt-2 py-2.5 px-4 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/15 transition-all"
            >
              <span className="material-symbols-outlined text-base">vpn_key</span>
              <span>تفعيل باقة أو كود وصول</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav
        aria-label="شريط التنقل السفلي للهواتف"
        dir="rtl"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-t border-gold-500/20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.4)] xl:hidden safe-area-pb"
      >
        <div className="h-[64px] max-w-lg mx-auto px-2 flex items-center justify-around">
          {mainNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all select-none ${
                  isActive
                    ? "text-amber-600 dark:text-gold-400 font-bold"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 rounded-full bg-gradient-to-r from-amber-500 to-gold-400 shadow-sm shadow-gold-500/50" />
                )}

                <div className="relative flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-[23px] transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-500 border border-white dark:border-dark-950" />
                  )}
                </div>

                <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* User Dashboard / Login / Register Button if logged in */}
          {isMounted && currentUser ? (
            <Link
              href={getRedirectUrlForRole(currentUser.role)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all select-none ${
                pathname.startsWith("/admin") || pathname.startsWith("/dashboard")
                  ? "text-amber-600 dark:text-gold-400 font-bold"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-gold-500/20 border border-gold-500/40 text-amber-700 dark:text-gold-300 font-bold text-[11px] flex items-center justify-center">
                {currentUser.avatar || currentUser.fullName.slice(0, 1)}
              </div>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                حسابي
              </span>
            </Link>
          ) : (
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              type="button"
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all select-none ${
                isMoreOpen || isMoreActive
                  ? "text-amber-600 dark:text-gold-400 font-bold"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
              }`}
            >
              {isMoreActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-gradient-to-r from-amber-500 to-gold-400 shadow-sm shadow-gold-500/50" />
              )}
              <span
                className={`material-symbols-outlined text-[23px] transition-transform ${
                  isMoreOpen ? "rotate-90 text-amber-600 dark:text-gold-400" : ""
                }`}
              >
                {isMoreOpen ? "expand_more" : "apps"}
              </span>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                المزيد
              </span>
            </button>
          )}

          {/* If user logged in, still provide the "More" button */}
          {isMounted && currentUser && (
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              type="button"
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all select-none ${
                isMoreOpen || isMoreActive
                  ? "text-amber-600 dark:text-gold-400 font-bold"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
              }`}
            >
              {isMoreActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-gradient-to-r from-amber-500 to-gold-400 shadow-sm shadow-gold-500/50" />
              )}
              <span
                className={`material-symbols-outlined text-[23px] transition-transform ${
                  isMoreOpen ? "rotate-90 text-amber-600 dark:text-gold-400" : ""
                }`}
              >
                {isMoreOpen ? "expand_more" : "apps"}
              </span>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                المزيد
              </span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

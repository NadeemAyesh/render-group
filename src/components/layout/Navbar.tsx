"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AuthUser,
  AuthRole,
  getActiveSession,
  clearActiveSession,
  getRedirectUrlForRole,
} from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ActionIconButton } from "@/components/ui/ActionIconButton";

interface NavbarProps {
  onOpenActivation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenActivation }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

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

  // Helper to extract a clean, compact display name
  const getCleanDisplayName = (name: string) => {
    if (!name) return "";
    return name.split(/[\(\-]/)[0].trim() || name;
  };

  // Helper for a short, crisp role label
  const getCleanRoleLabel = (role: AuthRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "مدير النظام العام";
      case "EMPLOYER":
        return "صاحب عمل";
      case "JOB_SEEKER":
        return "مستقل";
      case "CONTENT_EDITOR":
        return "محرر محتوى";
      default:
        return role;
    }
  };

  const navLinks = [
    {
      href: "/",
      label: "الرئيسية",
    },
    {
      href: "/pricing",
      label: "الأسعار والباقات",
      badge: "عروض",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    },
    {
      href: "/ai-studio",
      label: "استوديو الـ AI",
      badge: "12 أداة",
      badgeColor: "bg-gold-500/15 text-amber-900 dark:text-gold-300 border-gold-500/30",
    },
    {
      href: "/courses",
      label: "أكاديمية الدورات",
      badge: "جديد",
      badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
    {
      href: "/jobs",
      label: "الوظائف",
    },
    {
      href: "/talents",
      label: "المواهب والمستقلون",
    },
    {
      href: "/companies",
      label: "الشركات والجهات",
    },
    {
      href: "/about",
      label: "من نحن",
    },
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 dark:bg-dark-950/90 backdrop-blur-xl border-b border-gold-500/20 shadow-sm">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-md shadow-gold-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">all_inclusive</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Render<span className="gold-gradient-text">Lancer</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold-500/15 text-amber-900 dark:text-gold-300 border border-gold-500/35 font-bold shadow-xs whitespace-nowrap">
                  Studio Ecosystem
                </span>
              </div>
              <span className="hidden 2xl:block text-[10px] text-slate-500 dark:text-gray-400 font-medium -mt-0.5 whitespace-nowrap">
                منصة العمل الحر وترسانة أدوات الذكاء الاصطناعي الموحدة
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links - Centered with even spacing */}
        <nav className="hidden xl:flex items-center justify-center flex-1 gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs 2xl:text-[13px] transition-all whitespace-nowrap ${
                  isActive
                    ? "text-amber-600 dark:text-gold-400 font-extrabold"
                    : "text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-gold-400 font-semibold hover:bg-gold-500/10"
                }`}
              >
                <span>{link.label}</span>

                {link.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border whitespace-nowrap leading-none ${link.badgeColor}`}
                  >
                    {link.badge}
                  </span>
                )}

                {/* Sleek active underline indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-500 to-gold-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Theme Mode Switcher */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>

          {isMounted && currentUser ? (
            <div className="flex items-center gap-2">
              {/* Compact Active User Pill */}
              <div 
                title={`${currentUser.fullName} - ${getCleanRoleLabel(currentUser.role)}`}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-dark-900 border border-gold-500/30 shadow-xs flex-shrink-0"
              >
                <div className="w-6 h-6 rounded-md bg-gold-500 text-dark-950 flex items-center justify-center font-black text-[11px] shadow-xs flex-shrink-0">
                  {currentUser.avatar || currentUser.fullName.slice(0, 2)}
                </div>
                <div className="text-right leading-tight max-w-[130px]">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate whitespace-nowrap">
                    {getCleanDisplayName(currentUser.fullName)}
                  </span>
                  <span className="block text-[9px] text-amber-700 dark:text-gold-400 font-semibold truncate whitespace-nowrap">
                    {getCleanRoleLabel(currentUser.role)}
                  </span>
                </div>
              </div>

              {/* Dashboard Direct Shortcut Button */}
              <Link
                href={getRedirectUrlForRole(currentUser.role)}
                className="px-3.5 py-1.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
                <span>لوحة التحكم</span>
              </Link>

              {/* Logout Button */}
              <ActionIconButton
                icon="logout"
                label="تسجيل الخروج"
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="shadow-xs hover:scale-105 active:scale-95"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-gray-100 bg-white dark:bg-dark-900/80 hover:bg-gold-500/10 border border-gold-500/30 hover:border-gold-500/60 shadow-xs transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/register"
                className="px-4 py-1.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1 shadow-sm shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">person_add</span>
                <span>انضم الآن</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DEMO_ACCOUNTS,
  getRegisteredUsers,
  setActiveSession,
  getRedirectUrlForRole,
  AuthUser,
} from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Check in DEMO_ACCOUNTS
      const demoMatch = DEMO_ACCOUNTS[normalizedEmail];
      if (demoMatch && demoMatch.password === password) {
        setActiveSession(demoMatch.user);
        router.push(demoMatch.redirectUrl);
        return;
      }

      // 2. Check in dynamically registered users
      const registeredUsers = getRegisteredUsers();
      const registeredMatch = registeredUsers[normalizedEmail];
      if (registeredMatch && registeredMatch.password === password) {
        setActiveSession(registeredMatch.user);
        router.push(registeredMatch.redirectUrl);
        return;
      }

      // 3. Fallback for test emails with valid credentials
      if (normalizedEmail.includes("@") && password.length >= 6) {
        const newUser: AuthUser = {
          id: `u-${Date.now()}`,
          fullName: normalizedEmail.split("@")[0],
          email: normalizedEmail,
          role: "JOB_SEEKER",
          location: "فلسطين (عن بعد)",
          avatar: normalizedEmail.slice(0, 2).toUpperCase(),
        };
        setActiveSession(newUser);
        router.push(getRedirectUrlForRole("JOB_SEEKER"));
        return;
      }

      setIsLoading(false);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من صحة البيانات والمحاولة مجدداً.");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Theme Switcher */}
      <div className="absolute top-6 left-6 z-20">
        <ThemeToggle compact />
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link href="/" className="inline-flex items-center justify-center mb-4 group">
          <Image
            src="/logo.png"
            alt="Render Connect"
            width={200}
            height={50}
            className="h-12 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt="Render Connect"
            width={200}
            height={50}
            className="h-12 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform"
            priority
          />
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">تسجيل الدخول إلى حسابك</h2>
        <p className="mt-1 text-xs text-gray-400">
          منظومة العمل الحر واستوديو أدوات الذكاء الاصطناعي لكفاءات فلسطين والشتات
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                  mail
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white">كلمة المرور</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-gold-400 hover:underline font-semibold"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans pr-3.5 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                />
                <span>تذكر بياناتي على هذا الجهاز</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-500/25 transition-all mt-2 disabled:opacity-50"
            >
              <span>{isLoading ? "جاري التحقق والدخول..." : "تسجيل الدخول"}</span>
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gold-500/15">
            <span>ليس لديك حساب بعد؟ </span>
            <Link href="/register" className="text-gold-400 hover:underline font-bold">
              إنشاء حساب جديد مجاناً
            </Link>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

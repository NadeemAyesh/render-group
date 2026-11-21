"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Theme Switcher */}
      <div className="absolute top-6 left-6 z-20">
        <ThemeToggle compact />
      </div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">all_inclusive</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Render<span className="text-gold-500">Lancer</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">استعادة كلمة المرور</h2>
        <p className="mt-1 text-xs text-gray-400">
          أدخل بريدك الإلكتروني المسجل لإرسال رابط إعادة تعيين كلمة المرور
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-6">
          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3">
              <span className="material-symbols-outlined text-emerald-400 text-[48px]">mark_email_read</span>
              <h4 className="text-base font-bold text-white">تم إرسال الرابط!</h4>
              <p className="text-xs text-emerald-300 leading-relaxed">
                إذا كان البريد <strong>{email}</strong> مسجلاً لدينا، فقد أرسلنا لك رابطاً مؤمناً لتعيين كلمة مرور جديدة.
              </p>
              <Link
                href="/login"
                className="inline-block mt-3 px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>إرسال رابط الاستعادة</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          )}

          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gold-500/15">
            <Link href="/login" className="text-gold-400 hover:underline font-bold">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

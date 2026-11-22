"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  onOpenActivation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenActivation }) => {
  return (
    <footer className="border-t border-gold-500/20 bg-dark-950 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center md:text-right">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gold-500/15">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 justify-center md:justify-start">
              <Image
                src="/logo-dark.png"
                alt="Render Connect"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              منصة العمل الحر وتمكين الكفاءات الفلسطينية واستوديو الذكاء الاصطناعي الموحد. إحدى المبادرات التكنولوجية
              لمجموعة <strong className="text-gold-400">Render Group</strong>.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="text-xs font-semibold text-gold-400 hover:underline flex items-center gap-1 justify-center md:justify-start"
              >
                <span>تعرف على قصة ورؤية Render Group</span>
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              </Link>
            </div>
          </div>

          {/* Quick Pages */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">صفحات المنظومة</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/courses" className="hover:text-gold-400 transition-colors text-amber-400 font-semibold flex items-center gap-1.5 justify-center md:justify-start">
                  <span>أكاديمية الدورات والتكليفات</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">يوتيوب ومتابعة</span>
                </Link>
              </li>
              <li>
                <Link href="/cv-builder" className="hover:text-gold-400 transition-colors text-gold-400 font-semibold">
                  صانع السيرة الذاتية (ATS Builder)
                </Link>
              </li>
              <li>
                <Link href="/ai-studio" className="hover:text-gold-400 transition-colors">
                  استوديو أدوات الـ AI (12 أداة)
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-gold-400 transition-colors">
                  سوق الوظائف والمشاريع
                </Link>
              </li>
              <li>
                <Link href="/talents" className="hover:text-gold-400 transition-colors">
                  دليل الكفاءات والمستقلين
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-gold-400 transition-colors">
                  بوابة الشركات والتوظيف
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gold-400 transition-colors text-gold-300 font-semibold">
                  مشاريع منجزة من ريندر ✓
                </Link>
              </li>
            </ul>
          </div>

          {/* التشبيك والضمان */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">التشبيك والشتات</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/companies" className="hover:text-gold-400 transition-colors">
                  تحالف شركات الشتات الفلسطيني
                </Link>
              </li>
              <li>الضمان المالي الكامل (Escrow)</li>
              <li>قنوات السحب المعتمدة (بنك فلسطين، PalPay)</li>
              <li>سحب أرباح USDT TRC-20 و Payoneer</li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  مكاتب التنسيق في غزة ودبي
                </Link>
              </li>
            </ul>
          </div>

          {/* تفعيل وتجربة */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">تفعيل الاشتراكات</h4>
            <p className="text-xs text-gray-400 mb-3">هل لديك رمز تفعيل صادر عن Render Group؟</p>
            {onOpenActivation ? (
              <button
                onClick={onOpenActivation}
                className="w-full px-4 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                <span>إدخال رمز التفعيل</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full px-4 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>تسجيل الدخول للتفعيل</span>
              </Link>
            )}
            <div className="mt-3">
              <Link
                href="/register"
                className="block text-center text-xs text-gold-400 hover:underline font-semibold"
              >
                إنشاء حساب جديد كباحث عن عمل أو شركة
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Render Group. جميع الحقوق محفوظة لمنظومة RenderLancer &amp; Render Studio.</p>
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span>فلسطين • القدس • غزة • رام الله • الشتات</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

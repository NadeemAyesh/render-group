"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-service";

interface FooterProps {
  onOpenActivation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenActivation }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    setSettings(getSiteSettings());
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) setSettings(customEvent.detail);
    };
    window.addEventListener("renderlancer_settings_change", handleSettingsChange);
    return () => window.removeEventListener("renderlancer_settings_change", handleSettingsChange);
  }, []);

  const cleanWhatsapp = (settings.supportWhatsapp || "+970599908299").replace(/[^0-9]/g, "");
  return (
    <footer className="border-t border-gold-500/20 bg-dark-950 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center md:text-right">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gold-500/15">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 justify-center md:justify-start group">
              <Image
                src="/logo.png"
                alt="Render Connect"
                width={160}
                height={40}
                className="h-10 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
              />
              <Image
                src="/logo-dark.png"
                alt="Render Connect"
                width={160}
                height={40}
                className="h-10 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform"
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
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  الأسئلة الشائعة (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  اتصل بنا والدعم الفني
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

          {/* قنوات التواصل والدعم الفني - New Dedicated Contact Col */}
          <div className="text-right">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 justify-start">
              <span className="w-2 h-2 rounded-full bg-gold-400"></span>
              <span>التواصل والدعم الفني</span>
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-300">
              {/* WhatsApp & Phone */}
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors justify-start group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {/* SVG WhatsApp Brand Icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-normal">واتساب وهاتف الدعم المباشر:</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs" dir="ltr">
                      {settings.supportPhone || "+970 599 908 299"}
                    </span>
                  </div>
                </a>
              </li>

              {/* Facebook */}
              <li>
                <a
                  href={settings.officialFacebook || "https://www.facebook.com/Rendergroup.studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors justify-start group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {/* SVG Facebook Icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-normal">صفحة فيسبوك الرسمية:</span>
                    <span className="font-semibold text-white group-hover:text-blue-400 text-xs">Rendergroup.studio</span>
                  </div>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href={settings.officialInstagram || "https://www.instagram.com/render.group_studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-pink-400 transition-colors justify-start group"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-rose-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                    {/* SVG Instagram Icon */}
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-normal">إنستغرام الاستوديو:</span>
                    <span className="font-semibold text-white group-hover:text-pink-400 text-xs" dir="ltr">@render.group_studio</span>
                  </div>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${settings.supportEmail || "support@renderlancer.ps"}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-gold-400 transition-colors justify-start group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 group-hover:text-dark-950 transition-all">
                    {/* SVG Email Icon */}
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="truncate max-w-[170px]">
                    <span className="text-[10px] text-gray-400 block font-normal">البريد الإلكتروني المعتمد:</span>
                    <span className="font-mono text-xs text-gray-200 group-hover:text-gold-400">{settings.supportEmail || "support@renderlancer.ps"}</span>
                  </div>
                </a>
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

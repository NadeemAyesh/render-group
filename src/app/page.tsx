"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudioToolsGrid } from "@/components/studio/StudioToolsGrid";
import { ActivationModal } from "@/components/studio/ActivationModal";
import { CvShowcase } from "@/components/cv/CvShowcase";
import { getSiteContent, SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/cms-service";

export default function HomePage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [cms, setCms] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    setCms(getSiteContent());
    const handleCmsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      setCms(customEvent.detail || getSiteContent());
    };
    window.addEventListener("renderlancer_cms_change", handleCmsChange);
    return () => window.removeEventListener("renderlancer_cms_change", handleCmsChange);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 selection:bg-gold-500 selection:text-dark-950 font-sans">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="relative flex flex-col justify-center items-center overflow-hidden border-b border-gold-500/15 py-16 lg:py-24">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-gold-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6 text-center z-10 flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-dark-850/90 border border-gold-500/30 backdrop-blur-md mb-8 shadow-xl">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">verified</span>
              <span className="text-xs font-semibold text-gold-300 tracking-wide">
                {cms.heroBadge}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-[1.2] text-white">
              {cms.heroTitle} <span className="gold-gradient-text">{cms.heroHighlight}</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed">
              {cms.heroDescription}
            </p>

            {/* Quick Action Buttons including "مشاريع منجزة من ريندر" */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/projects"
                className="px-6 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>مشاريع منجزة من ريندر</span>
              </Link>

              <Link
                href="/cv-builder"
                className="px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gold-400 border border-gold-500/40 font-bold text-xs md:text-sm flex items-center gap-2 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined text-[20px] text-gold-400">description</span>
                <span>صانع السيرة الذاتية (ATS)</span>
              </Link>

              <Link
                href="/ai-studio"
                className="px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gold-300 border border-gold-500/30 font-bold text-xs md:text-sm flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-gold-400">token</span>
                <span>استوديو الـ AI (12 أداة)</span>
              </Link>

              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gray-200 border border-gray-700 font-bold text-xs md:text-sm flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-gray-400">info</span>
                <span>تعريف بشركة Render</span>
              </Link>
            </div>

            {/* Advanced Search Box */}
            <div className="w-full max-w-3xl mt-10 p-2.5 rounded-2xl glass-card shadow-2xl">
              <div className="flex items-center justify-between mb-2 px-2 border-b border-gold-500/15 pb-2">
                <div className="flex items-center gap-3">
                  <Link
                    href="/jobs"
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-gold-500 text-dark-950 flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">search</span>
                    البحث عن وظائف ومشاريع
                  </Link>
                  <Link
                    href="/ai-studio"
                    className="text-xs font-semibold px-3 py-1 rounded-lg text-gold-400 hover:bg-gold-500/10 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    فتح أدوات الذكاء الاصطناعي (12)
                  </Link>
                </div>
                <span className="text-[11px] text-gray-400 hidden sm:block">+2,400 فرصة نشطة</span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="w-full md:w-56 flex items-center gap-2 px-4 py-3 bg-dark-950/80 rounded-xl border border-gold-500/20">
                  <span className="material-symbols-outlined text-gold-500 text-[18px]">category</span>
                  <select className="bg-transparent text-xs font-medium text-gray-200 focus:outline-none cursor-pointer w-full">
                    <option value="all" className="bg-dark-900">
                      كل التصنيفات
                    </option>
                    <option value="ai" className="bg-dark-900">
                      الذكاء الاصطناعي
                    </option>
                    <option value="dev" className="bg-dark-900">
                      البرمجة والتطوير
                    </option>
                    <option value="design" className="bg-dark-900">
                      التصميم والمونتاج
                    </option>
                  </select>
                </div>

                <div className="w-full flex-1 flex items-center px-4 py-3 bg-dark-950/80 rounded-xl border border-gold-500/20">
                  <span className="material-symbols-outlined text-gold-500/70 text-[20px] ml-2">search</span>
                  <input
                    type="text"
                    placeholder="ما هي الخدمة أو المهارة التي تبحث عنها اليوم؟"
                    className="w-full bg-transparent text-xs md:text-sm text-white placeholder:text-gray-500 focus:outline-none"
                  />
                </div>

                <Link
                  href="/jobs"
                  className="w-full md:w-auto px-8 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm flex items-center justify-center gap-2 shrink-0"
                >
                  <span>ابحث الآن</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </Link>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl glass-card">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold gold-gradient-text">12 أداة</span>
                <span className="text-xs text-gray-400 mt-1">ذكاء اصطناعي موحدة بالكامل</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">+3,450</span>
                <span className="text-xs text-gray-400 mt-1">كفاءة ومستقل فلسطيني</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold gold-gradient-text">+650</span>
                <span className="text-xs text-gray-400 mt-1">شركة في الشتات والعالم</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">0$ فيزا</span>
                <span className="text-xs text-gray-400 mt-1">تفعيل الأدوات من أرباحك مباشرة</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT RENDER GROUP SECTION (تعريف كامل للشركة) ================= */}
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 border-b border-gold-500/15">
          <div className="rounded-3xl glass-card p-8 md:p-12 border border-gold-500/30 relative overflow-hidden space-y-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gold-500/15 pb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>التعريف الرسمي بمجموعة Render</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  عن شركة <span className="gold-gradient-text">Render Group</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
                  تكتل تقني رقمي يهدف إلى تحويل قطاع غزة والضفة الغربية إلى مركز ثقل عالمي للابتكار التكنولوجي وصناعة المحتوى بالذكاء الاصطناعي، وربط كفاءات فلسطين برؤوس أموال شركات الشتات الدولي.
                </p>
              </div>

              <Link
                href="/about"
                className="shrink-0 px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <span>الملف التعريفي والرسالة الكاملة</span>
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
                <span className="material-symbols-outlined text-gold-400 text-[26px]">all_inclusive</span>
                <h4 className="text-sm font-bold text-white">سوق RenderLancer للعمل الحر</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  ربط كفاءات فلسطين بمشاريع الشركات عبر نظام مطابقة الـ AI الذكي وضمان مالي Escrow متكامل.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900 border border-purple-500/20 space-y-2">
                <span className="material-symbols-outlined text-purple-400 text-[26px]">token</span>
                <h4 className="text-sm font-bold text-white">استوديو Render Studio (12 أداة)</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  ترسانة توليد الفيديو السينمائي والصور والـ 3D والنماذج اللغوية باشتراك موحد بدون عوائق بنكية.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-dark-900 border border-blue-500/20 space-y-2">
                <span className="material-symbols-outlined text-blue-400 text-[26px]">handshake</span>
                <h4 className="text-sm font-bold text-white">تحالف الشتات الفلسطيني</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  شبكة تضم أكثر من 650 شركة ومؤسسة في دبي والرياض والدوحة ولندن لرعاية وتوظيف كفاءات الداخل.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMPLETED PROJECTS SHOWCASE PREVIEW ================= */}
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 border-b border-gold-500/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>سجل الإنجاز والتميز</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">مشاريع منجزة من ريندر</h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>استعرض كافة المشاريع المنجزة (5)</span>
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30 text-[10px] font-bold">
                  SaaS & السحاب
                </span>
                <h3 className="text-base font-bold text-white mt-2">منصة Horizon SaaS لإدارة سلاسل الإمداد</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  بنية معمارية متكاملة بـ Next.js 15 و PostgreSQL تعالج 200K عملية يومياً لصالح شركة في دبي.
                </p>
              </div>
              <div className="pt-3 border-t border-gold-500/15 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">$14,500</span>
                <span className="text-gray-400 font-semibold">غزة (عن بعد)</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  فيديو سينمائي 4K
                </span>
                <h3 className="text-base font-bold text-white mt-2">حملة إعلانية سينمائية بـ Veo 3.1 & Seedance</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  إنتاج فيديو ترويجي 4K بدون تصوير ميداني باستخدام أدوات Render Studio لصالح وكالة بالرياض.
                </p>
              </div>
              <div className="pt-3 border-t border-gold-500/15 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">$8,200</span>
                <span className="text-gray-400 font-semibold">غزة والقدس</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  FinTech & Escrow
                </span>
                <h3 className="text-base font-bold text-white mt-2">نظام الضمان المالي والتحويلات اللحظية</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  محرك Escrow ذكي يدعم سحوبات USDT وبنك فلسطين وحسابات PalPay لكفاءات الشتات والداخل.
                </p>
              </div>
              <div className="pt-3 border-t border-gold-500/15 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">$16,000</span>
                <span className="text-gray-400 font-semibold">غزة والضفة</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= THE 12 AI TOOLS & SUBSCRIPTIONS HUB ================= */}
        <section id="ai-studio-hub">
          <StudioToolsGrid onOpenActivation={() => setIsActivationOpen(true)} />
        </section>

        {/* ================= AI CV BUILDER SHOWCASE ================= */}
        <section id="ai-cv">
          <CvShowcase />
        </section>

        {/* ================= DIASPORA & PALESTINE BRIDGE ================= */}
        <section id="diaspora" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="rounded-3xl glass-card p-8 md:p-14 relative overflow-hidden border border-gold-500/30">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
                <span className="material-symbols-outlined text-[16px]">public</span>
                شبكة الشتات الفلسطيني والأعمال الدولية
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-snug">
                ربط مباشر بين <span className="gold-gradient-text">الشركات الفلسطينية في الخارج</span> وكفاءات الوطن
              </h2>
              <p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
                صُمم RenderLancer لكسر الحصار والقيود المالية عبر ضمان مالي (Escrow) ودعم قنوات الدفع الملائمة
                (Payoneer, USDT Crypto, وبنك فلسطين).
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/companies"
                  className="px-6 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm flex items-center gap-2"
                >
                  <span>بوابة الشركات وبرنامج الشتات</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </Link>
                <Link
                  href="/talents"
                  className="px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-bold text-sm border border-gold-500/30 flex items-center gap-2"
                >
                  <span>تصفح دليل الكفاءات</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TOP FREELANCERS ================= */}
        <section id="talents" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 border-t border-gold-500/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-gold-400 text-xs font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                نخبة المحترفين
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">كفاءات فلسطينية متميزة</h2>
            </div>
            <Link href="/talents" className="text-xs font-bold text-gold-400 hover:underline flex items-center gap-1">
              <span>عرض كل الكفاءات الموثقة</span>
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/25 hover:border-gold-500/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-gold-400 font-bold">
                      أ.ن
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">أحمد النجار</h4>
                    <span className="text-[11px] text-gold-400 block">Senior Full-Stack & AI</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  متخصص في Next.js 15 و PostgreSQL ودمج نماذج الذكاء الاصطناعي السحابية.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  $35.00 <span className="text-[10px] text-gray-400 font-normal">/ساعة</span>
                </span>
                <Link href="/talents" className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors">
                  عرض الملف
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/25 hover:border-gold-500/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-gold-400 font-bold">
                      م.ن
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">م. ندى بركات</h4>
                    <span className="text-[11px] text-gold-400 block">AI & Backend Engineer</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  متخصصة في بناء وتكامل حلول الذكاء الاصطناعي وواجهات API السحابية بـ FastAPI.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  $40.00 <span className="text-[10px] text-gray-400 font-normal">/ساعة</span>
                </span>
                <Link href="/talents" className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors">
                  عرض الملف
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/25 hover:border-gold-500/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-gold-400 font-bold">
                      ح.م
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">حسان مطر</h4>
                    <span className="text-[11px] text-gold-400 block">Senior Product Designer</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  تصميم نظم منتجات رقمية وتجارب مستخدم Figma Design Systems معقدة.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  $30.00 <span className="text-[10px] text-gray-400 font-normal">/ساعة</span>
                </span>
                <Link href="/talents" className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors">
                  عرض الملف
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/25 hover:border-gold-500/70 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center text-gold-400 font-bold">
                      ط.ع
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">طارق عساف</h4>
                    <span className="text-[11px] text-gold-400 block">Video & 3D Motion</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  صناعة إعلانات سينمائية وموشن جرافيك 3D باستخدام Veo 3.1 و Seedance.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  $45.00 <span className="text-[10px] text-gray-400 font-normal">/ساعة</span>
                </span>
                <Link href="/talents" className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-colors">
                  عرض الملف
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenActivation={() => setIsActivationOpen(true)} />

      <ActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import { getSiteContent, SiteContent, DEFAULT_SITE_CONTENT } from "@/lib/cms-service";

export default function AboutPage() {
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
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>الملف التعريفي الرسمي • Render Group Global</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            من هي مجموعة <span className="gold-gradient-text">Render</span>؟
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed">
            {cms.aboutStory}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/projects"
              className="px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>استعرض مشاريع منجزة من ريندر</span>
            </Link>
            <Link
              href="/companies"
              className="px-6 py-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-bold text-sm border border-gold-500/30 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>فرص الشراكة والتوظيف المؤسسي</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats Counter */}
      <section className="py-12 bg-dark-900 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-dark-950/60 border border-gold-500/20">
            <span className="text-3xl md:text-4xl font-bold gold-gradient-text font-mono">+3,450</span>
            <span className="block text-xs text-gray-400 mt-1 font-semibold">مستقل ومهندس ومبدع فلسطيني</span>
          </div>
          <div className="p-4 rounded-2xl bg-dark-950/60 border border-gold-500/20">
            <span className="text-3xl md:text-4xl font-bold text-white font-mono">+650</span>
            <span className="block text-xs text-gray-400 mt-1 font-semibold">شركة شريكة في الشتات والخليج</span>
          </div>
          <div className="p-4 rounded-2xl bg-dark-950/60 border border-gold-500/20">
            <span className="text-3xl md:text-4xl font-bold text-emerald-400 font-mono">$1.85M+</span>
            <span className="block text-xs text-gray-400 mt-1 font-semibold">مدفوعات مؤمنة تم ضخها للداخل الفلسطيني</span>
          </div>
          <div className="p-4 rounded-2xl bg-dark-950/60 border border-gold-500/20">
            <span className="text-3xl md:text-4xl font-bold gold-gradient-text font-mono">12 أداة</span>
            <span className="block text-xs text-gray-400 mt-1 font-semibold">ذكاء اصطناعي موحدة باشتراك واحد</span>
          </div>
        </div>
      </section>

      {/* Vision & Mission Detailed */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">flag</span>
              <span>رؤيتنا ورسالتنا الوطنية والتقنية</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              تحويل التحديات والحصار إلى <span className="gold-gradient-text">قوة إنتاج رقمية عالمية</span>
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {cms.aboutVision}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-400 mt-0.5">check_circle</span>
                <span className="text-xs text-gray-300 leading-relaxed">
                  <strong>التمكين بالكفاءة:</strong> فتح أسواق العمل الدولية للشركات الناشئة والمؤسسات الكبرى وتوفير أجور عادلة ومحمية.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-400 mt-0.5">check_circle</span>
                <span className="text-xs text-gray-300 leading-relaxed">
                  <strong>توطين تقنيات الذكاء الاصطناعي:</strong> إتاحة أدوات الذكاء الاصطناعي العالمية (فيديو، صوت، نماذج لغوية، تصميم 3D) للمستقل الفلسطيني بدون عوائق دفع دولية.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-400 mt-0.5">check_circle</span>
                <span className="text-xs text-gray-300 leading-relaxed">
                  <strong>حماية رأس المال بالضمان (Escrow):</strong> أمان مالي كامل للشركة والمستقل مع قنوات سحب مالي معتمدة (USDT، بنك فلسطين، Payoneer).
                </span>
              </div>
            </div>
          </div>

          {/* Pillars Card */}
          <div className="glass-card p-8 rounded-3xl border border-gold-500/30 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[24px]">hub</span>
              منظومة ريندر الثلاثية المتكاملة
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20">
                <div className="flex items-center gap-2 text-gold-400 font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">laptop_mac</span>
                  <span>1. RenderLancer (سوق العمل الحر الذكي)</span>
                </div>
                <p className="text-xs text-gray-400">
                  منصة توظيف حرة مدعومة بخوارزميات المطابقة الذكية (AI Matching) بنسبة دقة تصل إلى 98%، تضمن وصول المشروع لأفضل كفاءة في دقائق.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-900 border border-amber-500/25">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">token</span>
                  <span>2. Render Studio (ترسانة الـ 12 أداة للذكاء الاصطناعي)</span>
                </div>
                <p className="text-xs text-gray-400">
                  استوديو رقمي يجمع أقوى نماذج الذكاء الاصطناعي العالمية (Veo 3.1، Seedance 2.0، GPT Image 2، Motion Master) باشتراك موحد وأكواد تفعيل فورية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-dark-900 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
                  <span className="material-symbols-outlined text-[18px]">diversity_3</span>
                  <span>3. شبكة الشتات الفلسطيني (Diaspora Alliance)</span>
                </div>
                <p className="text-xs text-gray-400">
                  تحالف يضم مئات الشركات ورجال الأعمال الفلسطينيين والعرب في الخليج وأوروبا وأمريكا لتوفير عقود ومشاريع مستمرة للكفاءات بالداخل.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Locations & Contact */}
        <div className="pt-12 border-t border-gold-500/20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">المراكز التشغيلية ومكاتب التنسيق</h3>
            <p className="text-xs text-gray-400">
              تدير مجموعة Render مراكز تنسيق تقنية وشبكة عمل عن بعد ممتدة جغرافياً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2">
              <span className="material-symbols-outlined text-gold-400 text-[26px]">location_on</span>
              <h4 className="text-sm font-bold text-white">مركز كفاءات فلسطين - غزة والضفة</h4>
              <p className="text-xs text-gray-400">
                إدارة شبكة المستقلين، مطابقة المشاريع، وضمان تسليم الأعمال بأعلى جودة.
              </p>
              <span className="block text-[11px] text-gold-400 font-mono">support@render.ps</span>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-blue-500/20 space-y-2">
              <span className="material-symbols-outlined text-blue-400 text-[26px]">business</span>
              <h4 className="text-sm font-bold text-white">مكتب علاقات الشتات والشركات - دبي</h4>
              <p className="text-xs text-gray-400">
                إدارة عقود الشركات والتمويل المؤسسي، وبرامج الضمان المالي المعتمدة.
              </p>
              <span className="block text-[11px] text-blue-400 font-mono">diaspora@render.ps</span>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-amber-500/25 space-y-2">
              <span className="material-symbols-outlined text-amber-400 text-[26px]">precision_manufacturing</span>
              <h4 className="text-sm font-bold text-white">وحدة تطوير الذكاء الاصطناعي - Studio</h4>
              <p className="text-xs text-gray-400">
                دمج وتحديث النماذج الـ 12 وتوليد أكواد التفعيل وتطوير البنية السحابية.
              </p>
              <span className="block text-[11px] text-amber-400 font-mono">studio@render.ps</span>
            </div>
          </div>
        </div>

      </section>

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

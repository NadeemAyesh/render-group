"use client";

import React, { useState } from "react";
import Link from "next/link";

export const CvShowcase: React.FC = () => {
  const [atsScore, setAtsScore] = useState<number>(98);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [bulletText, setBulletText] = useState<string>(
    "هندسة وتطوير منصة تجارة سحابية خفضت وقت التحميل بنسبة 42% ورفعت معدل التحويل 3x."
  );

  const handleSimulateEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setBulletText(
        "قيادة وتصميم منصة تجارة رقمية قابلة للتوسع عالي التحمل، أدت لخفض زمن الاستجابة إلى 85ms وزيادة إجمالي الإيرادات بنسبة 140%."
      );
      setAtsScore(99);
      setIsEnhancing(false);
    }, 800);
  };

  return (
    <section id="ai-cv" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative border-t border-gold-500/15">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Copy & Features */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold w-max">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            حصرياً في RenderLancer • صانع السير الذاتية الذكي
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            سيرة ذاتية متوافقة مع <br />
            <span className="gold-gradient-text">أنظمة الفرز العالمية (ATS)</span> بنقرة زر
          </h2>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            محرك ذكاء اصطناعي يعيد صياغة مسؤولياتك السابقة إلى إنجازات رقمية مبهرة باستخدام أفعال القوة،
            ويقيس نسبة قبولك في الشركات الدولية قبل أن تقدم على أي وظيفة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-dark-900 border border-gold-500/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-gold-500 text-[24px]">troubleshoot</span>
              <div>
                <h4 className="text-sm font-bold text-white">فحص فوري للـ ATS Score</h4>
                <p className="text-xs text-gray-400 mt-1">
                  يقيس نسبة قبول سيرتك في الشركات العالمية قبل التقديم.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900 border border-gold-500/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-gold-500 text-[24px]">magic_button</span>
              <div>
                <h4 className="text-sm font-bold text-white">إعادة صياغة ذكية بالـ AI</h4>
                <p className="text-xs text-gray-400 mt-1">
                  يستبدل العبارات الضعيفة بأفعال قوة مهنية وإحصائيات مؤثرة.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900 border border-gold-500/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-gold-500 text-[24px]">translate</span>
              <div>
                <h4 className="text-sm font-bold text-white">دعم ثنائي (عربي / إنجليزي)</h4>
                <p className="text-xs text-gray-400 mt-1">
                  ترجمة احترافية فورية للسيرة كاملة بنقرة واحدة.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900 border border-gold-500/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-gold-500 text-[24px]">picture_as_pdf</span>
              <div>
                <h4 className="text-sm font-bold text-white">تصدير PDF عالي الدقة</h4>
                <p className="text-xs text-gray-400 mt-1">
                  قوالب جاهزة للطباعة والتنزيل ورابط إلكتروني للمشاركة.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/cv-builder"
              className="px-6 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-gold-500/20"
            >
              <span>افتح صانع السير الذاتية الآن (ATS Builder)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
            <button
              onClick={handleSimulateEnhance}
              className="px-4 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gold-300 border border-gold-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">magic_button</span>
              <span>{isEnhancing ? "جاري تحسين الصياغة..." : "تجربة صياغة الذكاء"}</span>
            </button>
            <span className="text-xs text-gray-400">بدون رسوم خفية • جاهز للتصدير فوراً</span>
          </div>
        </div>

        {/* Right Side: Interactive ATS Simulator Card */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl glass-card p-6 border border-gold-500/40 shadow-2xl">
            {/* ATS Score Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gold-400 text-[26px]">analytics</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">فاحص أنظمة الفرز (ATS Scanner)</h4>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    جاهز للمنافسة في الأسواق الدولية
                  </span>
                </div>
              </div>

              <div className="text-left">
                <span className="text-2xl font-bold gold-gradient-text">{atsScore} / 100</span>
                <span className="block text-[10px] text-gray-400">ATS Rating</span>
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="mt-5 p-5 rounded-xl bg-dark-950/90 border border-gold-500/20 space-y-4 text-right">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">أحمد خليل النجار</h3>
                  <p className="text-xs text-gold-400 font-medium">Senior Full-Stack Engineer & AI Architect</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-dark-850 text-gray-300 border border-gold-500/20">
                  فلسطين - غزة / عن بعد
                </span>
              </div>

              {/* Dynamic AI Suggestion */}
              <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-gold-400 text-[18px] shrink-0 mt-0.5">smart_toy</span>
                <div>
                  <span className="text-xs font-bold text-gold-300 block">
                    الصياغة المولدة بالذكاء الاصطناعي (معيار الأثر الرقمي):
                  </span>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed font-mono">
                    {bulletText}
                  </p>
                </div>
              </div>

              {/* Skills Badges */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5">المهارات المدققة برمجياً:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20">
                    Next.js 15
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20">
                    TypeScript
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20">
                    Python AI/ML
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20">
                    PostgreSQL
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20">
                    Docker
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between text-xs pt-2">
              <span className="text-gray-400">
                القالب النشط: <strong className="text-white">Executive Gold Minimal</strong>
              </span>
              <button
                onClick={handleSimulateEnhance}
                className="px-3 py-1.5 rounded-lg gold-button-gradient text-dark-950 font-bold"
              >
                تحسين إضافي بالـ AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

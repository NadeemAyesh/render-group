"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";

export default function CompaniesPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            <span>بوابة الشركات وأصحاب الأعمال • Render for Business</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            وظّف نخبة الكفاءات التقنية <br />
            مع <span className="gold-gradient-text">حماية مالية 100% بنظام الضمان</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed mb-8">
            تمكنك منصة <strong className="text-white">RenderLancer</strong> من التعاقد مع ألمع مهندسي البرمجيات،
            مبتكري الذكاء الاصطناعي، ومصممي المنتجات في فلسطين والشتات، بعقود موثقة وإشراف دقيق ونظام دفع مرحلي (Milestones) لا يُصرف إلا بعد رضاك الكامل عن التسليم.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>انشر مشروعك مجاناً وابدأ استقبال العروض</span>
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-bold text-sm border border-gold-500/30 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span>استعرض مشاريع منجزة لشركات شريكة</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Hire Palestinian Talent */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs text-gold-400 font-bold uppercase tracking-wider">ميزتك التنافسية كشركة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">لماذا توظف كفاءات فلسطين عبر Render؟</h2>
          <p className="text-xs md:text-sm text-gray-400">
            تجمع المنظومة بين المهارة البرمجية المتقدمة والتكلفة التنافسية مع الأمان الإداري الكامل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-gold-500/30 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
            </div>
            <h3 className="text-lg font-bold text-white">نخبة كفاءات مفحوصة (Top 1%)</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              تخضع كافة الكفاءات المسجلة لاختبارات كفاءة برمجية ومطابقة سير ذاتية عبر خوارزميات ATS الذكية لضمان تسليم العمل بأعلى المعايير العالمية.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-blue-500/30 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[26px]">shield</span>
            </div>
            <h3 className="text-lg font-bold text-white">حماية الضمان المالي الكامل (Escrow)</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              أموالك في أمان تام: تودع ميزانية المشروع في حساب وسيط موثق، ولا يتم تحرير أي دفعة للمستقل إلا بعد اعتمادك وموافقتك التامة على مرحلة الإنجاز.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-gold-500/30 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[26px]">token</span>
            </div>
            <h3 className="text-lg font-bold text-white">مدعومون بـ 12 أداة ذكاء اصطناعي</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              يمتلك المستقلون في ريندر وصولاً مباشراً لترسانة Render Studio (Veo 3.1، GPT Image 2، Seedance 2.0)، مما يضاعف سرعة إنجاز مشاريعك وجودتها.
            </p>
          </div>
        </div>

        {/* Diaspora Alliance Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-950/60 via-dark-900 to-amber-950/40 border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">handshake</span>
              <span>برنامج شراكة الشتات الفلسطيني المعتمد</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              حوّل مشاريع شركتك إلى شريان حياة ودعم صمود حقيقي
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              انضم لمئات الشركات ورجال الأعمال في دبي، الرياض، الدوحة، لندن وكندا الذين يسندون مشاريعهم البرمجية والتسويقية لكفاءات غزة والضفة، ويحصلون على أعمال من الطراز الأول وشارة الشتات الداعمة.
            </p>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <span>تسجيل كشركة شريكة راعية</span>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </Link>
            <span className="block text-[10px] text-gray-400 text-center font-mono">
              عقود رسمية قابلة للخصم الضريبي
            </span>
          </div>
        </div>

        {/* Hiring Steps */}
        <div className="pt-12 border-t border-gold-500/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white mb-2">كيف تبدأ التوظيف في 4 خطوات بسيطة؟</h3>
            <p className="text-xs text-gray-400">من نشر المتطلبات وحتى استلام العمل النهائي المعتمد</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 font-bold font-mono text-sm flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="text-sm font-bold text-white">انشر المشروع</h4>
              <p className="text-[11px] text-gray-400">حدد متطلباتك وميزانيتك المرصودة والمدة المطلوبة في دقائق.</p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 font-bold font-mono text-sm flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="text-sm font-bold text-white">استقبل العروض والمطابقة</h4>
              <p className="text-[11px] text-gray-400">تصلك عروض أفضل الكفاءات مع نسبة مطابقة الـ AI CV وتقييماتهم السابقة.</p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 font-bold font-mono text-sm flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="text-sm font-bold text-white">أودع في الضمان (Escrow)</h4>
              <p className="text-[11px] text-gray-400">تودع الدفعة بأمان دون أن تصل للمستقل حتى ينفذ المطلوب ويعتمده فريقك.</p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-400 font-bold font-mono text-sm flex items-center justify-center mx-auto">
                4
              </div>
              <h4 className="text-sm font-bold text-white">استلم العمل واعتمد الدفعة</h4>
              <p className="text-[11px] text-gray-400">استلم المخرجات البرمجية أو التصميمية واعتمد التحرير المالي برضا كامل.</p>
            </div>
          </div>
        </div>

      </section>

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

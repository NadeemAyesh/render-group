"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";

interface ShowcaseProject {
  id: string;
  title: string;
  client: string;
  clientLocation: string;
  category: "dev" | "ai" | "video" | "design" | "fintech";
  categoryLabel: string;
  budget: string;
  duration: string;
  teamLocation: string;
  summary: string;
  deliverables: string[];
  techStack: string[];
  aiToolsUsed: string[];
  rating: number;
}

const PROJECTS_DATA: ShowcaseProject[] = [
  {
    id: "proj-1",
    title: "منصة Horizon SaaS لإدارة سلاسل الإمداد والتنبؤ بالمخزون",
    client: "مجموعة الأفق العالمية",
    clientLocation: "دبي • الإمارات",
    category: "dev",
    categoryLabel: "هندسة البرمجيات السحابية",
    budget: "$14,500",
    duration: "45 يوماً",
    teamLocation: "فلسطين - قطاع غزة (عن بعد)",
    summary:
      "بناء بنية معمارية سحابية متكاملة بـ Next.js 15 و PostgreSQL تعالج أكثر من 200,000 عملية يومياً مع لوحة تحكم إدارية وتحليلات تنبؤية بالذكاء الاصطناعي.",
    deliverables: ["واجهات Next.js 15 فائقة السرعة", "قاعدة بيانات PostgreSQL محسنة مع pgvector", "نظام صلاحيات RBAC ثلاثي المستويات", "تكامل كامل مع بوابات الدفع والـ Webhooks"],
    techStack: ["Next.js 15", "TypeScript", "PostgreSQL", "Docker", "Tailwind CSS"],
    aiToolsUsed: ["Render Chat", "Prompt Extractor"],
    rating: 5.0,
  },
  {
    id: "proj-2",
    title: "إنتاج حملة إعلانية سينمائية 4K فائقة الواقعية بـ AI Video",
    client: "وكالة إبداع الرياض للدعاية",
    clientLocation: "الرياض • السعودية",
    category: "video",
    categoryLabel: "صناعة الفيديو والذكاء الاصطناعي",
    budget: "$8,200",
    duration: "14 يوماً",
    teamLocation: "فلسطين - قطاع غزة والقدس",
    summary:
      "توليد مشاهد فيديو سينمائية بدون تصوير ميداني بالاعتماد الكامل على ترسانة Render Studio (Veo 3.1 و Seedance 2.0 ومحرك الحركة Motion Master).",
    deliverables: ["فيديو ترويجي بدقة 4K مدته 90 ثانية", "تصميم صوتي سينمائي متكامل ومؤثرات", "تحريك الشخصيات بـ Seedance 2.0", "تسليم ملفات المشروع المفتوحة"],
    techStack: ["Veo 3.1", "Seedance 2.0", "Motion Master", "Premiere Pro"],
    aiToolsUsed: ["Veo 3.1", "Seedance 2.0", "Motion Master", "Omni Transition"],
    rating: 5.0,
  },
  {
    id: "proj-3",
    title: "محرك الفحص الدقيق والتلخيص الذكي للعقود القانونية (LegalAI)",
    client: "دار العدالة للاستشارات الدولية",
    clientLocation: "الدوحة • قطر",
    category: "ai",
    categoryLabel: "تطبيقات الذكاء الاصطناعي",
    budget: "$11,800",
    duration: "30 يوماً",
    teamLocation: "فلسطين - نابلس / رام الله",
    summary:
      "تطوير نظام يعتمد على نماذج اللغات الكبيرة والـ Vector Search للبحث الدلالي في آلاف الوثائق القانونية بصيغة PDF واستخراج البنود الحرجة ونسب المخاطر بدقة 99.4%.",
    deliverables: ["Microservices بـ FastAPI و Python", "قاعدة بيانات متجهة بـ Qdrant", "لوحة تحكم للمحامين والباحثين", "تشفير بيانات عالي الأمان End-to-End"],
    techStack: ["Python", "FastAPI", "Gemini API", "Qdrant", "React"],
    aiToolsUsed: ["Render Chat", "Prompt Extractor"],
    rating: 4.9,
  },
  {
    id: "proj-4",
    title: "منصة تجارة إلكترونية فاخرة مع تجربة القياس الافتراضي 3D",
    client: "Velvet Couture UK",
    clientLocation: "لندن • بريطانيا",
    category: "design",
    categoryLabel: "تجربة المستخدم و 3D Virtual Try-on",
    budget: "$9,500",
    duration: "25 يوماً",
    teamLocation: "فلسطين - قطاع غزة والشتات",
    summary:
      "تصميم تجربة تسوق تفاعلية تتيح للمتسوق تجربة الملابس والفساتين على صورته الشخصية بدقة متناهية عبر أداة القياس الافتراضي (Virtual Try-on) في استوديو ريندر.",
    deliverables: ["تصميم نظام كامل Figma Design System", "تطبيق أداة القياس الافتراضي", "بوابة دفع متعددة العملات عبر Stripe", "تجاوب كامل مع الأجهزة اللوحية والمحمول"],
    techStack: ["Figma", "Next.js", "Virtual Try-on API", "Stripe"],
    aiToolsUsed: ["Virtual Try-on", "AI Avatar", "Face Swap"],
    rating: 5.0,
  },
  {
    id: "proj-5",
    title: "نظام الضمان المالي والتحويلات اللحظية الآمنة لكفاءات فلسطين (Escrow Engine)",
    client: "صندوق تمكين الشتات الفلسطيني",
    clientLocation: "عمان • الأردن / مونتريال",
    category: "fintech",
    categoryLabel: "التكنولوجيا المالية (FinTech)",
    budget: "$16,000",
    duration: "40 يوماً",
    teamLocation: "فلسطين - غزة والضفة الغربية",
    summary:
      "تطوير منصة دفع مالي مؤمنة تحتجز أموال المشاريع بنظام Escrow وتفرج عنها آلياً عند اعتماد مراحل العمل مع دعم السحب بـ USDT وبنك فلسطين وحسابات PalPay.",
    deliverables: ["محرك الضمان المالي المتطور", "لوحة تدقيق العمليات وسجلات الحسابات", "ربط بوابات Web3 والعملات الرقمية TRC20", "توافق كامل مع متطلبات الامتثال"],
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "USDT Rail", "Next.js"],
    aiToolsUsed: ["Render Chat"],
    rating: 5.0,
  },
];

export default function ProjectsShowcasePage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProjects =
    selectedCategory === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>معرض الأعمال والإنجازات الدولية المعتمدة</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            مشاريع منجزة من <span className="gold-gradient-text">Render</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed">
            نماذج حقيقية لمشاريع برمجية وتقنية وحملات ذكاء اصطناعي نفذتها كفاءات فلسطين في قطاع غزة والضفة
            لصالح كبرى الشركات في دبي، الرياض، الدوحة، ولندن بأعلى معايير الإتقان العالمية.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "كافة المشاريع المنجزة (5)" },
              { id: "dev", label: "هندسة السحاب و SaaS" },
              { id: "ai", label: "تطبيقات الذكاء الاصطناعي" },
              { id: "video", label: "الإنتاج السينمائي و 4K" },
              { id: "design", label: "تصميم 3D و Virtual Try-on" },
              { id: "fintech", label: "التكنولوجيا المالية والضمان" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? "gold-button-gradient text-dark-950 shadow-md"
                    : "bg-dark-900 text-gray-400 hover:text-white border border-gold-500/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-gold-500/30 hover:border-gold-500/60 transition-all shadow-xl flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold-500/15 text-gold-400 border border-gold-500/30 text-[11px] font-bold">
                      {project.categoryLabel}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[15px] text-blue-400">corporate_fare</span>
                      {project.client} ({project.clientLocation})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-dark-900 px-2.5 py-1 rounded-lg border border-gold-500/20 text-xs font-mono font-bold text-gold-400">
                    <span className="material-symbols-outlined text-amber-400 text-[14px]">star</span>
                    <span>{project.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  {project.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-300 leading-relaxed">{project.summary}</p>

                {/* Team & Budget Badges */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-dark-900/90 border border-gold-500/20 text-center">
                  <div>
                    <span className="block text-[10px] text-gray-500">الميزانية</span>
                    <strong className="text-xs font-mono text-emerald-400 font-bold">{project.budget}</strong>
                  </div>
                  <div className="border-x border-gold-500/10">
                    <span className="block text-[10px] text-gray-500">مدة التسليم</span>
                    <strong className="text-xs font-mono text-white font-bold">{project.duration}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">فريق التنفيذ</span>
                    <strong className="text-[10px] text-gold-400 font-bold truncate block">{project.teamLocation}</strong>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-gray-300 block">المخرجات الرئيسية المسلمة:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {project.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <span className="material-symbols-outlined text-emerald-400 text-[14px]">check</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack & AI Tools */}
                <div className="space-y-2 pt-2 border-t border-gold-500/15">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 font-semibold ml-1">التقنيات:</span>
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-dark-900 text-gray-300 border border-gray-800 text-[10px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gold-400 font-semibold ml-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">token</span>
                      أدوات Studio:
                    </span>
                    {project.aiToolsUsed.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-gold-500/15 text-gold-300 border border-gold-500/30 text-[10px] font-bold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  href="/register"
                  className="w-full py-2.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gold-400 hover:text-white border border-gold-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add_task</span>
                  <span>اطلب مشروعاً مماثلاً من ريندر</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl gold-gradient-border bg-gradient-to-r from-dark-900 via-dark-950 to-dark-900 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">هل تبحث عن فريق كفاءات فلسطيني لتنفيذ مشروعك القادم؟</h3>
          <p className="max-w-xl mx-auto text-xs text-gray-300 leading-relaxed">
            احصل على مطابقة ذكية فورية مع أفضل 1% من المهندسين والمبدعين في فلسطين والشتات مع ضمان مالي كامل (Escrow) وجودة تنفيذ موثقة.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/companies"
              className="px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-lg"
            >
              ابدأ توظيف فريقك الآن
            </Link>
            <Link
              href="/talents"
              className="px-6 py-3 rounded-xl bg-dark-850 text-white font-bold text-xs border border-gold-500/30 hover:bg-dark-800"
            >
              تصفح ملفات المستقلين
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

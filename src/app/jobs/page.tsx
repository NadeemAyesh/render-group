"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";

interface JobItem {
  id: string;
  title: string;
  company: string;
  companyLocation: string;
  isDiasporaSponsor: boolean;
  category: "dev" | "ai" | "design" | "video" | "mobile";
  budget: string;
  duration: string;
  postedTime: string;
  proposalsCount: number;
  aiMatch: number;
  description: string;
  skills: string[];
}

const JOBS_DATA: JobItem[] = [
  {
    id: "job-101",
    title: "هندسة وبناء منصة SaaS متكاملة بـ Next.js 15 و PostgreSQL",
    company: "مجموعة الأفق الرقمية",
    companyLocation: "الشتات الفلسطيني • دبي",
    isDiasporaSponsor: true,
    category: "dev",
    budget: "$1,200.00",
    duration: "14 يوماً",
    postedTime: "منذ 3 ساعات",
    proposalsCount: 6,
    aiMatch: 98,
    description:
      "نبحث عن مهندس برمجيات محترف لبناء واجهات ومنظومة سحابية بـ Next.js 15 (App Router) و Prisma و Tailwind مع ربط نظام صلاحيات RBAC وحماية متكاملة.",
    skills: ["Next.js 15", "TypeScript", "PostgreSQL", "Tailwind CSS", "Prisma"],
  },
  {
    id: "job-102",
    title: "تطوير Microservice بـ FastAPI لربط نماذج الذكاء الاصطناعي والـ Vector Search",
    company: "كود لاين للحلول الذكية",
    companyLocation: "الدوحة • قطر",
    isDiasporaSponsor: true,
    category: "ai",
    budget: "$850.00",
    duration: "10 أيام",
    postedTime: "منذ 5 ساعات",
    proposalsCount: 9,
    aiMatch: 94,
    description:
      "مطلوب مبرمج بايثون خبير لبناء واجهات برمجية RESTful و Streaming باستخدام FastAPI وربطها بنماذج Gemini و Qdrant للبحث الدلالي السريع.",
    skills: ["Python", "FastAPI", "Gemini API", "Vector Search", "Docker"],
  },
  {
    id: "job-103",
    title: "تصميم واجهات وتجربة مستخدم (UI/UX) لمتجر إلكتروني فاخر على Figma",
    company: "Velvet Brand Global",
    companyLocation: "لندن • بريطانيا",
    isDiasporaSponsor: false,
    category: "design",
    budget: "$600.00",
    duration: "7 أيام",
    postedTime: "منذ يوم",
    proposalsCount: 14,
    aiMatch: 91,
    description:
      "تصميم نظام تصميم (Design System) متكامل مع نماذج أولية تفاعلية وتجربة مستخدم سلسة للمتاجر الكبرى مع مراعاة الهوية الفاخرة للعلامة التجارية.",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
  },
  {
    id: "job-104",
    title: "إنتاج فيديو إعلاني سينمائي ترويجي 4K باستخدام أدوات الذكاء الاصطناعي",
    company: "إبداع ميديا الرياض",
    companyLocation: "الرياض • السعودية",
    isDiasporaSponsor: true,
    category: "video",
    budget: "$950.00",
    duration: "8 أيام",
    postedTime: "منذ يومين",
    proposalsCount: 8,
    aiMatch: 89,
    description:
      "توليد ومونتاج فيديو ترويجي لمنتج تقني جديد باستخدام أدوات استوديو ريندر (Veo 3.1 و Seedance) مع مؤثرات صوتية احترافية ومكساج نقي.",
    skills: ["Veo 3.1", "Seedance", "Motion Master", "Premiere Pro", "AI Video"],
  },
  {
    id: "job-105",
    title: "تطوير تطبيق محمول لخدمات التوصيل السريع بـ Flutter",
    company: "سريع لوجستيك",
    companyLocation: "رام الله • فلسطين",
    isDiasporaSponsor: false,
    category: "mobile",
    budget: "$1,500.00",
    duration: "20 يوماً",
    postedTime: "منذ 3 أيام",
    proposalsCount: 11,
    aiMatch: 86,
    description:
      "بناء تطبيق أندرويد و iOS باستخدام Flutter مع تتبع لحظي للخرائط ونظام تنبيهات متزامن وبوابات دفع محلية وعالمية.",
    skills: ["Flutter", "Dart", "Firebase", "Google Maps API", "State Management"],
  },
];

export default function JobsPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJobModal, setActiveJobModal] = useState<JobItem | null>(null);
  const [proposalBid, setProposalBid] = useState("");
  const [proposalDays, setProposalDays] = useState("10");
  const [proposalCover, setProposalCover] = useState("");
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const filteredJobs = JOBS_DATA.filter((job) => {
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesSearch =
      job.title.includes(searchQuery) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.company.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleOpenProposal = (job: JobItem) => {
    setActiveJobModal(job);
    setProposalBid(job.budget.replace("$", "").replace(".00", ""));
    setProposalDays(job.duration.replace(" يوماً", "").replace(" أيام", "").replace(" يوم", ""));
    setProposalCover(
      `تحياتي لشركة ${job.company}،\nاطلعت على متطلبات مشروع "${job.title}"، وبفضل خبرتي العميقة في هذه التقنيات يسعدني تنفيذ العمل بأعلى معايير الجودة وتسليم المشروع في الموعد المحدد مع الدعم الكامل.`
    );
    setProposalSubmitted(false);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitted(true);

    if (typeof window !== "undefined" && activeJobModal) {
      try {
        const stored = localStorage.getItem("renderlancer_proposals");
        const list = stored ? JSON.parse(stored) : [];
        const newRecord = {
          id: `prop-${Date.now()}`,
          jobTitle: activeJobModal.title,
          company: activeJobModal.company,
          amount: `$${proposalBid}.00`,
          days: `${proposalDays} أيام`,
          status: "قيد المراجعة الفنية",
          statusClass: "bg-gold-500/15 text-gold-300 border-gold-500/30",
        };
        localStorage.setItem("renderlancer_proposals", JSON.stringify([newRecord, ...list]));
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setProposalSubmitted(false);
      setActiveJobModal(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Header */}
      <section className="relative py-16 lg:py-20 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">work</span>
            <span>سوق العمل والمشاريع المفتوحة • كفاءات فلسطين والشتات</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            فرص ومشاريع <span className="gold-gradient-text">العمل الحر</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed mb-8">
            تصفح مشاريع تقنية حقيقية مع شركات ومؤسسات في الخليج، أوروبا، والشتات، محمية بالكامل بنظام الضمان المالي (Escrow) ومدعومة بالمطابقة الذكية.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex items-center gap-3 bg-dark-900/90 p-2 rounded-2xl border border-gold-500/30">
            <span className="material-symbols-outlined text-gold-400 text-[22px] mr-2">search</span>
            <input
              type="text"
              placeholder="ابحث باسم الوظيفة، المهارة (Next.js، Python، Figma...) أو اسم الشركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-white text-xs px-2">
                مسح
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "كافة المجالات (5)" },
              { id: "dev", label: "تطوير البرمجيات والسحاب" },
              { id: "ai", label: "الذكاء الاصطناعي وبايثون" },
              { id: "design", label: "تصميم واجهات UI/UX" },
              { id: "video", label: "فيديو وموشن جرافيك" },
              { id: "mobile", label: "تطبيقات الموبايل" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? "gold-button-gradient text-dark-950 font-bold shadow-md"
                    : "bg-dark-900 text-gray-400 hover:text-white border border-gold-500/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Feed */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold">
            عرض <strong className="text-white">{filteredJobs.length}</strong> وظيفة متوفرة حالياً
          </span>
          <Link
            href="/dashboard/employer"
            className="text-xs text-gold-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>هل أنت صاحب عمل؟ انشر مشروعك مجاناً</span>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          </Link>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-6 rounded-3xl border border-gold-500/25 hover:border-gold-500/60 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 text-[10px] font-bold">
                    {job.aiMatch}% مطابقة مع كفاءات فلسطين
                  </span>
                  {job.isDiasporaSponsor && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">handshake</span>
                      <span>جهة داعمة في الشتات</span>
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-gray-500">schedule</span>
                    {job.postedTime}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-gold-400">corporate_fare</span>
                    {job.company} ({job.companyLocation})
                  </span>
                  <span className="text-gray-600">|</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-dark-900 border border-gold-500/20 text-gray-300 text-[10px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget & Apply Button */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 md:border-r md:pr-6 border-gold-500/15 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="block text-[10px] text-gray-400 font-medium">الميزانية المرصودة</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{job.budget}</span>
                  <span className="block text-[10px] text-gray-500 mt-0.5">
                    {job.duration} • {job.proposalsCount} عروض مقدمة
                  </span>
                </div>

                <button
                  onClick={() => handleOpenProposal(job)}
                  className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>قدّم عرضك الآن</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proposal Submission Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-gold-500/40 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveJobModal(null)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {proposalSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h3 className="text-xl font-bold text-white">تم إرسال عرضك بنجاح!</h3>
                <p className="text-xs text-gray-300">
                  تم استلام عرضك لدى شركة {activeJobModal.company} وستصلك إشعارات بالمحادثة والموافقة.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">تقديم عرض على:</span>
                  <h3 className="text-lg font-bold text-white mt-1">{activeJobModal.title}</h3>
                  <span className="text-xs text-gray-400">صاحب العمل: {activeJobModal.company}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">سعرك المقترح ($)</label>
                    <input
                      type="number"
                      required
                      value={proposalBid}
                      onChange={(e) => setProposalBid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">المدة المتوقعة (أيام)</label>
                    <input
                      type="text"
                      value={proposalDays}
                      onChange={(e) => setProposalDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">رسالة التقديم (Cover Letter)</label>
                  <textarea
                    rows={4}
                    required
                    value={proposalCover}
                    onChange={(e) => setProposalCover(e.target.value)}
                    className="w-full p-3 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500 font-sans"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-[11px] text-gold-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>مشروعك محمي بضمان RenderLancer Escrow المالي المعتمد.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>إرسال العرض رسمياً لصاحب المشروع</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

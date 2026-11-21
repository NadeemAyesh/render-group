"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";

interface TalentProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  locationDetail: string;
  avatar: string;
  hourlyRate: string;
  completedProjects: number;
  rating: number;
  atsScore: number;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  category: "dev" | "ai" | "design" | "video";
}

const TALENTS_DATA: TalentProfile[] = [
  {
    id: "tal-1",
    name: "أحمد خليل النجار",
    title: "Senior Full-Stack & AI Cloud Architect",
    location: "فلسطين - قطاع غزة",
    locationDetail: "غزة • يعمل عن بعد بجودة دولية",
    avatar: "أ.ن",
    hourlyRate: "$35 / ساعة",
    completedProjects: 48,
    rating: 5.0,
    atsScore: 98,
    bio: "مهندس برمجيات متخصص في Next.js 15 و TypeScript وبناء النظم السحابية المقاومة للضغط مع دمج نماذج اللغات الكبيرة.",
    skills: ["Next.js 15", "TypeScript", "PostgreSQL", "Docker", "Tailwind", "Gemini API"],
    isAvailable: true,
    category: "dev",
  },
  {
    id: "tal-2",
    name: "م. ندى بركات",
    title: "AI Engineer & Python Backend Specialist",
    location: "فلسطين - نابلس",
    locationDetail: "الضفة الغربية • نابلس",
    avatar: "ن.ب",
    hourlyRate: "$40 / ساعة",
    completedProjects: 36,
    rating: 4.9,
    atsScore: 96,
    bio: "خبيرة في بناء نماذج الذكاء الاصطناعي و Microservices بـ FastAPI ومعالجة اللغات الطبيعية (NLP) والـ Vector Search.",
    skills: ["Python", "FastAPI", "PyTorch", "Qdrant", "LangChain", "Cloudflare"],
    isAvailable: true,
    category: "ai",
  },
  {
    id: "tal-3",
    name: "حسان مطر",
    title: "Lead UI/UX & Product Designer",
    location: "فلسطين - القدس الشريف",
    locationDetail: "القدس • خبير أنظمة التصميم",
    avatar: "ح.م",
    hourlyRate: "$30 / ساعة",
    completedProjects: 52,
    rating: 5.0,
    atsScore: 94,
    bio: "مصمم منتجات رقمية بخبرة 6 سنوات في بناء وتوسيع أنظمة التصميم Figma Design Systems لشركات ناشئة في الخليج وأوروبا.",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Design Tokens"],
    isAvailable: true,
    category: "design",
  },
  {
    id: "tal-4",
    name: "طارق زياد عساف",
    title: "Creative Video Director & 3D Motion Artist",
    location: "فلسطين - قطاع غزة",
    locationDetail: "غزة • صانع محتوى إعلاني عالمي",
    avatar: "ط.ع",
    hourlyRate: "$45 / ساعة",
    completedProjects: 41,
    rating: 5.0,
    atsScore: 97,
    bio: "مخرج ومصمم موشن جرافيك يجمع بين الإنتاج السينمائي وأحدث أدوات توليد الفيديو بالذكاء الاصطناعي (Veo 3.1 و Seedance).",
    skills: ["After Effects", "Cinema 4D", "Veo 3.1", "Seedance", "Premiere Pro"],
    isAvailable: true,
    category: "video",
  },
  {
    id: "tal-5",
    name: "ريم سمير القدوة",
    title: "Mobile App Engineer (Flutter & iOS)",
    location: "الشتات الفلسطيني • دبي",
    locationDetail: "الشتات • الإمارات",
    avatar: "ر.ق",
    hourlyRate: "$38 / ساعة",
    completedProjects: 29,
    rating: 4.8,
    atsScore: 92,
    bio: "مبتكرة تطبيقات أجهزة ذكية بهندسة Clean Architecture بـ Flutter مع خبرة واسعة في ربط بوابات الدفع والخرائط.",
    skills: ["Flutter", "Dart", "Firebase", "REST APIs", "State Management"],
    isAvailable: false,
    category: "dev",
  },
  {
    id: "tal-6",
    name: "باسم عبد الرحمن",
    title: "Cybersecurity & Cloud DevSecOps Engineer",
    location: "فلسطين - الخليل",
    locationDetail: "الضفة الغربية • الخليل",
    avatar: "ب.ع",
    hourlyRate: "$50 / ساعة",
    completedProjects: 23,
    rating: 5.0,
    atsScore: 99,
    bio: "متخصص في أمن التطبيقات السحابية وحماية البيانات وفحص الثغرات Penetration Testing للبنوك ومنصات التكنولوجيا المالية.",
    skills: ["DevSecOps", "AWS", "Kubernetes", "Penetration Testing", "CI/CD"],
    isAvailable: true,
    category: "dev",
  },
];

export default function TalentsDirectoryPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);

  const filteredTalents = TALENTS_DATA.filter((talent) => {
    const matchesCategory = selectedCategory === "all" || talent.category === selectedCategory;
    const matchesSearch =
      talent.name.includes(searchQuery) ||
      talent.title.includes(searchQuery) ||
      talent.location.includes(searchQuery) ||
      talent.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Header */}
      <section className="relative py-16 lg:py-20 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>دليل النخبة • أكثر من 3,450 كفاءة معتمدة</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            المواهب والكفاءات <span className="gold-gradient-text">الفلسطينية</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed mb-8">
            وظف أفضل 1% من المهندسين والمصممين ومبتكري الذكاء الاصطناعي في قطاع غزة والضفة والشتات
            بعقود موثقة وضمان مالي Escrow كامل.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex items-center gap-3 bg-dark-900/90 p-2 rounded-2xl border border-gold-500/30">
            <span className="material-symbols-outlined text-gold-400 text-[22px] mr-2">search</span>
            <input
              type="text"
              placeholder="ابحث بالاسم، المهارة (React، Python، فيديو، تصميم) أو الموقع (غزة، القدس)..."
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
              { id: "all", label: "كافة التخصصات (6)" },
              { id: "dev", label: "البرمجة والسحاب" },
              { id: "ai", label: "الذكاء الاصطناعي والبيانات" },
              { id: "design", label: "تصميم واجهات UI/UX" },
              { id: "video", label: "فيديو وموشن 3D" },
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

      {/* Talents Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-semibold">
            عرض <strong className="text-white">{filteredTalents.length}</strong> كفاءة موثقة ومتاحة للتعاقد
          </span>
          <Link
            href="/register"
            className="text-xs text-gold-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>هل أنت كفاءة فلسطينية؟ انضم للمنظومة الآن</span>
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="glass-card p-6 rounded-3xl border border-gold-500/25 hover:border-gold-500/60 transition-all shadow-xl flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Header with Avatar and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-base group-hover:scale-105 transition-transform">
                      {talent.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-gold-400 transition-colors">
                        {talent.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 block">{talent.locationDetail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-dark-900 px-2 py-0.5 rounded-lg border border-gold-500/20 text-xs font-mono font-bold text-gold-400">
                    <span className="material-symbols-outlined text-amber-400 text-[14px]">star</span>
                    <span>{talent.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-gold-300">{talent.title}</h4>

                {/* Bio */}
                <p className="text-xs text-gray-300 leading-relaxed min-h-[48px]">
                  {talent.bio}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-dark-900/90 border border-gold-500/20 text-center">
                  <div>
                    <span className="block text-[10px] text-gray-500">سعر الساعة</span>
                    <strong className="text-xs font-mono text-emerald-400 font-bold">{talent.hourlyRate}</strong>
                  </div>
                  <div className="border-x border-gold-500/10">
                    <span className="block text-[10px] text-gray-500">المشاريع</span>
                    <strong className="text-xs font-mono text-white font-bold">{talent.completedProjects}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">درجة الـ ATS</span>
                    <strong className="text-xs font-mono text-gold-400 font-bold">{talent.atsScore}%</strong>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {talent.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-dark-900 border border-gold-500/20 text-gray-300 text-[10px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedTalent(talent)}
                  className="w-full py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">person_check</span>
                  <span>وظّف هذه الكفاءة مباشرة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Talent Hiring Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-gold-500/40 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedTalent(null)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold text-lg">
                {selectedTalent.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedTalent.name}</h3>
                <span className="text-xs text-gold-400 font-semibold">{selectedTalent.title}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>الموقع:</span>
                <strong className="text-white">{selectedTalent.locationDetail}</strong>
              </div>
              <div className="flex justify-between">
                <span>السعر المقترح:</span>
                <strong className="text-emerald-400 font-mono font-bold">{selectedTalent.hourlyRate}</strong>
              </div>
              <div className="flex justify-between">
                <span>المشاريع المنجزة بنجاح:</span>
                <strong className="text-white font-mono font-bold">{selectedTalent.completedProjects} مشروع</strong>
              </div>
              <div className="flex justify-between">
                <span>الحالة الحالية:</span>
                <strong className="text-emerald-400 font-bold">متاح للتعاقد الفوري ✓</strong>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>تسجيل الدخول كشركة وإرسال دعوة تعاقد بالضمان</span>
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 rounded-xl bg-dark-900 text-gold-400 border border-gold-500/30 text-xs font-semibold hover:text-white flex items-center justify-center gap-1"
              >
                <span>ليس لديك حساب شركة؟ أنشئ حسابك في ثوانٍ</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveSession, clearActiveSession, AuthUser } from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface Applicant {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  jobTitle: string;
  proposedRate: string;
  duration: string;
  aiMatch: number;
  coverLetter: string;
  skills: string[];
  status: "pending" | "accepted" | "rejected";
}

const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: "app-1",
    name: "أحمد خليل النجار",
    title: "Senior Full-Stack & AI Architect",
    location: "فلسطين - قطاع غزة (عن بعد)",
    avatar: "أ.ن",
    jobTitle: "هندسة وبناء منصة SaaS متكاملة بـ Next.js 15 و PostgreSQL",
    proposedRate: "$1,100.00",
    duration: "12 يوم",
    aiMatch: 98,
    coverLetter:
      "تحياتي، اطلعت على متطلبات المشروع وبفضل خبرتي العميقة في Next.js 15 وبناء الأنظمة السحابية يسعدني تنفيذ العمل بأعلى معايير الأداء والـ SEO مع تسليم متكامل وموثق.",
    skills: ["Next.js 15", "TypeScript", "PostgreSQL", "Docker", "Tailwind"],
    status: "pending",
  },
  {
    id: "app-2",
    name: "م. ندى بركات",
    title: "AI & Cloud Backend Engineer",
    location: "فلسطين - نابلس / الضفة الغربية",
    avatar: "ن.ب",
    jobTitle: "تطوير واجهات برمجة التطبيقات ونماذج الذكاء الاصطناعي",
    proposedRate: "$750.00",
    duration: "8 أيام",
    aiMatch: 94,
    coverLetter:
      "أمتلك خبرة 4 سنوات في ربط نماذج اللغات الكبيرة وتطوير Microservices بـ Python و FastAPI، ولدي أعمال سابقة مماثلة يمكن استعراضها.",
    skills: ["Python", "FastAPI", "Gemini AI", "Cloudflare R2"],
    status: "pending",
  },
  {
    id: "app-3",
    name: "حسان مطر",
    title: "Senior UI/UX & Product Designer",
    location: "فلسطين - القدس / الشتات",
    avatar: "ح.م",
    jobTitle: "تصميم واجهات وتجربة مستخدم لمتجر إلكتروني فاخر",
    proposedRate: "$500.00",
    duration: "6 أيام",
    aiMatch: 91,
    coverLetter:
      "قمت بتصميم وتطوير أكثر من 12 نظام تصميم (Design System) لشركات في الخليج مع تسليم ملفات Figma مرتبة وجاهزة للبرمجة المباشرة.",
    skills: ["Figma", "Design Systems", "UI/UX", "Prototyping"],
    status: "pending",
  },
];

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"applicants" | "contracts" | "my_jobs">("applicants");

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setActiveUser(session);
    }
  }, []);

  // Load custom applicants submitted from public jobs page
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("renderlancer_employer_applicants");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplicants([...parsed, ...INITIAL_APPLICANTS]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    clearActiveSession();
    router.push("/login");
  };

  // Post Job Form State
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobBudget, setNewJobBudget] = useState("1000");
  const [newJobCategory, setNewJobCategory] = useState("dev");
  const [newJobDuration, setNewJobDuration] = useState("14 يوماً");
  const [newJobSkills, setNewJobSkills] = useState("Next.js 15, TypeScript, Tailwind");
  const [newJobDesc, setNewJobDesc] = useState("نبحث عن مهندس برمجيات محترف لتطوير هذا المشروع بجودة عالية وتسليمه وفق المعايير المعتمدة.");
  const [isDiasporaBadge, setIsDiasporaBadge] = useState(true);
  const [postJobSuccess, setPostJobSuccess] = useState(false);
  const [myPostedJobs, setMyPostedJobs] = useState<any[]>([]);

  // Load Company Posted Jobs
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("renderlancer_custom_jobs");
        const parsed = stored ? JSON.parse(stored) : [];
        const defaultCompanyJob = {
          id: "job-alquds-100",
          title: "تطوير متجر إلكتروني ذكي وتطبيق جوال مع ربط بوابات دفع بنك فلسطين وUSDT",
          company: activeUser?.companyName || "شركة القدس للحلول الذكية • Al-Quds Smart Solutions",
          companyLocation: activeUser?.location || "فلسطين - رام الله (عن بعد)",
          budget: "$1,450.00",
          duration: "15 يوماً",
          postedTime: "منذ 15 دقيقة (جديد)",
          proposalsCount: applicants.length,
          description:
            "نبحث في شركة القدس للحلول الذكية عن مهندس/فريق برمجيات متمكن لبناء متجر وتطبيق خدمات لوجستية متكامل. يشمل النظام لوحة تحكم للطلبات، ربط بوابات دفع بنك فلسطين وUSDT، وواجهات مستخدم سريعة متجاوبة مع الهواتف المحمولة.",
          skills: ["Next.js 15", "Flutter", "PostgreSQL", "بنك فلسطين API", "Tailwind CSS"],
          postedBy: "EMPLOYER",
        };
        const all = Array.isArray(parsed) && parsed.length > 0 ? parsed : [defaultCompanyJob];
        setMyPostedJobs(all);
      } catch (e) {
        console.error(e);
      }
    }
  }, [postJobSuccess, activeUser, applicants.length]);

  const handleAcceptApplicant = (id: string) => {
    const updated = applicants.map((app) =>
      app.id === id ? { ...app, status: "accepted" as const } : app
    );
    setApplicants(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("renderlancer_employer_applicants", JSON.stringify(updated));
        // Also update the proposal status in renderlancer_proposals so the talent sees it accepted!
        const targetApp = applicants.find((a) => a.id === id);
        if (targetApp) {
          const rawProps = localStorage.getItem("renderlancer_proposals");
          if (rawProps) {
            const props = JSON.parse(rawProps);
            const updatedProps = props.map((p: any) => {
              if (p.jobTitle === targetApp.jobTitle) {
                return {
                  ...p,
                  status: "تم قبولك • بانتظار بدء العمل",
                  statusClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                };
              }
              return p;
            });
            localStorage.setItem("renderlancer_proposals", JSON.stringify(updatedProps));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRejectApplicant = (id: string) => {
    const updated = applicants.map((app) =>
      app.id === id ? { ...app, status: "rejected" as const } : app
    );
    setApplicants(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("renderlancer_employer_applicants", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    setPostJobSuccess(true);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("renderlancer_custom_jobs");
        const list = stored ? JSON.parse(stored) : [];
        const newJob = {
          id: `job-emp-${Date.now()}`,
          title: newJobTitle,
          company: activeUser?.companyName || activeUser?.fullName || "مجموعة الأفق الرقمية",
          companyLocation: activeUser?.location || "الشتات الفلسطيني • دبي",
          isDiasporaSponsor: isDiasporaBadge,
          category: newJobCategory,
          budget: `$${newJobBudget}.00`,
          duration: newJobDuration,
          postedTime: "الآن",
          proposalsCount: 0,
          aiMatch: 97,
          description: newJobDesc,
          skills: newJobSkills.split(",").map((s) => s.trim()).filter(Boolean),
          postedBy: "EMPLOYER",
        };
        const updated = [newJob, ...list];
        localStorage.setItem("renderlancer_custom_jobs", JSON.stringify(updated));
        setMyPostedJobs(updated);
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setPostJobSuccess(false);
      setIsPostJobOpen(false);
      setNewJobTitle("");
      setActiveTab("my_jobs");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-dark-900 border-l border-gold-500/20 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 px-6 flex items-center gap-3 border-b border-gold-500/15">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-md">
                <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  بوابة <span className="text-gold-500">الشركات والتوظيف</span>
                </span>
                <span className="block text-[9px] text-gray-400 font-mono -mt-1">
                  RenderLancer for Business
                </span>
              </div>
            </Link>
          </div>

          {/* Company Profile Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-dark-950/80 border border-gold-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {activeUser?.avatar || "أ.ف"}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {activeUser?.companyName || activeUser?.fullName || "مجموعة الأفق الرقمية"}
                  </h4>
                  <span className="text-[10px] text-gold-400 block font-medium truncate">
                    {activeUser?.location || "شركة شتات • دبي"}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-gray-400 hover:text-red-400 border border-gold-500/20 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
            <div className="pt-2 border-t border-gold-500/10 flex items-center justify-between text-[10px] text-gray-400">
              <span>الرصيد في الضمان:</span>
              <strong className="text-emerald-400 font-mono font-bold">$4,250.00</strong>
            </div>
          </div>

          <nav className="px-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("applicants")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "applicants"
                  ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">groups</span>
              <span>المتقدمين للمشاريع (38)</span>
            </button>

            <button
              onClick={() => setActiveTab("contracts")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "contracts"
                  ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">handshake</span>
              <span>العقود النشطة والتسليمات (4)</span>
            </button>

            <button
              onClick={() => setActiveTab("my_jobs")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "my_jobs"
                  ? "bg-gold-500/15 text-gold-300 border border-gold-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">post_add</span>
              <span>الوظائف المنشورة (6)</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gold-500/15 space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>لوحة الباحث عن عمل</span>
          </Link>
          <Link
            href="/admin"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-500/15 text-purple-300 text-xs font-semibold hover:bg-purple-500/25 border border-purple-500/30"
          >
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>لوحة الـ Super Admin</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-dark-900/90 border-b border-gold-500/20 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[20px]">corporate_fare</span>
              لوحة إدارة التوظيف والشركات (Employer Portal)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />

            <button
              onClick={() => setIsPostJobOpen(true)}
              className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>نشر مشروع / وظيفة جديدة</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">تسجيل خروج</span>
            </button>
          </div>
        </header>

        {/* Body View */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
              <span className="text-xs text-gray-400 font-semibold">مشاريع مفتوحة حالياً</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">4 مشاريع</span>
                <span className="text-xs text-gold-400 font-bold">نشطة</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
              <span className="text-xs text-gray-400 font-semibold">إجمالي المتقدمين</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold gold-gradient-text">38 كفاءة</span>
                <span className="text-xs text-emerald-400 font-bold">+12 اليوم</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
              <span className="text-xs text-gray-400 font-semibold">أموال مؤمنة في الضمان (Escrow)</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-400">$4,250.00</span>
                <span className="text-[10px] text-gray-400">محمية بالكامل</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
              <span className="text-xs text-gray-400 font-semibold">كفاءات تم توظيفها وإنجازها</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">12 مستقل</span>
                <span className="text-xs text-gold-400">من غزة والضفة</span>
              </div>
            </div>
          </div>

          {/* Tab 1: Applicants Review (ATS Lite for Employers) */}
          {activeTab === "applicants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gold-500/15">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold-400 text-[22px]">how_to_reg</span>
                    المتقدمين للعروض ومطابقة الذكاء الاصطناعي (Candidate Review)
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    مرتبين تلقائياً حسب دقة تطابق مهاراتهم مع شروط وظيفتك بنظام الـ AI Match
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {applicants.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/50 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-dark-800 border-2 border-gold-500 text-gold-400 flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                          {app.avatar}
                        </div>

                        <div className="space-y-2 max-w-2xl">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{app.name}</h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                                {app.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[14px] text-gray-500">place</span>
                              {app.location}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-dark-950 border border-gold-500/15 text-xs text-gray-300 leading-relaxed">
                            <strong className="text-gold-400 block mb-1">
                              العرض المقدم لمشروع: {app.jobTitle}
                            </strong>
                            {app.coverLetter}
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {app.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side Match & Hiring Action */}
                      <div className="flex flex-col lg:items-end justify-between gap-4 shrink-0">
                        <div className="text-left lg:text-right">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                            <span className="material-symbols-outlined text-[16px]">psychology</span>
                            <span>{app.aiMatch}% تطابق مع الشروط</span>
                          </div>
                          <span className="block text-xl font-bold font-mono text-white">
                            {app.proposedRate}
                          </span>
                          <span className="block text-[11px] text-gray-400">
                            المدة المقترحة: {app.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {app.status === "accepted" ? (
                            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              تم توقيع العقد وبدء العمل
                            </span>
                          ) : app.status === "rejected" ? (
                            <span className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
                              تم رفض العرض
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRejectApplicant(app.id)}
                                className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-400 hover:text-red-400 text-xs font-semibold border border-gold-500/20"
                              >
                                رفض
                              </button>
                              <button
                                onClick={() => handleAcceptApplicant(app.id)}
                                className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                              >
                                <span className="material-symbols-outlined text-[16px]">handshake</span>
                                <span>قبول وتأمين الضمان (Escrow)</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Contracts & Milestone Releases */}
          {activeTab === "contracts" && (
            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gold-500/15">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold-400 text-[20px]">verified</span>
                  العقود النشطة ومراجعة التسليمات (Milestone Approvals)
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-dark-950 border border-gold-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">
                      عقد: تطوير لوحة تحكم سحابية لشركة عقارية
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                      التسليم بانتظار مراجعتك
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    المستقل: <strong>أحمد النجار</strong> • الدفعة الأولى محجوزة في الضمان المالي:{" "}
                    <strong className="text-emerald-400 font-mono font-bold">$600.00</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20">
                    معاينة ملف التسليم
                  </button>
                  <button
                    onClick={() => alert("تم تحرير الدفعة بنجاح وتحويل 600$ لمحفظة المستقل الفلسطيني!")}
                    className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>اعتماد وتحرير الدفعة للمستقل</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: My Jobs */}
          {activeTab === "my_jobs" && (
            <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gold-500/15">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold-400 text-[20px]">work</span>
                    إدارة ومتابعة المشاريع والوظائف المنشورة
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    المشاريع المنشورة باسم شركتك والمتاحة للمستقلين في سوق العمل
                  </p>
                </div>
                <button
                  onClick={() => setIsPostJobOpen(true)}
                  className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>نشر مشروع جديد</span>
                </button>
              </div>

              {myPostedJobs.length === 0 ? (
                <div className="p-8 rounded-2xl bg-dark-950/60 border border-gold-500/15 text-center space-y-2">
                  <span className="material-symbols-outlined text-gray-500 text-[36px]">work_outline</span>
                  <p className="text-xs text-gray-400">لم تقم بنشر أي مشاريع مخصصة بعد.</p>
                  <button
                    onClick={() => setIsPostJobOpen(true)}
                    className="text-xs text-gold-400 hover:underline font-bold"
                  >
                    انقر هنا لنشر أول مشروع لشركتك
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPostedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl bg-dark-950/80 border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{job.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                            نشط ويستقبل العروض
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1">{job.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>الميزانية: <strong className="text-emerald-400 font-mono">{job.budget}</strong></span>
                          <span>•</span>
                          <span>المدة: {job.duration}</span>
                          <span>•</span>
                          <span>العروض: {job.proposalsCount || 0} متقدمين</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href="/jobs"
                          className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-gold-400 border border-gold-500/20 text-xs font-semibold"
                        >
                          معاينة في السوق
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: POST NEW JOB ================= */}
      {isPostJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-6">
            
            <button
              onClick={() => setIsPostJobOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-[15px]">post_add</span>
                نشر مشروع جديد لاستقطاب الكفاءات الفلسطينية
              </div>
              <h3 className="text-lg font-bold text-white">تفاصيل المناقصة والميزانية</h3>
            </div>

            {postJobSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-400 text-[48px]">check_circle</span>
                <h4 className="text-base font-bold text-white">تم نشر المشروع بنجاح!</h4>
                <p className="text-xs text-emerald-300">
                  سيقوم محرك الذكاء الاصطناعي الآن بمطابقة وظيفتك مع أفضل المستقلين وإشعارهم للتقديم.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    عنوان المشروع أو المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تطوير تطبيق جوال لمنصة تجارة سحابية"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      الميزانية التقديرية المعتمدة ($ USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={newJobBudget}
                      onChange={(e) => setNewJobBudget(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs font-mono text-emerald-400 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      التخصص
                    </label>
                    <select
                      value={newJobCategory}
                      onChange={(e) => setNewJobCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none"
                    >
                      <option value="dev">البرمجة وهندسة التطبيقات</option>
                      <option value="ai">الذكاء الاصطناعي وعلم البيانات</option>
                      <option value="design">التصميم وتجربة المستخدم UI/UX</option>
                      <option value="marketing">التسويق والمحتوى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      المدة التقديرية لإنجاز المشروع
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: 14 يوماً"
                      value={newJobDuration}
                      onChange={(e) => setNewJobDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      المهارات المطلوبة (مفصولة بفاصلة)
                    </label>
                    <input
                      type="text"
                      placeholder="Next.js 15, TypeScript, Tailwind"
                      value={newJobSkills}
                      onChange={(e) => setNewJobSkills(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    تفاصيل ومتطلبات المشروع
                  </label>
                  <textarea
                    rows={3}
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    placeholder="اكتب وصفاً دقيقاً للمهام والتسليمات..."
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-gray-200 focus:outline-none focus:border-gold-500 leading-relaxed"
                  />
                </div>

                {/* Diaspora sponsor checkbox */}
                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="diaspora-checkbox"
                    checked={isDiasporaBadge}
                    onChange={(e) => setIsDiasporaBadge(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                  />
                  <label htmlFor="diaspora-checkbox" className="text-xs text-gray-200 cursor-pointer">
                    تمييز المشروع بشارة <strong className="text-gold-300">"كفيل شتات فلسطيني داعم"</strong> لجذب أفضل الكفاءات في الداخل
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPostJobOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <span>نشر المشروع فوراً</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

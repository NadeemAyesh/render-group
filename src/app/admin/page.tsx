"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getActiveSession,
  clearActiveSession,
  getAllUsersArray,
  adminUpdateUser,
  adminDeleteUser,
  registerNewUser,
  AuthUser,
  AuthRole,
  ROLE_LABELS,
} from "@/lib/auth-service";
import {
  getSiteContent,
  saveSiteContent,
  resetSiteContent,
  SiteContent,
  DEFAULT_SITE_CONTENT,
} from "@/lib/cms-service";
import {
  getPlans,
  togglePlanStatus,
  createPlan,
  deletePlan,
  getSubscriptions,
  adminToggleSubscriptionStatus,
  adminExtendSubscription,
  adminChangeUserPlan,
  adminAddCredits,
  PricingPlan,
  UserSubscription,
} from "@/lib/subscription-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface PendingPayout {
  id: string;
  freelancerName: string;
  location: string;
  amount: string;
  channel: "USDT" | "BANK_PALESTINE" | "PAYONEER" | "PALPAY";
  channelDetails: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_PAYOUTS: PendingPayout[] = [
  {
    id: "pay-1",
    freelancerName: "أحمد خليل النجار",
    location: "غزة (عن بعد)",
    amount: "$600.00",
    channel: "USDT",
    channelDetails: "TRC20: TLA98xK...2q8M",
    date: "اليوم 11:30 ص",
    status: "pending",
  },
  {
    id: "pay-2",
    freelancerName: "م. ندى بركات",
    location: "نابلس",
    amount: "$450.00",
    channel: "BANK_PALESTINE",
    channelDetails: "IBAN: PS04 0002 0001 0293 8472",
    date: "اليوم 09:15 ص",
    status: "pending",
  },
  {
    id: "pay-3",
    freelancerName: "حسان مطر",
    location: "القدس",
    amount: "$320.00",
    channel: "PAYONEER",
    channelDetails: "hassan.design@gmail.com",
    date: "أمس 04:45 م",
    status: "pending",
  },
];

const AI_TOOLS_CATALOG = [
  { id: "render-chat", name: "ريندر شات (Render Chat)", category: "المساعد اللغوي والبرمجي", status: "ACTIVE", requests: "24,800" },
  { id: "gpt-image-2", name: "GPT Image 2 Pro", category: "توليد وتعديل الصور 4K", status: "ACTIVE", requests: "18,450" },
  { id: "nano-banana", name: "Nano Banana Pro", category: "تحسين وتفريغ الصور", status: "ACTIVE", requests: "12,100" },
  { id: "veo-3-1", name: "Veo 3.1 السينمائي", category: "توليد الفيديو السينمائي", status: "ACTIVE", requests: "9,820" },
  { id: "seedance-2-0", name: "Seedance 2.0 Motion", category: "محاكاة الحركة والفيزياء", status: "ACTIVE", requests: "7,400" },
  { id: "omni-transition", name: "انتقال فريمين (Omni)", category: "الانتقالات السينمائية والصوت", status: "ACTIVE", requests: "6,150" },
  { id: "motion-master", name: "Motion Master Pro", category: "تحريك الشعارات والرسوم", status: "ACTIVE", requests: "5,300" },
  { id: "virtual-studio", name: "استوديو التصوير الافتراضي", category: "جلسات تصوير المنتجات 3D", status: "ACTIVE", requests: "4,900" },
  { id: "face-swap", name: "تبديل الوجوه / الأشخاص", category: "المطابقة وتغيير الملامح", status: "ACTIVE", requests: "3,850" },
  { id: "virtual-try-on", name: "القياس الافتراضي (Try-on)", category: "محاكاة الأزياء والملابس", status: "ACTIVE", requests: "3,400" },
  { id: "prompt-extractor", name: "استخراج البرومبت الهندسي", category: "الهندسة العكسية للأوامر", status: "ACTIVE", requests: "2,980" },
  { id: "ai-avatar", name: "أفتار الذكاء الاصطناعي", category: "المتحدث الرقمي الناطق", status: "ACTIVE", requests: "2,150" },
];

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "jobs" | "platforms" | "cms" | "escrow" | "subscriptions">("overview");

  // Payouts State
  const [payouts, setPayouts] = useState<PendingPayout[]>(INITIAL_PAYOUTS);

  // Subscriptions & Plans Management State
  const [plansList, setPlansList] = useState<PricingPlan[]>([]);
  const [subsList, setSubsList] = useState<UserSubscription[]>([]);
  const [subStatusFilter, setSubStatusFilter] = useState<string>("ALL");
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isAddCreditsModalOpen, setIsAddCreditsModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<UserSubscription | null>(null);

  // Extension & Credit form states
  const [extendDaysAmount, setExtendDaysAmount] = useState(30);
  const [extraImagesAmount, setExtraImagesAmount] = useState(100);
  const [extraVideosAmount, setExtraVideosAmount] = useState(10);
  const [targetPlanId, setTargetPlanId] = useState("plan-pro");

  // New Plan form state
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanNameEn, setNewPlanNameEn] = useState("");
  const [newPlanBadge, setNewPlanBadge] = useState("");
  const [newPlanMonthlyPrice, setNewPlanMonthlyPrice] = useState(49);
  const [newPlanYearlyPrice, setNewPlanYearlyPrice] = useState(450);
  const [newPlanImagesQuota, setNewPlanImagesQuota] = useState(1000);
  const [newPlanVideosQuota, setNewPlanVideosQuota] = useState(50);
  const [newPlanChatQuota, setNewPlanChatQuota] = useState(5000);
  const [newPlanFeatures, setNewPlanFeatures] = useState("توليد صور 4K غير محدود, 50 فيديو سينمائي, سحب أرباح فوري, دعم فني 24/7");

  // Users Management State
  const [usersList, setUsersList] = useState<AuthUser[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("password123");
  const [newUserRole, setNewUserRole] = useState<AuthRole>("JOB_SEEKER");
  const [newUserLocation, setNewUserLocation] = useState("فلسطين - قطاع غزة");
  const [newUserCompanyName, setNewUserCompanyName] = useState("");

  // Code Generator State
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [planDuration, setPlanDuration] = useState("30");

  // Central Jobs State
  const [allPlatformJobs, setAllPlatformJobs] = useState<any[]>([]);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [jobPostSuccess, setJobPostSuccess] = useState(false);
  const [adminJobTitle, setAdminJobTitle] = useState("");
  const [adminJobCompany, setAdminJobCompany] = useState("إدارة Render Group المركزية");
  const [adminJobLocation, setAdminJobLocation] = useState("الشتات الفلسطيني • دبي");
  const [adminJobBudget, setAdminJobBudget] = useState("1500");
  const [adminJobDuration, setAdminJobDuration] = useState("14 يوماً");
  const [adminJobCategory, setAdminJobCategory] = useState("dev");
  const [adminJobSkills, setAdminJobSkills] = useState("Next.js 15, PostgreSQL, TypeScript, Tailwind");
  const [adminJobDesc, setAdminJobDesc] = useState("مشروع رسمي معتمد تحت إشراف Render Group وإدارة المنصة المركزية مع ضمان مالي كامل وتوثيق متكامل.");
  const [adminJobIsDiaspora, setAdminJobIsDiaspora] = useState(true);

  // Tools Management State
  const [toolsList, setToolsList] = useState(AI_TOOLS_CATALOG);

  // CMS State
  const [cmsForm, setCmsForm] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [cmsSaveToast, setCmsSaveToast] = useState(false);

  // Load Initial Data
  const refreshUsers = () => {
    setUsersList(getAllUsersArray());
  };

  const refreshSubscriptions = () => {
    setPlansList(getPlans());
    setSubsList(getSubscriptions());
  };

  const loadPlatformJobs = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("renderlancer_custom_jobs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setAllPlatformJobs(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setActiveUser(session);
    }
    refreshUsers();
    refreshSubscriptions();
    loadPlatformJobs();
    setCmsForm(getSiteContent());
  }, []);

  const handleLogout = () => {
    clearActiveSession();
    router.push("/login");
  };

  // Payout actions
  const handleApprovePayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  // User Actions
  const handleToggleUserStatus = (user: AuthUser) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    adminUpdateUser(user.email, { status: newStatus });
    refreshUsers();
  };

  const handleToggleUserVerification = (user: AuthUser) => {
    const newVerification = !user.verified;
    adminUpdateUser(user.email, { verified: newVerification });
    refreshUsers();
  };

  const handleRoleChange = (email: string, newRole: AuthRole) => {
    adminUpdateUser(email, { role: newRole });
    refreshUsers();
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الحساب (${email}) نهائياً؟`)) {
      adminDeleteUser(email);
      refreshUsers();
    }
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      fullName: newUserName || newUserEmail.split("@")[0],
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      location: newUserLocation,
      companyName: newUserRole === "EMPLOYER" ? newUserCompanyName : undefined,
      avatar: (newUserName || newUserEmail).slice(0, 2).toUpperCase(),
      status: "ACTIVE",
      verified: true,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    registerNewUser(user, newUserPassword);
    refreshUsers();
    setIsAddUserModalOpen(false);
    setNewUserEmail("");
    setNewUserName("");
  };

  // Code generator
  const handleGenerateCode = () => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `RENDER-GOLD-${randomHex}`;
    setGeneratedCode(newCode);
  };

  // Admin Job actions
  const handleAdminPostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminJobTitle.trim()) return;

    setJobPostSuccess(true);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("renderlancer_custom_jobs");
        const list = stored ? JSON.parse(stored) : [];
        const newJob = {
          id: `job-admin-${Date.now()}`,
          title: adminJobTitle,
          company: adminJobCompany,
          companyLocation: adminJobLocation,
          isDiasporaSponsor: adminJobIsDiaspora,
          category: adminJobCategory,
          budget: `$${adminJobBudget}.00`,
          duration: adminJobDuration,
          postedTime: "الآن",
          proposalsCount: 0,
          aiMatch: 99,
          description: adminJobDesc,
          skills: adminJobSkills.split(",").map((s) => s.trim()).filter(Boolean),
          postedBy: "SUPER_ADMIN",
        };
        const updated = [newJob, ...list];
        localStorage.setItem("renderlancer_custom_jobs", JSON.stringify(updated));
        setAllPlatformJobs(updated);
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setJobPostSuccess(false);
      setIsAddJobOpen(false);
      setAdminJobTitle("");
    }, 1200);
  };

  const handleAdminDeleteJob = (id: string) => {
    const updated = allPlatformJobs.filter((j) => j.id !== id);
    setAllPlatformJobs(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("renderlancer_custom_jobs", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Tools actions
  const handleToggleToolStatus = (toolId: string) => {
    setToolsList((prev) =>
      prev.map((t) =>
        t.id === toolId ? { ...t, status: t.status === "ACTIVE" ? "MAINTENANCE" : "ACTIVE" } : t
      )
    );
  };

  // CMS actions
  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteContent(cmsForm);
    setCmsSaveToast(true);
    setTimeout(() => setCmsSaveToast(false), 3000);
  };

  const handleResetCms = () => {
    if (window.confirm("هل تريد استعادة النصوص الافتراضية للموقع بالكامل؟")) {
      const def = resetSiteContent();
      setCmsForm(def);
      setCmsSaveToast(true);
      setTimeout(() => setCmsSaveToast(false), 3000);
    }
  };

  // Subscription & Plan Actions
  const handleToggleSubStatus = (subId: string) => {
    adminToggleSubscriptionStatus(subId);
    refreshSubscriptions();
  };

  const handleTogglePlan = (planId: string) => {
    togglePlanStatus(planId);
    refreshSubscriptions();
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الباقة نهائياً؟")) {
      deletePlan(planId);
      refreshSubscriptions();
    }
  };

  const handleConfirmExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSub) {
      adminExtendSubscription(selectedSub.id, Number(extendDaysAmount));
      setIsExtendModalOpen(false);
      refreshSubscriptions();
    }
  };

  const handleConfirmAddCredits = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSub) {
      adminAddCredits(selectedSub.id, Number(extraImagesAmount), Number(extraVideosAmount));
      setIsAddCreditsModalOpen(false);
      refreshSubscriptions();
    }
  };

  const handleConfirmChangePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSub) {
      adminChangeUserPlan(selectedSub.id, targetPlanId);
      setIsChangePlanModalOpen(false);
      refreshSubscriptions();
    }
  };

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;
    const newP: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName,
      nameEn: newPlanNameEn || newPlanName,
      badge: newPlanBadge || undefined,
      priceMonthly: Number(newPlanMonthlyPrice),
      priceYearly: Number(newPlanYearlyPrice),
      durationDays: 30,
      imagesQuota: Number(newPlanImagesQuota),
      videosQuota: Number(newPlanVideosQuota),
      chatQuota: Number(newPlanChatQuota),
      active: true,
      popular: false,
      features: newPlanFeatures.split(",").map((f) => f.trim()).filter(Boolean),
    };
    createPlan(newP);
    setIsAddPlanModalOpen(false);
    setNewPlanName("");
    setNewPlanNameEn("");
    setNewPlanBadge("");
    refreshSubscriptions();
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter === "ALL") return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* ================= SUPER ADMIN METRONIC SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-dark-900 border-l border-purple-500/30 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 px-6 flex items-center gap-3 border-b border-purple-500/20">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  RENDER <span className="text-purple-400">ADMIN</span>
                </span>
                <span className="block text-[9px] text-gray-400 font-mono -mt-1">
                  Metronic Enterprise Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Super Admin User Card */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center font-bold text-sm shrink-0">
                {activeUser?.avatar || "SA"}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white truncate">
                  {activeUser?.fullName || "المهندس نديم (Super Admin)"}
                </span>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold mt-0.5">
                  SUPER_ADMIN (صلاحيات مطلقة)
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-gray-400 hover:text-red-400 border border-purple-500/30 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="px-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "overview"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>مركز القيادة الشامل</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "users"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-purple-400">group</span>
                <span>إدارة حسابات المستخدمين</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-dark-850 text-gray-300 text-[10px] font-mono">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "jobs"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-blue-400">work</span>
                <span>إدارة الوظائف والفرص</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                {allPlatformJobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("platforms")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "platforms"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">token</span>
              <span>إدارة المنصات واستوديو الـ AI</span>
            </button>

            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "subscriptions"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-amber-400">loyalty</span>
                <span>إدارة الحزم والاشتراكات</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                {subsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cms")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "cms"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">edit_note</span>
              <span>إدارة محتوى الموقع (CMS)</span>
            </button>

            <button
              onClick={() => setActiveTab("escrow")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "escrow"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">account_balance</span>
              <span>الضمان المالي وسحوبات فلسطين</span>
            </button>

            <Link
              href="/admin/permissions"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-purple-400">account_tree</span>
              <span>شجرة الصلاحيات (RBAC)</span>
            </Link>
          </nav>
        </div>

        {/* Quick Portal Switchers */}
        <div className="p-4 border-t border-purple-500/20 space-y-2">
          <Link
            href="/jobs"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>معاينة سوق الوظائف المباشر</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gray-700"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>زيارة الصفحة الرئيسية للموقع</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-dark-900 border-b border-purple-500/20 px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {activeTab === "overview" && "مركز القيادة والتحكم الإداري الموحد"}
                {activeTab === "users" && "إدارة حسابات المستخدمين والمستقلين والشركات"}
                {activeTab === "jobs" && "إدارة الوظائف والمشاريع المفتوحة في السوق"}
                {activeTab === "platforms" && "إدارة استوديو الذكاء الاصطناعي وتراخيص الأدوات"}
                {activeTab === "cms" && "إدارة محتوى الموقع وصفحات المنظومة (CMS)"}
                {activeTab === "escrow" && "سجل الضمان المالي وسحوبات أرباح فلسطين"}
              </span>
            </h1>
            <span className="text-xs text-gray-400">
              منصة RenderLancer المركزية • جلسة مصادقة مشفرة للـ Super Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <Link
              href="/admin/permissions"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>مصفوفة الصلاحيات</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Notification Toast */}
          {cmsSaveToast && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>تم حفظ ونشر التعديلات بنجاح وتحديث الموقع فورياً!</span>
            </div>
          )}

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Executive KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">المستخدمين المسجلين</span>
                    <span className="material-symbols-outlined text-purple-400 text-[22px]">group</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-white">+{usersList.length}</span>
                    <span className="block text-[11px] text-emerald-400 mt-1">كفاءات وشركات مسجلة</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">حجم السيولة في الضمان (Escrow)</span>
                    <span className="material-symbols-outlined text-emerald-400 text-[22px]">lock</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono text-emerald-400">$142,500.00</span>
                    <span className="block text-[11px] text-gray-400 mt-1">محمية بنظام العقود الذكية</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">الوظائف والفرص المفتوحة</span>
                    <span className="material-symbols-outlined text-blue-400 text-[22px]">work</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono text-white">
                      {allPlatformJobs.length + 4}
                    </span>
                    <span className="block text-[11px] text-blue-300 mt-1">Super Admin والشركات</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">استهلاك أدوات الـ AI الموحدة</span>
                    <span className="material-symbols-outlined text-gold-400 text-[22px]">token</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono gold-gradient-text">12 أداة</span>
                    <span className="block text-[11px] text-gold-400 mt-1">عناقيد حوسبة H100 نشطة</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setActiveTab("users")}
                  className="p-6 rounded-2xl bg-dark-900 border border-purple-500/25 hover:border-purple-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">manage_accounts</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    إدارة حسابات المستخدمين
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    توثيق المستقلين، تجميد أو تفعيل الحسابات، تغيير الصلاحيات وإضافة مستخدمين جدد.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("jobs")}
                  className="p-6 rounded-2xl bg-dark-900 border border-blue-500/25 hover:border-blue-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">post_add</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    إدارة ونشر الوظائف
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    نشر وظائف ومشاريع رسمية باسم Super Admin أو مراقبة وحذف وظائف الشركات المسجلة.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("cms")}
                  className="p-6 rounded-2xl bg-dark-900 border border-emerald-500/25 hover:border-emerald-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">edit_document</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    إدارة محتوى الموقع (CMS)
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    التحكم بنصوص الرئيسية وصفحة من نحن، الإحصائيات، وشريط الإعلانات وتحديثها فورياً.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: USERS MANAGEMENT ================= */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-dark-900 border border-purple-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-400 text-[22px]">manage_accounts</span>
                      <span>سجل وإدارة حسابات المستخدمين الشامل</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      التحكم بحسابات المستقلين، الشركات، ومحرري المحتوى، مع إدارة التوثيق وتجميد الحسابات
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">person_add</span>
                      <span>+ إضافة مستخدم جديد</span>
                    </button>
                  </div>
                </div>

                {/* Filters Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 font-semibold">تصفية حسب الدور:</span>
                  {["ALL", "JOB_SEEKER", "EMPLOYER", "SUPER_ADMIN", "CONTENT_EDITOR"].map((roleKey) => (
                    <button
                      key={roleKey}
                      onClick={() => setUserRoleFilter(roleKey)}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                        userRoleFilter === roleKey
                          ? "bg-purple-600 text-white"
                          : "bg-dark-850 text-gray-400 hover:text-white"
                      }`}
                    >
                      {roleKey === "ALL" && "الكل"}
                      {roleKey === "JOB_SEEKER" && "مستقلون"}
                      {roleKey === "EMPLOYER" && "شركات"}
                      {roleKey === "SUPER_ADMIN" && "مدراء"}
                      {roleKey === "CONTENT_EDITOR" && "محررون"}
                    </button>
                  ))}
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-purple-500/20 text-gray-400 pb-2">
                        <th className="py-2.5 font-semibold">المستخدم</th>
                        <th className="py-2.5 font-semibold">الدور في المنصة</th>
                        <th className="py-2.5 font-semibold">الموقع الجغرافي</th>
                        <th className="py-2.5 font-semibold">حالة الحساب</th>
                        <th className="py-2.5 font-semibold">التوثيق</th>
                        <th className="py-2.5 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.email}>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-dark-850 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                                {u.avatar || u.fullName.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{u.fullName}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_LABELS[u.role]?.badgeClass}`}>
                              {ROLE_LABELS[u.role]?.ar || u.role}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-300">{u.location || "فلسطين"}</td>
                          <td className="py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.status === "SUSPENDED"
                                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              }`}
                            >
                              {u.status === "SUSPENDED" ? "موقوف" : "نشط"}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <button
                              onClick={() => handleToggleUserVerification(u)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${
                                u.verified
                                  ? "bg-gold-500/15 text-gold-300 border-gold-500/30"
                                  : "bg-dark-850 text-gray-500 border-gray-700 hover:text-white"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">
                                {u.verified ? "verified" : "check"}
                              </span>
                              <span>{u.verified ? "موثق رسمياً" : "غير موثق"}</span>
                            </button>
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                  u.status === "SUSPENDED"
                                    ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                                }`}
                              >
                                {u.status === "SUSPENDED" ? "تفعيل" : "إيقاف"}
                              </button>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.email, e.target.value as AuthRole)}
                                className="px-1.5 py-1 rounded-lg bg-dark-950 border border-purple-500/30 text-[10px] text-gray-300"
                              >
                                <option value="JOB_SEEKER">مستقل</option>
                                <option value="EMPLOYER">شركة</option>
                                <option value="CONTENT_EDITOR">محرر</option>
                                <option value="SUPER_ADMIN">مدير</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(u.email)}
                                className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                title="حذف المستخدم"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: JOBS MANAGEMENT ================= */}
          {activeTab === "jobs" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-dark-900 border border-blue-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-400 text-[22px]">work</span>
                      <span>إدارة ونشر الوظائف والفرص (Job Marketplace Engine)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      نشر مشاريع رسمية معتمدة من إدارة Render ومراجعة وإدارة الوظائف المنشورة من قبل الشركات
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/jobs"
                      className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gold-400 border border-gold-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>سوق الوظائف الحي</span>
                    </Link>
                    <button
                      onClick={() => setIsAddJobOpen(true)}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      <span>+ نشر وظيفة من Super Admin</span>
                    </button>
                  </div>
                </div>

                {allPlatformJobs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-dark-950/60 border border-blue-500/20 text-center space-y-3">
                    <span className="material-symbols-outlined text-blue-400 text-[40px]">work_outline</span>
                    <h4 className="text-sm font-bold text-white">لا توجد وظائف مخصصة مضافة بعد</h4>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      انقر على زر النشر أعلاه لإضافة مشاريع معتمدة تظهر فوراً في قمة سوق العمل.
                    </p>
                    <button
                      onClick={() => setIsAddJobOpen(true)}
                      className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>نشر أول وظيفة رسمية</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-blue-500/20 text-gray-400 pb-2">
                          <th className="py-2.5 font-semibold">المشروع / المسمى</th>
                          <th className="py-2.5 font-semibold">الجهة الناشرة</th>
                          <th className="py-2.5 font-semibold">الموقع والميزانية</th>
                          <th className="py-2.5 font-semibold">المدة والتخصص</th>
                          <th className="py-2.5 font-semibold">الحالة</th>
                          <th className="py-2.5 font-semibold">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-500/10">
                        {allPlatformJobs.map((job) => (
                          <tr key={job.id}>
                            <td className="py-3.5">
                              <span className="font-bold text-white block">{job.title}</span>
                              <span className="text-[10px] text-gray-400 line-clamp-1">{job.description}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="text-gray-200 font-semibold block">{job.company}</span>
                              {job.postedBy === "SUPER_ADMIN" ? (
                                <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                  👑 Super Admin موثق
                                </span>
                              ) : (
                                <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                                  🏢 شركة مسجلة
                                </span>
                              )}
                            </td>
                            <td className="py-3.5">
                              <span className="text-emerald-400 font-mono font-bold block">{job.budget}</span>
                              <span className="text-[10px] text-gray-500">{job.companyLocation}</span>
                            </td>
                            <td className="py-3.5 text-gray-300">
                              <span>{job.duration}</span>
                              <span className="text-[10px] text-gray-500 block">تصنيف: {job.category}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                مفتوح في السوق
                              </span>
                            </td>
                            <td className="py-3.5">
                              <div className="flex items-center gap-2">
                                <Link
                                  href="/jobs"
                                  className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 text-gold-400 border border-gold-500/20 text-[11px]"
                                >
                                  عرض
                                </Link>
                                <button
                                  onClick={() => handleAdminDeleteJob(job.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-[11px]"
                                >
                                  حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PLATFORMS & AI STUDIO ================= */}
          {activeTab === "platforms" && (
            <div className="space-y-6 animate-fade-in">
              {/* Activation Code Generator */}
              <div id="code-generator" className="p-6 rounded-2xl bg-dark-900 border border-gold-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold-500/15">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold-400 text-[22px]">vpn_key</span>
                      توليد وإصدار رموز تفعيل باقات Render Studio (Activation Engine)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      توليد أكواد تراخيص مسبقة الدفع لتوزيعها على الشركاء أو بيعها محلياً في غزة والضفة
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateCode}
                    className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>توليد كود جديد الآن</span>
                  </button>
                </div>

                {generatedCode && (
                  <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gold-400 text-[28px]">token</span>
                      <div>
                        <span className="text-xs text-gray-300 block">الكود الصادر بنجاح:</span>
                        <strong className="text-lg font-mono font-bold text-gold-400 tracking-wider">
                          {generatedCode}
                        </strong>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          صالح لمدة 30 يوماً ويمنح وصولاً شاملاً لكافة الأدوات الـ 12
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        alert(`تم نسخ الكود (${generatedCode}) بنجاح!`);
                      }}
                      className="px-4 py-2 rounded-lg bg-dark-900 hover:bg-dark-850 text-gold-300 border border-gold-500/30 text-xs font-bold"
                    >
                      نسخ الكود
                    </button>
                  </div>
                )}
              </div>

              {/* Tools Catalog Table */}
              <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-gold-500/15 pb-3">
                  <span className="material-symbols-outlined text-gold-400 text-[20px]">hub</span>
                  <span>حالة وإدارة أدوات استوديو الذكاء الـ 12</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsList.map((tool) => (
                    <div key={tool.id} className="p-4 rounded-2xl bg-dark-950 border border-gold-500/20 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              tool.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {tool.status === "ACTIVE" ? "نشط سحابياً" : "تحت الصيانة"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 block mt-1">{tool.category}</span>
                      </div>

                      <div className="pt-2 border-t border-gold-500/10 flex items-center justify-between text-xs">
                        <span className="text-gray-400 text-[11px]">الاستهلاك: <strong className="text-white font-mono">{tool.requests}</strong></span>
                        <button
                          onClick={() => handleToggleToolStatus(tool.id)}
                          className="px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 text-gold-400 text-[11px] font-semibold border border-gold-500/20"
                        >
                          تبديل الحالة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: CMS SITE CONTENT MANAGEMENT ================= */}
          {activeTab === "cms" && (
            <div className="space-y-6 animate-fade-in">
              <form onSubmit={handleSaveCms} className="p-6 rounded-2xl bg-dark-900 border border-emerald-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[22px]">edit_note</span>
                      <span>إدارة وتعديل محتوى صفحات الموقع (CMS Engine)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      تعديل نصوص الصفحة الرئيسية، صفحة من نحن، الإحصائيات، ومعلومات التواصل وتحديثها في الموقع لحظياً
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetCms}
                      className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs font-semibold"
                    >
                      استعادة الافتراضي
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>حفظ ونشر التعديلات فوراً</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Homepage Hero */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gold-400 border-b border-gold-500/15 pb-1">
                    1. نصوص الصفحة الرئيسية (Hero Section)
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      نص الشارة العلوية (Hero Badge)
                    </label>
                    <input
                      type="text"
                      value={cmsForm.heroBadge}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroBadge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">
                        العنوان الرئيسي (Hero Title)
                      </label>
                      <input
                        type="text"
                        value={cmsForm.heroTitle}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-white focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">
                        الكلمة المميزة باللون الذهبي (Golden Highlight)
                      </label>
                      <input
                        type="text"
                        value={cmsForm.heroHighlight}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroHighlight: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-gold-400 focus:outline-none focus:border-emerald-400 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      الوصف الترحيبي (Hero Subtitle)
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.heroDescription}
                      onChange={(e) => setCmsForm({ ...cmsForm, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-gray-200 focus:outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 2: About Us */}
                <div className="space-y-4 pt-4 border-t border-emerald-500/15">
                  <h4 className="text-sm font-bold text-gold-400 border-b border-gold-500/15 pb-1">
                    2. محتوى صفحة من نحن (About Us)
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      قصة وهوية Render Group
                    </label>
                    <textarea
                      rows={4}
                      value={cmsForm.aboutStory}
                      onChange={(e) => setCmsForm({ ...cmsForm, aboutStory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-gray-200 focus:outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      الرؤية والرسالة الاستراتيجية
                    </label>
                    <textarea
                      rows={3}
                      value={cmsForm.aboutVision}
                      onChange={(e) => setCmsForm({ ...cmsForm, aboutVision: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-gray-200 focus:outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section 3: Statistics & Contact */}
                <div className="space-y-4 pt-4 border-t border-emerald-500/15">
                  <h4 className="text-sm font-bold text-gold-400 border-b border-gold-500/15 pb-1">
                    3. أرقام وإحصائيات المنظومة ومعلومات الاتصال
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">إجمالي المستقلين</label>
                      <input
                        type="text"
                        value={cmsForm.statTalents}
                        onChange={(e) => setCmsForm({ ...cmsForm, statTalents: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">حجم المعاملات ($)</label>
                      <input
                        type="text"
                        value={cmsForm.statVolume}
                        onChange={(e) => setCmsForm({ ...cmsForm, statVolume: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-emerald-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">نسبة الرضا</label>
                      <input
                        type="text"
                        value={cmsForm.statSatisfaction}
                        onChange={(e) => setCmsForm({ ...cmsForm, statSatisfaction: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-gold-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">البريد الإلكتروني الرسمي</label>
                      <input
                        type="text"
                        value={cmsForm.contactEmail}
                        onChange={(e) => setCmsForm({ ...cmsForm, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">رقم الهاتف / الدعم</label>
                      <input
                        type="text"
                        value={cmsForm.contactPhone}
                        onChange={(e) => setCmsForm({ ...cmsForm, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    <span>نشر المحتوى وتحديث الموقع الحي فوراً</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 6: ESCROW & PAYOUTS ================= */}
          {activeTab === "escrow" && (
            <div className="space-y-6 animate-fade-in">
              <div id="escrow-ledger" className="p-6 rounded-2xl bg-dark-900 border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/15">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-400 text-[22px]">account_balance</span>
                      <span>سجل الضمان المالي وطلبات سحب الأرباح (Palestine Payouts Rails)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      اعتماد وتحويل مستحقات المستقلين في غزة والضفة عبر قنوات USDT TRC20 وبنك فلسطين
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-emerald-500/20 text-gray-400 pb-2">
                        <th className="py-2.5 font-semibold">المستقل</th>
                        <th className="py-2.5 font-semibold">الموقع</th>
                        <th className="py-2.5 font-semibold">المبلغ المطلوب</th>
                        <th className="py-2.5 font-semibold">قناة التحويل والتفاصيل</th>
                        <th className="py-2.5 font-semibold">تاريخ الطلب</th>
                        <th className="py-2.5 font-semibold">الحالة</th>
                        <th className="py-2.5 font-semibold">إجراء الاعتماد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/10">
                      {payouts.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3.5 font-bold text-white">{item.freelancerName}</td>
                          <td className="py-3.5 text-gray-400">{item.location}</td>
                          <td className="py-3.5 font-mono text-emerald-400 font-bold text-sm">
                            {item.amount}
                          </td>
                          <td className="py-3.5">
                            <span className="text-gold-400 font-bold block">{item.channel}</span>
                            <span className="text-[10px] text-gray-500 font-mono block">
                              {item.channelDetails}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-400">{item.date}</td>
                          <td className="py-3.5">
                            {item.status === "approved" ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                تم التحويل بنجاح ✓
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30 text-[10px] font-semibold">
                                بانتظار الموافقة
                              </span>
                            )}
                          </td>
                          <td className="py-3.5">
                            {item.status === "approved" ? (
                              <span className="text-gray-500 text-[11px]">مكتمل</span>
                            ) : (
                              <button
                                onClick={() => handleApprovePayout(item.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                <span>اعتماد والتحويل</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: SUBSCRIPTIONS & PLANS MANAGEMENT ================= */}
          {activeTab === "subscriptions" && (
            <div className="space-y-8">
              {/* Top Banner & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1.5">
                    <span className="material-symbols-outlined text-[15px]">loyalty</span>
                    <span>منظومة الحزم السحابية وإدارة رصيد الذكاء الاصطناعي (Subscriptions Engine)</span>
                  </div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    إدارة الاشتراكات، الحزم، وباقة التجربة المجانية (3 أيام)
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    مراقبة رصيد كافة المستخدمين الفوري، تعديل وتمديد الاشتراكات، تفعيل/إلغاء تفعيل الباقات، وشحن الرصيد الإضافي.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddPlanModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>+ إضافة باقة جديدة</span>
                  </button>
                  <Link
                    href="/pricing"
                    target="_blank"
                    className="px-3.5 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gold-400 border border-gold-500/30 text-xs font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>معاينة صفحة الأسعار</span>
                  </Link>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-dark-900 border border-amber-500/30 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">إجمالي المشتركين المسجلين</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono text-white">{subsList.length}</span>
                    <span className="text-xs text-amber-400 font-bold">مشترك ومستفيد</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-emerald-500/30 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">مستخدمو التجربة المجانية (3 أيام)</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono text-emerald-400">
                      {subsList.filter((s) => s.status === "TRIAL").length}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      50 صورة + 3 فيديو
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/30 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">المشتركون النشطون (Paid)</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono text-purple-300">
                      {subsList.filter((s) => s.status === "ACTIVE").length}
                    </span>
                    <span className="text-xs text-purple-400 font-bold">باقات مدفوعة</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/30 flex flex-col justify-between">
                  <span className="text-xs text-gray-400 font-semibold">الإيراد الشهري التقديري (MRR)</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold font-mono gold-gradient-text">
                      ${subsList.filter((s) => s.status === "ACTIVE").reduce((acc, curr) => acc + (curr.price || 0), 0)}
                    </span>
                    <span className="text-[10px] text-gray-400">شهرياً عبر البنوك والكريبتو</span>
                  </div>
                </div>
              </div>

              {/* ============ SUB-SECTION 1: USER SUBSCRIPTIONS MONITORING ============ */}
              <div className="p-6 rounded-3xl bg-dark-900 border border-amber-500/25 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-amber-500/15">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-[20px]">manage_accounts</span>
                      <span>سجل ومراقبة اشتراكات المستخدمين الحية</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      متابعة استهلاك الصور والفيديوهات لكل مستخدم، وتمديد الأيام وشحن الرصيد والترقية الفورية
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد أو الباقة..."
                        value={subSearchQuery}
                        onChange={(e) => setSubSearchQuery(e.target.value)}
                        className="px-3 py-1.5 pr-8 rounded-xl bg-dark-950 border border-amber-500/30 text-xs text-white placeholder:text-gray-500 focus:outline-none w-52"
                      />
                      <span className="material-symbols-outlined absolute right-2.5 top-2 text-gray-500 text-[16px]">
                        search
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-amber-500/20">
                      {[
                        { id: "ALL", label: "الكل" },
                        { id: "ACTIVE", label: "نشط" },
                        { id: "TRIAL", label: "تجريبي (3 أيام)" },
                        { id: "EXPIRED", label: "منتهي" },
                        { id: "SUSPENDED", label: "معلق" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSubStatusFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            subStatusFilter === tab.id
                              ? "bg-amber-500 text-dark-950 shadow-sm"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscriptions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-amber-500/20 text-gray-400 pb-2">
                        <th className="py-3 font-semibold">المستخدم</th>
                        <th className="py-3 font-semibold">الباقة ودورة الدفع</th>
                        <th className="py-3 font-semibold">الحالة</th>
                        <th className="py-3 font-semibold">الأيام المتبقية</th>
                        <th className="py-3 font-semibold">استهلاك الصور 4K</th>
                        <th className="py-3 font-semibold">استهلاك الفيديو</th>
                        <th className="py-3 font-semibold">وسيلة الدفع</th>
                        <th className="py-3 font-semibold text-center">تحكم Super Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10">
                      {subsList
                        .filter((sub) => {
                          const matchesStatus = subStatusFilter === "ALL" || sub.status === subStatusFilter;
                          const matchesSearch =
                            sub.userName.toLowerCase().includes(subSearchQuery.toLowerCase()) ||
                            sub.userEmail.toLowerCase().includes(subSearchQuery.toLowerCase()) ||
                            sub.planName.toLowerCase().includes(subSearchQuery.toLowerCase());
                          return matchesStatus && matchesSearch;
                        })
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-dark-850/50 transition-colors">
                            {/* User */}
                            <td className="py-3.5">
                              <span className="font-bold text-white block">{sub.userName}</span>
                              <span className="text-[10px] text-gray-400 font-mono block">{sub.userEmail}</span>
                              <span className="text-[9px] text-amber-400 font-semibold">{sub.userRole}</span>
                            </td>

                            {/* Plan */}
                            <td className="py-3.5">
                              <span className="font-bold text-white block">{sub.planName}</span>
                              <span className="text-[10px] text-gray-400">
                                {sub.billingCycle === "trial" ? "تجربة 3 أيام مجانية" : `$${sub.price} (${sub.billingCycle})`}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  sub.status === "ACTIVE"
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                    : sub.status === "TRIAL"
                                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                    : sub.status === "EXPIRED"
                                    ? "bg-gray-700/50 text-gray-400 border-gray-600"
                                    : "bg-red-500/15 text-red-300 border-red-500/30"
                                }`}
                              >
                                {sub.status === "ACTIVE"
                                  ? "نشط ومعتمد"
                                  : sub.status === "TRIAL"
                                  ? "تجربة 3 أيام"
                                  : sub.status === "EXPIRED"
                                  ? "منتهي الصلاحية"
                                  : "معلّق"}
                              </span>
                            </td>

                            {/* Days remaining */}
                            <td className="py-3.5 font-mono">
                              <span className="text-white font-bold block">{sub.daysRemaining} يوم</span>
                              <span className="text-[10px] text-gray-500">حتى {sub.expiresAt}</span>
                            </td>

                            {/* Images quota */}
                            <td className="py-3.5">
                              <div className="space-y-1 w-28">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-gray-400">{sub.imagesUsed}</span>
                                  <span className="text-white font-bold">{sub.imagesTotal}</span>
                                </div>
                                <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-gold-500/20">
                                  <div
                                    className="bg-gold-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(100, (sub.imagesUsed / Math.max(1, sub.imagesTotal)) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Videos quota */}
                            <td className="py-3.5">
                              <div className="space-y-1 w-24">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-gray-400">{sub.videosUsed}</span>
                                  <span className="text-purple-300 font-bold">{sub.videosTotal}</span>
                                </div>
                                <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-purple-500/20">
                                  <div
                                    className="bg-purple-500 h-full rounded-full"
                                    style={{
                                      width: `${Math.min(100, (sub.videosUsed / Math.max(1, sub.videosTotal)) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Payment Method */}
                            <td className="py-3.5">
                              <span className="text-xs text-gray-300 block">{sub.paymentMethod || "دفع سحابي"}</span>
                            </td>

                            {/* Admin Actions */}
                            <td className="py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* Toggle Status */}
                                <button
                                  onClick={() => handleToggleSubStatus(sub.id)}
                                  title={sub.status === "ACTIVE" || sub.status === "TRIAL" ? "تجميد وتعليق الاشتراك" : "إعادة تفعيل الاشتراك"}
                                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                    sub.status === "ACTIVE" || sub.status === "TRIAL"
                                      ? "bg-dark-850 hover:bg-dark-800 text-yellow-400 border-yellow-500/30"
                                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[15px]">
                                    {sub.status === "ACTIVE" || sub.status === "TRIAL" ? "pause" : "play_arrow"}
                                  </span>
                                </button>

                                {/* Extend Days */}
                                <button
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsExtendModalOpen(true);
                                  }}
                                  title="تمديد فترة الصلاحية بالأيام"
                                  className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-blue-400 border border-blue-500/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[15px]">more_time</span>
                                </button>

                                {/* Add Quota */}
                                <button
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsAddCreditsModalOpen(true);
                                  }}
                                  title="شحن رصيد إضافي (صور وفيديو)"
                                  className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-emerald-400 border border-emerald-500/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                                </button>

                                {/* Change Plan */}
                                <button
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsChangePlanModalOpen(true);
                                  }}
                                  title="ترقية أو تغيير باقة المستخدم"
                                  className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-purple-400 border border-purple-500/30 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[15px]">published_with_changes</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============ SUB-SECTION 2: PRICING PLANS CATALOG MANAGEMENT ============ */}
              <div className="p-6 rounded-3xl bg-dark-900 border border-amber-500/25 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-500/15">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-[20px]">view_timeline</span>
                      <span>إدارة باقات وخطط الأسعار (Plan Catalog & Quotas)</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      تفعيل وإلغاء تفعيل الباقات، التحكم في الأسعار والحصص والمزايا المعروضة في صفحة الأسعار العامة
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddPlanModalOpen(true)}
                    className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>إنشاء خطة جديدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plansList.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                        plan.active
                          ? "bg-dark-950 border-amber-500/30 hover:border-amber-500/60"
                          : "bg-dark-950/50 border-gray-800 opacity-60"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              plan.active
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-red-500/15 text-red-300 border-red-500/30"
                            }`}
                          >
                            {plan.active ? "مفعّلة على الموقع" : "معطّلة / مخفية"}
                          </span>
                          {plan.badge && (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono block">{plan.nameEn}</span>
                        </div>

                        <div className="pt-2 border-t border-amber-500/15 flex items-baseline justify-between">
                          <span className="text-xs text-gray-400">السعر الشهري:</span>
                          <strong className="text-lg font-mono text-emerald-400 font-bold">
                            {plan.priceMonthly === 0 ? "مجاني ($0)" : `$${plan.priceMonthly}`}
                          </strong>
                        </div>

                        <div className="space-y-1 text-[11px] text-gray-300 bg-dark-900 p-2.5 rounded-xl border border-amber-500/15">
                          <div className="flex justify-between">
                            <span className="text-gray-400">حصة الصور 4K:</span>
                            <strong className="text-white font-mono">{plan.imagesQuota} صورة</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">الفيديو السينمائي:</span>
                            <strong className="text-white font-mono">{plan.videosQuota} فيديو</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">المحادثات:</span>
                            <strong className="text-white font-mono">{plan.chatQuota} شات</strong>
                          </div>
                        </div>
                      </div>

                      {/* Plan Admin Actions */}
                      <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePlan(plan.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            plan.active
                              ? "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                              : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {plan.active ? "إلغاء التفعيل" : "تفعيل الباقة"}
                        </button>

                        {!plan.isTrial && (
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            title="حذف الباقة"
                            className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-400 hover:text-red-400 border border-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD NEW USER BY ADMIN ================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-purple-500/40 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">إضافة مستخدم جديد للنظام</h3>
              <p className="text-xs text-gray-400">إنشاء حساب معتمد بصلاحيات محددة مباشرة من الإدارة</p>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">كلمة المرور</label>
                  <input
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">الدور الوظيفي</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AuthRole)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white"
                  >
                    <option value="JOB_SEEKER">باحث عن عمل / مستقل</option>
                    <option value="EMPLOYER">صاحب عمل / شركة</option>
                    <option value="CONTENT_EDITOR">محرر محتوى</option>
                    <option value="SUPER_ADMIN">مدير نظام (Admin)</option>
                  </select>
                </div>
              </div>

              {newUserRole === "EMPLOYER" && (
                <div>
                  <label className="block text-xs font-bold text-white mb-1">اسم الشركة أو المؤسسة</label>
                  <input
                    type="text"
                    value={newUserCompanyName}
                    onChange={(e) => setNewUserCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-white mb-1">الموقع الجغرافي</label>
                <input
                  type="text"
                  value={newUserLocation}
                  onChange={(e) => setNewUserLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
                >
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUPER ADMIN POST JOB ================= */}
      {isAddJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-xl rounded-3xl glass-card p-6 md:p-8 border border-purple-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddJobOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                <span>نشر وظيفة / مشروع رسمي من لوحة Super Admin</span>
              </div>
              <h3 className="text-lg font-bold text-white">تفاصيل المشروع والاعتماد</h3>
            </div>

            {jobPostSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2 animate-fade-in">
                <span className="material-symbols-outlined text-emerald-400 text-[48px]">check_circle</span>
                <h4 className="text-base font-bold text-white">تم نشر الوظيفة في السوق فوراً!</h4>
                <p className="text-xs text-emerald-300">
                  أصبحت الوظيفة متاحة الآن أمام كافة الكفاءات في صفحة سوق العمل مع شارة الاعتماد الرسمي.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdminPostJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    عنوان الوظيفة / المشروع
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بناء منصة ذكاء اصطناعي وتطبيق هواتف"
                    value={adminJobTitle}
                    onChange={(e) => setAdminJobTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      اسم الجهة أو الشركة الناشرة
                    </label>
                    <input
                      type="text"
                      required
                      value={adminJobCompany}
                      onChange={(e) => setAdminJobCompany(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      الموقع الجغرافي
                    </label>
                    <input
                      type="text"
                      required
                      value={adminJobLocation}
                      onChange={(e) => setAdminJobLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      الميزانية ($ USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={adminJobBudget}
                      onChange={(e) => setAdminJobBudget(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs font-mono text-emerald-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      المدة التقديرية
                    </label>
                    <input
                      type="text"
                      value={adminJobDuration}
                      onChange={(e) => setAdminJobDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      التصنيف
                    </label>
                    <select
                      value={adminJobCategory}
                      onChange={(e) => setAdminJobCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none"
                    >
                      <option value="dev">برمجة ومواقع</option>
                      <option value="ai">ذكاء اصطناعي</option>
                      <option value="design">تصميم UI/UX</option>
                      <option value="mobile">تطبيقات جوال</option>
                      <option value="video">فيديو ومونتاج</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    المهارات المطلوبة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={adminJobSkills}
                    onChange={(e) => setAdminJobSkills(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    تفاصيل ومواصفات المشروع
                  </label>
                  <textarea
                    rows={3}
                    value={adminJobDesc}
                    onChange={(e) => setAdminJobDesc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-gray-200 focus:outline-none focus:border-purple-400 leading-relaxed"
                  />
                </div>

                {/* Diaspora sponsor checkbox */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="admin-diaspora-checkbox"
                    checked={adminJobIsDiaspora}
                    onChange={(e) => setAdminJobIsDiaspora(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                  <label htmlFor="admin-diaspora-checkbox" className="text-xs text-gray-200 cursor-pointer">
                    إرفاق شارة <strong className="text-purple-300">"شريك داعم من الشتات الفلسطيني"</strong> مع تمييز المشروع في السوق
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddJobOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <span>نشر الوظيفة في السوق فوراً</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW PRICING PLAN ================= */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 md:p-8 border border-amber-500/40 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddPlanModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-1.5">
                <span className="material-symbols-outlined text-[15px]">add_box</span>
                <span>إضافة باقة تسعير سحابية جديدة للمنصة</span>
              </div>
              <h3 className="text-lg font-bold text-white">تفاصيل الباقة والحصص المقررة</h3>
            </div>

            <form onSubmit={handleCreateNewPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">اسم الباقة (عربي)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باقة رواد الأعمال المستقلين (Creator Pro)"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    placeholder="Creator Pro Tier"
                    value={newPlanNameEn}
                    onChange={(e) => setNewPlanNameEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">شارة الباقة (Badge)</label>
                  <input
                    type="text"
                    placeholder="عرض محدود"
                    value={newPlanBadge}
                    onChange={(e) => setNewPlanBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">السعر الشهري ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newPlanMonthlyPrice}
                    onChange={(e) => setNewPlanMonthlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">السعر السنوي ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={newPlanYearlyPrice}
                    onChange={(e) => setNewPlanYearlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-white mb-1">رصيد الصور 4K</label>
                  <input
                    type="number"
                    required
                    value={newPlanImagesQuota}
                    onChange={(e) => setNewPlanImagesQuota(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white mb-1">الفيديو السينمائي</label>
                  <input
                    type="number"
                    required
                    value={newPlanVideosQuota}
                    onChange={(e) => setNewPlanVideosQuota(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-white mb-1">المحادثات</label>
                  <input
                    type="number"
                    required
                    value={newPlanChatQuota}
                    onChange={(e) => setNewPlanChatQuota(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  المزايا المشمولة (افصل بينها بفاصلة ,)
                </label>
                <textarea
                  rows={3}
                  value={newPlanFeatures}
                  onChange={(e) => setNewPlanFeatures(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-amber-500/30 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-lg"
                >
                  إنشاء وتفعيل الباقة فورياً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EXTEND SUBSCRIPTION DAYS ================= */}
      {isExtendModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-blue-500/40 shadow-2xl space-y-5">
            <button
              onClick={() => setIsExtendModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold mb-1.5">
                <span className="material-symbols-outlined text-[15px]">more_time</span>
                <span>تمديد صلاحية الاشتراك</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedSub.userName}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedSub.userEmail}</p>
            </div>

            <form onSubmit={handleConfirmExtend} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-dark-950 border border-blue-500/20 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">الباقة الحالية:</span>
                  <strong className="text-white">{selectedSub.planName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">الصلاحية الحالية:</span>
                  <strong className="text-amber-400 font-mono">{selectedSub.daysRemaining} يوماً</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">اختر عدد الأيام الإضافية:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 30, 90].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setExtendDaysAmount(days)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        extendDaysAmount === days
                          ? "bg-blue-600 border-blue-400 text-white shadow-md"
                          : "bg-dark-900 border-blue-500/20 text-gray-400 hover:text-white"
                      }`}
                    >
                      +{days} يوم
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExtendModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
                >
                  تأكيد التمديد (+{extendDaysAmount} يوماً)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD EXTRA CREDITS ================= */}
      {isAddCreditsModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-emerald-500/40 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddCreditsModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-1.5">
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                <span>شحن رصيد سحابي إضافي</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedSub.userName}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedSub.userEmail}</p>
            </div>

            <form onSubmit={handleConfirmAddCredits} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">صور إضافية (4K)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={extraImagesAmount}
                    onChange={(e) => setExtraImagesAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-emerald-500/30 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">فيديوهات سينمائية</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={extraVideosAmount}
                    onChange={(e) => setExtraVideosAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-purple-500/30 text-xs text-purple-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-dark-950 border border-emerald-500/20 text-[11px] text-gray-300 space-y-1">
                <div>سيتم إضافة هذا الرصيد فوراً إلى حساب المستخدم في قاعدة البيانات السحابية.</div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCreditsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                >
                  شحن الرصيد فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHANGE / UPGRADE PLAN ================= */}
      {isChangePlanModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-purple-500/40 shadow-2xl space-y-5">
            <button
              onClick={() => setIsChangePlanModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-1.5">
                <span className="material-symbols-outlined text-[15px]">published_with_changes</span>
                <span>ترقية أو تغيير باقة المستخدم</span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedSub.userName}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">الباقة الحالية: {selectedSub.planName}</p>
            </div>

            <form onSubmit={handleConfirmChangePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-2">اختر الباقة الجديدة المراد تطبيقها:</label>
                <div className="space-y-2">
                  {plansList.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        targetPlanId === p.id
                          ? "bg-purple-500/20 border-purple-500 text-white"
                          : "bg-dark-900 border-purple-500/20 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="targetPlan"
                          value={p.id}
                          checked={targetPlanId === p.id}
                          onChange={(e) => setTargetPlanId(e.target.value)}
                          className="accent-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold block text-white">{p.name}</span>
                          <span className="text-[10px] text-gray-400">
                            {p.imagesQuota} صورة • {p.videosQuota} فيديو
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {p.priceMonthly === 0 ? "مجاني" : `$${p.priceMonthly}/شهر`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsChangePlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
                >
                  تأكيد ترقية الباقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

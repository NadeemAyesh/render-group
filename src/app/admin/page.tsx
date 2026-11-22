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
  getSiteSettings,
  saveSiteSettings,
  resetSiteSettings,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/site-settings-service";
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
import {
  PERMISSIONS_TREE,
  SYSTEM_ROLES,
  DEFAULT_SYSTEM_ROLES,
  SystemRole,
  getStoredRoles,
  saveStoredRoles,
  toggleRolePermission,
  setAllRolePermissions,
  resetRolesToDefaults,
  getStoredUserOverrides,
  saveStoredUserOverrides,
  getUserOverrides,
  setUserPermissionOverride,
  resetUserOverrides,
  UserPermissionOverride,
} from "@/lib/permissions";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CoursesAdminSection } from "@/components/admin/CoursesAdminSection";
import { ActionIconButton } from "@/components/ui/ActionIconButton";
import { getCourses, getSubmissions } from "@/lib/courses-service";

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
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "jobs" | "platforms" | "cms" | "escrow" | "subscriptions" | "permissions" | "courses" | "settings"
  >("overview");
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isSettingsSavedToast, setIsSettingsSavedToast] = useState(false);

  // Permissions RBAC State
  const [rbacMode, setRbacMode] = useState<"ROLES" | "USER_OVERRIDE">("ROLES");
  const [selectedRole, setSelectedRole] = useState<string>("CONTENT_EDITOR");
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<string>("u-talent-ahmed");
  const [rolesConfig, setRolesConfig] = useState<Record<string, SystemRole>>(DEFAULT_SYSTEM_ROLES);
  const [userOverrides, setUserOverrides] = useState<Record<string, UserPermissionOverride>>({});
  const [rbacToast, setRbacToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Initialize and reload RBAC from storage on mount
  const refreshRbacState = () => {
    setRolesConfig(getStoredRoles());
    setUserOverrides(getStoredUserOverrides());
  };

  const showRbacToast = (message: string, type: "success" | "info" = "success") => {
    setRbacToast({ message, type });
    setTimeout(() => {
      setRbacToast(null);
    }, 3500);
  };

  const handleToggleRolePerm = (roleKey: string, permId: string) => {
    if (rolesConfig[roleKey]?.isSuperAdmin) {
      showRbacToast("دور مدير النظام العام (Super Admin) يمتلك كافة الصلاحيات بصورة ثابتة لحماية استقرار المنظومة.", "info");
      return;
    }
    const updated = toggleRolePermission(roleKey, permId);
    setRolesConfig({ ...updated });
    showRbacToast("تم تحديث صلاحية الدور وحفظها بنجاح!");
  };

  const handleSetAllRolePerms = (roleKey: string, enableAll: boolean) => {
    if (rolesConfig[roleKey]?.isSuperAdmin) return;
    const updated = setAllRolePermissions(roleKey, enableAll);
    setRolesConfig({ ...updated });
    showRbacToast(enableAll ? "تم تفعيل كافة الصلاحيات لهذا الدور بنجاح!" : "تم تعطيل كافة الصلاحيات لهذا الدور!");
  };

  const handleResetRoleDefaults = () => {
    const updated = resetRolesToDefaults();
    setRolesConfig({ ...updated });
    showRbacToast("تمت استعادة الصلاحيات الافتراضية لكافة الأدوار بنجاح!");
  };

  const handleSetUserOverrideAction = (userId: string, permId: string, action: "inherit" | "grant" | "deny") => {
    const updated = setUserPermissionOverride(userId, permId, action);
    setUserOverrides({ ...updated });
    if (action === "grant") {
      showRbacToast("تم منح الصلاحية استثنائياً للمستخدم بنجاح (+)");
    } else if (action === "deny") {
      showRbacToast("تم سحب وحجب الصلاحية عن هذا المستخدم بنجاح (✕)");
    } else {
      showRbacToast("تمت إعادة الصلاحية للوضع الافتراضي لدور المستخدم");
    }
  };

  const handleClearUserOverrides = (userId: string) => {
    const updated = resetUserOverrides(userId);
    setUserOverrides({ ...updated });
    showRbacToast("تم مسح كافة الاستثناءات لهذا المستخدم والعودة للافتراضي!");
  };

  const menuNodes = PERMISSIONS_TREE.filter((p) => p.type === "menu");
  const getPagesForMenu = (menuId: string) =>
    PERMISSIONS_TREE.filter((p) => p.type === "page" && p.parent === menuId);
  const getActionsForPage = (pageId: string) =>
    PERMISSIONS_TREE.filter((p) => p.type === "action" && p.parent === pageId);

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
    refreshRbacState();
    refreshSubscriptions();
    loadPlatformJobs();
    setCmsForm(getSiteContent());
    setSiteSettingsForm(getSiteSettings());

    const refreshCourseCounters = () => {
      try {
        const cList = getCourses();
        const sList = getSubmissions();
        setCoursesCount(cList.length);
        setPendingSubmissionsCount(sList.filter((s) => s.status === "pending").length);
      } catch {}
    };

    refreshCourseCounters();
    window.addEventListener("renderlancer_courses_change", refreshCourseCounters);
    window.addEventListener("renderlancer_submissions_change", refreshCourseCounters);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["overview", "users", "jobs", "platforms", "cms", "escrow", "subscriptions", "permissions", "courses", "settings"].includes(tab)) {
        setActiveTab(tab as any);
      }
    }

    return () => {
      window.removeEventListener("renderlancer_courses_change", refreshCourseCounters);
      window.removeEventListener("renderlancer_submissions_change", refreshCourseCounters);
    };
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
    refreshRbacState();
  };

  const handleToggleUserVerification = (user: AuthUser) => {
    const newVerification = !user.verified;
    adminUpdateUser(user.email, { verified: newVerification });
    refreshUsers();
    refreshRbacState();
  };

  const handleRoleChange = (email: string, newRole: AuthRole) => {
    adminUpdateUser(email, { role: newRole });
    refreshUsers();
    refreshRbacState();
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الحساب (${email}) نهائياً؟`)) {
      adminDeleteUser(email);
      refreshUsers();
    refreshRbacState();
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
    refreshRbacState();
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

  // Site Settings Actions
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(siteSettingsForm);
    setIsSettingsSavedToast(true);
    setTimeout(() => setIsSettingsSavedToast(false), 3500);
  };

  const handleResetSiteSettings = () => {
    if (typeof window !== "undefined" && window.confirm("هل أنت متأكد من استعادة كافة إعدادات الموقع إلى الحالة الافتراضية؟")) {
      const reset = resetSiteSettings();
      setSiteSettingsForm(reset);
      setIsSettingsSavedToast(true);
      setTimeout(() => setIsSettingsSavedToast(false), 3500);
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter === "ALL") return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* ================= SUPER ADMIN METRONIC SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-dark-900 border-l border-gold-500/20 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 px-6 flex items-center gap-3 border-b border-gold-500/20">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gold-button-gradient text-dark-950 flex items-center justify-center font-bold shadow-md shadow-gold-500/20">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  RENDER <span className="gold-gradient-text font-black">ADMIN</span>
                </span>
                <span className="block text-[9px] text-gray-400 font-mono -mt-1">
                  Metronic Enterprise Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Super Admin User Card */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl gold-button-gradient text-dark-950 border border-gold-400/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {activeUser?.avatar || "SA"}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white truncate">
                  {activeUser?.fullName || "المهندس نديم (Super Admin)"}
                </span>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-gold-500/20 text-amber-900 dark:text-gold-300 font-mono font-bold mt-0.5 border border-gold-500/30">
                  SUPER_ADMIN (صلاحيات مطلقة)
                </span>
              </div>
            </div>
            <ActionIconButton
              icon="logout"
              label="تسجيل الخروج"
              variant="danger"
              size="sm"
              onClick={handleLogout}
            />
          </div>

          {/* Nav Tabs */}
          <nav className="px-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "overview"
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
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
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-gold-500">group</span>
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
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
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
              onClick={() => setActiveTab("courses")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "courses"
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-amber-400">school</span>
                <span>إدارة الدورات والتكليفات</span>
              </div>
              {pendingSubmissionsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold animate-pulse">
                  {pendingSubmissionsCount} تكليف
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-dark-850 text-gray-300 text-[10px] font-mono">
                  {coursesCount} دورات
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("platforms")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "platforms"
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
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
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
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
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
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
                  ? "bg-gold-500/15 dark:bg-gold-500/20 text-amber-950 dark:text-gold-200 border border-gold-500/40 shadow-sm font-bold"
                  : "text-gray-300 hover:bg-dark-850 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">account_balance</span>
              <span>الضمان المالي وسحوبات فلسطين</span>
            </button>

            <button
              onClick={() => setActiveTab("permissions")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "permissions"
                  ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-500/40 font-bold shadow-xs"
                  : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-dark-850 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-amber-500">admin_panel_settings</span>
                <span>إدارة الصلاحيات</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-mono border border-amber-500/20">
                RBAC
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-amber-500/15 dark:bg-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-500/40 font-bold shadow-xs"
                  : "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-dark-850 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-amber-500">settings</span>
                <span>إعدادات الموقع العامة</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-mono border border-amber-500/20">
                System
              </span>
            </button>
          </nav>
        </div>

        {/* Quick Portal Switchers */}
        <div className="p-4 border-t border-gold-500/20 space-y-2">
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
        <header className="h-20 bg-dark-900 border-b border-gold-500/20 px-6 lg:px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {activeTab === "overview" && "مركز القيادة والتحكم الإداري الموحد"}
                {activeTab === "users" && "إدارة حسابات المستخدمين والمستقلين والشركات"}
                {activeTab === "jobs" && "إدارة الوظائف والمشاريع المفتوحة في السوق"}
                {activeTab === "platforms" && "إدارة استوديو الذكاء الاصطناعي وتراخيص الأدوات"}
                {activeTab === "cms" && "إدارة محتوى الموقع وصفحات المنظومة (CMS)"}
                {activeTab === "subscriptions" && "إدارة الحزم والاشتراكات وتراخيص الـ AI"}
                {activeTab === "escrow" && "سجل الضمان المالي وسحوبات أرباح فلسطين"}
                {activeTab === "permissions" && "شجرة ومصفوفة الصلاحيات الهرمية (RBAC)"}
                {activeTab === "courses" && "إدارة أكاديمية الدورات ومتابعة وتصحيح التكليفات"}
                {activeTab === "settings" && "إعدادات وتشغيل المنظومة والموقع العام"}
              </span>
            </h1>
            <span className="text-xs text-gray-400">
              منصة RenderLancer المركزية • جلسة مصادقة مشفرة للـ Super Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <button
              onClick={() => setActiveTab("permissions")}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                activeTab === "permissions"
                  ? "bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400 font-black"
                  : "gold-button-gradient text-dark-950 shadow-gold-500/20 hover:scale-105 active:scale-95"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>مصفوفة الصلاحيات</span>
            </button>
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
                <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">المستخدمين المسجلين</span>
                    <span className="material-symbols-outlined text-gold-400 text-[22px]">group</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-white">+{usersList.length}</span>
                    <span className="block text-[11px] text-emerald-400 mt-1">كفاءات وشركات مسجلة</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-emerald-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">حجم السيولة في الضمان (Escrow)</span>
                    <span className="material-symbols-outlined text-emerald-400 text-[22px]">lock</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold font-mono text-emerald-400">$142,500.00</span>
                    <span className="block text-[11px] text-gray-400 mt-1">محمية بنظام العقود الذكية</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-900 border border-blue-500/20 flex flex-col justify-between">
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

                <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
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
                  className="p-6 rounded-2xl bg-dark-900 border border-gold-500/25 hover:border-gold-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/15 text-gold-400 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">manage_accounts</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors">
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
              <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-gold-500/30 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-gold-500/20">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 dark:text-gold-400 text-[24px]">manage_accounts</span>
                      <span>سجل وإدارة حسابات المستخدمين الشامل</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mt-0.5">
                      التحكم بحسابات المستقلين، الشركات، ومحرري المحتوى، مع إدارة التوثيق وتجميد الحسابات
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all border border-amber-500/40"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span>+ إضافة مستخدم جديد</span>
                    </button>
                  </div>
                </div>

                {/* Filters Bar - Sharp Segmented Control */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-700 dark:text-gray-300 font-black ml-2">تصفية حسب الدور:</span>
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
                    {["ALL", "JOB_SEEKER", "EMPLOYER", "SUPER_ADMIN", "CONTENT_EDITOR"].map((roleKey) => (
                      <button
                        key={roleKey}
                        onClick={() => setUserRoleFilter(roleKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          userRoleFilter === roleKey
                            ? "bg-slate-900 text-white dark:bg-gold-500 dark:text-dark-950 shadow-sm"
                            : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-dark-850"
                        }`}
                      >
                        {roleKey === "ALL" && "الكل"}
                        {roleKey === "JOB_SEEKER" && "مستقلون"}
                        {roleKey === "EMPLOYER" && "شركات"}
                        {roleKey === "SUPER_ADMIN" && "مدراء (Admin)"}
                        {roleKey === "CONTENT_EDITOR" && "محررون"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-gold-500/20">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 dark:bg-dark-950/80 border-b-2 border-slate-200 dark:border-gold-500/20">
                      <tr className="text-slate-800 dark:text-gray-200 font-black">
                        <th className="py-3 px-4 font-black">المستخدم</th>
                        <th className="py-3 px-4 font-black">الدور في المنصة</th>
                        <th className="py-3 px-4 font-black">الموقع الجغرافي</th>
                        <th className="py-3 px-4 font-black">حالة الحساب</th>
                        <th className="py-3 px-4 font-black">التوثيق</th>
                        <th className="py-3 px-4 font-black">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gold-500/10 bg-white dark:bg-transparent">
                      {filteredUsers.map((u) => (
                        <tr key={u.email} className="hover:bg-slate-50/70 dark:hover:bg-dark-850/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-dark-850 text-slate-900 dark:text-gold-300 border border-slate-300 dark:border-gold-500/30 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                {u.avatar || u.fullName.slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">{u.fullName}</span>
                                <span className="text-[11px] text-slate-500 dark:text-gray-400 font-mono block">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border shadow-xs inline-flex items-center gap-1 ${ROLE_LABELS[u.role]?.badgeClass}`}>
                              {ROLE_LABELS[u.role]?.ar || u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-gray-300 font-medium text-xs">
                            {u.location || "فلسطين والشتات"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black border inline-flex items-center gap-1.5 shadow-xs ${
                                u.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
                                  : "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === "SUSPENDED" ? "bg-red-600" : "bg-emerald-600 animate-pulse"}`}></span>
                              {u.status === "SUSPENDED" ? "موقوف" : "نشط"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserVerification(u)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black border flex items-center gap-1.5 shadow-xs transition-all ${
                                u.verified
                                  ? "bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200 dark:bg-gold-500/20 dark:text-gold-200 dark:border-gold-500/40"
                                  : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:bg-dark-850 dark:text-gray-400 dark:border-gray-700 dark:hover:text-white"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {u.verified ? "verified" : "check"}
                              </span>
                              <span>{u.verified ? "موثق رسمياً" : "غير موثق"}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  u.status === "SUSPENDED"
                                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                                    : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                                }`}
                              >
                                {u.status === "SUSPENDED" ? "تفعيل" : "إيقاف"}
                              </button>
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.email, e.target.value as AuthRole)}
                                className="px-2 py-1 rounded-lg bg-white dark:bg-dark-950 border border-slate-300 dark:border-gold-500/30 text-[10px] font-bold text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="JOB_SEEKER">مستقل</option>
                                <option value="EMPLOYER">شركة</option>
                                <option value="CONTENT_EDITOR">محرر</option>
                                <option value="SUPER_ADMIN">مدير</option>
                              </select>
                              <ActionIconButton
                                icon="delete"
                                label="حذف المستخدم"
                                variant="danger"
                                size="xs"
                                onClick={() => handleDeleteUser(u.email)}
                              />
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
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-blue-500/20">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-dark-950/80 border-b-2 border-slate-200 dark:border-blue-500/20">
                        <tr className="text-slate-800 dark:text-gray-200 font-black">
                          <th className="py-3 px-4 font-black">المشروع / المسمى</th>
                          <th className="py-3 px-4 font-black">الجهة الناشرة</th>
                          <th className="py-3 px-4 font-black">الموقع والميزانية</th>
                          <th className="py-3 px-4 font-black">المدة والتخصص</th>
                          <th className="py-3 px-4 font-black">الحالة</th>
                          <th className="py-3 px-4 font-black">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-blue-500/10 bg-white dark:bg-transparent">
                        {allPlatformJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50/70 dark:hover:bg-dark-850/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 dark:text-white block">{job.title}</span>
                              <span className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">{job.description}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-slate-800 dark:text-gray-200 font-bold block">{job.company}</span>
                              {job.postedBy === "SUPER_ADMIN" ? (
                                <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 dark:bg-gold-500/20 dark:text-gold-200 dark:border-gold-500/40 font-black">
                                  👑 Super Admin موثق
                                </span>
                              ) : (
                                <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/40 font-black">
                                  🏢 شركة مسجلة
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm block">{job.budget}</span>
                              <span className="text-[11px] text-slate-500 dark:text-gray-400">{job.companyLocation}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 dark:text-gray-300">
                              <span className="font-bold text-xs">{job.duration}</span>
                              <span className="text-[10px] text-slate-500 dark:text-gray-400 block font-medium">تصنيف: {job.category}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 text-[10px] font-black inline-flex items-center gap-1.5 shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                مفتوح في السوق
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href="/jobs"
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-dark-850 dark:hover:bg-dark-800 dark:text-gold-400 border border-slate-300 dark:border-gold-500/20 text-[11px] font-bold"
                                >
                                  عرض
                                </Link>
                                <button
                                  onClick={() => handleAdminDeleteJob(job.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 dark:bg-red-500/15 dark:hover:bg-red-500/25 dark:text-red-300 dark:border-red-500/30 text-[11px] font-bold transition-colors"
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
            <div className="space-y-6">
              {/* Top Banner & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1.5">
                    <span className="material-symbols-outlined text-[14px]">loyalty</span>
                    <span>منظومة الحزم وإدارة استهلاك الـ AI (Subscriptions Engine)</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    إدارة الاشتراكات، الحزم، وباقة التجربة المجانية (3 أيام)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    مراقبة رصيد كافة المستخدمين الفوري، تعديل وتمديد الاشتراكات، تفعيل/إلغاء تفعيل الباقات، وشحن الرصيد الإضافي.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddPlanModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">add_circle</span>
                    <span>+ إضافة باقة جديدة</span>
                  </button>
                  <Link
                    href="/pricing"
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-dark-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span>معاينة صفحة الأسعار</span>
                  </Link>
                </div>
              </div>

              {/* KPI Cards Row - Compact, Sharp & Proportionate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Users */}
                <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-dark-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">إجمالي المشتركين المسجلين</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-center justify-center text-slate-700 dark:text-gray-300">
                      <span className="material-symbols-outlined text-[16px]">group</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{subsList.length}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-dark-800 dark:text-gray-300 border border-slate-200 dark:border-dark-700">
                      مشترك مسجل
                    </span>
                  </div>
                </div>

                {/* Free Trial */}
                <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">التجربة المجانية (3 أيام)</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-[16px]">timer</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {subsList.filter((s) => s.status === "TRIAL").length}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                      50 صورة + 3 فيديو
                    </span>
                  </div>
                </div>

                {/* Paid Subscribers */}
                <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-800/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">المشتركون النشطون (Paid)</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
                      {subsList.filter((s) => s.status === "ACTIVE").length}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                      باقات مدفوعة
                    </span>
                  </div>
                </div>

                {/* MRR */}
                <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-dark-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">الإيراد الشهري (MRR)</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-center justify-center text-slate-700 dark:text-gray-300">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      ${subsList.filter((s) => s.status === "ACTIVE").reduce((acc, curr) => acc + (curr.price || 0), 0)}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-dark-800 dark:text-gray-300 border border-slate-200 dark:border-dark-700">
                      شهرياً
                    </span>
                  </div>
                </div>
              </div>

              {/* ============ SUB-SECTION 1: USER SUBSCRIPTIONS MONITORING ============ */}
              <div className="rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs overflow-hidden">
                {/* Header & Controls Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-dark-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">manage_accounts</span>
                      <span>سجل ومراقبة اشتراكات المستخدمين الحية</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      متابعة استهلاك الصور والفيديوهات، تمديد الصلاحية وشحن الرصيد والترقية الفورية.
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
                        className="h-8 px-3 pr-8 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-dark-900 w-52 sm:w-60 transition-all"
                      />
                      <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-[15px]">
                        search
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-0.5 bg-slate-100 dark:bg-dark-950 p-1 rounded-lg border border-slate-200 dark:border-dark-800">
                      {[
                        { id: "ALL", label: "الكل", count: subsList.length },
                        { id: "ACTIVE", label: "نشط", count: subsList.filter((s) => s.status === "ACTIVE").length },
                        { id: "TRIAL", label: "تجريبي", count: subsList.filter((s) => s.status === "TRIAL").length },
                        { id: "EXPIRED", label: "منتهي", count: subsList.filter((s) => s.status === "EXPIRED").length },
                        { id: "SUSPENDED", label: "معلق", count: subsList.filter((s) => s.status === "SUSPENDED").length },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSubStatusFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                            subStatusFilter === tab.id
                              ? "bg-white dark:bg-dark-850 text-slate-900 dark:text-white shadow-2xs border border-slate-200/80 dark:border-dark-700"
                              : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`text-[9px] px-1 rounded-full ${
                            subStatusFilter === tab.id
                              ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-slate-200/70 text-slate-600 dark:bg-dark-800 dark:text-gray-400"
                          }`}>
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscriptions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-dark-950/80 border-b border-slate-200 dark:border-dark-800 text-slate-700 dark:text-gray-300 font-bold text-[11px]">
                        <th className="py-2.5 px-3">المستخدم</th>
                        <th className="py-2.5 px-3">الباقة ودورة الدفع</th>
                        <th className="py-2.5 px-3">الحالة</th>
                        <th className="py-2.5 px-3">الصلاحية المتبقية</th>
                        <th className="py-2.5 px-3">استهلاك الصور (4K)</th>
                        <th className="py-2.5 px-3">استهلاك الفيديو</th>
                        <th className="py-2.5 px-3">وسيلة الدفع</th>
                        <th className="py-2.5 px-3 text-center">تحكم Super Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-800/60 bg-white dark:bg-transparent">
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
                          <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-850/50 transition-colors">
                            {/* User Info */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 font-bold text-xs flex items-center justify-center shrink-0">
                                  {sub.userName.slice(0, 1)}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">{sub.userName}</span>
                                  <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono block">{sub.userEmail}</span>
                                  <span className="text-[9px] font-semibold text-slate-400 dark:text-gray-500">{sub.userRole}</span>
                                </div>
                              </div>
                            </td>

                            {/* Plan & Cycle */}
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-slate-900 dark:text-white block text-xs">{sub.planName}</span>
                              <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono font-medium">
                                {sub.billingCycle === "trial" ? "تجربة 3 أيام مجانية" : `$${sub.price} (${sub.billingCycle})`}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1.5 shadow-2xs ${
                                  sub.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                                    : sub.status === "TRIAL"
                                    ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
                                    : sub.status === "EXPIRED"
                                    ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-dark-800 dark:text-gray-400 dark:border-dark-700"
                                    : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40"
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  sub.status === "ACTIVE"
                                    ? "bg-emerald-500"
                                    : sub.status === "TRIAL"
                                    ? "bg-amber-500"
                                    : sub.status === "EXPIRED"
                                    ? "bg-slate-400"
                                    : "bg-red-500"
                                }`} />
                                <span>
                                  {sub.status === "ACTIVE"
                                    ? "نشط ومعتمد"
                                    : sub.status === "TRIAL"
                                    ? "تجربة 3 أيام"
                                    : sub.status === "EXPIRED"
                                    ? "منتهي الصلاحية"
                                    : "معلّق"}
                                </span>
                              </span>
                            </td>

                            {/* Days remaining */}
                            <td className="py-2.5 px-3 font-mono">
                              <span className="text-slate-900 dark:text-white font-bold block text-xs">{sub.daysRemaining} يوم</span>
                              <span className="text-[10px] text-slate-500 dark:text-gray-400">حتى {sub.expiresAt}</span>
                            </td>

                            {/* Images quota */}
                            <td className="py-2.5 px-3">
                              <div className="space-y-1 w-24">
                                <div className="flex justify-between text-[10px] font-mono text-slate-600 dark:text-gray-400 font-semibold">
                                  <span>{sub.imagesUsed}</span>
                                  <span className="text-slate-900 dark:text-white font-bold">{sub.imagesTotal}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-dark-700">
                                  <div
                                    className="bg-amber-500 h-full rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(100, (sub.imagesUsed / Math.max(1, sub.imagesTotal)) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Videos quota */}
                            <td className="py-2.5 px-3">
                              <div className="space-y-1 w-20">
                                <div className="flex justify-between text-[10px] font-mono text-slate-600 dark:text-gray-400 font-semibold">
                                  <span>{sub.videosUsed}</span>
                                  <span className="text-sky-700 dark:text-sky-400 font-bold">{sub.videosTotal}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-dark-950 h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-dark-700">
                                  <div
                                    className="bg-sky-500 h-full rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(100, (sub.videosUsed / Math.max(1, sub.videosTotal)) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Payment Method */}
                            <td className="py-2.5 px-3">
                              <span className="text-[11px] text-slate-600 dark:text-gray-400 font-medium block">
                                {sub.paymentMethod || "دفع سحابي"}
                              </span>
                            </td>

                            {/* Admin Actions Toolbar */}
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                {/* Toggle Status */}
                                <ActionIconButton
                                  icon={sub.status === "ACTIVE" || sub.status === "TRIAL" ? "pause" : "play_arrow"}
                                  label={sub.status === "ACTIVE" || sub.status === "TRIAL" ? "تجميد وتعليق الاشتراك" : "إعادة تفعيل الاشتراك"}
                                  variant={sub.status === "ACTIVE" || sub.status === "TRIAL" ? "warning" : "success"}
                                  size="xs"
                                  onClick={() => handleToggleSubStatus(sub.id)}
                                />

                                {/* Extend Days */}
                                <ActionIconButton
                                  icon="more_time"
                                  label="تمديد فترة الصلاحية بالأيام"
                                  variant="info"
                                  size="xs"
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsExtendModalOpen(true);
                                  }}
                                />

                                {/* Add Quota */}
                                <ActionIconButton
                                  icon="add_circle"
                                  label="شحن رصيد إضافي (صور وفيديو)"
                                  variant="success"
                                  size="xs"
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsAddCreditsModalOpen(true);
                                  }}
                                />

                                {/* Change Plan */}
                                <ActionIconButton
                                  icon="published_with_changes"
                                  label="ترقية أو تغيير باقة المستخدم"
                                  variant="neutral"
                                  size="xs"
                                  onClick={() => {
                                    setSelectedSub(sub);
                                    setIsChangePlanModalOpen(true);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============ SUB-SECTION 2: PRICING PLANS CATALOG MANAGEMENT ============ */}
              <div className="rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-dark-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">view_timeline</span>
                      <span>إدارة باقات وخطط الأسعار (Plan Catalog & Quotas)</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      تفعيل وإلغاء تفعيل الباقات، التحكم في الأسعار والحصص والمزايا المعروضة في صفحة الأسعار العامة.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddPlanModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    <span>إنشاء خطة جديدة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {plansList.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                        plan.active
                          ? "bg-slate-50/50 dark:bg-dark-950/70 border-slate-200 dark:border-dark-700 hover:border-amber-400/60"
                          : "bg-slate-100/60 dark:bg-dark-950/30 border-slate-200 dark:border-dark-800 opacity-60"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              plan.active
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                                : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40"
                            }`}
                          >
                            {plan.active ? "مفعّلة على الموقع" : "معطّلة / مخفية"}
                          </span>
                          {plan.badge && (
                            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">{plan.nameEn}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-dark-800 flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 dark:text-gray-400">السعر الشهري:</span>
                          <strong className="text-base font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {plan.priceMonthly === 0 ? "مجاني ($0)" : `$${plan.priceMonthly}`}
                          </strong>
                        </div>

                        <div className="space-y-1 text-[11px] bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-slate-200 dark:border-dark-800">
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">حصة الصور 4K:</span>
                            <strong className="text-slate-900 dark:text-white font-mono">{plan.imagesQuota} صورة</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">الفيديو السينمائي:</span>
                            <strong className="text-slate-900 dark:text-white font-mono">{plan.videosQuota} فيديو</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">المحادثات:</span>
                            <strong className="text-slate-900 dark:text-white font-mono">{plan.chatQuota} شات</strong>
                          </div>
                        </div>
                      </div>

                      {/* Plan Admin Actions */}
                      <div className="pt-2.5 border-t border-slate-200 dark:border-dark-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePlan(plan.id)}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            plan.active
                              ? "bg-red-50 hover:bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-300 dark:border-red-800/40"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40"
                          }`}
                        >
                          {plan.active ? "إلغاء التفعيل" : "تفعيل الباقة"}
                        </button>

                        {!plan.isTrial && (
                          <ActionIconButton
                            icon="delete"
                            label="حذف الباقة"
                            variant="danger"
                            size="xs"
                            onClick={() => handleDeletePlan(plan.id)}
                          />
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 8: 3-TIER HIERARCHICAL RBAC PERMISSIONS TREE ================= */}
          {activeTab === "permissions" && (() => {
            const currentUsers = usersList.length > 0 ? usersList : getAllUsersArray();
            const activeTargetUser = currentUsers.find((u) => u.id === selectedUserForPerms) || currentUsers[0];
            const activeUserOverride = userOverrides[activeTargetUser?.id || ""] || { granted: [], denied: [] };
            const targetUserRole = activeTargetUser?.role || "JOB_SEEKER";
            const targetRoleObj = rolesConfig[targetUserRole] || DEFAULT_SYSTEM_ROLES[targetUserRole];
            const activeRoleObj = rolesConfig[selectedRole] || DEFAULT_SYSTEM_ROLES[selectedRole] || DEFAULT_SYSTEM_ROLES.SUPER_ADMIN;

            // Helper to get permission evaluation for active target user
            const evalUserPermission = (permId: string) => {
              if (activeTargetUser?.role === "SUPER_ADMIN") {
                return { effective: true, source: "role" as const, isOverride: false };
              }
              if (activeUserOverride.denied.includes(permId)) {
                return { effective: false, source: "denied" as const, isOverride: true };
              }
              if (activeUserOverride.granted.includes(permId)) {
                return { effective: true, source: "granted" as const, isOverride: true };
              }
              const inRole = targetRoleObj?.defaultPermissions?.includes(permId);
              return { effective: Boolean(inRole), source: "role" as const, isOverride: false };
            };

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="pb-4 border-b border-slate-200 dark:border-dark-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1.5">
                      <span className="material-symbols-outlined text-[15px]">account_tree</span>
                      <span>منظومة الصلاحيات الشجرية الثلاثية (3-Tier Hierarchical RBAC)</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      إدارة شجرة الصلاحيات والأدوار والتحكم الفردي بالمستخدمين
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                      تحكم هرمي شجري دقيق: <strong>Menu (القوائم)</strong> ➜ <strong>Page (الصفحات)</strong> ➜ <strong>Action (الإجراءات والأزرار)</strong>. تحكم بكافة صلاحيات الأدوار أو امنح استثناءات فردية فورية لأي مستخدم بالاسم.
                    </p>
                  </div>

                  {/* Mode Selector Pill */}
                  <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-2xs self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => setRbacMode("ROLES")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        rbacMode === "ROLES"
                          ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">groups</span>
                      <span>1. إدارة صلاحيات الأدوار (Roles)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRbacMode("USER_OVERRIDE")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        rbacMode === "USER_OVERRIDE"
                          ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                          : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">person_check</span>
                      <span>2. استثناءات مستخدم محدد (User Overrides)</span>
                    </button>
                  </div>
                </div>

                {/* Toast Banner */}
                {rbacToast && (
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold shadow-xs animate-fade-in ${
                    rbacToast.type === "info"
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300"
                      : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {rbacToast.type === "info" ? "info" : "check_circle"}
                      </span>
                      <span>{rbacToast.message}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/60 dark:bg-dark-900/60">
                      Live Saved ✓
                    </span>
                  </div>
                )}

                {/* Main RBAC Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Right Column: Mode Dependent Context Controls (4 cols) */}
                  <div className="lg:col-span-4 space-y-5">
                    
                    {/* MODE 1: ROLES MANAGEMENT SIDEBAR */}
                    {rbacMode === "ROLES" && (
                      <div className="p-5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[18px]">badge</span>
                            <span>الأدوار الأساسية في المنظومة</span>
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-dark-850 text-slate-600 dark:text-gray-400">
                            4 Roles
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                          اختر دوراً لتعديل الصلاحيات الممنوحة أو المحجوبة عنه من الشجرة على اليسار:
                        </p>

                        <div className="space-y-2.5">
                          {Object.keys(rolesConfig).map((roleKey) => {
                            const role = rolesConfig[roleKey] || DEFAULT_SYSTEM_ROLES[roleKey];
                            const isSelected = selectedRole === roleKey;
                            const isSuper = role.isSuperAdmin;
                            const count = role.defaultPermissions?.length || 0;

                            return (
                              <button
                                key={roleKey}
                                type="button"
                                onClick={() => setSelectedRole(roleKey)}
                                className={`w-full text-right p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-amber-500/15 border-amber-400 dark:border-amber-500 text-slate-950 dark:text-amber-200 font-bold shadow-xs ring-1 ring-amber-400"
                                    : "bg-slate-50 dark:bg-dark-950/60 border-slate-200 dark:border-dark-800 text-slate-700 dark:text-gray-300 hover:border-amber-400/50 hover:bg-white dark:hover:bg-dark-850"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900 dark:text-white">{role.labelArabic}</span>
                                    {isSuper && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black">
                                        SUPER
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 dark:text-gray-400 font-mono mt-0.5 block">
                                    {role.name}
                                  </span>
                                </div>

                                <div className="text-left">
                                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border block ${
                                    isSuper
                                      ? "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                                      : count > 0
                                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                      : "bg-slate-100 dark:bg-dark-850 text-slate-500 border-slate-200 dark:border-dark-700"
                                  }`}>
                                    {isSuper ? "كامل الصلاحيات" : `${count} صلاحية`}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Role Quick Actions */}
                        <div className="pt-3 border-t border-slate-100 dark:border-dark-800 space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300 block">
                            إجراءات سريعة للدور المحدد ({activeRoleObj.labelArabic}):
                          </span>
                          
                          {!activeRoleObj.isSuperAdmin ? (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleSetAllRolePerms(selectedRole, true)}
                                className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 dark:bg-dark-950 dark:hover:bg-emerald-950/40 dark:text-gray-300 dark:hover:text-emerald-300 dark:border-dark-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">done_all</span>
                                <span>تفعيل الكل للدور</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetAllRolePerms(selectedRole, false)}
                                className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 border border-slate-200 dark:bg-dark-950 dark:hover:bg-red-950/40 dark:text-gray-300 dark:hover:text-red-300 dark:border-dark-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[14px]">remove_done</span>
                                <span>تعطيل الكل للدور</span>
                              </button>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
                              <span>صلاحيات الـ Super Admin مقفلة وتمنح كل المزايا دائماً لحماية النظام.</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleResetRoleDefaults}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-dark-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                            <span>استعادة الصلاحيات الافتراضية لكافة الأدوار</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* MODE 2: USER OVERRIDE MANAGEMENT SIDEBAR */}
                    {rbacMode === "USER_OVERRIDE" && (
                      <div className="p-5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500 text-[18px]">person_search</span>
                            <span>اختر المستخدم للتخصيص</span>
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                            User Override
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                          اختر أي حساب في المنصة لمنحه صلاحيات إضافية خاصة به (+) أو حجب وسحب صلاحيات منه (✕):
                        </p>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                            المستخدم المستهدف:
                          </label>
                          <select
                            value={activeTargetUser?.id}
                            onChange={(e) => setSelectedUserForPerms(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                          >
                            {currentUsers.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.fullName} — [{ROLE_LABELS[u.role]?.ar || u.role}] ({u.email})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected User Details Card */}
                        {activeTargetUser && (
                          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-dark-950/60 border border-slate-200 dark:border-dark-800 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center text-sm border border-amber-500/30 shrink-0">
                                {activeTargetUser.avatar || activeTargetUser.fullName.slice(0, 2)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {activeTargetUser.fullName}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono truncate">
                                  {activeTargetUser.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-slate-500 dark:text-gray-400">الدور الأساسي:</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ROLE_LABELS[activeTargetUser.role]?.badgeClass || "bg-slate-100 text-slate-800"}`}>
                                {ROLE_LABELS[activeTargetUser.role]?.ar || activeTargetUser.role}
                              </span>
                            </div>

                            {/* Counters */}
                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70 dark:border-dark-800 text-center">
                              <div className="p-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200/70 dark:border-dark-800">
                                <span className="block text-xs font-black text-slate-800 dark:text-white">
                                  {targetRoleObj?.defaultPermissions?.length || 0}
                                </span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">موروثة بالدور</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                                <span className="block text-xs font-black text-emerald-700 dark:text-emerald-400">
                                  +{activeUserOverride.granted.length}
                                </span>
                                <span className="text-[9px] text-emerald-600 dark:text-emerald-500 block mt-0.5">منح استثنائي</span>
                              </div>
                              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
                                <span className="block text-xs font-black text-rose-700 dark:text-rose-400">
                                  -{activeUserOverride.denied.length}
                                </span>
                                <span className="text-[9px] text-rose-600 dark:text-rose-500 block mt-0.5">سحب وحجب</span>
                              </div>
                            </div>

                            {/* Reset Button */}
                            {(activeUserOverride.granted.length > 0 || activeUserOverride.denied.length > 0) && (
                              <button
                                type="button"
                                onClick={() => handleClearUserOverrides(activeTargetUser.id)}
                                className="w-full mt-2 px-3 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-rose-50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                              >
                                <span className="material-symbols-outlined text-[15px]">clear_all</span>
                                <span>مسح استثناءات المستخدم والعودة للافتراضي</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Left Column: Interactive 3-Tier Tree (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-5">
                      
                      {/* Active Mode Banner & Legend */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-dark-800 gap-3">
                        <div>
                          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[20px]">account_tree</span>
                            <span>استعراض شجرة الصلاحيات: Menu ➜ Page ➜ Action</span>
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                            {rbacMode === "ROLES" ? (
                              <>
                                أنت تعدل الآن دور: <strong className="text-amber-600 dark:text-amber-400 font-bold">{activeRoleObj.labelArabic}</strong> (انقر على الزر للتبديل بين مفعلة ومحجوبة).
                              </>
                            ) : (
                              <>
                                أنت تخصص الآن استثناءات: <strong className="text-blue-600 dark:text-blue-400 font-bold">{activeTargetUser?.fullName}</strong> (دوره: {ROLE_LABELS[targetUserRole]?.ar}).
                              </>
                            )}
                          </p>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono font-bold">
                            MENU
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono font-bold">
                            PAGE
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-bold">
                            ACTION
                          </span>
                        </div>
                      </div>

                      {/* Tree Nodes List */}
                      <div className="space-y-4">
                        {menuNodes.map((menu) => {
                          const isRoleMenuAllowed = activeRoleObj.defaultPermissions?.includes(menu.id);
                          const userMenuEval = evalUserPermission(menu.id);
                          const pages = getPagesForMenu(menu.id);

                          return (
                            <div
                              key={menu.id}
                              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-950/50 border border-slate-200 dark:border-dark-800 space-y-3"
                            >
                              {/* Level 1: Menu Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-mono font-black mt-0.5">
                                    MENU
                                  </span>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                      {menu.labelArabic}
                                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                                        ({menu.id})
                                      </span>
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">{menu.description}</p>
                                  </div>
                                </div>

                                {/* Controls: Mode dependent */}
                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                  {rbacMode === "ROLES" ? (
                                    activeRoleObj.isSuperAdmin ? (
                                      <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">verified</span>
                                        <span>مفعلة دائماً (Super Admin)</span>
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleRolePerm(selectedRole, menu.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                                          isRoleMenuAllowed
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                            : "bg-white hover:bg-slate-100 text-slate-600 dark:bg-dark-850 dark:hover:bg-dark-800 dark:text-gray-300 border border-slate-200 dark:border-dark-700"
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[15px]">
                                          {isRoleMenuAllowed ? "check_circle" : "cancel"}
                                        </span>
                                        <span>{isRoleMenuAllowed ? "مفعلة للدور ✓" : "محجوبة عن الدور ✕"}</span>
                                      </button>
                                    )
                                  ) : (
                                    /* User Override Mode 3-way control */
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border ${
                                        userMenuEval.effective
                                          ? userMenuEval.source === "granted"
                                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                            : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                          : userMenuEval.source === "denied"
                                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700"
                                          : "bg-slate-100 dark:bg-dark-850 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-dark-700"
                                      }`}>
                                        <span className="material-symbols-outlined text-[13px]">
                                          {userMenuEval.effective ? "check_circle" : "cancel"}
                                        </span>
                                        <span>
                                          {userMenuEval.effective
                                            ? (userMenuEval.source === "granted" ? "ممنوحة (+)" : "متاحة بالدور")
                                            : (userMenuEval.source === "denied" ? "محجوبة (✕)" : "محجوبة بالدور")}
                                        </span>
                                      </span>

                                      <div className="inline-flex rounded-xl p-0.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 shadow-2xs">
                                        <button
                                          type="button"
                                          onClick={() => handleSetUserOverrideAction(activeTargetUser.id, menu.id, "inherit")}
                                          title="إلغاء الاستثناء والاعتماد على دور المستخدم"
                                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                            !userMenuEval.isOverride
                                              ? "bg-slate-200 dark:bg-dark-800 text-slate-900 dark:text-white"
                                              : "text-slate-500 hover:text-slate-800 dark:text-gray-400"
                                          }`}
                                        >
                                          افتراضي
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSetUserOverrideAction(activeTargetUser.id, menu.id, "grant")}
                                          title="منح الصلاحية للمستخدم استثنائياً"
                                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                            userMenuEval.source === "granted"
                                              ? "bg-emerald-600 text-white shadow-2xs"
                                              : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                          }`}
                                        >
                                          + منح
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSetUserOverrideAction(activeTargetUser.id, menu.id, "deny")}
                                          title="سحب وحجب الصلاحية عن المستخدم استثنائياً"
                                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                            userMenuEval.source === "denied"
                                              ? "bg-rose-600 text-white shadow-2xs"
                                              : "text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                          }`}
                                        >
                                          ✕ سحب
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Level 2: Pages under Menu */}
                              {pages.length > 0 && (
                                <div className="mr-4 sm:mr-6 space-y-2.5 border-r-2 border-sky-400/40 pr-3 sm:pr-4 mt-2">
                                  {pages.map((page) => {
                                    const isRolePageAllowed = activeRoleObj.defaultPermissions?.includes(page.id);
                                    const userPageEval = evalUserPermission(page.id);
                                    const actions = getActionsForPage(page.id);

                                    return (
                                      <div
                                        key={page.id}
                                        className="p-3 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 space-y-2.5 shadow-2xs"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                          <div className="flex items-start gap-2.5">
                                            <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 font-mono font-bold mt-0.5">
                                              PAGE
                                            </span>
                                            <div>
                                              <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {page.labelArabic}
                                                <span className="text-[10px] text-slate-400 font-mono font-normal">
                                                  ({page.id})
                                                </span>
                                              </h5>
                                              <p className="text-[11px] text-slate-500 dark:text-gray-400">{page.description}</p>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                            {rbacMode === "ROLES" ? (
                                              activeRoleObj.isSuperAdmin ? (
                                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                                                  متاحة دائماً
                                                </span>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleRolePerm(selectedRole, page.id)}
                                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                                    isRolePageAllowed
                                                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-dark-850 dark:hover:bg-dark-800 dark:text-gray-300 border border-slate-200 dark:border-dark-700"
                                                  }`}
                                                >
                                                  <span className="material-symbols-outlined text-[13px]">
                                                    {isRolePageAllowed ? "check" : "close"}
                                                  </span>
                                                  <span>{isRolePageAllowed ? "مفعلة ✓" : "محجوبة ✕"}</span>
                                                </button>
                                              )
                                            ) : (
                                              /* User Mode for Page */
                                              <div className="flex items-center gap-1.5">
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                                  userPageEval.effective
                                                    ? userPageEval.source === "granted"
                                                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                    : userPageEval.source === "denied"
                                                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700"
                                                    : "bg-slate-100 dark:bg-dark-850 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-dark-700"
                                                }`}>
                                                  {userPageEval.effective
                                                    ? (userPageEval.source === "granted" ? "ممنوحة (+)" : "متاحة بالدور")
                                                    : (userPageEval.source === "denied" ? "محجوبة (✕)" : "محجوبة بالدور")}
                                                </span>

                                                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleSetUserOverrideAction(activeTargetUser.id, page.id, "inherit")}
                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                      !userPageEval.isOverride
                                                        ? "bg-white dark:bg-dark-800 text-slate-900 dark:text-white"
                                                        : "text-slate-500"
                                                    }`}
                                                  >
                                                    دور
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleSetUserOverrideAction(activeTargetUser.id, page.id, "grant")}
                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                      userPageEval.source === "granted"
                                                        ? "bg-emerald-600 text-white"
                                                        : "text-emerald-700 dark:text-emerald-400"
                                                    }`}
                                                  >
                                                    + منح
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleSetUserOverrideAction(activeTargetUser.id, page.id, "deny")}
                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                      userPageEval.source === "denied"
                                                        ? "bg-rose-600 text-white"
                                                        : "text-rose-700 dark:text-rose-400"
                                                    }`}
                                                  >
                                                    ✕ سحب
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Level 3: Actions under Page */}
                                        {actions.length > 0 && (
                                          <div className="mr-3 space-y-1.5 border-r-2 border-emerald-400/40 pr-2.5 mt-1.5">
                                            {actions.map((act) => {
                                              const isRoleActAllowed = activeRoleObj.defaultPermissions?.includes(act.id);
                                              const userActEval = evalUserPermission(act.id);

                                              return (
                                                <div
                                                  key={act.id}
                                                  className="p-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200/80 dark:border-dark-800 flex items-center justify-between gap-3 text-xs"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
                                                      ACTION
                                                    </span>
                                                    <div>
                                                      <span className="font-bold text-slate-800 dark:text-gray-200 block text-[11px]">
                                                        {act.labelArabic}
                                                      </span>
                                                      <span className="text-[9px] text-slate-400 font-mono">
                                                        {act.id}
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="flex items-center gap-2 shrink-0">
                                                    {rbacMode === "ROLES" ? (
                                                      activeRoleObj.isSuperAdmin ? (
                                                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold">
                                                          متاح
                                                        </span>
                                                      ) : (
                                                        <button
                                                          type="button"
                                                          onClick={() => handleToggleRolePerm(selectedRole, act.id)}
                                                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 ${
                                                            isRoleActAllowed
                                                              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                                              : "bg-white hover:bg-slate-200 text-slate-600 dark:bg-dark-850 dark:hover:bg-dark-800 dark:text-gray-300 border border-slate-200 dark:border-dark-700"
                                                          }`}
                                                        >
                                                          <span>{isRoleActAllowed ? "مسموح ✓" : "معطل ✕"}</span>
                                                        </button>
                                                      )
                                                    ) : (
                                                      /* User Mode for Action */
                                                      <div className="flex items-center gap-1.5">
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                                          userActEval.effective
                                                            ? userActEval.source === "granted"
                                                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                                              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                            : userActEval.source === "denied"
                                                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700"
                                                            : "bg-slate-100 dark:bg-dark-850 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-dark-700"
                                                        }`}>
                                                          {userActEval.effective
                                                            ? (userActEval.source === "granted" ? "+ ممنوحة" : "مسموح")
                                                            : (userActEval.source === "denied" ? "✕ محجوبة" : "معطل")}
                                                        </span>

                                                        <div className="inline-flex rounded-md p-0.5 bg-slate-200/70 dark:bg-dark-900 border border-slate-300 dark:border-dark-700">
                                                          <button
                                                            type="button"
                                                            onClick={() => handleSetUserOverrideAction(activeTargetUser.id, act.id, "inherit")}
                                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                              !userActEval.isOverride
                                                                ? "bg-white dark:bg-dark-800 text-slate-900 dark:text-white"
                                                                : "text-slate-500"
                                                            }`}
                                                          >
                                                            دور
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={() => handleSetUserOverrideAction(activeTargetUser.id, act.id, "grant")}
                                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                              userActEval.source === "granted"
                                                                ? "bg-emerald-600 text-white"
                                                                : "text-emerald-700 dark:text-emerald-400"
                                                            }`}
                                                          >
                                                            +
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={() => handleSetUserOverrideAction(activeTargetUser.id, act.id, "deny")}
                                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                              userActEval.source === "denied"
                                                                ? "bg-rose-600 text-white"
                                                                : "text-rose-700 dark:text-rose-400"
                                                            }`}
                                                          >
                                                            ✕
                                                          </button>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* ================= TAB 9: COURSES ACADEMY & ASSIGNMENTS REVIEW ================= */}
          {activeTab === "courses" && (
            <CoursesAdminSection currentUser={activeUser} />
          )}

          {/* ================= TAB 10: SITE & SYSTEM SETTINGS ================= */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1.5">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    <span>لوحة التحكم المركزية بإعدادات النظام والموقع</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    إعدادات وتشغيل المنظومة والموقع العام (Site & System Settings)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    إدارة الهوية الرقمية، وضع الصيانة، السياسات المالية، عمولات الضمان Escrow، ومحركات الذكاء الاصطناعي.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetSiteSettings}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-dark-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                    <span>استعادة الافتراضي</span>
                  </button>
                  <button
                    type="submit"
                    form="site-settings-form"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>حفظ كافة الإعدادات فوراً</span>
                  </button>
                </div>
              </div>

              {/* Success Toast Banner */}
              {isSettingsSavedToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                    <span>تم حفظ كافة إعدادات الموقع وتحديث التطبيق السحابي فورياً بنجاح!</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200">
                    Live Synced ✓
                  </span>
                </div>
              )}

              <form id="site-settings-form" onSubmit={handleSaveSiteSettings} className="space-y-6">
                
                {/* 1. Operation Switches & Toggles */}
                <div className="p-5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">power_settings_new</span>
                      <span>تشغيل المنظومة والمفاتيح الحية (Live System Controls)</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-dark-700">
                      Real-Time Switches
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {/* Maintenance Mode */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      siteSettingsForm.maintenanceMode
                        ? "bg-amber-500/10 border-amber-500/40 dark:bg-amber-950/30"
                        : "bg-slate-50 dark:bg-dark-950/70 border-slate-200 dark:border-dark-800"
                    }`}>
                      <label className="flex items-start justify-between cursor-pointer gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">وضع الصيانة العام</span>
                          <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block">
                            توجيه الزوار لصفحة الصيانة المؤقتة
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.maintenanceMode}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, maintenanceMode: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                      </label>
                      {siteSettingsForm.maintenanceMode && (
                        <div className="mt-2.5 pt-2 border-t border-amber-500/20">
                          <input
                            type="text"
                            value={siteSettingsForm.maintenanceNotice}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, maintenanceNotice: e.target.value })}
                            placeholder="رسالة الصيانة المعروضة..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-dark-900 border border-amber-500/30 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* New User Registrations */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/70 border border-slate-200 dark:border-dark-800">
                      <label className="flex items-start justify-between cursor-pointer gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">تسجيل المستخدمين الجدد</span>
                          <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block">
                            السماح بإنشاء حسابات مستقلين وشركات جديدة
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.allowUserRegistration}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, allowUserRegistration: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Job Posting */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/70 border border-slate-200 dark:border-dark-800">
                      <label className="flex items-start justify-between cursor-pointer gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">نشر الوظائف والمشاريع</span>
                          <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block">
                            السماح لأصحاب الأعمال بطرح عقود في السوق
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.allowJobPosting}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, allowJobPosting: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Free Trial AI Tier */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/70 border border-slate-200 dark:border-dark-800">
                      <label className="flex items-start justify-between cursor-pointer gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">التجربة المجانية (3 أيام)</span>
                          <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block">
                            تفعيل باقة الذكاء الاصطناعي الترويجية تلقائياً
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.enableAiStudioFreeTier}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, enableAiStudioFreeTier: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Company Verification */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950/70 border border-slate-200 dark:border-dark-800">
                      <label className="flex items-start justify-between cursor-pointer gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">مراجعة وتوثيق الشركات</span>
                          <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 block">
                            اشتراط اعتماد السجل التجاري قبل فتح العقود
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={siteSettingsForm.requireCompanyVerification}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, requireCompanyVerification: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 mt-0.5 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Site Identity & Branding */}
                <div className="p-5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">badge</span>
                      <span>الهوية الأساسية ومعلومات المنصة (Branding & Identity)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">اسم المنصة الرسمي</label>
                      <input
                        type="text"
                        value={siteSettingsForm.siteName}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, siteName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">العملة الأساسية للحسابات</label>
                      <select
                        value={siteSettingsForm.defaultCurrency}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, defaultCurrency: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      >
                        <option value="USD ($)">USD ($) - الدولار الأمريكي</option>
                        <option value="USDT (TRC20)">USDT (TRC20) - العملة الرقمية المستقرة</option>
                        <option value="ILS (₪)">ILS (₪) - الشيكل الفلسطيني / المحلي</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">الشعار الترويجي (Tagline)</label>
                      <input
                        type="text"
                        value={siteSettingsForm.siteTagline}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, siteTagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">وصف المنصة لمحركات البحث (SEO Meta Description)</label>
                      <textarea
                        rows={2}
                        value={siteSettingsForm.metaDescription}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all leading-relaxed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">نص حقوق الملكية في الفوتر</label>
                      <input
                        type="text"
                        value={siteSettingsForm.copyrightText}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, copyrightText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Financial & Escrow Policies */}
                <div className="p-5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[18px]">account_balance</span>
                      <span>السياسات المالية وعمولات الضمان Escrow (Financial Rates)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">عمولة المنصة من العقود (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          value={siteSettingsForm.platformFeePercent}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, platformFeePercent: Number(e.target.value) })}
                          className="w-full px-3 py-2 pr-8 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 block">تخصم من قيمة الصفقة المكتملة</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">الحد الأدنى للسحب الفوري ($)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min="10"
                          step="5"
                          value={siteSettingsForm.minWithdrawalUsd}
                          onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, minWithdrawalUsd: Number(e.target.value) })}
                          className="w-full px-3 py-2 pr-8 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">$</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 block">لبنوك ومحافظ غزة والضفة</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">مدة باقة التجربة المجانية (أيام)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={siteSettingsForm.freeTrialDays}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, freeTrialDays: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">حصة صور التجربة (4K)</label>
                      <input
                        type="number"
                        min="5"
                        value={siteSettingsForm.freeTrialImagesQuota}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, freeTrialImagesQuota: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">حصة فيديوهات التجربة</label>
                      <input
                        type="number"
                        min="1"
                        value={siteSettingsForm.freeTrialVideosQuota}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, freeTrialVideosQuota: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-sky-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. AI Engine Defaults */}
                <div className="p-5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">smart_toy</span>
                      <span>محركات الذكاء الاصطناعي الافتراضية (AI Engine Defaults)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">المحرك الافتراضي للصور</label>
                      <select
                        value={siteSettingsForm.defaultImageModel}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, defaultImageModel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      >
                        <option value="GPT Image 2 (HD Photo)">GPT Image 2 (HD Photo)</option>
                        <option value="FLUX Pro 1.1 Ultra">FLUX Pro 1.1 Ultra</option>
                        <option value="Stable Diffusion 3.5 Large">Stable Diffusion 3.5 Large</option>
                        <option value="Nano Banana Pro (4K Fast)">Nano Banana Pro (4K Fast)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">المحرك الافتراضي للفيديو</label>
                      <select
                        value={siteSettingsForm.defaultVideoModel}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, defaultVideoModel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:bg-white focus:border-sky-500 outline-none transition-all"
                      >
                        <option value="Veo 3.1 & Seedance 2.0 (4K)">Veo 3.1 & Seedance 2.0 (4K)</option>
                        <option value="Kling v5 Omni Cinema">Kling v5 Omni Cinema</option>
                        <option value="Luma Dream Machine 2">Luma Dream Machine 2</option>
                        <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">حد الطلبات بالدقيقة (Rate Limit)</label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={siteSettingsForm.aiRateLimitPerMin}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, aiRateLimitPerMin: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Contact & Support Channels */}
                <div className="p-5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-500 text-[18px]">contact_support</span>
                      <span>قنوات التواصل والدعم الفني المباشر (Contact & Support)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">البريد الإلكتروني للدعم</label>
                      <input
                        type="email"
                        value={siteSettingsForm.supportEmail}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, supportEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">هاتف الدعم المباشر</label>
                      <input
                        type="text"
                        value={siteSettingsForm.supportPhone}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, supportPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">رقم واتساب الدعم الفني</label>
                      <input
                        type="text"
                        value={siteSettingsForm.supportWhatsapp}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, supportWhatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">معرف تيليجرام الرسمي</label>
                      <input
                        type="text"
                        value={siteSettingsForm.officialTelegram}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, officialTelegram: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">رابط تويتر / X الرسمي</label>
                      <input
                        type="url"
                        value={siteSettingsForm.officialTwitter}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, officialTwitter: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">رابط صفحة لينكد إن (LinkedIn)</label>
                      <input
                        type="url"
                        value={siteSettingsForm.officialLinkedIn}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, officialLinkedIn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:bg-white focus:border-amber-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Save Bar */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleResetSiteSettings}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-dark-900 hover:bg-slate-50 dark:hover:bg-dark-850 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-dark-700 text-xs font-semibold shadow-2xs transition-all"
                  >
                    استعادة الافتراضي
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>حفظ وتطبيق إعدادات الموقع فوراً</span>
                  </button>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD NEW USER BY ADMIN ================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-5">
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
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white font-mono"
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
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">الدور الوظيفي</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AuthRole)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white"
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
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-white mb-1">الموقع الجغرافي</label>
                <input
                  type="text"
                  value={newUserLocation}
                  onChange={(e) => setNewUserLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white"
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
                  className="px-5 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-md shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all"
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
          <div className="relative w-full max-w-xl rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddJobOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-amber-900 dark:text-gold-300 font-bold text-xs mb-2">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-400"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-400"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-400"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs font-mono text-emerald-400 focus:outline-none focus:border-gold-400"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      التصنيف
                    </label>
                    <select
                      value={adminJobCategory}
                      onChange={(e) => setAdminJobCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-gray-200 focus:outline-none focus:border-gold-400 leading-relaxed"
                  />
                </div>

                {/* Diaspora sponsor checkbox */}
                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="admin-diaspora-checkbox"
                    checked={adminJobIsDiaspora}
                    onChange={(e) => setAdminJobIsDiaspora(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                  />
                  <label htmlFor="admin-diaspora-checkbox" className="text-xs text-gray-200 cursor-pointer">
                    إرفاق شارة <strong className="text-gold-300">"شريك داعم من الشتات الفلسطيني"</strong> مع تمييز المشروع في السوق
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
                    className="px-6 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all"
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
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-gold-300 font-mono font-bold"
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
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-5">
            <button
              onClick={() => setIsChangePlanModalOpen(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-amber-900 dark:text-gold-300 text-xs font-bold mb-1.5">
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
                          ? "bg-gold-500/20 border-gold-500 text-white font-bold"
                          : "bg-dark-900 border-gold-500/20 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="targetPlan"
                          value={p.id}
                          checked={targetPlanId === p.id}
                          onChange={(e) => setTargetPlanId(e.target.value)}
                          className="accent-gold-500"
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
                  className="px-6 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-md shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all"
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

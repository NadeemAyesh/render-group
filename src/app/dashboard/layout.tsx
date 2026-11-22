"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserSessionState, SYSTEM_ROLES, hasPermission } from "@/lib/permissions";
import { getActiveSession, clearActiveSession } from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AuthContext } from "@/context/DashboardAuthContext";
import { ActionIconButton } from "@/components/ui/ActionIconButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Default user state
  const [currentUser, setCurrentUser] = useState<UserSessionState>({
    id: "user-1",
    fullName: "أحمد النجار (باحث عن عمل)",
    role: "JOB_SEEKER",
    customGrantedPermissions: [],
    customDeniedPermissions: [],
  });

  // Sync with active session on mount
  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setCurrentUser({
        id: session.id,
        fullName: session.fullName,
        role: session.role,
        customGrantedPermissions: [],
        customDeniedPermissions: [],
      });
    }
  }, []);

  const switchRole = (roleName: string) => {
    let name = "أحمد النجار (باحث عن عمل)";
    if (roleName === "SUPER_ADMIN") name = "المهندس معاذ (Super Admin)";
    if (roleName === "CONTENT_EDITOR") name = "سارة خليل (محررة محتوى)";
    if (roleName === "EMPLOYER") name = "شركة الأفق للحلول الرقمية (صاحب عمل)";

    setCurrentUser({
      ...currentUser,
      fullName: name,
      role: roleName,
      customGrantedPermissions: [],
      customDeniedPermissions: [],
    });
  };

  const toggleCustomPermission = (permId: string) => {
    const granted = currentUser.customGrantedPermissions || [];
    if (granted.includes(permId)) {
      setCurrentUser({
        ...currentUser,
        customGrantedPermissions: granted.filter((p) => p !== permId),
      });
    } else {
      setCurrentUser({
        ...currentUser,
        customGrantedPermissions: [...granted, permId],
      });
    }
  };

  const handleLogout = () => {
    clearActiveSession();
    router.push("/login");
  };

  // Check Menu-level permissions for Sidebar visibility
  const canSeeDashboardMenu = hasPermission(currentUser, "menu.dashboard");
  const canSeeJobsMenu = hasPermission(currentUser, "menu.jobs");
  const canSeeProposalsMenu = hasPermission(currentUser, "menu.proposals");
  const canSeeStudioMenu = hasPermission(currentUser, "menu.studio");
  const canSeeContentMenu = hasPermission(currentUser, "menu.content");
  const canSeeUsersRolesMenu = hasPermission(currentUser, "menu.users_roles");
  const canSeeFinanceMenu = hasPermission(currentUser, "menu.finance");

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, toggleCustomPermission, logout: handleLogout }}>
      <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">
        
        {/* ================= SIDEBAR (MENU-LEVEL RBAC APPLIED) ================= */}
        <aside className="w-full md:w-64 bg-dark-900 border-l border-gold-500/20 flex flex-col justify-between shrink-0">
          <div>
            {/* Brand Logo */}
            <div className="h-20 px-6 flex items-center gap-3 border-b border-gold-500/15">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-md">
                  <span className="material-symbols-outlined text-[22px]">all_inclusive</span>
                </div>
                <div>
                  <span className="text-base font-bold text-white tracking-tight">
                    Render<span className="text-gold-500">Lancer</span>
                  </span>
                  <span className="block text-[9px] text-gold-400 font-mono -mt-1">
                    لوحة التحكم الموحدة
                  </span>
                </div>
              </Link>
            </div>

            {/* User Identity Mini Card */}
            <div className="p-4 mx-4 my-4 rounded-2xl bg-dark-950/80 border border-gold-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser.fullName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 mt-0.5 font-medium truncate max-w-full">
                      {SYSTEM_ROLES[currentUser.role]?.labelArabic || currentUser.role}
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
            </div>

            {/* Navigation Menus based on 3-tier Tree */}
            <nav className="px-3 space-y-1 text-xs font-semibold">
              <span className="px-3 text-[10px] text-gray-500 uppercase tracking-wider block mb-2">
                القوائم المتاحة بحسب صلاحياتك:
              </span>

              {canSeeDashboardMenu && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gold-500/15 text-gold-300 border border-gold-500/30"
                >
                  <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                  <span>الرئيسية ونظرة عامة</span>
                </Link>
              )}

              {canSeeJobsMenu && (
                <a
                  href="#jobs-feed"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-gold-400">work</span>
                  <span>المشاريع ومطابقة الـ AI</span>
                </a>
              )}

              {canSeeProposalsMenu && (
                <a
                  href="#proposals-tracker"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-gold-400">send_and_archive</span>
                  <span>عروضي المقدمة (3)</span>
                </a>
              )}

              {canSeeStudioMenu && (
                <a
                  href="#studio-quick-access"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-gold-400">token</span>
                  <span>أدوات استوديو الـ AI</span>
                </a>
              )}

              {canSeeContentMenu && (
                <a
                  href="#content-admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                >
                  <span className="material-symbols-outlined text-[18px]">article</span>
                  <span>إدارة المحتوى والمقالات</span>
                </a>
              )}

              {canSeeUsersRolesMenu && (
                <Link
                  href="/admin?tab=permissions"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gold-300 bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20"
                >
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  <span>شجرة الصلاحيات (Admin)</span>
                </Link>
              )}

              {canSeeFinanceMenu && (
                <a
                  href="#escrow-payouts"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850"
                >
                  <span className="material-symbols-outlined text-[18px] text-emerald-400">account_balance_wallet</span>
                  <span>المحفظة والضمان Escrow</span>
                </a>
              )}
            </nav>
          </div>

          {/* Quick Return to Landing Page */}
          <div className="p-4 border-t border-gold-500/15">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              <span>العودة للواجهة العامة</span>
            </Link>
          </div>
        </aside>

        {/* ================= MAIN DASHBOARD BODY ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar with Enterprise Real Header */}
          <header className="h-20 bg-dark-900/90 border-b border-gold-500/20 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
            
            {/* Real Account & Portal Title */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-400 text-[20px]">space_dashboard</span>
                بوابة الكفاءات والمستقلين (Talent Portal)
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>حساب موثق ومعتمد • وصول سحابي نشط</span>
              </span>
            </div>

            {/* Wallet, Theme, Permissions & Logout */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle compact />

              <div className="px-3.5 py-1.5 rounded-xl bg-dark-950 border border-gold-500/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">account_balance_wallet</span>
                <span className="text-xs text-gray-300 hidden sm:inline">الرصيد:</span>
                <span className="text-xs font-mono font-bold text-emerald-400">$120.00</span>
              </div>

              <Link
                href="/admin?tab=permissions"
                className="px-3.5 py-1.5 rounded-xl bg-gold-500/15 text-gold-300 border border-gold-500/30 hover:bg-gold-500/25 text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
                <span className="hidden sm:inline">شجرة الصلاحيات</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">تسجيل خروج</span>
              </button>
            </div>
          </header>

          {/* Children View */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>

      </div>
    </AuthContext.Provider>
  );
}

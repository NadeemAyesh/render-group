"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getActiveSession, clearActiveSession, AuthUser } from "@/lib/auth-service";
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

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);
  const [payouts, setPayouts] = useState<PendingPayout[]>(INITIAL_PAYOUTS);
  
  // Instant Code Generator State
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [planDuration, setPlanDuration] = useState("30");

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setActiveUser(session);
    }
  }, []);

  const handleLogout = () => {
    clearActiveSession();
    router.push("/login");
  };

  const handleGenerateCode = () => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `RENDER-GOLD-${randomHex}`;
    setGeneratedCode(newCode);
  };

  const handleApprovePayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">
      
      {/* ================= METRONIC-STYLE ADMIN SIDEBAR ================= */}
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

          {/* Super Admin Badge */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center justify-center font-bold text-sm shrink-0">
                {activeUser?.avatar || "SA"}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white truncate">
                  {activeUser?.fullName || "المهندس معاذ"}
                </span>
                <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold mt-0.5">
                  {activeUser?.role || "SUPER_ADMIN (مطلق)"}
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

          <nav className="px-3 space-y-1 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>مركز القيادة الشامل</span>
            </Link>

            <Link
              href="/admin/permissions"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-purple-400">account_tree</span>
              <span>شجرة الصلاحيات (RBAC)</span>
            </Link>

            <a
              href="#escrow-ledger"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">account_balance</span>
              <span>الضمان المالي وسحوبات فلسطين</span>
            </a>

            <a
              href="#code-generator"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-dark-850 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">key</span>
              <span>توليد أكواد التفعيل (Studio)</span>
            </a>
          </nav>
        </div>

        {/* Quick Links back to Portals */}
        <div className="p-4 border-t border-purple-500/20 space-y-2">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>لوحة الباحث عن عمل</span>
          </Link>

          <Link
            href="/dashboard/employer"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-dark-850 text-gray-300 text-xs font-semibold hover:text-white border border-gold-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            <span>لوحة الشركة والتوظيف</span>
          </Link>
        </div>
      </aside>

      {/* ================= MAIN METRONIC BODY ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-dark-900/90 border-b border-purple-500/20 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-[22px]">security</span>
              لوحة التحكم الإدارية المركزية (Super Admin Console)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />

            <Link
              href="/admin/permissions"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>تعديل الصلاحيات وتجاوز المستخدمين</span>
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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Executive KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">إجمالي المستخدمين</span>
                <span className="material-symbols-outlined text-purple-400 text-[22px]">group</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white">+3,450</span>
                <span className="block text-[11px] text-emerald-400 mt-1">2,800 مستقل • 650 شركة</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">حجم السيولة في الضمان (Escrow)</span>
                <span className="material-symbols-outlined text-emerald-400 text-[22px]">lock</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono text-emerald-400">$142,500.00</span>
                <span className="block text-[11px] text-gray-400 mt-1">في 48 مشروع نشط</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">طلبات سحب معلقة لفلسطين</span>
                <span className="material-symbols-outlined text-gold-400 text-[22px]">payments</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono gold-gradient-text">6 طلبات</span>
                <span className="block text-[11px] text-gold-400 mt-1">USDT وبنك فلسطين</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">استهلاك أدوات الذكاء الاصطناعي</span>
                <span className="material-symbols-outlined text-purple-400 text-[22px]">token</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono text-white">84,200</span>
                <span className="block text-[11px] text-purple-300 mt-1">عملية توليد هذا الشهر</span>
              </div>
            </div>

          </div>

          {/* Section 1: Instant Activation Codes Generator (طلب استوديو الذكاء) */}
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
              <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold-400 text-[28px]">token</span>
                  <div>
                    <span className="text-xs text-gray-300 block">الكود الصادر بنجاح:</span>
                    <strong className="text-lg font-mono font-bold text-gold-400 tracking-wider">
                      {generatedCode}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-dark-850 text-gray-300 border border-gold-500/20">
                    باقة شاملة • 30 يوماً
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      alert(`تم نسخ الكود ${generatedCode} للحافظة!`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gold-500 text-dark-950 font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>نسخ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Financial Escrow & Payout Approvals (سحوبات فلسطين) */}
          <div id="escrow-ledger" className="p-6 rounded-2xl bg-dark-900 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[22px]">price_check</span>
                  اعتماد طلبات السحب المالي للمستقلين الفلسطينيين
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  مراجعة والتحويل عبر القنوات الآمنة (USDT Crypto، بنك فلسطين، وبايونير)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-purple-500/15 text-gray-400 pb-2">
                    <th className="py-2.5 font-semibold">المستقل</th>
                    <th className="py-2.5 font-semibold">الموقع</th>
                    <th className="py-2.5 font-semibold">المبلغ المطلوب</th>
                    <th className="py-2.5 font-semibold">طريقة السحب والبيانات</th>
                    <th className="py-2.5 font-semibold">وقت الطلب</th>
                    <th className="py-2.5 font-semibold">الحالة</th>
                    <th className="py-2.5 font-semibold">الإجراء الإداري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
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

        </main>
      </div>

    </div>
  );
}

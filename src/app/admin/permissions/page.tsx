"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PERMISSIONS_TREE, SYSTEM_ROLES, PermissionNode } from "@/lib/permissions";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function AdminPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string>("CONTENT_EDITOR");
  const [selectedUser, setSelectedUser] = useState<string>("user-ahmed");
  
  // Custom user overrides state (demonstrating adding extra permissions to specific user)
  const [userCustomPermissions, setUserCustomPermissions] = useState<Record<string, string[]>>({
    "user-ahmed": ["action.jobs.delete", "page.jobs.create"], // Ahmed has JOB_SEEKER base role, but granted delete & create!
    "user-sara": ["action.users.grant_custom_permission"],
  });

  const activeOverrides = userCustomPermissions[selectedUser] || [];

  const handleToggleUserPermission = (permId: string) => {
    const current = userCustomPermissions[selectedUser] || [];
    if (current.includes(permId)) {
      setUserCustomPermissions({
        ...userCustomPermissions,
        [selectedUser]: current.filter((p) => p !== permId),
      });
    } else {
      setUserCustomPermissions({
        ...userCustomPermissions,
        [selectedUser]: [...current, permId],
      });
    }
  };

  const menuNodes = PERMISSIONS_TREE.filter((p) => p.type === "menu");
  const getPagesForMenu = (menuId: string) =>
    PERMISSIONS_TREE.filter((p) => p.type === "page" && p.parent === menuId);
  const getActionsForPage = (pageId: string) =>
    PERMISSIONS_TREE.filter((p) => p.type === "action" && p.parent === pageId);

  const roleData = SYSTEM_ROLES[selectedRole];

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 p-6 lg:p-10">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gold-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              العودة للوحة المستقلين
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-xs text-gray-400">لوحة الإشراف (Metronic Style)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2.5">
            <span className="material-symbols-outlined text-gold-400 text-[30px]">account_tree</span>
            شجرة الصلاحيات والأدوار (3-Tier Hierarchical RBAC)
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            إدارة الصلاحيات الشجرية الثلاثية: <strong>Menu (القائمة)</strong> ➜ <strong>Page (الصفحة)</strong> ➜ <strong>Action (الإجراء)</strong>، مع إمكانية التخصيص لكل مستخدم بشكل مستقل.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle compact />

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <span>معاينة لوحة المستخدم</span>
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN: ROLES & USER OVERRIDE SELECTOR ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Base Roles */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">badge</span>
              الأدوار الأساسية في النظام (Roles)
            </h3>
            
            <div className="space-y-2">
              {Object.keys(SYSTEM_ROLES).map((roleKey) => {
                const role = SYSTEM_ROLES[roleKey];
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`w-full text-right p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-gold-500/15 border-gold-500 text-gold-300 shadow-md"
                        : "bg-dark-950/70 border-gold-500/15 text-gray-300 hover:border-gold-500/40"
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{role.labelArabic}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{role.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-850 text-gold-400 border border-gold-500/20">
                      {role.defaultPermissions.length} صلاحية
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. User Specific Override Box (خاصية إضافة صلاحيات للمستخدم مباشرة) */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">person_add</span>
                تخصيص صلاحيات استثنائية لمستخدم
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">
                User Override
              </span>
            </div>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              اختر مستخدماً لإضافة صلاحيات إضافية مباشرة له (تجاوز للدور)، حتى لو لم تكن موجودة في دوره الأساسي:
            </p>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-dark-950 border border-purple-500/30 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="user-ahmed">أحمد النجار (باحث عن عمل / Job Seeker)</option>
              <option value="user-sara">سارة خليل (محررة محتوى / Content Editor)</option>
            </select>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
              <span className="text-purple-300 font-bold block mb-1">
                الصلاحيات الاستثنائية الممنوحة له الآن:
              </span>
              {activeOverrides.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeOverrides.map((perm) => (
                    <span
                      key={perm}
                      className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-400/40 flex items-center gap-1 font-mono"
                    >
                      {perm}
                      <button
                        onClick={() => handleToggleUserPermission(perm)}
                        className="text-purple-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-[11px]">
                  لا توجد صلاحيات استثنائية (يعتمد كلياً على دوره الأساسي). انقر على أي صلاحية في الشجرة على اليسار لمنحها له فوراً!
                </span>
              )}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: THE 3-TIER HIERARCHICAL TREE ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-500/15 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold-400 text-[22px]">account_tree</span>
                  استعراض الشجرة: Menu ➜ Page ➜ Action
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  الدور المحدد حالياً: <strong className="text-gold-300">{roleData?.labelArabic}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-gold-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-500"></span>
                  مستوى Menu
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  مستوى Page
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  مستوى Action
                </span>
              </div>
            </div>

            {/* Tree Nodes List */}
            <div className="space-y-6">
              {menuNodes.map((menu) => {
                const isMenuInRole = roleData?.defaultPermissions.includes(menu.id);
                const isMenuOverridden = activeOverrides.includes(menu.id);
                const hasMenuEffective = isMenuInRole || isMenuOverridden;

                const pages = getPagesForMenu(menu.id);

                return (
                  <div
                    key={menu.id}
                    className="p-4 rounded-2xl bg-dark-950/80 border border-gold-500/25 space-y-4"
                  >
                    {/* Level 1: Menu Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/40 font-mono font-bold">
                          MENU
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {menu.labelArabic}
                            <span className="text-[10px] text-gray-400 font-mono font-normal">
                              ({menu.id})
                            </span>
                          </h4>
                          <p className="text-[11px] text-gray-400">{menu.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasMenuEffective ? (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check</span>
                            مفعلة
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-semibold">
                            محجوبة
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleUserPermission(menu.id)}
                          title="منح/إلغاء استثنائي للمستخدم المحدد"
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                            isMenuOverridden
                              ? "bg-purple-500 text-white border-purple-400"
                              : "bg-dark-850 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {isMenuOverridden ? "استثنائي (ممنوح) ✓" : "+ منح للمستخدم"}
                        </button>
                      </div>
                    </div>

                    {/* Level 2: Pages under Menu */}
                    {pages.length > 0 && (
                      <div className="mr-6 space-y-3 border-r-2 border-blue-500/30 pr-4 mt-3">
                        {pages.map((page) => {
                          const isPageInRole = roleData?.defaultPermissions.includes(page.id);
                          const isPageOverridden = activeOverrides.includes(page.id);
                          const hasPageEffective = isPageInRole || isPageOverridden;

                          const actions = getActionsForPage(page.id);

                          return (
                            <div
                              key={page.id}
                              className="p-3 rounded-xl bg-dark-900 border border-blue-500/20 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-bold">
                                    PAGE
                                  </span>
                                  <div>
                                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                                      {page.labelArabic}
                                      <span className="text-[10px] text-gray-500 font-mono font-normal">
                                        ({page.id})
                                      </span>
                                    </h5>
                                    <p className="text-[10px] text-gray-400">{page.description}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {hasPageEffective ? (
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                      متاحة
                                    </span>
                                  ) : (
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                                      غير متاحة
                                    </span>
                                  )}

                                  <button
                                    onClick={() => handleToggleUserPermission(page.id)}
                                    className={`text-[9px] px-2 py-0.5 rounded-lg border font-bold transition-colors ${
                                      isPageOverridden
                                        ? "bg-purple-500 text-white border-purple-400"
                                        : "bg-dark-850 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                                    }`}
                                  >
                                    {isPageOverridden ? "استثنائي ✓" : "+ منح"}
                                  </button>
                                </div>
                              </div>

                              {/* Level 3: Actions under Page */}
                              {actions.length > 0 && (
                                <div className="mr-6 space-y-2 border-r-2 border-emerald-500/30 pr-3 mt-2">
                                  {actions.map((act) => {
                                    const isActInRole = roleData?.defaultPermissions.includes(act.id);
                                    const isActOverridden = activeOverrides.includes(act.id);
                                    const hasActEffective = isActInRole || isActOverridden;

                                    return (
                                      <div
                                        key={act.id}
                                        className="p-2.5 rounded-lg bg-dark-950 border border-emerald-500/15 flex items-center justify-between gap-3 text-xs"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                                            ACTION
                                          </span>
                                          <div>
                                            <span className="font-bold text-white block">
                                              {act.labelArabic}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                              {act.id}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {hasActEffective ? (
                                            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                              مسموح بالضغط ✓
                                            </span>
                                          ) : (
                                            <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">
                                              معطل ✕
                                            </span>
                                          )}

                                          <button
                                            onClick={() => handleToggleUserPermission(act.id)}
                                            className={`text-[9px] px-2 py-0.5 rounded-lg border font-bold transition-colors ${
                                              isActOverridden
                                                ? "bg-purple-500 text-white border-purple-400"
                                                : "bg-dark-850 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                                            }`}
                                          >
                                            {isActOverridden ? "استثنائي ✓" : "+ منح"}
                                          </button>
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
}

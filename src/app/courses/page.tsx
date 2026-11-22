"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import {
  getCourses,
  Course,
  CourseCategory,
  COURSE_CATEGORIES,
  LEVEL_LABELS,
} from "@/lib/courses-service";
import { getActiveSession, AuthUser } from "@/lib/auth-service";

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeLevel, setActiveLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCourses(getCourses());
    setCurrentUser(getActiveSession());

    const handleCoursesChange = (e: Event) => {
      const customEvent = e as CustomEvent<Course[]>;
      if (customEvent.detail) {
        setCourses(customEvent.detail);
      } else {
        setCourses(getCourses());
      }
    };

    window.addEventListener("renderlancer_courses_change", handleCoursesChange);
    return () => window.removeEventListener("renderlancer_courses_change", handleCoursesChange);
  }, []);

  const filteredCourses = courses.filter((c) => {
    // Only active courses for students/public (unless user is Super Admin)
    const isVisible = c.status === "ACTIVE" || currentUser?.role === "SUPER_ADMIN";
    if (!isVisible) return false;

    if (activeCategory !== "ALL" && c.category !== activeCategory) return false;
    if (activeLevel !== "ALL" && c.level !== activeLevel) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.shortDescription.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const matchInstructor = c.instructor.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInstructor) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 text-gray-900 dark:text-gray-100 selection:bg-gold-500 selection:text-dark-950 font-sans">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      <main>
        {/* ================= HERO HEADER ================= */}
        <section className="relative overflow-hidden border-b border-gold-500/15 py-10 lg:py-14 bg-gradient-to-b from-slate-50 dark:from-dark-900/60 via-transparent to-transparent">
          <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 backdrop-blur-md mb-4">
              <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">school</span>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                أكاديمية ريندر للتدريب الاحترافي والتكليفات المباشرة
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white max-w-4xl">
              تعلّم بالصوت والصورة، وطبّق <span className="gold-gradient-text">تكليفات حقيقية</span> على المنصة
            </h1>

            <p className="mt-4 text-sm text-slate-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              دورات تخصصية تُعرض عبر <strong className="text-red-500 dark:text-red-400">YouTube</strong> مع نظام تكليفات متكامل ومتابعة دقيقة من <strong className="text-amber-600 dark:text-gold-400">Super Admin</strong>.
            </p>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
              <div className="p-3 rounded-xl bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-gold-500/20 shadow-sm">
                <div className="text-xl font-extrabold text-amber-500 font-mono">100%</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">متابعة وتصحيح التكليفات</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-gold-500/20 shadow-sm">
                <div className="text-xl font-extrabold text-emerald-500 font-mono">4K UHD</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">شروحات يوتيوب مركزة</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-gold-500/20 shadow-sm">
                <div className="text-xl font-extrabold text-blue-500 font-mono">+520</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">طالب مسجل</div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-dark-900/80 border border-slate-200 dark:border-gold-500/20 shadow-sm">
                <div className="text-xl font-extrabold text-amber-500 font-mono">شهادة</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-semibold">معتمدة عند الإتمام</div>
              </div>
            </div>

            {currentUser?.role === "SUPER_ADMIN" && (
              <div className="mt-5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/15 border border-gold-500/40 text-amber-700 dark:text-gold-300 text-xs font-bold hover:bg-gold-500/25 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                  <span>مدير النظام — إدارة الدورات والتكليفات</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ================= HOW IT WORKS WORKFLOW ================= */}
        <section className="py-8 border-b border-slate-100 dark:border-gold-500/10 bg-slate-50 dark:bg-dark-900/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold text-amber-600 dark:text-gold-400 uppercase tracking-widest font-mono">WORKFLOW SYSTEM</span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                من المشاهدة حتى الاعتماد
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-gold-500/20 flex items-start gap-3 hover:border-gold-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">play_circle</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-gold-400 mb-0.5">المرحلة 01</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">مشاهدة شروحات يوتيوب</h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                    محاضرات مركزة بجودة 4K مع روابط الملحقات وملفات العمل.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-gold-500/20 flex items-start gap-3 hover:border-gold-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">assignment_add</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-gold-400 mb-0.5">المرحلة 02</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">تسليم التكليف العملي</h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                    رفع التكليف مباشرة عبر روابط Drive، GitHub، Figma، أو Behance.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-gold-500/20 flex items-start gap-3 hover:border-gold-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">fact_check</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-gold-400 mb-0.5">المرحلة 03</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">تدقيق وتصحيح الإدارة</h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                    مراجعة دقيقة، رصد الدرجة، وتوجيه احترافي لاعتماد إنجازك.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= SEARCH & CATEGORIES FILTER ================= */}
        <section className="py-8 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute right-3.5 top-2.5 text-slate-400 dark:text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دورة، مدرب، أو مهارة..."
                className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-gold-500/25 rounded-xl py-2.5 pr-11 pl-4 text-xs text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:border-amber-400 dark:focus:border-gold-500 focus:ring-1 focus:ring-amber-400 dark:focus:ring-gold-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-500 dark:text-gray-400 whitespace-nowrap">المستوى:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {["ALL", "beginner", "intermediate", "advanced"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeLevel === lvl
                        ? "bg-amber-500 dark:bg-gold-500 text-white dark:text-dark-950 font-bold shadow-sm"
                        : "bg-white dark:bg-dark-900 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-gold-500/15"
                    }`}
                  >
                    {lvl === "ALL" ? "كافة المستويات" : LEVEL_LABELS[lvl as keyof typeof LEVEL_LABELS]?.ar || lvl}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeCategory === "ALL"
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-500 dark:to-gold-400 text-white dark:text-dark-950 shadow-md shadow-amber-500/20"
                  : "bg-white dark:bg-dark-900 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-dark-850 border border-slate-200 dark:border-gold-500/20"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">apps</span>
              <span>الكل ({courses.length})</span>
            </button>

            {Object.values(COURSE_CATEGORIES).map((cat) => {
              const count = courses.filter((c) => c.category === cat.key).length;
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-500 dark:to-gold-400 text-white dark:text-dark-950 shadow-md shadow-amber-500/20"
                      : "bg-white dark:bg-dark-900 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-dark-850 border border-slate-200 dark:border-gold-500/20"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                  <span>{cat.ar}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/25 text-white dark:bg-dark-950/20 dark:text-dark-950 font-bold" : "bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-gray-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ================= COURSES GRID ================= */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-dark-900/50 rounded-2xl border border-gold-500/20 p-8">
              <span className="material-symbols-outlined text-[36px] text-gray-400 block mb-3">school</span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">لا توجد دورات تطابق معايير البحث</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                جرّب إزالة الفلاتر أو استخدام كلمات بحث مختلفة.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("ALL");
                  setActiveLevel("ALL");
                  setSearchQuery("");
                }}
                className="px-5 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-md"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCourses.map((course) => {
                const catMeta = COURSE_CATEGORIES[course.category] || COURSE_CATEGORIES.motion;
                const levelMeta = LEVEL_LABELS[course.level] || LEVEL_LABELS.all;
                const assignmentsCount = course.lessons.filter((l) => l.hasAssignment).length;

                return (
                  <div
                    key={course.id}
                    className="flex flex-col bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-gold-500/20 overflow-hidden shadow-sm hover:shadow-md hover:border-gold-500/40 transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-dark-950">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border font-bold backdrop-blur-sm ${catMeta.badgeClass}`}>
                          {catMeta.ar}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-red-600/90 text-white font-bold backdrop-blur-sm">
                          <span className="material-symbols-outlined text-[11px]">smart_display</span>
                          يوتيوب
                        </span>
                      </div>

                      {/* Bottom: level + duration */}
                      <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${levelMeta.class}`}>
                          {levelMeta.ar}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] text-gold-300 font-mono font-bold bg-black/60 px-2 py-0.5 rounded border border-gold-500/20">
                          <span className="material-symbols-outlined text-[11px]">schedule</span>
                          {course.duration}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      {/* Title */}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-gold-300 transition-colors">
                        {course.title}
                      </h3>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-gold-400 text-[13px]">menu_book</span>
                          {course.lessons.length} درس
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-amber-400 text-[13px]">star</span>
                          <span className="font-bold text-slate-700 dark:text-white">{course.rating}</span>
                          <span className="text-slate-400">({course.reviewsCount})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-blue-400 text-[13px]">group</span>
                          {course.enrolledCount}
                        </span>
                      </div>

                      {/* Assignments badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25">
                        <span className="material-symbols-outlined text-amber-500 text-[13px]">task_alt</span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-200">{assignmentsCount} تكليفات مصححة</span>
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/30">متابعة إدارية</span>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-gold-500/10">
                        <div className="w-7 h-7 rounded-full gold-button-gradient text-dark-950 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                          {course.instructor.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-800 dark:text-gray-200 truncate">{course.instructor.name}</p>
                          <p className="text-[9px] text-slate-500 dark:text-gray-400 truncate">{course.instructor.title}</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/courses/${course.id}`}
                        className="mt-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                        <span>دخول الدورة</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= PLATFORM GUARANTEE & BANNER ================= */}
        <section className="py-16 bg-gradient-to-t from-dark-900 to-dark-950 border-t border-gold-500/15 mt-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-lg shadow-gold-500/10">
              <span className="material-symbols-outlined text-[32px]">verified_user</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              منصة تدريب عملية تفتح لك أبواب التعاقدات الدولية
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              لا نكتفي بإعطائك مقاطع فيديو نظرية؛ بل نتابع كل سطر كود وكل كادر موشن جرافيك تقدمه في تكليفاتك. وعند إتمام جميع التكليفات بنجاح، يُمنح ملفك الشخصي شارة <strong className="text-gold-400">"خريج ريندر معتمد"</strong> لترشيحك الفوري لوظائف شركات الشتات والخليج.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/jobs"
                className="px-6 py-3 rounded-xl bg-dark-900 border border-gold-500/30 text-white font-bold text-xs hover:bg-dark-850 hover:border-gold-500/60 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">work</span>
                <span>استكشف الوظائف والمشاريع المتاحة</span>
              </Link>
              <Link
                href="/talents"
                className="px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-md shadow-gold-500/15 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                <span>انضم كمدرب أو خبير معتمد</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

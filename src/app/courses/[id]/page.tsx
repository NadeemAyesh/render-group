"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import {
  getCourseById,
  Course,
  CourseLesson,
  AssignmentSubmission,
  getYoutubeEmbedUrl,
  getYoutubeVideoId,
  submitAssignment,
  getStudentSubmissionForLesson,
  getSubmissions,
  isStudentEnrolled,
  enrollInCourse,
  COURSE_CATEGORIES,
  LEVEL_LABELS,
} from "@/lib/courses-service";
import { getActiveSession, AuthUser } from "@/lib/auth-service";
import { ActionIconButton } from "@/components/ui/ActionIconButton";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isActivationOpen, setIsActivationOpen] = useState(false);

  // Sidebar Tab
  const [sidebarTab, setSidebarTab] = useState<"playlist" | "assignments" | "instructor">("playlist");

  // Assignment Form State
  const [studentNotes, setStudentNotes] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState<{ label: string; url: string }[]>([
    { label: "رابط العمل الرئيسي (Google Drive / GitHub / Figma)", url: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Completed Lessons Tracking in LocalStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Submissions for this course
  const [courseSubmissions, setCourseSubmissions] = useState<AssignmentSubmission[]>([]);

  const loadData = () => {
    if (!courseId) return;
    const found = getCourseById(courseId);
    if (found) {
      setCourse(found);
      if (!activeLesson && found.lessons.length > 0) {
        setActiveLesson(found.lessons[0]);
      }
    }

    const session = getActiveSession();
    setCurrentUser(session);

    if (session) {
      setIsEnrolled(isStudentEnrolled(session.id, courseId));
    } else {
      setIsEnrolled(true); // Allow previewing
    }

    // Load completed lessons
    try {
      const raw = localStorage.getItem(`renderlancer_completed_lessons_${courseId}`);
      if (raw) setCompletedLessonIds(JSON.parse(raw));
    } catch {}

    // Load submissions
    const subs = getSubmissions({ courseId });
    setCourseSubmissions(subs);
  };

  useEffect(() => {
    loadData();

    const handleCoursesChange = () => loadData();
    const handleSubmissionsChange = () => loadData();

    window.addEventListener("renderlancer_courses_change", handleCoursesChange);
    window.addEventListener("renderlancer_submissions_change", handleSubmissionsChange);

    return () => {
      window.removeEventListener("renderlancer_courses_change", handleCoursesChange);
      window.removeEventListener("renderlancer_submissions_change", handleSubmissionsChange);
    };
  }, [courseId]);

  // When active lesson changes, pre-fill student submission if already exists
  useEffect(() => {
    if (!activeLesson || !currentUser || !course) return;
    const existing = getStudentSubmissionForLesson(course.id, activeLesson.id, currentUser.id);
    if (existing) {
      setStudentNotes(existing.studentNotes);
      setSubmissionLinks(
        existing.submissionLinks.length > 0
          ? existing.submissionLinks
          : [{ label: "رابط العمل الرئيسي", url: "" }]
      );
      setIsEditMode(false);
    } else {
      setStudentNotes("");
      setSubmissionLinks([{ label: "رابط العمل الرئيسي (Google Drive / GitHub / Figma)", url: "" }]);
      setIsEditMode(false);
    }
  }, [activeLesson, currentUser, course]);

  const handleEnroll = () => {
    if (!course) return;
    const studentId = currentUser ? currentUser.id : "guest-student";
    enrollInCourse(studentId, course.id);
    setIsEnrolled(true);
  };

  const toggleLessonComplete = (lessonId: string) => {
    const updated = completedLessonIds.includes(lessonId)
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];
    setCompletedLessonIds(updated);
    localStorage.setItem(`renderlancer_completed_lessons_${courseId}`, JSON.stringify(updated));
  };

  const handleAddLink = () => {
    setSubmissionLinks([...submissionLinks, { label: "رابط إضافي (فيديو / ملحقات)", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setSubmissionLinks(submissionLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
    const next = [...submissionLinks];
    next[index][field] = value;
    setSubmissionLinks(next);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !activeLesson || !activeLesson.assignment) return;

    const student = currentUser || {
      id: "u-talent-guest",
      fullName: "طالب ضيف في منصة ريندر",
      email: "guest@render.ps",
      avatar: "ط.ض",
    };

    const validLinks = submissionLinks.filter((l) => l.url.trim().length > 0);
    if (validLinks.length === 0) {
      alert("يرجى إرفاق رابط عمل واحد على الأقل (مثلاً رابط Google Drive أو GitHub أو Figma)");
      return;
    }

    setIsSubmitting(true);

    try {
      submitAssignment({
        courseId: course.id,
        courseTitle: course.title,
        lessonId: activeLesson.id,
        lessonTitle: activeLesson.title,
        assignmentId: activeLesson.assignment.id,
        assignmentTitle: activeLesson.assignment.title,
        studentId: student.id,
        studentName: student.fullName,
        studentEmail: student.email,
        studentAvatar: student.avatar || "ط.م",
        studentNotes: studentNotes.trim() || "تم تنفيذ متطلبات التكليف ومرفق روابط العمل للمراجعة.",
        submissionLinks: validLinks,
      });

      // Automatically mark lesson as completed
      if (!completedLessonIds.includes(activeLesson.id)) {
        toggleLessonComplete(activeLesson.id);
      }

      setIsSubmitting(false);
      setSubmitSuccessToast(true);
      setIsEditMode(false);
      loadData();
      setTimeout(() => setSubmitSuccessToast(false), 5000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col justify-between font-sans">
        <Navbar onOpenActivation={() => setIsActivationOpen(true)} />
        <div className="text-center py-32">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-gold-500/30 flex items-center justify-center mx-auto mb-4 text-gold-400">
            <span className="material-symbols-outlined text-[32px] animate-spin">refresh</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">جاري تحميل بيانات الدورة...</h2>
          <p className="text-xs text-gray-400 mb-6">إذا استمر التحميل، قد تكون الدورة غير موجودة أو تم حذفها.</p>
          <Link href="/courses" className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs">
            العودة لكتالوج الدورات
          </Link>
        </div>
        <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      </div>
    );
  }

  const catMeta = COURSE_CATEGORIES[course.category] || COURSE_CATEGORIES.motion;
  const levelMeta = LEVEL_LABELS[course.level] || LEVEL_LABELS.all;
  const currentSubmission = activeLesson && currentUser
    ? getStudentSubmissionForLesson(course.id, activeLesson.id, currentUser.id)
    : undefined;

  const currentLessonIndex = activeLesson ? course.lessons.findIndex((l) => l.id === activeLesson.id) : 0;
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;

  const progressPercentage = Math.round((completedLessonIds.length / (course.lessons.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 selection:bg-gold-500 selection:text-dark-950 font-sans">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* ================= BREADCRUMBS & COURSE TOP BAR ================= */}
      <section className="border-b border-gold-500/15 bg-dark-900/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs text-gray-400 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-gold-400">الرئيسية</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-gold-400">أكاديمية الدورات</Link>
            <span>/</span>
            <span className="text-gold-300 font-bold truncate max-w-xs">{course.title}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${catMeta.badgeClass}`}>
              {catMeta.ar}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${levelMeta.class}`}>
              {levelMeta.ar}
            </span>
            
            {currentUser?.role === "SUPER_ADMIN" && (
              <Link
                href="/admin"
                className="px-3 py-1 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold hover:bg-gold-500/30 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                <span>لوحة تحكم السوبر أدمن</span>
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* ================= MAIN PLAYER & WORKSPACE GRID ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT / MAIN CONTENT (PLAYER & ASSIGNMENT) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. YOUTUBE VIDEO PLAYER CONTAINER */}
            <div className="rounded-3xl overflow-hidden bg-black border border-gold-500/25 shadow-2xl shadow-gold-500/5 relative aspect-video">
              {activeLesson?.youtubeUrl ? (
                (() => {
                  const embedUrl = getYoutubeEmbedUrl(activeLesson.youtubeUrl);
                  if (embedUrl) {
                    return (
                      <iframe
                        src={embedUrl}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    );
                  }
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-dark-900">
                      <span className="material-symbols-outlined text-red-500 text-[48px] mb-2">smart_display</span>
                      <h4 className="text-sm font-bold text-white mb-1">فيديو يوتيوب مخصص لهذا الدرس</h4>
                      <p className="text-xs text-gray-400 font-mono mb-4">{activeLesson.youtubeUrl}</p>
                      <a
                        href={activeLesson.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs"
                      >
                        فتح الفيديو مباشرة على YouTube
                      </a>
                    </div>
                  );
                })()
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-dark-900">
                  <span className="material-symbols-outlined text-gray-600 text-[48px] mb-2">movie</span>
                  <h4 className="text-sm font-bold text-white mb-1">لم يتم إرفاق رابط يوتيوب لهذا الدرس بعد</h4>
                  <p className="text-xs text-gray-400">يمكن للمدير العام (Super Admin) إضافة رابط الفيديو من لوحة التحكم.</p>
                </div>
              )}
            </div>

            {/* 2. LESSON CONTROLS & HEADER */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-gold-500/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gold-500/15">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-gold-400">
                      المحاضرة رقم {activeLesson?.order || 1} من {course.lessons.length}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-gray-400 font-mono">{activeLesson?.duration}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {activeLesson?.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mark as Completed Button */}
                  {activeLesson && (
                    <button
                      onClick={() => toggleLessonComplete(activeLesson.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        completedLessonIds.includes(activeLesson.id)
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-dark-850 text-gray-300 hover:text-white border border-gold-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {completedLessonIds.includes(activeLesson.id) ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      <span>
                        {completedLessonIds.includes(activeLesson.id) ? "تمت مشاهدة الدرس ✓" : "تحديد كمكتمل"}
                      </span>
                    </button>
                  )}

                  {/* Prev / Next buttons */}
                  {prevLesson && (
                    <ActionIconButton
                      icon="arrow_forward"
                      label="الدرس السابق"
                      variant="neutral"
                      size="sm"
                      onClick={() => setActiveLesson(prevLesson)}
                    />
                  )}
                  {nextLesson && (
                    <ActionIconButton
                      icon="arrow_back"
                      label="الدرس التالي"
                      variant="neutral"
                      size="sm"
                      onClick={() => setActiveLesson(nextLesson)}
                    />
                  )}
                </div>
              </div>

              {/* Lesson Description */}
              <div className="py-4 text-xs md:text-sm text-gray-300 leading-relaxed">
                {activeLesson?.description}
              </div>

              {/* Lesson Resources & Attachments */}
              {activeLesson?.resources && activeLesson.resources.length > 0 && (
                <div className="pt-4 border-t border-gold-500/10">
                  <h4 className="text-xs font-bold text-gold-300 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                    <span>ملحقات وملفات العمل المفتوحة للدرس:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {activeLesson.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-gold-500/20 text-xs text-gray-200 hover:text-gold-300 transition-all flex items-center gap-2 group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-gold-400 group-hover:scale-110 transition-transform">
                          {res.type === "code" ? "terminal" : res.type === "pdf" ? "picture_as_pdf" : "download"}
                        </span>
                        <span>{res.name}</span>
                        <span className="material-symbols-outlined text-[14px] text-gray-500">open_in_new</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ================= 3. CORE REQUIREMENT: PRACTICAL ASSIGNMENT SUBMISSION & TRACKING ================= */}
            {activeLesson?.hasAssignment && activeLesson.assignment ? (
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-dark-900 to-dark-900/90 border-2 border-gold-500/40 shadow-2xl relative">
                
                {/* Assignment Top Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gold-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[28px]">assignment_turned_in</span>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                        <span>التكليف العملي الإلزامي للدرس</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gold-400 font-mono">الدرجة: {activeLesson.assignment.maxScore} نقطة</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {activeLesson.assignment.title}
                      </h3>
                    </div>
                  </div>

                  {/* Submission Status Badge */}
                  <div>
                    {currentSubmission ? (
                      currentSubmission.status === "graded" ? (
                        <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>تم الاعتماد والتقييم: {currentSubmission.score}/100</span>
                        </div>
                      ) : currentSubmission.status === "needs_revision" ? (
                        <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">error</span>
                          <span>مطلوب تعديلات وإعادة تسليم</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                          <span className="material-symbols-outlined text-[18px] animate-pulse">hourglass_top</span>
                          <span>قيد المراجعة والتدقيق بواسطة الإدارة</span>
                        </div>
                      )
                    ) : (
                      <div className="px-3.5 py-1.5 rounded-xl bg-dark-850 border border-gold-500/20 text-gray-400 text-xs font-semibold">
                        لم يتم التسليم بعد
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructions & Requirements */}
                <div className="py-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                      شروط وتفاصيل التكليف:
                    </h4>
                    <p className="text-xs md:text-sm text-gray-200 leading-relaxed bg-dark-950/60 p-4 rounded-2xl border border-gold-500/15">
                      {activeLesson.assignment.instructions}
                    </p>
                  </div>

                  {/* Deliverable Type */}
                  <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center gap-2.5 text-xs text-gold-200">
                    <span className="material-symbols-outlined text-[18px] text-gold-400">info</span>
                    <span><strong>صيغة التسليم المطلوبة:</strong> {activeLesson.assignment.deliverableType}</span>
                  </div>

                  {/* Requirements Checklist */}
                  {activeLesson.assignment.requirements && activeLesson.assignment.requirements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 mb-2.5">
                        معايير قبول التكليف من المشرف:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                        {activeLesson.assignment.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-dark-850/80 border border-gold-500/10">
                            <span className="material-symbols-outlined text-emerald-400 text-[16px] shrink-0">check_circle</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ================= INSTRUCTOR FEEDBACK SECTION (IF GRADED OR REVISION) ================= */}
                {currentSubmission && currentSubmission.instructorFeedback && (
                  <div className="mb-6 p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-gray-100 shadow-lg">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gold-button-gradient text-dark-950 flex items-center justify-center font-bold text-xs">
                          SA
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            ملاحظات وتقييم المشرف: {currentSubmission.reviewedBy || "المهندس نديم (Super Admin)"}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            بتاريخ: {new Date(currentSubmission.reviewedAt || "").toLocaleString("ar-EG")}
                          </div>
                        </div>
                      </div>

                      {currentSubmission.score !== undefined && (
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block">الدرجة الممنوحة:</span>
                          <span className="text-xl font-black text-gold-300 font-mono">
                            {currentSubmission.score} / 100
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs md:text-sm text-amber-100 leading-relaxed whitespace-pre-line bg-dark-950/40 p-4 rounded-xl border border-amber-500/20">
                      {currentSubmission.instructorFeedback}
                    </div>
                  </div>
                )}

                {/* ================= STUDENT SUBMISSION BOX OR REVIEW PREVIEW ================= */}
                {currentSubmission && !isEditMode ? (
                  <div className="p-5 rounded-2xl bg-dark-950/80 border border-gold-500/20">
                    <div className="flex items-center justify-between pb-3 border-b border-gold-500/15 mb-4">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block">
                          لقد قمت بتسليم هذا التكليف بتاريخ {new Date(currentSubmission.submittedAt).toLocaleString("ar-EG")}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          بواسطة: {currentSubmission.studentName} ({currentSubmission.studentEmail})
                        </span>
                      </div>

                      <button
                        onClick={() => setIsEditMode(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gold-300 border border-gold-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span>{currentSubmission.status === "needs_revision" ? "تعديل وإعادة تسليم" : "تحديث الروابط"}</span>
                      </button>
                    </div>

                    {/* Student Notes Display */}
                    <div className="mb-4">
                      <span className="text-[11px] text-gray-400 block mb-1">ملاحظاتك وشرح العمل:</span>
                      <p className="text-xs text-gray-200 bg-dark-900 p-3 rounded-xl border border-gold-500/10 whitespace-pre-line">
                        {currentSubmission.studentNotes}
                      </p>
                    </div>

                    {/* Submitted Links Display */}
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-2">روابط العمل المسلمة:</span>
                      <div className="space-y-2">
                        {currentSubmission.submissionLinks.map((link, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-dark-900 border border-gold-500/15 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="material-symbols-outlined text-gold-400 text-[18px] shrink-0">link</span>
                              <span className="font-semibold text-gray-200">{link.label}:</span>
                              <span className="text-gold-300 font-mono text-[11px] truncate max-w-xs">{link.url}</span>
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-gold-500/15 text-gold-300 hover:bg-gold-500/25 transition-all text-xs font-bold flex items-center gap-1 shrink-0"
                            >
                              <span>معاينة الرابط</span>
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SUBMISSION FORM */
                  <form onSubmit={handleAssignmentSubmit} className="space-y-5">
                    {submitSuccessToast && (
                      <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>تم تسليم التكليف بنجاح للمراجعة! سيقوم السوبر أدمن بتدقيقه ورصد الملاحظات قريباً.</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-200 mb-2">
                        شرح وملاحظات إنجاز التكليف (Student Notes):
                      </label>
                      <textarea
                        rows={4}
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="اشرح باختصار كيف نفذت التكليف، ما هي الأدوات أو البرومبتات التي اعتمدت عليها، وأي تحديات واجهتك..."
                        className="w-full bg-dark-950 border border-gold-500/30 rounded-2xl p-4 text-xs md:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all leading-relaxed"
                        required
                      />
                    </div>

                    {/* Links Inputs */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-200">
                          روابط تسليم العمل (Google Drive / Figma / GitHub / Behance / YouTube):
                        </label>
                        <button
                          type="button"
                          onClick={handleAddLink}
                          className="text-[11px] text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          <span>إضافة رابط إضافي</span>
                        </button>
                      </div>

                      {submissionLinks.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => handleLinkChange(idx, "label", e.target.value)}
                            placeholder="وصف الرابط (مثلاً: مجلد درايف للمشروع)"
                            className="w-1/3 bg-dark-950 border border-gold-500/25 rounded-xl py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-gold-500"
                          />
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="flex-1 bg-dark-950 border border-gold-500/25 rounded-xl py-2 px-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-gold-500"
                            required
                          />
                          {submissionLinks.length > 1 && (
                            <ActionIconButton
                              icon="delete"
                              label="حذف هذا الرابط"
                              variant="danger"
                              size="xs"
                              onClick={() => handleRemoveLink(idx)}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Student Info Notice */}
                    <div className="p-3 rounded-xl bg-dark-950/60 border border-gold-500/15 flex items-center justify-between text-[11px] text-gray-400">
                      <div>
                        <span>التسليم باسم: </span>
                        <strong className="text-white">{currentUser?.fullName || "حساب تجريبي / طالب زائر"}</strong>
                        <span> ({currentUser?.email || "talent@render.ps"})</span>
                      </div>
                      <span className="text-gold-400">حفظ فوري في منصة ريندر</span>
                    </div>

                    {/* Action Submit Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3.5 px-6 rounded-2xl gold-button-gradient text-dark-950 font-bold text-xs md:text-sm shadow-xl shadow-gold-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                            <span>جاري إرسال التكليف للمنصة...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            <span>{isEditMode ? "حفظ التعديلات وإعادة الإرسال" : "تسليم التكليف للاعتماد والتقييم"}</span>
                          </>
                        )}
                      </button>

                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="py-3.5 px-5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-gray-300 font-bold text-xs"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                )}

              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-dark-900 border border-gold-500/15 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-gold-400 text-[18px]">info</span>
                <span>هذا الدرس لا يتطلب تكليفاً عملياً. يمكنك التركيز على الاستيعاب النظري وتطبيق الملاحظات.</span>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR (PLAYLIST, ASSIGNMENTS, INSTRUCTOR) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Course Progress Card */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-gold-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-300">إنجازك في الدورة:</span>
                <span className="text-xs font-black text-gold-400 font-mono">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-dark-950 overflow-hidden mb-4 border border-gold-500/15">
                <div
                  className="h-full gold-button-gradient transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>{completedLessonIds.length} من {course.lessons.length} مكتملة</span>
                <span>{courseSubmissions.filter((s) => s.studentId === currentUser?.id).length} تكليفات مسلمة</span>
              </div>
            </div>

            {/* Sidebar Tabs Switcher */}
            <div className="flex rounded-2xl bg-dark-900 p-1 border border-gold-500/20 text-xs font-semibold">
              <button
                onClick={() => setSidebarTab("playlist")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  sidebarTab === "playlist"
                    ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                الدروس ({course.lessons.length})
              </button>
              <button
                onClick={() => setSidebarTab("assignments")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  sidebarTab === "assignments"
                    ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                التكليفات
              </button>
              <button
                onClick={() => setSidebarTab("instructor")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  sidebarTab === "instructor"
                    ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                عن المدرب
              </button>
            </div>

            {/* TAB 1: PLAYLIST */}
            {sidebarTab === "playlist" && (
              <div className="space-y-2.5">
                {course.lessons.map((lesson, idx) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);
                  const sub = currentUser
                    ? getStudentSubmissionForLesson(course.id, lesson.id, currentUser.id)
                    : undefined;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? "bg-gold-500/15 border-gold-500/50 shadow-md text-white"
                          : "bg-dark-900 border-gold-500/15 hover:border-gold-500/35 text-gray-300"
                      }`}
                    >
                      {/* Checkbox / Number */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonComplete(lesson.id);
                        }}
                        className="mt-0.5 shrink-0"
                      >
                        <span className={`material-symbols-outlined text-[20px] ${isDone ? "text-emerald-400" : "text-gray-500 hover:text-gold-400"}`}>
                          {isDone ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono text-gray-400">
                            درس #{idx + 1} • {lesson.duration}
                          </span>
                          {lesson.hasAssignment && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              تكليف عملي
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold leading-snug line-clamp-2">
                          {lesson.title}
                        </h4>

                        {/* Submission status pill in lesson row */}
                        {sub && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px]">
                            {sub.status === "graded" && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">verified</span>
                                <span>تم الاعتماد ({sub.score}/100)</span>
                              </span>
                            )}
                            {sub.status === "needs_revision" && (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">priority_high</span>
                                <span>مطلوب تعديلات</span>
                              </span>
                            )}
                            {sub.status === "pending" && (
                              <span className="text-blue-400 font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
                                <span>قيد المراجعة</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: ALL ASSIGNMENTS OVERVIEW */}
            {sidebarTab === "assignments" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  <div className="font-bold mb-1">نظام المتابعة والتصحيح المباشر:</div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    جميع التكليفات يتم مراجعتها وتصحيحها من قبل السوبر أدمن مع رصد الدرجات والتوجيهات المباشرة.
                  </p>
                </div>

                {course.lessons
                  .filter((l) => l.hasAssignment && l.assignment)
                  .map((lesson) => {
                    const sub = currentUser
                      ? getStudentSubmissionForLesson(course.id, lesson.id, currentUser.id)
                      : undefined;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                          <span>{lesson.title}</span>
                          <span className="font-mono text-gold-400">{lesson.assignment?.maxScore} نقطة</span>
                        </div>
                        <h5 className="text-xs font-bold text-white mb-2">{lesson.assignment?.title}</h5>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">الحالة:</span>
                          {sub ? (
                            sub.status === "graded" ? (
                              <span className="text-xs font-bold text-emerald-400">معتمد ({sub.score}/100)</span>
                            ) : sub.status === "needs_revision" ? (
                              <span className="text-xs font-bold text-amber-400">مطلوب تعديلات</span>
                            ) : (
                              <span className="text-xs font-bold text-blue-400">قيد التدقيق</span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-gray-500">لم يُسلّم</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* TAB 3: INSTRUCTOR & CERTIFICATION */}
            {sidebarTab === "instructor" && (
              <div className="p-6 rounded-3xl bg-dark-900 border border-gold-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl gold-button-gradient text-dark-950 font-bold flex items-center justify-center text-lg shadow-md">
                    {course.instructor.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                    <p className="text-xs text-gold-400">{course.instructor.title}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pt-2 border-t border-gold-500/10">
                  {course.instructor.bio}
                </p>

                <div className="p-4 rounded-2xl bg-dark-950/80 border border-gold-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gold-300">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>شهادة إتمام معتمدة:</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    تُمنح الشهادة الرقمية المعتمدة مع توثيق السوبر أدمن بعد تسليم كافة التكليفات وحصولها على تقييم 70% فأعلى.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

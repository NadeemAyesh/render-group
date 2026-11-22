"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCourses,
  saveCourse,
  deleteCourse,
  toggleCourseStatus,
  getSubmissions,
  reviewAssignment,
  Course,
  CourseLesson,
  AssignmentSubmission,
  CourseCategory,
  CourseLevel,
  COURSE_CATEGORIES,
  LEVEL_LABELS,
  getYoutubeEmbedUrl,
  getYoutubeVideoId,
  resetAllCoursesData,
} from "@/lib/courses-service";
import { AuthUser } from "@/lib/auth-service";
import {
  ActionIcon,
  ActionIconButton,
  actionIconButtonClass,
} from "@/components/ui/ActionIconButton";

interface CoursesAdminSectionProps {
  currentUser: AuthUser | null;
}

export const CoursesAdminSection: React.FC<CoursesAdminSectionProps> = ({ currentUser }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [innerTab, setInnerTab] = useState<"courses" | "submissions">("courses");

  // Filter States
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>("ALL");
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<string>("ALL");
  const [submissionCourseFilter, setSubmissionCourseFilter] = useState<string>("ALL");
  const [submissionSearchQuery, setSubmissionSearchQuery] = useState("");

  // Modals
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);

  // Review Form
  const [reviewScore, setReviewScore] = useState<number>(85);
  const [reviewStatus, setReviewStatus] = useState<"graded" | "needs_revision" | "rejected">("graded");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // New / Edit Course Form State
  const [isEditing, setIsEditing] = useState(false);
  const [courseIdToEdit, setCourseIdToEdit] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState<CourseCategory>("motion");
  const [formLevel, setFormLevel] = useState<CourseLevel>("intermediate");
  const [formThumbnail, setFormThumbnail] = useState("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80");
  const [formDuration, setFormDuration] = useState("16 ساعة تدريبية");
  const [formInstructorName, setFormInstructorName] = useState(currentUser?.fullName || "م. حمزة رضوان");
  const [formInstructorTitle, setFormInstructorTitle] = useState("كبير مخرجي الرسوم والموشن جرافيك في Render Group");
  const [formInstructorAvatar, setFormInstructorAvatar] = useState("SA");
  const [formInstructorBio, setFormInstructorBio] = useState("خبير معتمد ومخرج تقني في Render Group يشرف على تدقيق الأعمال وتوجيه المواهب.");
  const [formPrerequisites, setFormPrerequisites] = useState("معرفة أساسية بمجال التخصص, جهاز حاسوب متصل بالإنترنت");
  const [formWhatYouLearn, setFormWhatYouLearn] = useState("إتقان الأدوات الاحترافية, إنتاج مشاريع كاملة للبورتفوليو, اقتناص العقود الدولية");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "DRAFT">("ACTIVE");

  // Form Lessons Builder
  const [formLessons, setFormLessons] = useState<
    Array<{
      id: string;
      title: string;
      youtubeUrl: string;
      duration: string;
      description: string;
      hasAssignment: boolean;
      assignmentTitle: string;
      assignmentInstructions: string;
      assignmentMaxScore: number;
      assignmentDeliverableType: string;
      requirementsText: string;
    }>
  >([
    {
      id: "les-new-1",
      title: "المحاضرة 1: مدخل تطبيقي وتأسيس المشروع",
      youtubeUrl: "https://www.youtube.com/watch?v=fBNz54PJRnc",
      duration: "25 دقيقة",
      description: "شرح شامل للخطوات المنهجية وتحليل متطلبات العمل.",
      hasAssignment: true,
      assignmentTitle: "التكليف 1: إعداد ملف العمل الأولي ورفع خطة المشروع",
      assignmentInstructions: "المطلوب تطبيق النقاط المشروحة في الفيديو ورفع رابط المشروع للمراجعة.",
      assignmentMaxScore: 100,
      assignmentDeliverableType: "رابط Google Drive / GitHub / Figma",
      requirementsText: "تطبيق كافة المعايير المشروحة, ملف منظم ونظيف, رابط متاح للمعاينة",
    },
  ]);

  const refreshData = () => {
    setCourses(getCourses());
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    refreshData();
    const handleCoursesChange = () => refreshData();
    const handleSubmissionsChange = () => refreshData();

    window.addEventListener("renderlancer_courses_change", handleCoursesChange);
    window.addEventListener("renderlancer_submissions_change", handleSubmissionsChange);

    return () => {
      window.removeEventListener("renderlancer_courses_change", handleCoursesChange);
      window.removeEventListener("renderlancer_submissions_change", handleSubmissionsChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  // Open Review Modal
  const handleOpenReview = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setReviewScore(submission.score ?? 85);
    setReviewStatus(submission.status === "pending" ? "graded" : submission.status);
    setReviewFeedback(
      submission.instructorFeedback ||
        "عمل متقن ومطابق للشروط، تم تدقيق المشروع واعتماده بنجاح من قبل إدارة المنصة."
    );
    setIsReviewModalOpen(true);
  };

  // Save Review / Grade
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const reviewer = currentUser?.fullName || "المهندس نديم (Super Admin)";
    reviewAssignment(selectedSubmission.id, {
      status: reviewStatus,
      score: reviewStatus === "graded" ? Number(reviewScore) : undefined,
      feedback: reviewFeedback.trim(),
      reviewerName: reviewer,
    });

    setIsReviewModalOpen(false);
    setSelectedSubmission(null);
    refreshData();
    showToast("تم حفظ تقييم التكليف وإرسال الملاحظات للطالب بنجاح!");
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCourseIdToEdit(null);
    setFormTitle("");
    setFormShortDesc("");
    setFormDesc("");
    setFormCategory("motion");
    setFormLevel("intermediate");
    setFormDuration("16 ساعة تدريبية");
    setFormThumbnail("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80");
    setFormInstructorName(currentUser?.fullName || "م. حمزة رضوان");
    setFormInstructorTitle("كبير مخرجي الرسوم في Render Group");
    setFormInstructorAvatar("SA");
    setFormLessons([
      {
        id: `les-${Date.now()}-1`,
        title: "المحاضرة 1: مقدمة وأسس المهارة العملية",
        youtubeUrl: "https://www.youtube.com/watch?v=fBNz54PJRnc",
        duration: "30 دقيقة",
        description: "شرح تطبيقي مباشر عبر يوتيوب لكافة المفاهيم الأساسية وتطبيقاتها.",
        hasAssignment: true,
        assignmentTitle: "التكليف 1: التطبيق العملي للدرس ورفع المشروع",
        assignmentInstructions: "قم بتنفيذ الخطوات المشروحة في المحاضرة وسلّم رابط العمل.",
        assignmentMaxScore: 100,
        assignmentDeliverableType: "رابط Google Drive أو Figma أو GitHub",
        requirementsText: "تنفيذ المطلوب بدقة, دقة عالية في الإخراج, ملفات عمل منظمة",
      },
    ]);
    setIsAddCourseModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (c: Course) => {
    setIsEditing(true);
    setCourseIdToEdit(c.id);
    setFormTitle(c.title);
    setFormShortDesc(c.shortDescription);
    setFormDesc(c.description);
    setFormCategory(c.category);
    setFormLevel(c.level);
    setFormThumbnail(c.thumbnail);
    setFormDuration(c.duration);
    setFormInstructorName(c.instructor.name);
    setFormInstructorTitle(c.instructor.title);
    setFormInstructorAvatar(c.instructor.avatar);
    setFormInstructorBio(c.instructor.bio);
    setFormPrerequisites(c.prerequisites.join(", "));
    setFormWhatYouLearn(c.whatYouWillLearn.join(", "));
    setFormStatus(c.status === "ACTIVE" ? "ACTIVE" : "DRAFT");

    setFormLessons(
      c.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        youtubeUrl: l.youtubeUrl,
        duration: l.duration,
        description: l.description,
        hasAssignment: l.hasAssignment,
        assignmentTitle: l.assignment?.title || "تكليف تطبيقي",
        assignmentInstructions: l.assignment?.instructions || "",
        assignmentMaxScore: l.assignment?.maxScore || 100,
        assignmentDeliverableType: l.assignment?.deliverableType || "رابط Google Drive / GitHub / Figma",
        requirementsText: (l.assignment?.requirements || []).join(", "),
      }))
    );

    setIsAddCourseModalOpen(true);
  };

  // Add lesson to form
  const handleAddLessonToForm = () => {
    setFormLessons([
      ...formLessons,
      {
        id: `les-${Date.now()}-${formLessons.length + 1}`,
        title: `المحاضرة ${formLessons.length + 1}: تفاصيل متقدمة وتطبيق عملي`,
        youtubeUrl: "https://www.youtube.com/watch?v=k3_tw44QsZQ",
        duration: "30 دقيقة",
        description: "متابعة الشرح وتوضيح كيفية تفادي الأخطاء الشائعة.",
        hasAssignment: true,
        assignmentTitle: `التكليف ${formLessons.length + 1}: تسليم ملفات المرحلة`,
        assignmentInstructions: "المطلوب تسليم مخرجات هذه المحاضرة للمراجعة وتحديد الملاحظات.",
        assignmentMaxScore: 100,
        assignmentDeliverableType: "رابط Google Drive / GitHub / Figma",
        requirementsText: "تسليم الروابط المباشرة, مخرجات عالية الجودة",
      },
    ]);
  };

  const handleRemoveLessonFromForm = (index: number) => {
    setFormLessons(formLessons.filter((_, i) => i !== index));
  };

  // Save Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("يرجى إدخال عنوان الدورة");
      return;
    }

    const builtLessons: CourseLesson[] = formLessons.map((l, idx) => ({
      id: l.id || `les-${Date.now()}-${idx + 1}`,
      order: idx + 1,
      title: l.title.trim() || `المحاضرة ${idx + 1}`,
      description: l.description.trim() || "شرح تفصيلي للمحاضرة عبر يوتيوب.",
      youtubeUrl: l.youtubeUrl.trim(),
      duration: l.duration.trim() || "30 دقيقة",
      hasAssignment: l.hasAssignment,
      assignment: l.hasAssignment
        ? {
            id: `asg-${l.id}`,
            title: l.assignmentTitle.trim() || `تكليف المحاضرة ${idx + 1}`,
            instructions: l.assignmentInstructions.trim() || "المطلوب تطبيق الدرس وتسليم الرابط.",
            maxScore: Number(l.assignmentMaxScore) || 100,
            passingScore: 70,
            deliverableType: l.assignmentDeliverableType.trim() || "رابط Google Drive / Figma / GitHub",
            requirements: l.requirementsText
              ? l.requirementsText.split(",").map((r) => r.trim()).filter(Boolean)
              : ["تسليم العمل بجودة عالية", "رابط متاح للمعاينة بدون قيود"],
          }
        : undefined,
    }));

    const courseToSave: Course = {
      id: isEditing && courseIdToEdit ? courseIdToEdit : `course-${Date.now()}`,
      slug: (isEditing && courseIdToEdit ? courseIdToEdit : formTitle)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .slice(0, 40),
      title: formTitle.trim(),
      shortDescription: formShortDesc.trim() || "دورة عملية معتمدة على منصة RenderLancer مع تكليفات متابعة مباشرة.",
      description: formDesc.trim() || formShortDesc.trim() || "دورة عملية مكثفة تركز على المهارات المطلوبة في سوق العمل وتطبيقات الذكاء الاصطناعي.",
      category: formCategory,
      level: formLevel,
      thumbnail: formThumbnail.trim() || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
      duration: formDuration.trim() || "12 ساعة تدريبية",
      lessonsCount: builtLessons.length,
      status: formStatus,
      instructor: {
        name: formInstructorName.trim() || "م. حمزة رضوان",
        title: formInstructorTitle.trim() || "مدرب معتمد في Render Group",
        avatar: formInstructorAvatar.trim() || "SA",
        bio: formInstructorBio.trim() || "مدرب خبير يشرف على برامج التدريب والتكليفات المباشرة.",
      },
      prerequisites: formPrerequisites.split(",").map((p) => p.trim()).filter(Boolean),
      whatYouWillLearn: formWhatYouLearn.split(",").map((w) => w.trim()).filter(Boolean),
      certificationIncluded: true,
      lessons: builtLessons,
      enrolledCount: isEditing && courseIdToEdit ? (courses.find((c) => c.id === courseIdToEdit)?.enrolledCount || 85) : 1,
      rating: 5.0,
      reviewsCount: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveCourse(courseToSave);
    setIsAddCourseModalOpen(false);
    refreshData();
    showToast(isEditing ? "تم تحديث بيانات الدورة والدروس بنجاح!" : "تمت إضافة الدورة الجديدة مع دروس اليوتيوب والتكليفات بنجاح!");
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    toggleCourseStatus(id);
    refreshData();
    showToast("تم تحديث حالة الدورة بنجاح!");
  };

  // Delete Course
  const handleDeleteCourse = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من حذف دورة "${title}" وجميع دروسها وتكليفاتها؟`)) {
      const success = deleteCourse(id);
      if (success) {
        refreshData();
        showToast("تم حذف الدورة بنجاح من المنصة.");
      } else {
        showToast("حدث خطأ أثناء حذف الدورة، حاول مرة أخرى.");
      }
    }
  };

  // Submissions Filtering
  const pendingSubmissionsCount = submissions.filter((s) => s.status === "pending").length;

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionStatusFilter !== "ALL" && s.status !== submissionStatusFilter) return false;
    if (submissionCourseFilter !== "ALL" && s.courseId !== submissionCourseFilter) return false;
    if (submissionSearchQuery.trim()) {
      const q = submissionSearchQuery.toLowerCase();
      const matchStudent = s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q);
      const matchAssignment = s.assignmentTitle.toLowerCase().includes(q) || s.lessonTitle.toLowerCase().includes(q);
      if (!matchStudent && !matchAssignment) return false;
    }
    return true;
  });

  const filteredCourses = courses.filter((c) => {
    if (courseCategoryFilter !== "ALL" && c.category !== courseCategoryFilter) return false;
    if (courseSearchQuery.trim()) {
      const q = courseSearchQuery.toLowerCase();
      const match = c.title.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Banner & Inner Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-dark-900 border border-gold-500/25">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gold-button-gradient text-dark-950 flex items-center justify-center font-bold shadow-md shadow-gold-500/20">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white">إدارة الأكاديمية والدورات وتصحيح التكليفات</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">إضافة دورات اليوتيوب، تخصيص الدروس، والتحكم التام في تصحيح ومتابعة التكليفات.</p>
          </div>
        </div>

        {/* Tab Switcher & Quick Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-2xl bg-dark-950 p-1 border border-gold-500/20 text-xs font-bold">
            <button
              onClick={() => setInnerTab("courses")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                innerTab === "courses"
                  ? "bg-gold-500 text-dark-950 font-bold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">video_library</span>
              <span>الدورات التدريبية ({courses.length})</span>
            </button>

            <button
              onClick={() => setInnerTab("submissions")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 relative ${
                innerTab === "submissions"
                  ? "bg-gold-500 text-dark-950 font-bold shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
              <span>متابعة وتصحيح التكليفات</span>
              {pendingSubmissionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono animate-pulse">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>
          </div>

          {innerTab === "courses" && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>إضافة دورة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-dark-900 border border-gold-500/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-gold-400 text-[22px]">movie_filter</span>
          <div>
            <div className="text-lg font-black text-white font-mono">{courses.length}</div>
            <div className="text-[10px] text-gray-400 font-semibold">إجمالي الدورات</div>
            <div className="text-[10px] text-emerald-400">{courses.filter((c) => c.status === "ACTIVE").length} نشطة</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-dark-900 border border-blue-500/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-400 text-[22px]">smart_display</span>
          <div>
            <div className="text-lg font-black text-blue-300 font-mono">{courses.reduce((acc, c) => acc + c.lessons.length, 0)}</div>
            <div className="text-[10px] text-gray-400 font-semibold">محاضرة يوتيوب</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-dark-900 border border-amber-500/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-400 text-[22px]">pending_actions</span>
          <div>
            <div className="text-lg font-black text-amber-300 font-mono">{pendingSubmissionsCount}</div>
            <div className="text-[10px] text-gray-400 font-semibold">تكليف بانتظار التصحيح</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-dark-900 border border-emerald-500/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-[22px]">verified</span>
          <div>
            <div className="text-lg font-black text-emerald-300 font-mono">{submissions.filter((s) => s.status === "graded").length}</div>
            <div className="text-[10px] text-gray-400 font-semibold">تكليف معتمد</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INNER TAB 1: COURSES MANAGEMENT & YOUTUBE BUILDER */}
      {/* ========================================================================= */}
      {innerTab === "courses" && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute right-3.5 top-2.5 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="ابحث عن دورة أو اسم المحاضر..."
                className="w-full bg-dark-950 border border-gold-500/25 rounded-xl py-2 pr-10 pl-4 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">التصنيف:</span>
              <button
                onClick={() => setCourseCategoryFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  courseCategoryFilter === "ALL"
                    ? "bg-gold-500 text-dark-950 font-bold"
                    : "bg-dark-950 text-gray-400 border border-gold-500/15"
                }`}
              >
                الكل
              </button>
              {Object.values(COURSE_CATEGORIES).map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCourseCategoryFilter(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    courseCategoryFilter === cat.key
                      ? "bg-gold-500 text-dark-950 font-bold"
                      : "bg-dark-950 text-gray-400 border border-gold-500/15"
                  }`}
                >
                  {cat.ar}
                </button>
              ))}
            </div>

          </div>

          {/* Courses Compact Table */}
          <div className="rounded-2xl border border-gold-500/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-dark-900 border-b border-gold-500/15 px-4 py-2.5 grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>الدورة</span>
              <span className="text-center">المحاضرات / التكليفات</span>
              <span className="text-center">الحالة</span>
              <span className="text-center">المدرب</span>
              <span className="text-center">إجراءات</span>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-dark-900/50">
                <span className="material-symbols-outlined text-[36px] text-gray-600 block mb-2">school</span>
                <p className="text-xs text-gray-500">لا توجد دورات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className="divide-y divide-gold-500/10">
                {filteredCourses.map((c) => {
                  const cat = COURSE_CATEGORIES[c.category] || COURSE_CATEGORIES.motion;
                  const asgsCount = c.lessons.filter((l) => l.hasAssignment).length;
                  return (
                    <div
                      key={c.id}
                      className="px-4 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center bg-dark-900 hover:bg-dark-850 transition-colors group"
                    >
                      {/* Course Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-gold-500/20"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate leading-tight mb-0.5">{c.title}</p>
                          <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${cat.badgeClass}`}>
                            {cat.ar}
                          </span>
                        </div>
                      </div>

                      {/* Counts */}
                      <div className="text-center">
                        <span className="text-xs font-mono font-bold text-gold-300">{c.lessons.length}</span>
                        <span className="text-[10px] text-gray-500 block">فيديو</span>
                        <span className="text-[10px] font-mono font-bold text-amber-300">{asgsCount} تكليف</span>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <span
                          className={`inline-block text-[9px] px-2 py-0.5 rounded-full border font-bold font-mono ${
                            c.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {c.status === "ACTIVE" ? "منشورة" : "مسودة"}
                        </span>
                      </div>

                      {/* Instructor */}
                      <div className="text-center min-w-0">
                        <p className="text-[10px] text-gray-300 truncate font-semibold">{c.instructor.name.split("(")[0].trim()}</p>
                        <p className="text-[9px] text-gray-500 truncate">{c.instructor.title.slice(0, 24)}…</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Link
                          href={`/courses/${c.id}`}
                          target="_blank"
                          title="معاينة"
                          aria-label="معاينة"
                          className={actionIconButtonClass("neutral", "xs")}
                        >
                          <ActionIcon icon="visibility" size="xs" />
                        </Link>

                        <ActionIconButton
                          icon={c.status === "ACTIVE" ? "unpublished" : "publish"}
                          label={c.status === "ACTIVE" ? "تحويل لمسودة" : "نشر للعامة"}
                          variant={c.status === "ACTIVE" ? "warning" : "success"}
                          size="xs"
                          onClick={() => handleToggleStatus(c.id)}
                        />

                        <ActionIconButton
                          icon="edit"
                          label="تعديل"
                          variant="gold"
                          size="xs"
                          onClick={() => handleOpenEditModal(c)}
                        />

                        <ActionIconButton
                          icon="delete"
                          label="حذف الدورة"
                          variant="danger"
                          size="xs"
                          onClick={(e) => handleDeleteCourse(e, c.id, c.title)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INNER TAB 2: ASSIGNMENTS REVIEW & GRADING HUB */}
      {/* ========================================================================= */}
      {innerTab === "submissions" && (
        <div className="space-y-6">
          
          {/* Submissions Filters */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute right-3.5 top-2.5 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={submissionSearchQuery}
                onChange={(e) => setSubmissionSearchQuery(e.target.value)}
                placeholder="ابحث باسم الطالب، البريد، أو عنوان التكليف..."
                className="w-full bg-dark-950 border border-gold-500/25 rounded-xl py-2 pr-10 pl-4 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Filter by Course */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">الدورة:</span>
              <select
                value={submissionCourseFilter}
                onChange={(e) => setSubmissionCourseFilter(e.target.value)}
                className="bg-dark-950 border border-gold-500/25 rounded-xl py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-gold-500"
              >
                <option value="ALL">كافة الدورات التدريبية ({courses.length})</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "ALL", label: "كافة التكليفات" },
                { id: "pending", label: `قيد التدقيق (${pendingSubmissionsCount})` },
                { id: "graded", label: "تم الاعتماد" },
                { id: "needs_revision", label: "مطلوب تعديلات" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSubmissionStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    submissionStatusFilter === st.id
                      ? "bg-gold-500 text-dark-950 font-bold"
                      : "bg-dark-950 text-gray-400 border border-gold-500/15"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-dark-900 border border-gold-500/15 text-center">
              <div className="w-14 h-14 rounded-2xl bg-dark-850 border border-gold-500/20 flex items-center justify-center text-gray-400 mx-auto mb-3">
                <span className="material-symbols-outlined text-[28px]">assignment_turned_in</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">لا توجد تكليفات تطابق الفلتر الحالي</h4>
              <p className="text-xs text-gray-400">يمكنك تغيير الفلتر أو انتظار قيام الطلاب برفع التكليفات في المنصة.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-6 rounded-3xl bg-dark-900 border border-gold-500/20 hover:border-gold-500/40 transition-all shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gold-500/15">
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl gold-button-gradient text-dark-950 font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        {sub.studentAvatar || "ط"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{sub.studentName}</h4>
                          <span className="text-[11px] text-gray-400 font-mono">({sub.studentEmail})</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          تاريخ التسليم: <span className="text-gold-300 font-mono">{new Date(sub.submittedAt).toLocaleString("ar-EG")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Review Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      {sub.status === "graded" && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>معتمد ({sub.score}/100)</span>
                        </div>
                      )}
                      {sub.status === "needs_revision" && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">priority_high</span>
                          <span>مطلوب تعديلات</span>
                        </div>
                      )}
                      {sub.status === "pending" && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                          <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                          <span>قيد المراجعة</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenReview(sub)}
                        className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shadow-md shadow-gold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">rate_review</span>
                        <span>{sub.status === "pending" ? "تصحيح ورصد التقييم" : "تعديل الملاحظات والدرجة"}</span>
                      </button>
                    </div>

                  </div>

                  {/* Course & Assignment Details */}
                  <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-gold-500/15 space-y-1">
                      <div className="text-gray-400">الدورة والمحاضرة:</div>
                      <div className="font-bold text-gold-300">{sub.courseTitle}</div>
                      <div className="text-gray-300">{sub.lessonTitle}</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-gold-500/15 space-y-1">
                      <div className="text-gray-400">عنوان التكليف المطلوب:</div>
                      <div className="font-bold text-white">{sub.assignmentTitle}</div>
                    </div>
                  </div>

                  {/* Student Submission Content */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block mb-1">
                        ملاحظات وشرح الطالب:
                      </span>
                      <p className="text-xs text-gray-200 bg-dark-950 p-3 rounded-xl border border-gold-500/15 leading-relaxed whitespace-pre-line">
                        {sub.studentNotes}
                      </p>
                    </div>

                    {/* Submitted Links */}
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block mb-1.5">
                        روابط التسليم للمعاينة المباشرة:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sub.submissionLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/25 text-xs text-gold-300 font-bold flex items-center gap-1.5 transition-all group"
                          >
                            <span className="material-symbols-outlined text-[16px] text-gold-400 group-hover:scale-110 transition-transform">
                              link
                            </span>
                            <span>{link.label}</span>
                            <span className="material-symbols-outlined text-[13px] text-gray-400">open_in_new</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Feedback if already reviewed */}
                    {sub.instructorFeedback && (
                      <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                        <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                          <span>ملاحظات المشرف المسجلة ({sub.reviewedBy || "Super Admin"}):</span>
                          {sub.score !== undefined && <span className="font-mono text-gold-400 font-bold">الدرجة: {sub.score}/100</span>}
                        </div>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {sub.instructorFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* REVIEW & GRADING MODAL */}
      {/* ========================================================================= */}
      {isReviewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-dark-900 border-2 border-gold-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-button-gradient text-dark-950 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">fact_check</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">تصحيح وتقييم تكليف الطالب</h3>
                  <p className="text-xs text-gray-400">
                    الطالب: <strong className="text-gold-300">{selectedSubmission.studentName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Quick Summary of Submission */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/15 space-y-2 text-xs">
              <div>
                <span className="text-gray-400">التكليف: </span>
                <strong className="text-white">{selectedSubmission.assignmentTitle}</strong>
              </div>
              <div>
                <span className="text-gray-400">شرح الطالب: </span>
                <p className="text-gray-200 mt-1 bg-dark-900 p-2.5 rounded-lg border border-gold-500/10">
                  {selectedSubmission.studentNotes}
                </p>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">الروابط المسلمة:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.submissionLinks.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-gold-500/15 text-gold-300 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{l.label}</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSaveReview} className="space-y-4">
              
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-2">
                  قرار المراجعة (Status):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewStatus("graded")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reviewStatus === "graded"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 font-black shadow-md"
                        : "bg-dark-950 text-gray-400 border-gold-500/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>اعتماد ونجاح</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewStatus("needs_revision")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reviewStatus === "needs_revision"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500 font-black shadow-md"
                        : "bg-dark-950 text-gray-400 border-gold-500/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">published_with_changes</span>
                    <span>طلب تعديلات</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewStatus("rejected")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      reviewStatus === "rejected"
                        ? "bg-red-500/20 text-red-300 border-red-500 font-black shadow-md"
                        : "bg-dark-950 text-gray-400 border-gold-500/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>رفض التكليف</span>
                  </button>
                </div>
              </div>

              {/* Score Input (Only if graded) */}
              {reviewStatus === "graded" && (
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-2">
                    الدرجة المستحقة من 100:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={reviewScore}
                      onChange={(e) => setReviewScore(Number(e.target.value))}
                      className="flex-1 accent-amber-500 cursor-pointer"
                    />
                    <div className="w-16 text-center font-mono font-black text-lg text-gold-400 bg-dark-950 py-1.5 rounded-xl border border-gold-500/30">
                      {reviewScore}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-2">
                  توجيهات وملاحظات المشرف للطالب (تظهر مباشرة في حسابه):
                </label>
                <textarea
                  rows={4}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="اكتب نقاط القوة في عمل الطالب، وما يمكن تحسينه، وتوجيهات الخطوة التالية..."
                  className="w-full bg-dark-950 border border-gold-500/30 rounded-2xl p-4 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500 leading-relaxed"
                  required
                />
              </div>

              {/* Reviewer Notice */}
              <div className="text-[11px] text-gray-400 flex items-center justify-between">
                <span>المشرف المعتمد: <strong className="text-white">{currentUser?.fullName || "Super Admin"}</strong></span>
                <span className="text-gold-400">تحديث فوري لملف الطالب</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-2xl gold-button-gradient text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  حفظ التقييم واعتماد النتيجة
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="py-3 px-5 rounded-2xl bg-dark-850 hover:bg-dark-800 text-gray-300 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT COURSE MODAL WITH YOUTUBE LESSONS BUILDER */}
      {/* ========================================================================= */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl bg-dark-900 border-2 border-gold-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-button-gradient text-dark-950 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">video_call</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isEditing ? "تعديل تفاصيل دورة ومحاضرات اليوتيوب" : "إضافة دورة تدريبية جديدة بـ YouTube والتكليفات"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    أدخل معلومات الدورة ثم أضف روابط محاضرات اليوتيوب وشروط التكليفات التابعة لها.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    عنوان الدورة التدريبية:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: دبلوم صناعة المحتوى المرئي والموشن جرافيك الإعلاني بالذكاء الاصطناعي"
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    التصنيف التخصصي:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CourseCategory)}
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  >
                    {Object.values(COURSE_CATEGORIES).map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    المستوى المستهدف:
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as CourseLevel)}
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم ومحترف</option>
                    <option value="all">كافة المستويات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    المدة التقديرية للدورة:
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="مثال: 18 ساعة تدريبية"
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    حالة النشر:
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "DRAFT")}
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="ACTIVE">نشطة ومتاحة في الكتالوج (ACTIVE)</option>
                    <option value="DRAFT">مسودة غير منشورة (DRAFT)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    رابط صورة الغلاف (Thumbnail URL):
                  </label>
                  <input
                    type="url"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl py-2.5 px-3.5 text-xs text-gray-100 font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    وصف مختصر للدورة (يظهر في البطاقة):
                  </label>
                  <textarea
                    rows={2}
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="نبذة سريعة تلخص أهداف الدورة وأهميتها..."
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl p-3 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    الوصف التفصيلي والمنهج:
                  </label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="شرح كامل لمحتوى الدورة والتطبيقات والمشاريع النهائية..."
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl p-3 text-xs text-gray-100 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Instructor Info */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-gold-500/20 space-y-4">
                <h4 className="text-xs font-bold text-gold-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>معلومات المحاضر أو المدرب:</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">اسم المدرب:</label>
                    <input
                      type="text"
                      value={formInstructorName}
                      onChange={(e) => setFormInstructorName(e.target.value)}
                      className="w-full bg-dark-900 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">المسمى المهني للمدرب:</label>
                    <input
                      type="text"
                      value={formInstructorTitle}
                      onChange={(e) => setFormInstructorTitle(e.target.value)}
                      className="w-full bg-dark-900 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* What you learn & prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    ماذا سيتعلم الطالب (افصل بفواصل):
                  </label>
                  <textarea
                    rows={2}
                    value={formWhatYouLearn}
                    onChange={(e) => setFormWhatYouLearn(e.target.value)}
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl p-2.5 text-xs text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1.5">
                    المتطلبات المسبقة (افصل بفواصل):
                  </label>
                  <textarea
                    rows={2}
                    value={formPrerequisites}
                    onChange={(e) => setFormPrerequisites(e.target.value)}
                    className="w-full bg-dark-950 border border-gold-500/30 rounded-xl p-2.5 text-xs text-gray-100"
                  />
                </div>
              </div>

              {/* ================= DYNAMIC LESSONS & YOUTUBE BUILDER ================= */}
              <div className="border-t border-gold-500/20 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-500 text-[20px]">smart_display</span>
                      <span>محاضرات اليوتيوب والتكليفات العملية ({formLessons.length}):</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      أدخل رابط الفيديو من يوتيوب وتفاصيل التكليف العملي لكل محاضرة ليقوم الطلاب بالتسليم عليها.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddLessonToForm}
                    className="px-3 py-1.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold text-xs hover:bg-gold-500/30 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>إضافة محاضرة جديدة</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formLessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="p-5 rounded-2xl bg-dark-950 border border-gold-500/20 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gold-500/10">
                        <span className="text-xs font-bold text-gold-400 font-mono">
                          المحاضرة رقم #{idx + 1}
                        </span>
                        {formLessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLessonFromForm(idx)}
                            className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span>حذف المحاضرة</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-gray-300 mb-1">عنوان المحاضرة:</label>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => {
                              const next = [...formLessons];
                              next[idx].title = e.target.value;
                              setFormLessons(next);
                            }}
                            className="w-full bg-dark-900 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-red-400 font-bold mb-1 flex items-center gap-1">
                            <span>رابط فيديو يوتيوب (YouTube Video URL):</span>
                          </label>
                          <input
                            type="text"
                            value={lesson.youtubeUrl}
                            onChange={(e) => {
                              const next = [...formLessons];
                              next[idx].youtubeUrl = e.target.value;
                              setFormLessons(next);
                            }}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-dark-900 border border-red-500/40 rounded-lg p-2 text-xs text-gray-100 font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">مدة المحاضرة:</label>
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => {
                              const next = [...formLessons];
                              next[idx].duration = e.target.value;
                              setFormLessons(next);
                            }}
                            placeholder="مثال: 32 دقيقة"
                            className="w-full bg-dark-900 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-gray-300 mb-1">وصف أو ملخص المحاضرة:</label>
                          <input
                            type="text"
                            value={lesson.description}
                            onChange={(e) => {
                              const next = [...formLessons];
                              next[idx].description = e.target.value;
                              setFormLessons(next);
                            }}
                            className="w-full bg-dark-900 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                          />
                        </div>
                      </div>

                      {/* Assignment Toggle */}
                      <div className="p-3.5 rounded-xl bg-dark-900 border border-amber-500/25 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lesson.hasAssignment}
                            onChange={(e) => {
                              const next = [...formLessons];
                              next[idx].hasAssignment = e.target.checked;
                              setFormLessons(next);
                            }}
                            className="accent-amber-500 w-4 h-4 rounded"
                          />
                          <span className="text-xs font-bold text-amber-300">
                            يحتوي هذا الدرس على تكليف عملي إلزامي يسلّمه الطالب على المنصة
                          </span>
                        </label>

                        {lesson.hasAssignment && (
                          <div className="space-y-3 pt-2 border-t border-amber-500/15">
                            <div>
                              <label className="block text-[11px] text-gray-300 mb-1">عنوان التكليف:</label>
                              <input
                                type="text"
                                value={lesson.assignmentTitle}
                                onChange={(e) => {
                                  const next = [...formLessons];
                                  next[idx].assignmentTitle = e.target.value;
                                  setFormLessons(next);
                                }}
                                className="w-full bg-dark-950 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-gray-300 mb-1">شروط وتعليمات التكليف:</label>
                              <textarea
                                rows={2}
                                value={lesson.assignmentInstructions}
                                onChange={(e) => {
                                  const next = [...formLessons];
                                  next[idx].assignmentInstructions = e.target.value;
                                  setFormLessons(next);
                                }}
                                className="w-full bg-dark-950 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] text-gray-300 mb-1">صيغة التسليم المطلوبة:</label>
                                <input
                                  type="text"
                                  value={lesson.assignmentDeliverableType}
                                  onChange={(e) => {
                                    const next = [...formLessons];
                                    next[idx].assignmentDeliverableType = e.target.value;
                                    setFormLessons(next);
                                  }}
                                  placeholder="رابط Google Drive / GitHub / Figma"
                                  className="w-full bg-dark-950 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-gray-300 mb-1">الدرجة القصوى (Max Score):</label>
                                <input
                                  type="number"
                                  value={lesson.assignmentMaxScore}
                                  onChange={(e) => {
                                    const next = [...formLessons];
                                    next[idx].assignmentMaxScore = Number(e.target.value);
                                    setFormLessons(next);
                                  }}
                                  className="w-full bg-dark-950 border border-gold-500/20 rounded-lg p-2 text-xs text-gray-100"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gold-500/20">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl gold-button-gradient text-dark-950 font-bold text-xs md:text-sm shadow-xl shadow-gold-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isEditing ? "حفظ التعديلات ونشر الدورة" : "إضافة الدورة والمحاضرات إلى المنصة"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="py-3.5 px-6 rounded-2xl bg-dark-850 hover:bg-dark-800 text-gray-300 font-bold text-xs"
                >
                  إلغاء
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

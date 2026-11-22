// RenderLancer Academy & Courses Management Engine
// Complete Courses, YouTube Video Lessons, Practical Assignments & Super Admin Review Pipeline

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string; // YouTube Video URL or Video ID
  duration: string; // e.g. "24 دقيقة"
  order: number;
  resources?: { name: string; url: string; type?: "pdf" | "link" | "zip" | "code" }[];
  hasAssignment: boolean;
  assignment?: {
    id: string;
    title: string;
    instructions: string;
    deliverableType: string; // e.g. "رابط Google Drive / Behance / GitHub / فيديو MP4"
    maxScore: number;
    passingScore: number;
    deadlineDays?: number;
    requirements: string[];
    sampleLink?: string;
  };
}

export type CourseCategory = "motion" | "ai" | "dev" | "design" | "3d" | "freelance";

export interface CourseCategoryMeta {
  key: CourseCategory;
  ar: string;
  en: string;
  color: string;
  badgeClass: string;
  icon: string;
}

export const COURSE_CATEGORIES: Record<CourseCategory, CourseCategoryMeta> = {
  motion: {
    key: "motion",
    ar: "الموشن جرافيك والمونتاج",
    en: "Motion & Video Editing",
    color: "#E11D48",
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: "movie_creation",
  },
  ai: {
    key: "ai",
    ar: "الذكاء الاصطناعي التوليدي",
    en: "Generative AI & Media",
    color: "#D4AF37",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "psychology",
  },
  dev: {
    key: "dev",
    ar: "تطوير الويب والبرمجة",
    en: "Web Development",
    color: "#3B82F6",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: "code",
  },
  design: {
    key: "design",
    ar: "تصميم واجهات وتجربة المستخدم UI/UX",
    en: "UI/UX Design",
    color: "#10B981",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "palette",
  },
  "3d": {
    key: "3d",
    ar: "التصميم والرندر ثلاثي الأبعاد 3D",
    en: "3D Rendering & Blender",
    color: "#0284C7",
    badgeClass: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
    icon: "view_in_ar",
  },
  freelance: {
    key: "freelance",
    ar: "احتراف العمل الحر واقتناص العقود",
    en: "Freelance Mastery & Deals",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "payments",
  },
};

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all";

export const LEVEL_LABELS: Record<CourseLevel, { ar: string; class: string }> = {
  beginner: { ar: "مبتدئ", class: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  intermediate: { ar: "متوسط", class: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  advanced: { ar: "متقدم ومحترف", class: "bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30" },
  all: { ar: "كافة المستويات", class: "bg-gold-500/15 text-gold-300 border-gold-500/30" },
};

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  thumbnail: string;
  duration: string;
  lessonsCount: number;
  featured?: boolean;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  instructor: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  prerequisites: string[];
  whatYouWillLearn: string[];
  certificationIncluded: boolean;
  lessons: CourseLesson[];
  enrolledCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  submittedAt: string;
  updatedAt: string;
  studentNotes: string;
  submissionLinks: { label: string; url: string }[];
  status: "pending" | "graded" | "needs_revision" | "rejected";
  score?: number; // 0 - 100
  instructorFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ---------------- YOUTUBE PARSING HELPERS ----------------

/**
 * Robust YouTube video ID parser that handles all standard YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - Plain 11-char ID
 */
export function getYoutubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard watch?v=
  const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (vMatch && vMatch[1]) return vMatch[1];

  // Handle youtu.be/
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // Handle embed/
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // Handle shorts/
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  return null;
}

/**
 * Returns privacy-respecting YouTube embed URL
 */
export function getYoutubeEmbedUrl(input: string): string | null {
  const videoId = getYoutubeVideoId(input);
  if (!videoId) return null;

  // Extract playlist if present
  const listMatch = input.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const listParam = listMatch && listMatch[1] ? `&list=${listMatch[1]}` : "";

  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${listParam}`;
}

// ---------------- INITIAL SEED DATA ----------------

export const INITIAL_COURSES: Course[] = [
  {
    id: "course-sketchup-aljamal",
    slug: "sketchup-engineering-drawing",
    title: "مساق الرسم الهندسي المحوسب والنمذجة ثلاثية الأبعاد ببرنامج SketchUp Pro",
    shortDescription: "دورة هندسية معمارية شاملة من إعداد م. عزة رفعت الجمل تشرح أدوات الرسم، الرفع، المكونات، المقاطع الهندسية، وتصدير المخططات للأوتوكاد.",
    description: `مساق أكاديمي وتطبيقي متخصص في النمذجة ثلاثية الأبعاد والرسم الهندسي المحوسب ببرنامج SketchUp Pro، أعدته وقدّمته المهندسة عزة رفعت الجمل (مدرسة مساقات الرسم والتصميم المعماري في الكلية الجامعية للعلوم التطبيقية UCAS).

    يغطي المساق شرحاً تفصيلياً وتطبيقياً من الصفر:
    1. واجهة البرنامج وضبط وحدات القياس المترية والمحاور الفراغية.
    2. أدوات الرسم والتعديل ومحاكاة الرفع الحجمي بأداة Push/Pull.
    3. النمذجة المعمارية المتقدمة واستخدام أداة Follow Me للكورنيش والأشكال الدورانية.
    4. تنظيم المشروع وإدارة الكتل والعناصر المتكررة بنظام Groups و Components و Tags.
    5. أدوات الكاميرا الاحترافية، المقاطع الهندسية (Section Planes)، النصوص ثلاثية الأبعاد، وتصدير المخططات بصيغة DWG لبرنامج AutoCAD.

    جميع محاضرات المساق متاحة بجودة عالية عبر قناة المهندسة الرسمية على YouTube (@azzaaljamal6032)، ويتم تسليم التكليفات المعمارية وملفات الـ SKP ولقطات الرندر التنفيذية مباشرة داخل منصة RenderLancer ليتم تدقيقها ومراجعتها ورصد الدرجات والتقييمات من قبل المشرفين.`,
    category: "3d",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    duration: "12 ساعة تدريبية",
    lessonsCount: 6,
    featured: true,
    status: "ACTIVE",
    instructor: {
      name: "م. عزة رفعت الجمل",
      title: "محاضرة الرسم الهندسي المحوسب والتصميم ثلاثي الأبعاد (UCAS)",
      avatar: "ع.ج",
      bio: "مهندسة معمارية وأكاديمية متخصصة في برمجيات التصميم الهندسي المحوسب والنمذجة المعمارية (SketchUp, AutoCAD). درّست مئات الطلبة والمهندسين وأشرفت على العديد من المشاريع الهندسية في فلسطين.",
    },
    prerequisites: [
      "تثبيت برنامج SketchUp Pro على جهاز الحاسوب",
      "معرفة أولية بمبادئ الرسم الهندسي والمساقط المعمارية",
      "الرغبة في احتراف النمذجة ثلاثية الأبعاد للعمل الحر والمشاريع الهندسية",
    ],
    whatYouWillLearn: [
      "واجهة SketchUp وإعداد بيئة العمل والمحاور ووحدات القياس المترية",
      "أدوات الرسم الأساسية وأداة الرفع Push/Pull ونمذجة الكتل المعمارية",
      "أدوات التعديل: Move, Rotate, Scale, Offset, Follow Me",
      "تنظيم المشروع وإدارة الطبقات: Groups, Components, Tags",
      "ضبط الكاميرات والمناظير وزوايا الرؤية والأبعاد والنصوص ثلاثية الأبعاد",
      "إنشاء المقاطع الهندسية Section Planes وتصدير الرسومات بصيغة DWG للأوتوكاد",
    ],
    certificationIncluded: true,
    enrolledCount: 168,
    rating: 5.0,
    reviewsCount: 42,
    createdAt: "2026-02-15",
    updatedAt: "2026-02-22",
    lessons: [
      {
        id: "les-sk1",
        order: 1,
        title: "المحاضرة 01: واجهة برنامج SketchUp وإعداد وحدات القياس والمحاور",
        description: "التعرف على الواجهة الرئيسية لبرنامج SketchUp Pro، ضبط وحدات القياس المترية، فهم محاور الفراغ (Red, Green, Blue)، وطرق التنقل الأساسية (Orbit, Pan, Zoom).",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "25 دقيقة",
        resources: [
          { name: "رابط قناة م. عزة الجمل الرسمية على يوتيوب", url: "https://www.youtube.com/@azzaaljamal6032", type: "link" },
          { name: "دليل اختصارات لوحة المفاتيح لبرنامج SketchUp (PDF)", url: "https://example.com/sketchup-shortcuts.pdf", type: "pdf" },
        ],
        hasAssignment: false,
      },
      {
        id: "les-sk2",
        order: 2,
        title: "المحاضرة 02: أدوات الرسم الأساسية ومبادئ تكوين الأسطح (Lines, Shapes)",
        description: "شرح أدوات الخطوط (Line, Freehand)، المستطيلات والدوائر والأقواس، وكيفية إغلاق الخطوط لتوليد أسطح هندسية قابلة للرفع الحجمي.",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "30 دقيقة",
        hasAssignment: false,
      },
      {
        id: "les-sk3",
        order: 3,
        title: "المحاضرة 03: أدوات التعديل الأساسية والرفع الحجمي (Push/Pull & Modification)",
        description: "التحكم في الأشكال ثلاثية الأبعاد عبر أداة Push/Pull، النسخ المتعدد، التحريك الدقيق (Move)، التدوير (Rotate)، وتشكيل الفراغات والكتل.",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "34 دقيقة",
        hasAssignment: true,
        assignment: {
          id: "asg-sk3",
          title: "التكليف 01: نمذجة كتلة مبنى سكني أو فيلا معمارية بسيطة",
          instructions: "المطلوب رسم مخطط أرضي بسيط، ورفعه باستخدام أداة Push/Pull لإنشاء جدران وسقف وفتحات أبواب ونوافذ. سلّم لقطات منظورية ورابط ملف الـ SKP على المنصة.",
          deliverableType: "رابط مجلد Google Drive يحتوي ملف .skp وصور JPG للمجسم",
          maxScore: 100,
          passingScore: 70,
          deadlineDays: 4,
          requirements: [
            "أبعاد صحيحة متناسبة بوحدات المتر",
            "وجود فتحات أبواب ونوافذ متقنة",
            "تفريغ الأسطح وعدم وجود خطوط زائدة غير مغلقة",
          ],
        },
      },
      {
        id: "les-sk4",
        order: 4,
        title: "المحاضرة 04: أدوات التعديل المتقدمة وتطبيقات الجدران والزخارف (Offset & Follow Me)",
        description: "رسم سماكات الجدران الخارجية والداخلية بأداة Offset، تشكيل الكورنيش والمسارات المعمارية الدائرية بأداة Follow Me، واستخدام أداة القياس Tape Measure.",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "28 دقيقة",
        hasAssignment: false,
      },
      {
        id: "les-sk5",
        order: 5,
        title: "المحاضرة 05: تنظيم المشروع المعماري وإدارة الكتل (Groups, Components & Tags)",
        description: "كيفية حماية العناصر من الالتصاق العشوائي، إنشاء المجموعات (Groups)، بناء البلوكات والمكتبات المتكررة (Components) للأبواب والنوافذ، وتنظيم الطبقات (Tags).",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "32 دقيقة",
        hasAssignment: true,
        assignment: {
          id: "asg-sk5",
          title: "التكليف 02: تنظيم مشروع كامل بنظام المجموعات والمكونات والـ Tags",
          instructions: "قم بنمذجة فراغ داخلي (غرفة معيشة أو مكتب) مع تحويل الأثاث والأبواب إلى Components معمارية وفصل الجدران والأثاث في Tags منفصلة.",
          deliverableType: "رابط Google Drive أو Behance يحتوي ملف SketchUp المنظم",
          maxScore: 100,
          passingScore: 75,
          deadlineDays: 5,
          requirements: [
            "تحويل كل عنصر مستقل إلى Group أو Component",
            "تسمية الـ Tags بشكل هندسي منظم (Walls, Furniture, Doors, Windows)",
            "استخدام المكونات المتكررة لتعديل أوتوماتيكي",
          ],
        },
      },
      {
        id: "les-sk6",
        order: 6,
        title: "المحاضرة 06: أدوات الكاميرا والعرض، النصوص، المقاطع وتصدير المخططات للأوتوكاد",
        description: "المحاضرة التطبيقية المباشرة (رابط الفيديو المعتمد): ضبط زوايا الكاميرا (Position Camera, Walk, Look Around, Orbit)، المشاهد القياسية والمنظورية، عمل المقاطع الهندسية (Section Planes)، إضافة النصوص والأبعاد، وتصدير الرسومات ثنائية الأبعاد DWG إلى AutoCAD ومستندات العرض.",
        youtubeUrl: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc",
        duration: "35 دقيقة",
        resources: [
          { name: "رابط المحاضرة المباشر على يوتيوب (م. عزة الجمل)", url: "https://www.youtube.com/watch?v=am135Xxm4Ow&list=PLaqRGKpwMiIc", type: "link" },
          { name: "قناة م. عزة الجمل الرسمية (@azzaaljamal6032)", url: "https://www.youtube.com/@azzaaljamal6032", type: "link" },
          { name: "ملف عمل المحاضرة ومخطط الأوتوكاد التدريبي", url: "https://example.com/sketchup-lecture06-dwg.zip", type: "zip" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-sk6",
          title: "التكليف النهائي للمساق: إخراج المقاطع والمساقط وتصدير ملف DWG معتمد",
          instructions: "قم بتطبيق خطوات المحاضرة 06: أضف مقطعاً معمارياً (Section Plane) يمر بالمبنى لإظهار التفاصيل الداخلية، أضف الأبعاد والنصوص الإيضاحية، واضبط زاوية كاميرا عين الإنسان (Eye-level)، ثم قم بتصدير المقطع ثنائياً إلى ملف AutoCAD DWG وملف صورة عالي الدقة، وسلّم الروابط للمراجعة والتقييم.",
          deliverableType: "رابط مجلد Google Drive يحتوي ملف .DWG المصدّر + صور الإخراج + ملف .skp الأصلي",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 7,
          requirements: [
            "تطبيق مقطع هندسي واضح يظهر الفراغ الداخلي وسماكات العناصر",
            "إضافة نصوص وأبعاد توضيحية منسقة",
            "تصدير ملف DWG سليم يفتح على برنامج AutoCAD بدون أخطاء خطوط",
            "تسليم لقطة منظورية واحدة على الأقل بارتفاع عين الإنسان (Eye level perspective)",
          ],
        },
      },
    ],
  },
  {
    id: "course-motion-ai",
    slug: "motion-ai-mastery",
    title: "دبلوم صناعة المحتوى المرئي والموشن جرافيك الإعلاني بالذكاء الاصطناعي",
    shortDescription: "تعلم أسرار الإخراج البصري، التحريك السينمائي، وهندسة البرومبت لأدوات Veo 3.1 و Seedance لإنجاز إعلانات عالمية للشركات الدولية.",
    description: `دورة تطبيقية مكثفة مصممة خصيصاً للمستقلين والمبدعين في فلسطين والوطن العربي لإتقان صناعة الفيديوهات الإعلانية فائقة الجودة. نغطي فيها من الصفر كيف تبني سيناريو بصري وستوري بورد، ثم توليد اللقطات السينمائية بمحركات Veo 3.1 و GPT Image، ثم التحريك والتجميع الاحترافي وإضافة المؤثرات الصوتية والتعليق الصوتي.
    
    الميزة الأساسية للدورة أن كل درس يحتوي على تكليف عملي مباشر يتم رفعه للمنصة ليقوم المدرب والسوبر أدمن بفحصه، وتقديم ملاحظات تدقيقية دقيقة حتى تصل لدرجة الإتقان الكامل وعرض مشاريعك في بورتفوليو RenderLancer!`,
    category: "motion",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    duration: "18 ساعة تدريبية",
    lessonsCount: 4,
    featured: true,
    status: "ACTIVE",
    instructor: {
      name: "م. حمزة رضوان",
      title: "كبير مخرجي الرسوم والموشن جرافيك في Render Group",
      avatar: "ح.ر",
      bio: "مخرج فني خبير بخبرة تزيد عن 8 سنوات في الإخراج البصري والحملات الإعلانية العالمية لشركات في الخليج وأوروبا.",
    },
    prerequisites: [
      "معرفة أولية ببرامج المونتاج مثل After Effects أو Premiere أو CapCut",
      "جهاز حاسوب متصل بالإنترنت للتطبيق العملي",
      "الشغف بتعلم أحدث أدوات الذكاء الاصطناعي التوليدي",
    ],
    whatYouWillLearn: [
      "بناء الستوري بورد والتخطيط الإخراجي للإعلانات القصيرة",
      "صياغة برومبتات سينمائية عالية الدقة لمحركات Veo 3.1 و Seedance Motion",
      "توليد الشخصيات المتناسقة والخلفيات الواقعية عبر GPT Image 2 Pro",
      "المونتاج، تحريك الشعارات، وتزامن المؤثرات الصوتية والموسيقى",
      "كيف تسوق خدماتك وتقتنص عقود إعلانية بأسعار تبدأ من 500$ لكل إعلان",
    ],
    certificationIncluded: true,
    enrolledCount: 142,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-20",
    lessons: [
      {
        id: "les-m1",
        order: 1,
        title: "الدرس 1: أسس الستوري بورد وبناء الهوية البصرية للإعلان",
        description: "شرح شامل لكيفية تحويل الفكرة المكتوبة إلى مشاهد بصرية مترابطة، مع تحديد زوايا الكاميرا وحركة العناصر واللوحات اللونية المناسبة.",
        youtubeUrl: "https://www.youtube.com/watch?v=fBNz54PJRnc",
        duration: "28 دقيقة",
        resources: [
          { name: "قالب الستوري بورد الرسمي (PDF)", url: "https://example.com/storyboard-template.pdf", type: "pdf" },
          { name: "دليل درجات الألوان والإضاءة السينمائية", url: "https://example.com/color-guide", type: "link" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-m1",
          title: "التكليف 1: رسم ستوري بورد كامل لإعلان قهوة أو مشروب طاقة",
          instructions: "المطلوب إعداد ستوري بورد من 4 إلى 6 مشاهد لإعلان ترويجي لمنتج من اختيارك. يجب تحديد وصف المشهد، حركة الكاميرا، والنص الترويجي المصاحب لكل مشهد.",
          deliverableType: "رابط ملف Figma أو مستند Google Drive أو ملف PDF",
          maxScore: 100,
          passingScore: 75,
          deadlineDays: 4,
          requirements: [
            "تضمين 4 إلى 6 مشاهد متتالية",
            "كتابة وصف الكاميرا والإضاءة لكل مشهد",
            "صياغة التعليق الصوتي أو النص الإعلاني المرافق",
            "إرفاق رابط قابل للوصول من قبل الإدارة",
          ],
        },
      },
      {
        id: "les-m2",
        order: 2,
        title: "الدرس 2: هندسة الأوامر وتوليد الكادرات السينمائية بأدوات Veo 3.1 و GPT Image",
        description: "كيف تكتب برومبتات استوديو احترافية للتحكم بالعدسات السينمائية (Anamorphic, 35mm)، الإضاءة الدرامية، وتثبيت ملامح الشخصية عبر المشاهد.",
        youtubeUrl: "https://www.youtube.com/watch?v=k3_tw44QsZQ",
        duration: "35 دقيقة",
        resources: [
          { name: "كتيب أوامر البرومبت السينمائية المعتمدة من ريندر", url: "https://example.com/prompts-cheatsheet", type: "link" },
          { name: "حزمة أصول مجانية (Overlays & Textures)", url: "https://example.com/textures.zip", type: "zip" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-m2",
          title: "التكليف 2: توليد 3 كادرات سينمائية متناسقة مع برومبتاتها",
          instructions: "استخدم استوديو أدوات Render Group لتوليد 3 كادرات سينمائية تتبع نفس الموضوع والإضاءة. سلّم الكادرات مع ملف نصي يحتوي الأوامر (Prompts) المستخدمة وخطوات التعديل.",
          deliverableType: "رابط مجلد Google Drive أو Behance يحتوي الصور والبرومبتات",
          maxScore: 100,
          passingScore: 70,
          deadlineDays: 5,
          requirements: [
            "تناسق الإضاءة والألوان بين الكادرات الثلاثة",
            "دقة عالية 4K بدون تشوهات بصرية",
            "ذكر البرومبت الكامل لكل لقطة في الملاحظات",
          ],
        },
      },
      {
        id: "les-m3",
        order: 3,
        title: "الدرس 3: التحريك الفيزيائي والانتقالات السلسة بواسطة Seedance 2.0",
        description: "التحكم في حركة السوائل، الجزيئات، وسرعة الحركة (Speed Ramps)، وربط المشاهد بانتقالات فريمين متناسقة تمنح العمل طابعاً سينمائياً مبهراً.",
        youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        duration: "40 دقيقة",
        resources: [
          { name: "ملفات نماذج الحركة والاختبارات", url: "https://example.com/motion-presets.zip", type: "zip" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-m3",
          title: "التكليف 3: إنتاج مقطع فيديو متحرك مدته 10 إلى 15 ثانية",
          instructions: "قم بتحريك الكادرات التي ولدتها في التكليف السابق، وأنشئ فيديو متماسك من 10 إلى 15 ثانية يحتوي انتقالات ناعمة وحركة عناصر واضحة.",
          deliverableType: "رابط فيديو على Google Drive أو YouTube Unlisted أو Vimeo",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 6,
          requirements: [
            "مدة الفيديو بين 10 و 15 ثانية بجودة 1080p على الأقل",
            "انتقال سلس بين المشاهد",
            "عدم وجود وميض فريمات عشوائي",
          ],
        },
      },
      {
        id: "les-m4",
        order: 4,
        title: "الدرس 4: المونتاج النهائي، المؤثرات الصوتية، وتصدير العمل بجودة بث تلفزيوني",
        description: "مرحلة الـ Sound Design، تلوين الفيديو (Color Grading)، وإضافة شعار العميل وعبارات الدعوة للإجراء (Call to Action) والتصدير بأعلى معايير المنصات.",
        youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        duration: "32 دقيقة",
        resources: [
          { name: "مكتبة مؤثرات صوتية حصرية لصناع الإعلانات", url: "https://example.com/sfx-pack", type: "link" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-m4",
          title: "التكليف النهائي: تسليم المشروع الإعلاني المتكامل مع البورتفوليو",
          instructions: "هذا هو مشروع التخرج المعتمد للدورة. قم بتركيب الإعلان الكامل مع الصوت والموسيقى وكتابة النصوص، وسلّم الملف النهائي مع كتابة نبذة تقديمية يمكن وضعها كدراسة حالة في معرض أعمالك.",
          deliverableType: "رابط Google Drive يحتوي الفيديو MP4 النهائي + دراسة الحالة",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 7,
          requirements: [
            "إعلان متكامل مدته 20-30 ثانية بجودة عالية",
            "تصميم صوتي متقن وموسيقى متوافقة مع حقوق النشر",
            "مرفق دراسة حالة تشرح فكرة الحملة والنتائج المتوقعة",
          ],
        },
      },
    ],
  },
  {
    id: "course-nextjs-enterprise",
    slug: "nextjs-fullstack-enterprise",
    title: "هندسة تطبيقات الويب المتكاملة مع Next.js 15 و PostgreSQL و Escrow",
    shortDescription: "من الصفر حتى إطلاق منصة سحابية كاملة بأنظمة الصلاحيات RBAC، الحماية من الثغرات، والربط مع بوابات الدفع وقواعد بيانات Prisma.",
    description: `دورة عملية بالكامل لمهندسي البرمجيات في فلسطين والمنطقة، نغطي فيها بناء تطبيقات الويب واسعة النطاق (Enterprise Full-Stack). ستتعلم كيف تبني أنظمة الصلاحيات المتقدمة، وربط أنظمة الـ Escrow للضمان المالي، وتأمين الواجهات الخلفية، ونشر المشروع عبر عناقيد الاستضافة السحابية الحديثة.
    
    تشمل الدورة تكليفات برمجية حقيقية تتطلب كتابة كود ورفع روابط المستودعات (GitHub Repositories) وروابط المعاينة المباشرة (Live Demo)، مع مراجعة كود Code Review تفصيلية من السوبر أدمن وفريق الهندسة.`,
    category: "dev",
    level: "advanced",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    duration: "24 ساعة تدريبية",
    lessonsCount: 3,
    featured: true,
    status: "ACTIVE",
    instructor: {
      name: "م. نديم (Super Admin)",
      title: "كبير مهندسي النظم والبنية السحابية في Render Group",
      avatar: "م.ن",
      bio: "مهندس نظم ومؤسس منصات رقمية وحلول سحابية بخبرة تتجاوز 10 أعوام في بناء بنى الويب الكبيرة وأنظمة الدفع والضمان المالي.",
    },
    prerequisites: [
      "إتقان لغة JavaScript وتجربة مع TypeScript ومكتبة React",
      "معرفة بأسس قواعد البيانات العلائقية ومفاهيم SQL",
      "حساب على GitHub ومحرر كود مثل VS Code",
    ],
    whatYouWillLearn: [
      "البنية المعمارية المتقدمة لـ Next.js 15 App Router و Server Actions",
      "تصميم وتطبيع قواعد البيانات المعقدة باستخدام Prisma ORM و PostgreSQL",
      "تنفيذ نظام صلاحيات شجري متعدد المستويات (RBAC)",
      "بناء ومحاكاة دورة حياة الضمان المالي Escrow ومسارات الدفع الآمن",
      "تقنيات تسريع الأداء وتحسين محركات البحث SEO والأمان العالي",
    ],
    certificationIncluded: true,
    enrolledCount: 98,
    rating: 5.0,
    reviewsCount: 29,
    createdAt: "2026-02-05",
    updatedAt: "2026-02-21",
    lessons: [
      {
        id: "les-dev1",
        order: 1,
        title: "الدرس 1: معمارية Next.js 15 App Router وأنماط الـ Server Components",
        description: "فهم عميق لكيفية تدفق البيانات بين السيرفر والعميل، إدارة الـ Cache و Revalidation، وتصميم هيكلية المجلدات للمشاريع الضخمة.",
        youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        duration: "45 دقيقة",
        resources: [
          { name: "قالب المشروع الأساسي على GitHub", url: "https://github.com/rendergroup/enterprise-starter", type: "code" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-dev1",
          title: "التكليف 1: إعداد مشروع نظيف وتطبيق الـ Dynamic Routing مع Layouts مخصصة",
          instructions: "أنشئ مشروع Next.js 15 مع TypeScript و Tailwind، وقم ببرمجة مسارات ديناميكية مع دعم الـ Loading و Error Boundaries مع صفحة تفاصيل ديناميكية.",
          deliverableType: "رابط مستودع GitHub + رابط نشر تجريبي على Vercel",
          maxScore: 100,
          passingScore: 75,
          deadlineDays: 5,
          requirements: [
            "كود نظيف مكتوب بـ TypeScript بدون أخطاء any",
            "وجود ملف README منظم يوضح خطوات التشغيل",
            "رابط تجريبي حي يعمل بدون أخطاء Console",
          ],
        },
      },
      {
        id: "les-dev2",
        order: 2,
        title: "الدرس 2: مخطط قواعد البيانات Prisma وتطبيق نظام الصلاحيات الشجري (RBAC)",
        description: "بناء الموديلات، العلاقات المتعددة، الفهارس، وكتابة المحرك الأمني للتأكد من أذونات المستخدم قبل تنفيذ أي عملية حساسة.",
        youtubeUrl: "https://www.youtube.com/watch?v=fBNz54PJRnc",
        duration: "50 دقيقة",
        resources: [
          { name: "مخطط Prisma Schema المرجعي للأنظمة المعقدة", url: "https://example.com/schema-ref", type: "code" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-dev2",
          title: "التكليف 2: تصميم نموذج قاعدة بيانات لنظام إدارة مهام مع صلاحيات متعددة",
          instructions: "اكتب ملف `schema.prisma` يحتوي جداول المستخدمين، الأدوار، المهام، والسجلات، مع كتابة دالة التحقق من الصلاحية (Permission Checker) واختبارها.",
          deliverableType: "رابط GitHub Pull Request أو مستودع يحتوي ملف الـ Schema والاختبارات",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 6,
          requirements: [
            "تحديد المفاتيح الأساسية والأجنبية بوضوح",
            "إنشاء دور Super Admin ودور مستخدم عادي مع قيود دقيقة",
            "شرح منطق التحقق في ملف نصي أو README",
          ],
        },
      },
      {
        id: "les-dev3",
        order: 3,
        title: "الدرس 3: محاكاة وتطبيق نظام الضمان المالي Escrow ومسارات الحماية",
        description: "كيف تنشئ دورة مالية تبدأ من إيداع صاحب العمل للأموال، حجزها في حساب وسيط، وتأكيد الإنجاز، ثم الإفراج الفوري للمستقل بدون ثغرات.",
        youtubeUrl: "https://www.youtube.com/watch?v=k3_tw44QsZQ",
        duration: "42 دقيقة",
        resources: [
          { name: "مخطط تدفق العمليات المالية للـ Escrow", url: "https://example.com/escrow-flow.pdf", type: "pdf" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-dev3",
          title: "التكليف 3: بناء لوحة متابعة ومراجعة للمدفوعات السحابية",
          instructions: "برمج شاشة Dashboard تعرض الحركات المعلقة، وتتيح للمشرف زر 'الموافقة والإفراج' أو 'إيقاف المعاملة للتفتيش' مع تحديث حالة الرصيد في الواجهة لحظياً.",
          deliverableType: "رابط GitHub Repo ورابط تجريبي مباشر",
          maxScore: 100,
          passingScore: 85,
          deadlineDays: 7,
          requirements: [
            "واجهة مستخدم متناسقة متجاوبة",
            "معالجة حالات الخطأ والنجاح مع Toast Notifications",
            "حفظ التغييرات في قاعدة بيانات أو LocalStorage",
          ],
        },
      },
    ],
  },
  {
    id: "course-uiux-figma",
    slug: "uiux-figma-design-systems",
    title: "تصميم واجهات وتجربة المستخدم المتقدمة (UI/UX) وأنظمة التصميم في Figma",
    shortDescription: "احترف بناء الـ Design Systems المتكاملة، المتغيرات (Variables)، التفاعلات المتقدمة (Smart Animate)، وتسليم التصاميم للمطورين.",
    description: `دورة متخصصة للمصممين الراغبين في الارتقاء بمستواهم نحو معايير المنتجات الرقمية العالمية. ستتعلم كيف تبني نظام تصميم موحد لمنتج SaaS كامل، وكيف تصمم شاشات متجاوبة متوافقة مع الأجهزة الذكية وشاشات الحواسيب، وكيف تبني بروتوتايب تفاعلي يُحاكي التطبيق الحقيقي بدقة 100%.
    
    كل تكليف في هذه الدورة يتطلب تقديم رابط مشروع Figma مفتوح للتفقد والتعليق المباشر من مدربي المنصة.`,
    category: "design",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    duration: "14 ساعة تدريبية",
    lessonsCount: 3,
    featured: false,
    status: "ACTIVE",
    instructor: {
      name: "أ. ليلى كنعان",
      title: "استشارية تجربة المستخدم وتصميم المنتجات الرقمية",
      avatar: "ل.ك",
      bio: "صممت أكثر من 30 منتجاً رقمياً في قطاعات التكنولوجيا المالية والتجارة، مدربة معتمدة في Figma و Design Thinking.",
    },
    prerequisites: [
      "فهم أساسي لأدوات الرسم في Figma",
      "معرفة عامة بمفاهيم التصميم الشبكي (Grids) والمسافات",
    ],
    whatYouWillLearn: [
      "إنشاء وإدارة الـ Components و Component Sets و Variants باحتراف",
      "استخدام Figma Variables للوضع الفاتح والداكن (Light/Dark Mode)",
      "تصميم واجهات معقدة باستخدام Auto Layout المتقدم",
      "بناء بروتوتايب تفاعلي متقدم Smart Animate",
      "توثيق وتسليم التصاميم للمبرمجين مع Code Connect",
    ],
    certificationIncluded: true,
    enrolledCount: 76,
    rating: 4.8,
    reviewsCount: 19,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-18",
    lessons: [
      {
        id: "les-ui1",
        order: 1,
        title: "الدرس 1: تشريح نظام التصميم: التايبوغرافي، الألوان، وشبكة الـ 8pt Grid",
        description: "كيف تنشئ أسس التصميم الثابتة (Foundations) التي تجعل أي مشروع رقمي متماسكاً وقابلاً للتوسع بدون فوضى بصرية.",
        youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        duration: "30 دقيقة",
        resources: [
          { name: "ملف أساسيات نظام التصميم في Figma", url: "https://www.figma.com/@rendergroup/design-system-starter", type: "link" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-ui1",
          title: "التكليف 1: إعداد لوحة Tokens كاملة للألوان والخطوط والأزرار",
          instructions: "أنشئ ملف Figma جديد وابنِ فيه لوحة الـ Foundations: الألوان الأساسية والثانوية، درجات الرمادي، تدرجات النصوص، ومجموعة أزرار بجميع الحالات (Default, Hover, Active, Disabled).",
          deliverableType: "رابط ملف Figma مفتوح للصلاحية (Can view/comment)",
          maxScore: 100,
          passingScore: 75,
          deadlineDays: 4,
          requirements: [
            "استخدام الـ Styles أو Variables لكل من الألوان والنصوص",
            "استخدام Auto Layout في جميع الأزرار",
            "توفير حالات Hover و Disabled",
          ],
        },
      },
      {
        id: "les-ui2",
        order: 2,
        title: "الدرس 2: تصميم الشاشات المعقدة مع Auto Layout المتقدم والـ Responsive Design",
        description: "تصميم جداول بيانات تفاعلية، بطاقات منتجات مرنة، وأشرطة تنقل تتكيف تلقائياً مع الشاشات العريضة والهواتف المحمولة.",
        youtubeUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        duration: "38 دقيقة",
        resources: [
          { name: "دليل قياسات الشاشات العربية RTL", url: "https://example.com/rtl-guidelines", type: "pdf" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-ui2",
          title: "التكليف 2: تصميم لوحة تحكم متجاوبة (Desktop & Mobile) لمتجر إلكتروني",
          instructions: "صمم شاشة رئيسية للوحة تحكم متجر إلكتروني بنسختين: نسخة شاشة حاسوب 1440px ونسخة هاتف محمول 390px مع الحفاظ التام على اتجاه الـ RTL.",
          deliverableType: "رابط ملف Figma مع تفعيل خيار مشاركة العرض",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 5,
          requirements: [
            "تطابق الهوية والبيانات بين نسختي الموبايل والدسكتوب",
            "تصميم بطاقات الإحصائيات وجدول أحدث الطلبات",
            "مراعاة خطوط القراءة العربية (Cairo أو IBM Plex Arabic)",
          ],
        },
      },
      {
        id: "les-ui3",
        order: 3,
        title: "الدرس 3: هندسة البروتوتايب التفاعلي وتجهيز ملفات التسليم للمطورين (Design Handoff)",
        description: "كيف تربط الشاشات بتفاعلات واقعية، واستخدام الـ Component Properties لتقليل حجم الملف وتسهيل مهمة المطورين.",
        youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        duration: "44 دقيقة",
        resources: [
          { name: "قائمة فحص جاهزية التصميم للتسليم (Handoff Checklist)", url: "https://example.com/handoff-checklist.pdf", type: "pdf" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-ui3",
          title: "التكليف 3: بروتوتايب تفاعلي كامل لعملية الشراء والدفع",
          instructions: "اربط شاشات السلة، إدخال بيانات الشحن، الدفع، وتأكيد الطلب ببروتوتايب تفاعلي يعمل بالكامل عند الضغط على الأزرار مع رسائل التحقق.",
          deliverableType: "رابط Figma Prototype تفاعلي",
          maxScore: 100,
          passingScore: 85,
          deadlineDays: 6,
          requirements: [
            "سلاسة الانتقالات وسرعتها (Animation timing)",
            "وجود شاشات الخطأ وحالات النجاح",
            "ترتيب الفريمات وتسميتها بصورة نظيفة وواضحة",
          ],
        },
      },
    ],
  },
  {
    id: "course-freelance-contracts",
    slug: "freelance-international-contracts",
    title: "استراتيجيات اقتناص عقود العمل الحر الدولية وإدارة العملاء والتحويلات",
    shortDescription: "كيف تتفاوض كخبير محترف، تكتب عروض تقديم فائزة (Proposals)، وتدير المدفوعات والضمان المالي في ظل تحديات فلسطين والشتات.",
    description: `دورة تدريبية غير تقليدية تُركّز على الجانب المهني والمالي للعمل الحر. نكشف فيها آليات التسعير بالدولار، كيفية صياغة العروض الفنية التي تقنع شركات الخليج وأوروبا، كيفية توقيع العقود، وإدارة استلام الأرباح عبر القنوات المعتمدة مثل بنك فلسطين، PalPay، وUSDT.
    
    التكليفات في هذه الدورة هي تدريب عملي حقيقي على كتابة مقترحات وعروض حقيقية لفرص عمل منشورة في منصة RenderLancer، وسيقوم السوبر أدمن بتدقيق مقترحك وتقديم ملاحظات لتحسين نسبة قبولك!`,
    category: "freelance",
    level: "all",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    duration: "10 ساعات تدريبية",
    lessonsCount: 2,
    featured: false,
    status: "ACTIVE",
    instructor: {
      name: "أ. طارق عبد الرحمن",
      title: "مدير شراكات الأعمال والتوظيف الدولي في Render Group",
      avatar: "ط.ع",
      bio: "خبير استشارات أعمال وتوظيف عن بعد، قاد وساطة أكثر من 400 عقد توظيف دولي لكفاءات فلسطينية وعربية.",
    },
    prerequisites: [
      "امتلاك مهارة تقنية أو إبداعية قابلة للتقديم للعملاء (تصميم، برمجة، ترجمة، تسويق)",
      "الرغبة في الانتقال من المنافسة على الأسعار المنخفضة إلى التعاقدات ذات القيمة العالية",
    ],
    whatYouWillLearn: [
      "تحليل مشاريع العملاء واكتشاف نقاط الألم الخفية",
      "صياغة عروض تقديم مخصصة تبتعد عن القوالب الجاهزة المبتذلة",
      "هندسة التسعير: متى تختار السعر الثابت مقابل الأجر بالساعة",
      "التعامل مع اعتراضات العملاء وإغلاق الصفقات",
      "إدارة التدفقات النقدية والتحويلات بدون التعرض لتجميد الحسابات",
    ],
    certificationIncluded: true,
    enrolledCount: 210,
    rating: 4.9,
    reviewsCount: 54,
    createdAt: "2026-02-12",
    updatedAt: "2026-02-22",
    lessons: [
      {
        id: "les-fr1",
        order: 1,
        title: "الدرس 1: تشريح العرض الفائز (The Winning Proposal) وهندسة التسعير",
        description: "كيف تكتب فقرة افتتاحية تخطف انتباه العميل في أول 5 ثوانٍ، وكيف تسعّر خدماتك بثقة مع إضافة ضمانات تُزيل مخاطرة العميل.",
        youtubeUrl: "https://www.youtube.com/watch?v=fBNz54PJRnc",
        duration: "26 دقيقة",
        resources: [
          { name: "صيغة مقترح عمل معتمدة من ريندر جروب (DOCX)", url: "https://example.com/proposal-template.docx", type: "pdf" },
        ],
        hasAssignment: true,
        assignment: {
          id: "asg-fr1",
          title: "التكليف 1: صياغة عرض تقديم احترافي لوظيفة مطروحة في المنصة",
          instructions: "اختر أحد المشاريع المطروحة في قسم الوظائف بمنصة RenderLancer، واكتب عرض تقديم متكامل (Proposal) يشمل خطة العمل، المدة، الميزانية المقترحة، ونماذج أعمال ذات صلة.",
          deliverableType: "مستند Google Docs أو ملف PDF مع رابط المشروع المختار",
          maxScore: 100,
          passingScore: 80,
          deadlineDays: 4,
          requirements: [
            "تجنب النسخ واللصق وكتابة نص مخصص للمشروع",
            "توضيح القيمة المضافة التي ستقدمها للعميل",
            "طرح سؤالين أذكياء يثبتان فهمك العميق للتحدي",
          ],
        },
      },
      {
        id: "les-fr2",
        order: 2,
        title: "الدرس 2: استلام الأموال والتحويلات المالية الآمنة في فلسطين والشتات",
        description: "شرح عملي ومقارنة دقيقة بين سحب الأرباح عبر بنك فلسطين، حسابات PalPay، بطاقات Payoneer، ومحافظ العملات الرقمية USDT المشفرة.",
        youtubeUrl: "https://www.youtube.com/watch?v=k3_tw44QsZQ",
        duration: "30 دقيقة",
        resources: [
          { name: "دليل الرسوم والعمولات البنكية وقنوات الصرف المعتمدة", url: "https://example.com/payout-guide.pdf", type: "pdf" },
        ],
        hasAssignment: false,
      },
    ],
  },
];

// ---------------- INITIAL SEED ASSIGNMENT SUBMISSIONS ----------------
// Pre-seeded submissions so the Super Admin immediately sees data to review!

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-101",
    courseId: "course-motion-ai",
    courseTitle: "دبلوم صناعة المحتوى المرئي والموشن جرافيك الإعلاني بالذكاء الاصطناعي",
    lessonId: "les-m1",
    lessonTitle: "الدرس 1: أسس الستوري بورد وبناء الهوية البصرية للإعلان",
    assignmentId: "asg-m1",
    assignmentTitle: "التكليف 1: رسم ستوري بورد كامل لإعلان قهوة أو مشروب طاقة",
    studentId: "u-talent-ahmed",
    studentName: "أحمد خليل النجار",
    studentEmail: "talent@render.ps",
    studentAvatar: "أ.ن",
    submittedAt: "2026-02-21T14:30:00Z",
    updatedAt: "2026-02-21T14:30:00Z",
    studentNotes: "السلام عليكم أستاذ، قمت بتجهيز ستوري بورد متكامل من 6 مشاهد لإعلان قهوة مختصة بروح فلسطينية، استخدمت زوايا سينمائية 45 درجة وإضاءة الصباح الدافئة مع سيناريو صوتي يبرز عبق الهال والبن المحمص.",
    submissionLinks: [
      { label: "رابط ملف Figma للستوري بورد", url: "https://figma.com/file/mock-storyboard-coffee-render" },
      { label: "رابط مجلد Google Drive (الرسومات والملحقات)", url: "https://drive.google.com/drive/folders/mock-assets-coffee" },
    ],
    status: "pending",
  },
  {
    id: "sub-102",
    courseId: "course-motion-ai",
    courseTitle: "دبلوم صناعة المحتوى المرئي والموشن جرافيك الإعلاني بالذكاء الاصطناعي",
    lessonId: "les-m2",
    lessonTitle: "الدرس 2: هندسة الأوامر وتوليد الكادرات السينمائية بأدوات Veo 3.1 و GPT Image",
    assignmentId: "asg-m2",
    assignmentTitle: "التكليف 2: توليد 3 كادرات سينمائية متناسقة مع برومبتاتها",
    studentId: "u-jobseeker-tariq",
    studentName: "طارق منصور القدوة",
    studentEmail: "jobseeker@render.ps",
    studentAvatar: "ط.م",
    submittedAt: "2026-02-20T11:15:00Z",
    updatedAt: "2026-02-20T16:00:00Z",
    studentNotes: "تم توليد 3 كادرات لمشهد مدينة مستقبلية بأسلوب Cyberpunk مستوحى من القدس الشريف، مع توحيد درجات الإضاءة النيونية باللون الذهبي والأزرق الداكن.",
    submissionLinks: [
      { label: "معرض الصور والبرومبتات على Behance", url: "https://behance.net/gallery/mock-cyberpunk-alquds" },
    ],
    status: "graded",
    score: 94,
    instructorFeedback: "عمل ممتاز جداً يا طارق! الإضاءة متناسقة بشكل مذهل بين اللقطات الثلاث، وجودة البرومبت الهندسي عالية جداً. الملاحظة الوحيدة هي زيادة التباين في اللقطة الثانية قليلاً لتبرز عناصر الخلفية. تم اعتماد التكليف بنجاح!",
    reviewedBy: "م. حمزة رضوان (كبير مخرجي الرسوم)",
    reviewedAt: "2026-02-20T16:00:00Z",
  },
  {
    id: "sub-103",
    courseId: "course-nextjs-enterprise",
    courseTitle: "هندسة تطبيقات الويب المتكاملة مع Next.js 15 و PostgreSQL و Escrow",
    lessonId: "les-dev1",
    lessonTitle: "الدرس 1: معمارية Next.js 15 App Router وأنماط الـ Server Components",
    assignmentId: "asg-dev1",
    assignmentTitle: "التكليف 1: إعداد مشروع نظيف وتطبيق الـ Dynamic Routing مع Layouts مخصصة",
    studentId: "u-talent-ahmed",
    studentName: "أحمد خليل النجار",
    studentEmail: "talent@render.ps",
    studentAvatar: "أ.ن",
    submittedAt: "2026-02-19T18:20:00Z",
    updatedAt: "2026-02-20T10:30:00Z",
    studentNotes: "قمت بإنشاء التطبيق بالكامل مع دعم الوضع الليلي وتطبيق Next.js 15 App Router و Server Components. الرابط يعمل على Vercel.",
    submissionLinks: [
      { label: "مستودع الكود على GitHub", url: "https://github.com/ahmed-najjar/render-portfolio-app" },
      { label: "المعاينة الحية على Vercel", url: "https://render-portfolio-app.vercel.app" },
    ],
    status: "needs_revision",
    score: 65,
    instructorFeedback: "مجهود طيب يا أحمد، الهيكل العام ممتاز. لكن يرجى تصحيح الخطأ في ملف `layout.tsx` حيث لاحظنا وجود أخطاء Hydration mismatch عند التبديل للوضع الليلي، كما نرجو إضافة ملف `loading.tsx` لمسار التفاصيل لتحسين تجربة المستخدم. يُرجى إعادة التسليم بعد التعديل.",
    reviewedBy: "المهندس نديم (Super Admin)",
    reviewedAt: "2026-02-20T10:30:00Z",
  },
  {
    id: "sub-104",
    courseId: "course-sketchup-aljamal",
    courseTitle: "مساق الرسم الهندسي المحوسب والنمذجة ثلاثية الأبعاد ببرنامج SketchUp Pro",
    lessonId: "les-sk6",
    lessonTitle: "المحاضرة 06: أدوات الكاميرا والعرض، النصوص، المقاطع وتصدير المخططات للأوتوكاد",
    assignmentId: "asg-sk6",
    assignmentTitle: "التكليف النهائي للمساق: إخراج المقاطع والمساقط وتصدير ملف DWG معتمد",
    studentId: "u-jobseeker-tariq",
    studentName: "طارق منصور القدوة",
    studentEmail: "jobseeker@render.ps",
    studentAvatar: "ط.م",
    submittedAt: "2026-02-22T09:30:00Z",
    updatedAt: "2026-02-22T09:30:00Z",
    studentNotes: "السلام عليكم أستاذة عزة والإدارة الكريمة، قمت بتطبيق المحاضرة رقم 06 بالكامل على مشروع الفيلا السكنية: أنشأت المقطع الرأسي (Section Plane) يمر بالبهو والدرج لإبراز الفراغات الداخلية، وأضفت النصوص والأبعاد القياسية، وضبطت زاوية الكاميرا بارتفاع عين الإنسان، وصدّرت المقطع بصيغة DWG للأوتوكاد، ومرفق مجلد العمل كاملاً على Google Drive.",
    submissionLinks: [
      { label: "رابط مجلد Google Drive (ملف SKP + ملفات DWG المصدّرة + صور 4K)", url: "https://drive.google.com/drive/folders/mock-sketchup-aljamal-assignment" },
    ],
    status: "pending",
  },
];

// ---------------- LOCAL STORAGE KEYS & STORAGE HELPERS ----------------

const COURSES_STORAGE_KEY = "renderlancer_courses_catalog";
const DELETED_COURSES_KEY = "renderlancer_deleted_course_ids";
const SUBMISSIONS_STORAGE_KEY = "renderlancer_course_submissions";
const ENROLLMENTS_STORAGE_KEY = "renderlancer_student_enrollments";

function getDeletedCourseIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_COURSES_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getCourses(): Course[] {
  if (typeof window === "undefined") return INITIAL_COURSES;
  try {
    const deletedIds = getDeletedCourseIds();
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      const filteredInit = INITIAL_COURSES.filter((c) => !deletedIds.has(c.id));
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(filteredInit));
      return filteredInit;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any explicitly deleted course
      const cleaned = parsed.filter((c: any) => !deletedIds.has(c.id));

      // Auto-merge new initial courses (like Eng. Azza's SketchUp course) if not already present and NOT deleted
      const existingIds = new Set(cleaned.map((c: any) => c.id));
      let hasNew = false;
      for (const initC of INITIAL_COURSES) {
        if (!existingIds.has(initC.id) && !deletedIds.has(initC.id)) {
          cleaned.unshift(initC);
          hasNew = true;
        }
      }
      if (hasNew || cleaned.length !== parsed.length) {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return INITIAL_COURSES.filter((c) => !deletedIds.has(c.id));
  } catch (err) {
    console.error("Error reading courses:", err);
    return INITIAL_COURSES;
  }
}

export function getCourseById(id: string): Course | undefined {
  const all = getCourses();
  return all.find((c) => c.id === id || c.slug === id);
}

export function saveCourse(course: Course): Course {
  if (typeof window === "undefined") return course;
  try {
    const all = getCourses();
    const existingIndex = all.findIndex((c) => c.id === course.id);
    const updatedCourse = {
      ...course,
      updatedAt: new Date().toISOString(),
      lessonsCount: course.lessons?.length || 0,
    };

    // If re-saving or adding a course with this id, remove from deleted list
    const deletedIds = getDeletedCourseIds();
    if (deletedIds.has(course.id)) {
      deletedIds.delete(course.id);
      localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify(Array.from(deletedIds)));
    }

    let updatedList: Course[];
    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = updatedCourse;
    } else {
      updatedList = [updatedCourse, ...all];
    }

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent("renderlancer_courses_change", { detail: updatedList }));
    return updatedCourse;
  } catch (err) {
    console.error("Error saving course:", err);
    return course;
  }
}

export function deleteCourse(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Record in deleted IDs list so it never revives from INITIAL_COURSES
    const deletedIds = getDeletedCourseIds();
    deletedIds.add(id);
    localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify(Array.from(deletedIds)));

    const all = getCourses();
    const updated = all.filter((c) => c.id !== id);
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("renderlancer_courses_change", { detail: updated }));
    return true;
  } catch (err) {
    console.error("Error deleting course:", err);
    return false;
  }
}

export function toggleCourseStatus(id: string): Course | undefined {
  const all = getCourses();
  const target = all.find((c) => c.id === id);
  if (!target) return undefined;

  const nextStatus: Course["status"] = target.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
  const updated = { ...target, status: nextStatus, updatedAt: new Date().toISOString() };
  return saveCourse(updated);
}

// ---------------- SUBMISSIONS MANAGEMENT ----------------

export function getSubmissions(filters?: {
  courseId?: string;
  studentId?: string;
  status?: string;
  lessonId?: string;
}): AssignmentSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    let all: AssignmentSubmission[] = [];
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      all = INITIAL_SUBMISSIONS;
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-merge new seed submissions (like sub-104 for Eng. Azza's course)
        const existingSubIds = new Set(parsed.map((s: any) => s.id));
        let hasNewSub = false;
        for (const initS of INITIAL_SUBMISSIONS) {
          if (!existingSubIds.has(initS.id)) {
            parsed.unshift(initS);
            hasNewSub = true;
          }
        }
        if (hasNewSub) {
          localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
        all = parsed;
      } else {
        all = INITIAL_SUBMISSIONS;
      }
    }

    let filtered = [...all];
    if (filters?.courseId) filtered = filtered.filter((s) => s.courseId === filters.courseId);
    if (filters?.studentId) filtered = filtered.filter((s) => s.studentId === filters.studentId);
    if (filters?.lessonId) filtered = filtered.filter((s) => s.lessonId === filters.lessonId);
    if (filters?.status && filters.status !== "ALL") filtered = filtered.filter((s) => s.status === filters.status);

    return filtered;
  } catch (err) {
    console.error("Error reading submissions:", err);
    return INITIAL_SUBMISSIONS;
  }
}

export function getSubmissionById(id: string): AssignmentSubmission | undefined {
  const all = getSubmissions();
  return all.find((s) => s.id === id);
}

export function getStudentSubmissionForLesson(
  courseId: string,
  lessonId: string,
  studentId: string
): AssignmentSubmission | undefined {
  const all = getSubmissions();
  return all.find(
    (s) => s.courseId === courseId && s.lessonId === lessonId && s.studentId === studentId
  );
}

export function submitAssignment(
  payload: Omit<AssignmentSubmission, "id" | "submittedAt" | "status" | "updatedAt">
): AssignmentSubmission {
  if (typeof window === "undefined") {
    return {
      ...payload,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending",
    };
  }

  const all = getSubmissions();
  // Check if student already submitted this assignment
  const existingIndex = all.findIndex(
    (s) =>
      s.courseId === payload.courseId &&
      s.lessonId === payload.lessonId &&
      s.studentId === payload.studentId
  );

  const now = new Date().toISOString();
  let saved: AssignmentSubmission;

  if (existingIndex >= 0) {
    // Re-submission / update
    saved = {
      ...all[existingIndex],
      ...payload,
      status: "pending", // Reset to pending for Super Admin re-review
      updatedAt: now,
    };
    all[existingIndex] = saved;
  } else {
    // Brand new submission
    saved = {
      ...payload,
      id: `sub-${Date.now()}`,
      submittedAt: now,
      updatedAt: now,
      status: "pending",
    };
    all.unshift(saved);
  }

  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("renderlancer_submissions_change", { detail: all }));
  return saved;
}

export function reviewAssignment(
  submissionId: string,
  review: {
    status: "graded" | "needs_revision" | "rejected";
    score?: number;
    feedback: string;
    reviewerName: string;
  }
): AssignmentSubmission | undefined {
  if (typeof window === "undefined") return undefined;

  const all = getSubmissions();
  const idx = all.findIndex((s) => s.id === submissionId);
  if (idx === -1) return undefined;

  const updated: AssignmentSubmission = {
    ...all[idx],
    status: review.status,
    score: review.score,
    instructorFeedback: review.feedback,
    reviewedBy: review.reviewerName,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  all[idx] = updated;
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("renderlancer_submissions_change", { detail: all }));
  return updated;
}

// ---------------- ENROLLMENTS ----------------

export function getStudentEnrollments(studentId: string): string[] {
  if (typeof window === "undefined") return ["course-motion-ai"];
  try {
    const raw = localStorage.getItem(`${ENROLLMENTS_STORAGE_KEY}_${studentId}`);
    if (!raw) return ["course-motion-ai"];
    return JSON.parse(raw);
  } catch {
    return ["course-motion-ai"];
  }
}

export function enrollInCourse(studentId: string, courseId: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const current = getStudentEnrollments(studentId);
    if (!current.includes(courseId)) {
      const updated = [...current, courseId];
      localStorage.setItem(`${ENROLLMENTS_STORAGE_KEY}_${studentId}`, JSON.stringify(updated));

      // Also increment course enrolledCount
      const all = getCourses();
      const course = all.find((c) => c.id === courseId);
      if (course) {
        saveCourse({ ...course, enrolledCount: (course.enrolledCount || 0) + 1 });
      }
    }
    return true;
  } catch (err) {
    console.error("Error enrolling:", err);
    return false;
  }
}

export function isStudentEnrolled(studentId: string, courseId: string): boolean {
  const current = getStudentEnrollments(studentId);
  return current.includes(courseId);
}

// ---------------- STATS HELPER ----------------

export function getCoursesStats() {
  const courses = getCourses();
  const submissions = getSubmissions();

  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "ACTIVE").length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const gradedSubmissions = submissions.filter((s) => s.status === "graded").length;
  const needsRevisionSubmissions = submissions.filter((s) => s.status === "needs_revision").length;

  return {
    totalCourses,
    activeCourses,
    totalSubmissions,
    pendingSubmissions,
    gradedSubmissions,
    needsRevisionSubmissions,
  };
}

export function resetAllCoursesData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(COURSES_STORAGE_KEY);
  localStorage.removeItem(DELETED_COURSES_KEY);
  localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("renderlancer_courses_change", { detail: INITIAL_COURSES }));
  window.dispatchEvent(new CustomEvent("renderlancer_submissions_change", { detail: INITIAL_SUBMISSIONS }));
}

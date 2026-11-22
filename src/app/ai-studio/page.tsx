"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import { getActiveSession, AuthUser } from "@/lib/auth-service";
import {
  getUserSubscription,
  consumeCredit,
  UserSubscription,
} from "@/lib/subscription-service";

interface AITool {
  id: string;
  name: string;
  nameEn: string;
  category: "video" | "image" | "chat" | "motion" | "design" | "tools";
  categoryAr: string;
  badge: string;
  badgeColor: string;
  icon: string;
  desc: string;
  capabilities: string[];
  creditsRequired: string;
}

const AI_TOOLS_LIST: AITool[] = [
  {
    id: "gpt-image-2",
    name: "GPT Image 2",
    nameEn: "GPT Image 2 Pro",
    category: "image",
    categoryAr: "توليد وتعديل الصور",
    badge: "نظام الصور",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: "photo_library",
    desc: "توليد وتعديل الصور باستخدام GPT Image 2 مع دعم الصور المرجعية المتعددة ودقة 4K فائقة الوضوح.",
    capabilities: ["توليد فوري بدقة 4K", "دمج حتى 4 صور مرجعية", "تعديل جزئي Inpainting بالأوامر", "تصدير بصيغ WebP و PNG"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "render-chat",
    name: "ريندر شات",
    nameEn: "Render Chat Super",
    category: "chat",
    categoryAr: "المساعد الذكي الفائق",
    badge: "ذكاء فائق",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    icon: "chat_bubble",
    desc: "مساعدك الذكي المتطور للإجابة على تساؤلاتك، تحليل الصور، والبحث في الويب بدقة متناهية مع دعم اللغة العربية المتقن.",
    capabilities: ["معالجة مستندات PDF الضخمة", "تحليل الصور والأكواد البرمجية", "بحث حي متصل بالإنترنت", "كتابة المقالات والسيناريوهات"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "virtual-try-on",
    name: "القياس الافتراضي",
    nameEn: "Virtual Try-on Ultra",
    category: "design",
    categoryAr: "تجربة الأزياء 3D",
    badge: "تجربة واقعية",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: "checkroom",
    desc: "جرب الملابس افتراضياً على صورك الشخصية بدقة متناهية باستخدام أحدث تقنيات الذكاء الاصطناعي للمتاجر والماركات.",
    capabilities: ["مطابقة قياس الجسم واقعياً", "محاكاة خامات الأقمشة والظل", "جاهز للمتاجر الإلكترونية", "معالجة سريعة خلال 5 ثوانٍ"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "ai-avatar",
    name: "AI Avatar",
    nameEn: "AI Digital Avatar",
    category: "video",
    categoryAr: "المتحدث الرقمي",
    badge: "مجاني للمشتركين",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: "photo_camera_front",
    desc: "حوّل صورك الثابتة إلى أفتار متحدث يستعرض تقاريرك وعروضك بدقة متناهية مع حركة شفاه واقعية جداً.",
    capabilities: ["مزامنة حركة الشفاه Lip-sync", "أكثر من 40 لغة ونبرة صوت", "توليد فيديوهات تقديمية كاملة", "تصدير بجودة 1080p و 4K"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "seedance",
    name: "Seedance 2.0",
    nameEn: "Seedance Motion Engine",
    category: "motion",
    categoryAr: "توليد الفيديو السينمائي",
    badge: "سينمائي برو",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    icon: "auto_videocam",
    desc: "نظام التوليد السينمائي المتطور لمحاكاة فيزياء الحركة المتقدمة بدقة متناهية ومعدل إطارات سلس.",
    capabilities: ["فيزياء حركة طبيعية للأقمشة والرياح", "تحكم كامل بزوايا الكاميرا وحركتها", "توليد مشاهد طويلة حتى 10 ثوانٍ", "دقة ألوان سينمائية HDR"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "veo",
    name: "Veo 3.1",
    nameEn: "Veo 3.1 Google Deepmind",
    category: "video",
    categoryAr: "فيديو سينمائي فائق",
    badge: "تكنولوجيا متقدمة",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: "videocam",
    desc: "تحويل الصور إلى فيديو سينمائي مذهل باستخدام تقنية Veo 3.1 الأكثر تطوراً في العالم لمحاكاة الواقع.",
    capabilities: ["توليد سينمائي بدقة Full HD و 4K", "تناسق بصري فائق بين المشاهد", "فهم دقيق للبرومبت المعقد", "تحريك العناصر الثابتة بسلاسة"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "omni-transition",
    name: "انتقال فريمين (Omni)",
    nameEn: "Omni Frame Transition",
    category: "motion",
    categoryAr: "الانتقالات السينمائية",
    badge: "انتقال ذكي",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    icon: "video_settings",
    desc: "ارفع فريم البداية والنهاية لخلق انتقال سينمائي مذهل مع مؤثرات صوتية تلقائية بنغمة موسيقية ملائمة.",
    capabilities: ["انتقال بين مشهدين مختلفين تماماً", "توليد المؤثر الصوتي تلقائياً", "تحكم بمدة الانتقال والسرعة", "مثالي للمونتاج والإعلانات"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "motion-master",
    name: "محرك الحركة (Motion Master)",
    nameEn: "Motion Master Pro",
    category: "motion",
    categoryAr: "التحريك الديناميكي",
    badge: "تحريك متطور",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: "animation",
    desc: "تحريك العناصر ثنائية الأبعاد والرسوم التوضيحية بدقة فائقة مع محاكاة فيزياء الجاذبية والسرعة.",
    capabilities: ["تحريك الشعارات والإنفوجرافيك", "تصدير بصيغ Lottie و MP4", "تزامن مع الموسيقى التصويرية", "تحكم دقيق بمفردات الحركة"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "virtual-photo-studio",
    name: "استوديو التصوير الافتراضي",
    nameEn: "Virtual Photo Studio",
    category: "image",
    categoryAr: "تصوير المنتجات 3D",
    badge: "إضاءة استوديو",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    icon: "camera",
    desc: "ضع منتجاتك داخل استوديوهات تصوير افتراضية مع إضاءة سينمائية وخلفيات تجارية فاخرة بنقرة زر.",
    capabilities: ["عزل خلفيات المنتجات تلقائياً", "إضاءة ثلاثية الأبعاد تفاعلية", "أكثر من 150 بيئة استوديو جاهزة", "دقة تصدير جاهزة للطباعة"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "face-swap",
    name: "تبديل الوجوه / الأشخاص",
    nameEn: "Face Swap AI",
    category: "image",
    categoryAr: "المطابقة وتغيير الملامح",
    badge: "سرعة ودقة",
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    icon: "sync_alt",
    desc: "قم بتبديل ملامح الوجه أو الشخص بالكامل في أي صورة بضغطة واحدة وبدقة متناهية تحفظ الإضاءة وزاوية الرأس.",
    capabilities: ["حفظ التعبيرات الطبيعية والإضاءة", "دعم الوجوه المتعددة في المشهد", "معالجة فورية خلال ثانيتين", "تصدير عالي الدقة دون تشويش"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "prompt-extractor",
    name: "استخراج البرومبت (Prompt Extractor)",
    nameEn: "AI Prompt Reverse Engineer",
    category: "tools",
    categoryAr: "الهندسة العكسية",
    badge: "كاشف الأوامر",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: "saved_search",
    desc: "ارفع أي صورة أو تصميم واستخرج الوصف الدقيق (البرومبت) المستخدم في توليده لإعادة إنشاء نتائج متطابقة.",
    capabilities: ["تفكيك أسلوب الإضاءة والكاميرا", "استخراج الأوامر السلبية Negative", "تحديد أسماء النماذج المستخدمة", "تعديل فوري على البرومبت المستخرج"],
    creditsRequired: "مشمول في الاشتراك",
  },
  {
    id: "nano-banana-pro",
    name: "تعديل نانو بنانا برو 4K",
    nameEn: "Nano Banana Pro 4K",
    category: "tools",
    categoryAr: "الترقية والتحسين الفائق",
    badge: "سرعة فائقة",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    icon: "speed",
    desc: "ترقية الصور الضعيفة وتعديلها بالذكاء الاصطناعي بسرعة فائقة ودقة 4K Ultra HD مع تنقية التشويش.",
    capabilities: ["مضاعفة دقة الصور حتى 4X و 8X", "إصلاح ملامح الوجوه المشوشة", "إزالة الضوضاء الرقمية والتحبيب", "معالجة سحابية فائقة السرعة"],
    creditsRequired: "مشمول في الاشتراك",
  },
];

export default function AIStudioCatalogPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTool, setActiveModalTool] = useState<AITool | null>(null);

  // User and Quota State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);
  const [quotaToast, setQuotaToast] = useState<string | null>(null);
  const [quotaBlockedError, setQuotaBlockedError] = useState<string | null>(null);

  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setCurrentUser(session);
      setUserSub(getUserSubscription(session.email));
    } else {
      // Guest or default free trial demo
      setUserSub(getUserSubscription("guest@render.ps"));
    }

    const handleSubChange = () => {
      const email = getActiveSession()?.email || "guest@render.ps";
      setUserSub(getUserSubscription(email));
    };

    window.addEventListener("renderlancer_subscriptions_change", handleSubChange);
    return () => window.removeEventListener("renderlancer_subscriptions_change", handleSubChange);
  }, []);

  // Interactive Sandbox State
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);

  const handleOpenToolModal = (tool: AITool) => {
    setActiveModalTool(tool);
    setSandboxResult(null);
    setQuotaBlockedError(null);
    if (tool.id === "render-chat") {
      setSandboxPrompt("كيف أصمم معمارية سحابية موثوقة لمنصة عمل حر في فلسطين؟");
    } else if (tool.id === "prompt-extractor") {
      setSandboxPrompt("استخرج البرومبت المستخدم في تصميم بوستر تجاري فاخر لمنتج زيت زيتون فلسطيني");
    } else if (tool.category === "video") {
      setSandboxPrompt("لقطة سينمائية بطيئة لمدينة القدس عند شروق الشمس، زاوية واسعة بدقة 4K");
    } else {
      setSandboxPrompt(`تجربة إخراج فوري باستخدام قدرات أداة ${tool.name}`);
    }
  };

  const handleRunSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxPrompt.trim()) return;

    const email = currentUser?.email || "guest@render.ps";
    const creditType =
      activeModalTool?.category === "video" || activeModalTool?.category === "motion"
        ? "video"
        : activeModalTool?.id === "render-chat"
        ? "chat"
        : "image";

    // Quota check
    const check = consumeCredit(email, creditType);
    if (!check.allowed) {
      setQuotaBlockedError(check.message || "نفد رصيدك المتاح. يرجى الترقية لإكمال الاستخدام.");
      return;
    }

    setIsGenerating(true);
    setSandboxResult(null);
    setQuotaBlockedError(null);

    // Refresh sub state
    const updatedSub = getUserSubscription(email);
    setUserSub(updatedSub);

    setTimeout(() => {
      setIsGenerating(false);
      setQuotaToast(
        creditType === "video"
          ? `تم استهلاك 1 فيديو من رصيدك (المتبقي: ${updatedSub.videosTotal - updatedSub.videosUsed} فيديو)`
          : `تم استهلاك 1 ريندر من رصيدك (المتبقي: ${updatedSub.imagesTotal - updatedSub.imagesUsed} صورة)`
      );
      setTimeout(() => setQuotaToast(null), 3500);

      if (activeModalTool?.id === "render-chat") {
        setSandboxResult(
          `[استجابة Render Chat الفائقة]: تم تحليل طلبك بعناية.\nالتوصية الهندسية: اعتمد على Next.js 15 App Router مع طبقة caching ذكية، وافصل مسارات المصادقة عن قواعد البيانات الخارجية عبر JWT موثق، مع استخدام شبكة Cloudflare للحماية وتخفيض زمن الاستجابة إلى أقل من 75ms في فلسطين والشتات.`
        );
      } else if (activeModalTool?.id === "prompt-extractor") {
        setSandboxResult(
          `[نتيجة استخراج البرومبت الهندسي]:\nPrompt: "Ultra-luxury Palestinian extra virgin olive oil glass bottle, dark obsidian reflective surface, warm gold ambient backlight, water droplets, 8k resolution, cinematic commercial photography --ar 16:9 --style raw --v 6.1"`
        );
      } else if (activeModalTool?.category === "video" || activeModalTool?.category === "motion") {
        setSandboxResult(
          `[محرك التوليد السينمائي]: تم توليد لقطة فيديو 4K بدقة 60fps.\nالمعايير: Camera Dolly In 1.5x | Cinematic Depth of Field: f/1.8 | Sound FX: Ambient Wind & Subtle Oud Melody (مكتمل وجاهز للتصدير).`
        );
      } else {
        setSandboxResult(
          `[مخرجات Render Studio الحية]: تم توليد النتيجة بنجاح فائق وفق أعلى معايير الجودة 4K.\nمعلومات الريندر: GPU: NVIDIA H100 Cloud Cluster | Latency: 1.18s | الدقة: 3840x2160 WebP Lossless.`
        );
      }
    }, 1100);
  };

  const filteredTools = AI_TOOLS_LIST.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.includes(searchQuery) ||
      tool.desc.includes(searchQuery) ||
      tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-[16px]">token</span>
            <span>الترسانة الموحدة • 12 أداة ذكاء اصطناعي باشتراك واحد</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            استوديو أدوات <span className="gold-gradient-text">الذكاء الاصطناعي</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed mb-8">
            ودّع الاشتراكات المنفصلة وعوائق بطاقات الدفع الدولية. توفر لك مجموعة <strong className="text-white">Render</strong> كافة
            أدوات توليد الفيديو السينمائي، الصور فائقة الدقة 4K، المتحدث الرقمي، محاكاة القياس الافتراضي، والنماذج اللغوية في مكان واحد.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-gold-500/25 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">loyalty</span>
              <span>باقات واشتراكات الاستوديو (3 أيام تجربة مجاناً)</span>
            </Link>
            <button
              onClick={() => setIsActivationOpen(true)}
              className="px-6 py-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-white font-bold text-xs border border-gold-500/30 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>تفعيل اشتراكك برمز سري</span>
            </button>
          </div>

          {/* Live Subscription Quota & 3-Day Trial Card */}
          {userSub && (
            <div className="max-w-2xl mx-auto mt-8 p-5 rounded-3xl bg-dark-900/90 border border-gold-500/30 shadow-2xl text-right space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gold-500/15">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-sm font-bold text-white">{userSub.planName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      userSub.status === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : userSub.status === "TRIAL"
                        ? "bg-gold-500/15 text-gold-300 border-gold-500/30"
                        : "bg-red-500/15 text-red-300 border-red-500/30"
                    }`}>
                      {userSub.status === "TRIAL" ? "هدية الانضمام (3 أيام تجربة)" : userSub.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    الصلاحية: متبقي <strong className="text-gold-400">{userSub.daysRemaining} أيام</strong> (ينتهي في {userSub.expiresAt})
                  </span>
                </div>

                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">loyalty</span>
                  <span>ترقية الباقة الآن</span>
                </Link>
              </div>

              {/* Progress meters for quota */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-dark-950 border border-gold-500/20 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">رصيد الصور 4K:</span>
                    <strong className="text-white font-mono">{userSub.imagesTotal - userSub.imagesUsed} / {userSub.imagesTotal}</strong>
                  </div>
                  <div className="w-full bg-dark-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gold-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((userSub.imagesTotal - userSub.imagesUsed) / userSub.imagesTotal) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-950 border border-gold-500/20 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">رصيد الفيديو السينمائي:</span>
                    <strong className="text-white font-mono">{userSub.videosTotal - userSub.videosUsed} / {userSub.videosTotal}</strong>
                  </div>
                  <div className="w-full bg-dark-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((userSub.videosTotal - userSub.videosUsed) / userSub.videosTotal) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-950 border border-gold-500/20 space-y-1 col-span-2 sm:col-span-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">ريندر شات AI:</span>
                    <strong className="text-white font-mono">{userSub.chatTotal - userSub.chatUsed}</strong>
                  </div>
                  <div className="w-full bg-dark-850 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((userSub.chatTotal - userSub.chatUsed) / userSub.chatTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {quotaToast && (
            <div className="max-w-md mx-auto mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{quotaToast}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="mt-12 max-w-2xl mx-auto flex items-center gap-3 bg-dark-900/90 p-2 rounded-2xl border border-gold-500/30">
            <span className="material-symbols-outlined text-gold-400 text-[22px] mr-2">search</span>
            <input
              type="text"
              placeholder="ابحث عن أداة معينة (مثال: Veo، تحريك، صور، قياس، فيديو)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-500 hover:text-white text-xs px-2"
              >
                مسح
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "كافة الأدوات (12)" },
              { id: "video", label: "الفيديو والأفتار" },
              { id: "image", label: "الصور والاستوديو" },
              { id: "motion", label: "محركات الحركة والانتقال" },
              { id: "design", label: "الأزياء والقياس 3D" },
              { id: "chat", label: "المحادثة وتحليل الويب" },
              { id: "tools", label: "الترقية واستخراج الأوامر" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "gold-button-gradient text-dark-950 font-bold shadow-md"
                    : "bg-dark-900 text-gray-400 hover:text-white border border-gold-500/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Tools */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="glass-card p-6 rounded-3xl border border-gold-500/25 hover:border-gold-500/60 transition-all shadow-xl flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Header with icon and badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">{tool.icon}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                    {tool.name}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono block -mt-0.5">
                    {tool.nameEn} • {tool.categoryAr}
                  </span>
                </div>

                {/* Desc */}
                <p className="text-xs text-gray-300 leading-relaxed min-h-[48px]">
                  {tool.desc}
                </p>

                {/* Capabilities */}
                <div className="space-y-1 pt-2 border-t border-gold-500/15">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">الميزات المدعومة:</span>
                  {tool.capabilities.slice(0, 3).map((cap, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                      <span className="material-symbols-outlined text-gold-500 text-[14px]">check</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gold-500/15 flex items-center gap-2">
                <button
                  onClick={() => handleOpenToolModal(tool)}
                  className="flex-1 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>تشغيل وتجربة الأداة</span>
                </button>
                <button
                  onClick={() => setIsActivationOpen(true)}
                  title="رمز التفعيل"
                  className="p-2.5 rounded-xl bg-dark-900 hover:bg-dark-850 text-gold-400 border border-gold-500/25 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">key</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Preview & Live Sandbox Modal */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-gold-500/40 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalTool(null)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[28px]">{activeModalTool.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{activeModalTool.name}</h3>
                <span className="text-xs text-gold-400 font-mono">{activeModalTool.nameEn} • {activeModalTool.categoryAr}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{activeModalTool.desc}</p>

            {/* Interactive Live Playground */}
            <form onSubmit={handleRunSandbox} className="p-4 rounded-2xl bg-dark-900/90 border border-gold-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  <span>منصة التجربة الحية الفورية (Live AI Sandbox)</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  وصول سحابي مباشر (Enterprise Tier)
                </span>
              </div>

              {quotaBlockedError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    <span>تنبيه الرصيد السحابي:</span>
                  </div>
                  <p className="leading-relaxed">{quotaBlockedError}</p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg gold-button-gradient text-dark-950 font-bold text-[11px] shadow-md mt-1"
                  >
                    <span>الترقية إلى باقة Pro أو Agency</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  </Link>
                </div>
              )}

              <textarea
                rows={2}
                value={sandboxPrompt}
                onChange={(e) => setSandboxPrompt(e.target.value)}
                placeholder="أدخل برومبت أو سؤال للتجربة المباشرة..."
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 leading-relaxed"
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isGenerating || !sandboxPrompt.trim()}
                  className="px-5 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isGenerating ? "hourglass_empty" : "bolt"}
                  </span>
                  <span>{isGenerating ? "جاري المعالجة السحابية..." : "تشغيل النموذج وتوليد النتيجة"}</span>
                </button>
                <span className="text-[10px] text-gray-400 font-mono">
                  {activeModalTool.creditsRequired}
                </span>
              </div>

              {/* Output Box */}
              {sandboxResult && (
                <div className="p-3.5 rounded-xl bg-dark-950 border border-gold-500/40 text-xs text-gray-200 font-mono whitespace-pre-line leading-relaxed space-y-2 mt-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-gold-500/20 pb-1.5 text-[10px] text-gold-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Output Result (Ready)</span>
                    </span>
                    <span>NVIDIA H100 GPU Cluster</span>
                  </div>
                  <p>{sandboxResult}</p>
                </div>
              )}
            </form>

            <div className="p-3.5 rounded-2xl bg-dark-900 border border-gold-500/15 space-y-1.5">
              <h4 className="text-xs font-bold text-white">إمكانيات الأداة المتاحة:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-300">
                {activeModalTool.capabilities.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[14px]">check_circle</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setActiveModalTool(null);
                  setIsActivationOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-dark-900 text-gold-400 border border-gold-500/30 text-xs font-semibold hover:text-white"
              >
                تفعيل الباقة غير المحدودة برمز تفعيل (Code)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

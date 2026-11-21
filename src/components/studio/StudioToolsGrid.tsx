"use client";

import React, { useState } from "react";

interface ToolItem {
  id: string;
  name: string;
  category: "all" | "video" | "image" | "avatar" | "chat";
  categoryLabel: string;
  icon: string;
  description: string;
  statusBadge: string;
  statusColor: string;
  actionText: string;
}

const TOOLS_DATA: ToolItem[] = [
  {
    id: "gpt-image-2",
    name: "GPT Image 2",
    category: "image",
    categoryLabel: "توليد الصور",
    icon: "image_search",
    description: "توليد وتحويل الصور باستخدام GPT Image 2 مع دعم الصور المرجعية المتعددة لإنشاء شخصيات وهوية بصرية ثابتة.",
    statusBadge: "فترة تجريبية مفعلة",
    statusColor: "emerald",
    actionText: "فتح الأداة",
  },
  {
    id: "render-chat",
    name: "ريندر شات (Render Chat)",
    category: "chat",
    categoryLabel: "ذكاء لغوي",
    icon: "chat",
    description: "مساعدك الذكي المتطور للإجابة على تساؤلاتك، تحليل الملفات والصور، والبحث في الويب بدقة متناهية وسرعة فائقة.",
    statusBadge: "متاح مجاناً",
    statusColor: "emerald",
    actionText: "بدء المحادثة",
  },
  {
    id: "virtual-try-on",
    name: "القياس الافتراضي (Virtual Try-on)",
    category: "avatar",
    categoryLabel: "تجربة حصرية",
    icon: "apparel",
    description: "جرّب الملابس افتراضياً على صورتك الشخصية بدقة متناهية ومطابقة لأبعاد الجسم باستخدام أحدث تقنيات الـ AI.",
    statusBadge: "فترة تجريبية",
    statusColor: "gold",
    actionText: "تجربة الأداة",
  },
  {
    id: "veo-3-1",
    name: "Veo 3.1 السينمائي",
    category: "video",
    categoryLabel: "سينما وسينماتيك",
    icon: "videocam",
    description: "تحويل الصور والنصوص إلى فيديو سينمائي مذهل فائق الواقعية باستخدام تقنية Veo 3.1 الأكثر تطوراً عالمياً.",
    statusBadge: "نشط (تجريبي)",
    statusColor: "emerald",
    actionText: "توليد فيديو",
  },
  {
    id: "seedance-2-0",
    name: "Seedance 2.0",
    category: "video",
    categoryLabel: "محاكاة حركة",
    icon: "auto_videocam",
    description: "نظام التوليد السينمائي المتطور لمحاكاة فيزياء الحركة الواقعية المدعوم بتقنية ByteDance و Kling v5 Omni.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "فتح الأداة",
  },
  {
    id: "nano-banana-pro",
    name: "تعديل نانو بنانا برو (Nano Banana)",
    category: "image",
    categoryLabel: "سرعة خارقة 4K",
    icon: "edit_note",
    description: "تعديل الصور بالذكاء الاصطناعي بسرعة فائقة ودقة 4K Ultra HD وتفريغ العناصر مع الحفاظ التام على أدق التفاصيل.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "تحرير صورة",
  },
  {
    id: "omni-transition",
    name: "انتقال فريمين (Omni Transition)",
    category: "video",
    categoryLabel: "انتقال سينمائي",
    icon: "animation",
    description: "ارفع فريم البداية والنهاية لخلق انتقال سينمائي مذهل مع مؤثرات صوتية تلقائية مطابقة تماماً للمشهد.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "إنشاء انتقال",
  },
  {
    id: "prompt-extractor",
    name: "استخراج البرومبت (Prompt Extractor)",
    category: "chat",
    categoryLabel: "هندسة عكسية",
    icon: "manage_search",
    description: "ارفع أي صورة واستخرج الوصف الدقيق (البرومبت) المستخدم في توليدها لإعادة إنشاء نتائج وإضاءات مشابهة.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "استخراج الآن",
  },
  {
    id: "ai-avatar",
    name: "AI Avatar (الأفتار الناطق)",
    category: "avatar",
    categoryLabel: "فيديو بشري",
    icon: "person_pin",
    description: "حوّل صورك الثابتة إلى أفتار متحدث باحترافية عالية مع مزامنة كاملة لحركة الشفاه وتعبيرات الوجه بأي لغة.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "إنشاء أفتار",
  },
  {
    id: "face-swap",
    name: "تبديل الوجوه / الأشخاص (Face Swap)",
    category: "avatar",
    categoryLabel: "تبديل فوري",
    icon: "face_retouching_natural",
    description: "قم بتبديل ملامح الوجه أو الشخص بالكامل في أي صورة بضغطة واحدة وبدقة واقعية تحافظ على تعابير الوجه الأصلية.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "تبديل وجه",
  },
  {
    id: "motion-master",
    name: "محرك الحركة (Motion Master)",
    category: "video",
    categoryLabel: "تحريك مسارات",
    icon: "motion_photos_auto",
    description: "التحكم الاحترافي في مسار وحركة الكاميرا وتوجيه تدفق العناصر في الإعلانات الترويجية والتصاميم المتحركة.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "فتح المحرك",
  },
  {
    id: "virtual-studio",
    name: "استوديو التصوير (Virtual Studio)",
    category: "image",
    categoryLabel: "تصوير منتجات",
    icon: "camera",
    description: "إعداد جلسات تصوير افتراضية للمنتجات بإضاءات وظلال وزوايا احترافية ترفع مبيعات المتاجر والشركات.",
    statusBadge: "نشط",
    statusColor: "emerald",
    actionText: "دخول الاستوديو",
  },
];

interface StudioToolsGridProps {
  onOpenActivation: () => void;
}

export const StudioToolsGrid: React.FC<StudioToolsGridProps> = ({ onOpenActivation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTools =
    selectedCategory === "all"
      ? TOOLS_DATA
      : TOOLS_DATA.filter((t) => t.category === selectedCategory);

  return (
    <section id="ai-studio-hub" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold mb-3">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            مركز اشتراكات أدوات الذكاء الاصطناعي الموحد
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            أدواتنا <span className="gold-gradient-text">الاحترافية</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            اختر الأداة المناسبة لمشروعك الإبداعي القادم، أو تحكم باشتراكاتك وفترتك التجريبية
          </p>
        </div>

        {/* View toggles & activation */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenActivation}
            className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            تفعيل كود أو باقة شاملة
          </button>
          <div className="flex items-center bg-dark-900 border border-gold-500/20 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === "grid"
                  ? "bg-gold-500 text-dark-950 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              عرض شبكي
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === "list"
                  ? "bg-gold-500 text-dark-950 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              عرض القائمة
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-medium">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            selectedCategory === "all"
              ? "gold-button-gradient text-dark-950 font-bold shadow-md"
              : "bg-dark-900 text-gray-300 hover:bg-dark-850 border border-gold-500/20"
          }`}
        >
          الكل (12)
        </button>
        <button
          onClick={() => setSelectedCategory("video")}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            selectedCategory === "video"
              ? "gold-button-gradient text-dark-950 font-bold shadow-md"
              : "bg-dark-900 text-gray-300 hover:bg-dark-850 border border-gold-500/20"
          }`}
        >
          الفيديو والسينما (4)
        </button>
        <button
          onClick={() => setSelectedCategory("image")}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            selectedCategory === "image"
              ? "gold-button-gradient text-dark-950 font-bold shadow-md"
              : "bg-dark-900 text-gray-300 hover:bg-dark-850 border border-gold-500/20"
          }`}
        >
          الصور والتصميم (3)
        </button>
        <button
          onClick={() => setSelectedCategory("avatar")}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            selectedCategory === "avatar"
              ? "gold-button-gradient text-dark-950 font-bold shadow-md"
              : "bg-dark-900 text-gray-300 hover:bg-dark-850 border border-gold-500/20"
          }`}
        >
          الأفتار والهوية (3)
        </button>
        <button
          onClick={() => setSelectedCategory("chat")}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            selectedCategory === "chat"
              ? "gold-button-gradient text-dark-950 font-bold shadow-md"
              : "bg-dark-900 text-gray-300 hover:bg-dark-850 border border-gold-500/20"
          }`}
        >
          المحادثة والإنتاجية (2)
        </button>
      </div>

      {/* Grid or List Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="tool-card p-6 rounded-2xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-dark-950 transition-colors">
                    <span className="material-symbols-outlined text-[26px]">{tool.icon}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 font-medium">
                    {tool.categoryLabel}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{tool.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gold-500/15 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {tool.statusBadge}
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-gold-500 hover:text-dark-950 text-gold-400 font-bold text-xs border border-gold-500/25 transition-all">
                  {tool.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{tool.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{tool.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1">{tool.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-emerald-400 border border-emerald-500/30 hidden md:block">
                  {tool.statusBadge}
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-gold-500 hover:text-dark-950 text-gold-400 font-bold text-xs border border-gold-500/25 transition-all">
                  {tool.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

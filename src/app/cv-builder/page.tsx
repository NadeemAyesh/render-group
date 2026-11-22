"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export default function CvBuilderPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<"gold" | "slate">("gold");
  const [copied, setCopied] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("أحمد خليل النجار");
  const [jobTitle, setJobTitle] = useState("Senior Full-Stack Engineer & Cloud Architect");
  const [email, setEmail] = useState("ahmed.khalil@render.ps");
  const [phone, setPhone] = useState("+970 599 000 000");
  const [location, setLocation] = useState("فلسطين - قطاع غزة (متاح للعمل عن بعد)");
  const [portfolio, setPortfolio] = useState("https://renderlancer.ps/talents/ahmed-khalil");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/ahmed-khalil-dev");

  const [summary, setSummary] = useState(
    "مهندس برمجيات أول بخبرة تزيد عن 6 سنوات في تصميم وبناء المنصات السحابية الموزعة عالية الأداء باستخدام Next.js و TypeScript و PostgreSQL. متخصص في دمج حلول الذكاء الاصطناعي وهندسة تدفق البيانات الآمنة للشركات الناشئة والمؤسسات الدولية."
  );

  const [skills, setSkills] = useState<string[]>([
    "Next.js 15",
    "TypeScript",
    "React 19",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "pgvector",
    "Docker",
    "Gemini API",
    "CI/CD Pipelines",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      role: "Lead Full-Stack Developer",
      company: "Render Group Digital Solutions",
      period: "2023 - الحاضر",
      location: "عن بعد • فلسطين",
      bullets: [
        "قيادة وتصميم منصة أعمال سحابية تخدم أكثر من 15,000 مستخدم نشط مع خفض زمن الاستجابة إلى 78ms.",
        "هندسة نظام المدفوعات والضمان المالي (Escrow) بدعم قنوات USDT وحسابات بنك فلسطين.",
        "تكامل نماذج الذكاء الاصطناعي (Gemini 2.5) لأتمتة فحص وتعديل طلبات التوظيف بنسبة دقة 96%.",
      ],
    },
    {
      id: "exp-2",
      role: "Senior Frontend Engineer",
      company: "Apex Global Tech",
      period: "2021 - 2023",
      location: "عن بعد • دبي",
      bullets: [
        "إعادة بناء وتطوير واجهات منصة تجارة إلكترونية أدت إلى رفع معدل التحويل (Conversion Rate) بنسبة 35%.",
        "تطبيق أفضل ممارسات الـ Core Web Vitals وتحقيق علامة 99/100 على تقييمات Google Lighthouse.",
      ],
    },
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: "edu-1",
      degree: "بكالوريوس هندسة أنظمة الحاسوب والبرمجيات",
      institution: "الجامعة الإسلامية بغزة (IUG)",
      year: "2016 - 2020",
    },
  ]);

  // Compute ATS Score Dynamically
  const computeAtsScore = () => {
    let score = 65;
    if (fullName.trim()) score += 5;
    if (email.includes("@")) score += 5;
    if (summary.length > 80) score += 5;
    if (skills.length >= 6) score += 8;
    if (experiences.length >= 2) score += 7;
    // Check for metrics/numbers in bullets
    const hasNumbers = experiences.some((exp) => exp.bullets.some((b) => /\d+%|\d+ms|\d+/.test(b)));
    if (hasNumbers) score += 5;
    return Math.min(score, 99);
  };

  const atsScore = computeAtsScore();

  // AI Polish for Summary
  const handleAiPolishSummary = () => {
    setIsAiOptimizing(true);
    setAiMessage("جاري تحليل الملخص وتطبيق أفعال القوة الدولية بمعايير ATS...");
    setTimeout(() => {
      setSummary(
        "مهندس برمجيات استراتيجي وقائد تقني معتمد بسجل حافل في بناء بنى تحتية سحابية موثوقة (Next.js, TypeScript, PostgreSQL) استوعبت ملايين الطلبات الشهرية. خبير في تسريع دورات التسليم بنسبة 40%، وتقليص التكاليف السحابية بنسبة 28%، ودمج محركات الذكاء الاصطناعي لتحقيق قيمة تجارية فورية."
      );
      setIsAiOptimizing(false);
      setAiMessage("تمت ترقية الصياغة بنجاح وفق معايير شركات الـ Fortune 500!");
      setTimeout(() => setAiMessage(null), 4000);
    }, 1000);
  };

  // AI Polish for an Experience Bullet
  const handleEnhanceExperience = (expId: string) => {
    setIsAiOptimizing(true);
    setAiMessage("جاري استبدال المهام الروتينية بإنجازات رقمية مثبتة بأفعال القوة...");
    setTimeout(() => {
      setExperiences((prev) =>
        prev.map((exp) => {
          if (exp.id === expId) {
            return {
              ...exp,
              bullets: exp.bullets.map((b, idx) =>
                idx === 0
                  ? "قيادة معمارية منصة سحابية رائدة قادت لرفع نمو المعاملات بمعدل 3x مع الحفاظ على 99.98% توافرية تشغيل."
                  : b
              ),
            };
          }
          return exp;
        })
      );
      setIsAiOptimizing(false);
      setAiMessage("تم تعزيز نقاط الخبرة بنجاح بأفعال القوة والأثر الكمي!");
      setTimeout(() => setAiMessage(null), 4000);
    }, 900);
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Quick preset skills
  const presetSkills = ["Docker", "Kubernetes", "GraphQL", "Python", "Redis", "Figma", "AWS", "FastAPI"];

  // Print CV
  const handlePrint = () => {
    window.print();
  };

  // Copy Plain Text for ATS portals
  const handleCopyPlainText = () => {
    const text = `
${fullName.toUpperCase()}
${jobTitle}
${email} | ${phone} | ${location}
Portfolio: ${portfolio} | LinkedIn: ${linkedin}

PROFESSIONAL SUMMARY
${summary}

CORE TECHNICAL SKILLS
${skills.join(", ")}

PROFESSIONAL EXPERIENCE
${experiences
  .map(
    (exp) => `
${exp.role} - ${exp.company} (${exp.period})
${exp.location}
${exp.bullets.map((b) => `• ${b}`).join("\n")}
`
  )
  .join("\n")}

EDUCATION
${education.map((edu) => `${edu.degree} - ${edu.institution} (${edu.year})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <div className="no-print">
        <Navbar onOpenActivation={() => setIsActivationOpen(true)} />
      </div>

      {/* Hero Header */}
      <section className="no-print relative py-12 lg:py-16 overflow-hidden border-b border-gold-500/20 bg-dark-900/40">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>صانع السير الذاتية الذكي المعتمد دولياً • محرك ATS الحصري</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              صانع السيرة الذاتية <span className="gold-gradient-text">ATS Builder</span>
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
              ابنِ سيرتك الذاتية المتوافقة 100% مع أنظمة الفرز الآلي للشركات العالمية (Applicant Tracking Systems)، وحول مهامك إلى إنجازات رقمية مبهرة بنقرة زر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              <span>تصدير / طباعة PDF فوري</span>
            </button>
            <button
              onClick={handleCopyPlainText}
              className="px-4 py-3 rounded-xl bg-dark-900 hover:bg-dark-850 text-gray-200 border border-gold-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-gold-400">
                {copied ? "check" : "content_copy"}
              </span>
              <span>{copied ? "تم النسخ بنجاح!" : "نسخ نص ATS خام"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      {aiMessage && (
        <div className="no-print max-w-7xl mx-auto px-6 lg:px-12 w-full mt-4 animate-fade-in">
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>{aiMessage}</span>
          </div>
        </div>
      )}

      {/* Main Workspace: 2 Columns */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: FORM CONTROLS ================= */}
          <div className="no-print lg:col-span-5 space-y-6">
            
            {/* ATS Score Meter Card */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
                    <span className="material-symbols-outlined text-[22px]">troubleshoot</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">درجة التوافق مع أنظمة الفرز</h3>
                    <span className="text-[11px] text-gray-400">Global ATS Readiness</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold font-mono gold-gradient-text">{atsScore}%</span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">ممتاز للشركات الدولية</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-dark-900 rounded-full h-2.5 overflow-hidden border border-gold-500/20">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${atsScore}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="material-symbols-outlined text-emerald-400 text-[15px]">check_circle</span>
                  <span>أفعال قوة مهنية معتمدة</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="material-symbols-outlined text-emerald-400 text-[15px]">check_circle</span>
                  <span>إحصائيات وأرقام أداء كمية</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="material-symbols-outlined text-emerald-400 text-[15px]">check_circle</span>
                  <span>تنسيق عمود واحد مقروء للآلات</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="material-symbols-outlined text-emerald-400 text-[15px]">check_circle</span>
                  <span>كلمات مفتاحية متوافقة</span>
                </div>
              </div>
            </div>

            {/* Template Selector */}
            <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/25 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">اختر قالب العرض:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTemplate("gold")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTemplate === "gold"
                      ? "gold-button-gradient text-dark-950 shadow-md"
                      : "bg-dark-850 text-gray-400 hover:text-white"
                  }`}
                >
                  الذهبي الملكي (Executive Gold)
                </button>
                <button
                  onClick={() => setActiveTemplate("slate")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTemplate === "slate"
                      ? "bg-slate-700 text-white shadow-md"
                      : "bg-dark-850 text-gray-400 hover:text-white"
                  }`}
                >
                  التقني البسيط (Tech Slate)
                </button>
              </div>
            </div>

            {/* Section 1: Contact Info */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 space-y-4">
              <h3 className="text-sm font-bold text-gold-400 flex items-center gap-2 border-b border-gold-500/15 pb-2">
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>1. البيانات الشخصية ومعلومات الاتصال</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">المسمى المهني (Title)</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">رقم الهاتف / الواتساب</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">الموقع والمدينة (فلسطين / الشتات)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">رابط المعرض (Portfolio)</label>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">رابط لينكد إن (LinkedIn)</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Summary with AI Polish */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 space-y-3">
              <div className="flex items-center justify-between border-b border-gold-500/15 pb-2">
                <h3 className="text-sm font-bold text-gold-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>2. الملخص والهدف المهني (Summary)</span>
                </h3>
                <button
                  onClick={handleAiPolishSummary}
                  disabled={isAiOptimizing}
                  className="px-3 py-1 rounded-lg bg-gold-500/15 text-gold-300 border border-gold-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-gold-500 hover:text-dark-950 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>تحسين الصياغة بالـ AI</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-gray-200 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
              <span className="text-[10px] text-gray-400 block">
                نصيحة ATS: اكتب ملخصاً من 3-4 أسطر يبرز سنوات الخبرة وأقوى التقنيات والأثر التجاري.
              </span>
            </div>

            {/* Section 3: Experience */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 space-y-4">
              <div className="flex items-center justify-between border-b border-gold-500/15 pb-2">
                <h3 className="text-sm font-bold text-gold-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">work_history</span>
                  <span>3. الخبرات السابقة (Experience)</span>
                </h3>
              </div>

              {experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-dark-900/90 border border-gold-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">الخبرة #{idx + 1}</span>
                    <button
                      onClick={() => handleEnhanceExperience(exp.id)}
                      disabled={isAiOptimizing}
                      className="text-[10px] text-gold-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span className="material-symbols-outlined text-[13px]">magic_button</span>
                      <span>تعزيز بنقاط قوة رقمية (AI)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences((prev) =>
                          prev.map((item) => (item.id === exp.id ? { ...item, role: val } : item))
                        );
                      }}
                      placeholder="المسمى الوظيفي"
                      className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExperiences((prev) =>
                          prev.map((item) => (item.id === exp.id ? { ...item, company: val } : item))
                        );
                      }}
                      placeholder="اسم الشركة"
                      className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-white"
                    />
                  </div>

                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-gold-500 font-bold mt-1 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExperiences((prev) =>
                            prev.map((item) =>
                              item.id === exp.id
                                ? {
                                    ...item,
                                    bullets: item.bullets.map((b, i) => (i === bIdx ? val : b)),
                                  }
                                : item
                            )
                          );
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-gray-300 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Section 4: Skills */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 space-y-3">
              <h3 className="text-sm font-bold text-gold-400 flex items-center gap-2 border-b border-gold-500/15 pb-2">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                <span>4. المهارات والتقنيات (Core Skills)</span>
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-dark-900 border border-gold-500/30 text-gold-300 text-xs flex items-center gap-1 font-mono"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 text-gray-400 ml-1 text-[13px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill Form */}
              <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="أضف مهارة جديدة واضغط Enter..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gold-500/20 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shrink-0"
                >
                  إضافة
                </button>
              </form>

              {/* Suggested Skills */}
              <div className="pt-2">
                <span className="text-[10px] text-gray-400 block mb-1">اقتراحات سريعة:</span>
                <div className="flex flex-wrap gap-1">
                  {presetSkills.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        if (!skills.includes(preset)) setSkills([...skills, preset]);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-dark-900 hover:bg-gold-500/20 text-gray-300 border border-gray-700 hover:border-gold-500/40"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Education */}
            <div className="glass-card p-6 rounded-3xl border border-gold-500/25 space-y-3">
              <h3 className="text-sm font-bold text-gold-400 flex items-center gap-2 border-b border-gold-500/15 pb-2">
                <span className="material-symbols-outlined text-[18px]">school</span>
                <span>5. التعليم والشهادات (Education)</span>
              </h3>

              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-xl bg-dark-900 border border-gold-500/20 space-y-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEducation((prev) =>
                        prev.map((item) => (item.id === edu.id ? { ...item, degree: val } : item))
                      );
                    }}
                    placeholder="الدرجة العلمية"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-white font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducation((prev) =>
                          prev.map((item) => (item.id === edu.id ? { ...item, institution: val } : item))
                        );
                      }}
                      placeholder="اسم الجامعة أو المؤسسة"
                      className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-gray-300"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEducation((prev) =>
                          prev.map((item) => (item.id === edu.id ? { ...item, year: val } : item))
                        );
                      }}
                      placeholder="سنوات الدراسة"
                      className="px-2.5 py-1.5 rounded-lg bg-dark-950 border border-gold-500/20 text-xs text-gray-300 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ================= RIGHT COLUMN: LIVE RESUME SHEET PREVIEW ================= */}
          <div className="lg:col-span-7 sticky top-24">
            
            <div className="no-print flex items-center justify-between mb-4 px-2">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>المعاينة الحية الفورية (Live Document Preview)</span>
              </span>
              <span className="text-xs text-gold-400 font-mono">
                {activeTemplate === "gold" ? "قالب: Executive Royal Gold" : "قالب: Modern Tech Slate"}
              </span>
            </div>

            {/* Resume Sheet Container (Print Target) */}
            <div
              id="printable-cv"
              className={`rounded-3xl p-8 sm:p-12 shadow-2xl transition-all border ${
                activeTemplate === "gold"
                  ? "bg-[#0A0D14] border-gold-500/40 text-gray-200"
                  : "bg-slate-900 border-slate-700 text-slate-100"
              }`}
            >
              {/* Header */}
              <div className="border-b border-gold-500/30 pb-6 text-right space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {fullName || "اسم المستخدم"}
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30 font-semibold w-max">
                    {location}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gold-400 tracking-wide">
                  {jobTitle || "المسمى المهني"}
                </p>

                {/* Contact Bar */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-2 text-xs text-gray-300 font-mono">
                  {email && (
                    <span className="flex items-center gap-1">
                      <span className="text-gold-500">✉</span> {email}
                    </span>
                  )}
                  {phone && (
                    <span className="flex items-center gap-1">
                      <span className="text-gold-500">☎</span> {phone}
                    </span>
                  )}
                  {portfolio && (
                    <span className="flex items-center gap-1 text-gold-300 underline">
                      <span>🌐</span> {portfolio}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="py-6 border-b border-gold-500/20 space-y-2 text-right">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest font-mono">
                    الهدف والملخص المهني (Professional Summary)
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Core Skills */}
              {skills.length > 0 && (
                <div className="py-6 border-b border-gold-500/20 space-y-2.5 text-right">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest font-mono">
                    المهارات والتقنيات الأساسية (Technical Competencies)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-dark-900 border border-gold-500/25 text-gray-200 text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {experiences.length > 0 && (
                <div className="py-6 border-b border-gold-500/20 space-y-5 text-right">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest font-mono">
                    الخبرات العملية والمشاريع (Professional Experience)
                  </h3>

                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                          <strong className="text-white text-sm font-bold">{exp.role}</strong>
                          <span className="text-gold-400 font-mono font-semibold">{exp.period}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>{exp.company}</span>
                          <span>{exp.location}</span>
                        </div>
                        <ul className="space-y-1 pt-1">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                              <span className="text-gold-500 shrink-0 font-bold mt-0.5">▪</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="pt-6 space-y-3 text-right">
                  <h3 className="text-xs font-bold text-gold-400 uppercase tracking-widest font-mono">
                    التعليم الأكاديمي والشهادات (Education & Credentials)
                  </h3>

                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white font-bold block">{edu.degree}</strong>
                        <span className="text-gray-400 text-[11px]">{edu.institution}</span>
                      </div>
                      <span className="text-gold-400 font-mono font-semibold">{edu.year}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Stamp */}
              <div className="mt-8 pt-4 border-t border-gold-500/20 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>RenderLancer Verified Palestinian Talent</span>
                <span>ATS Compliant Profile • System Score: {atsScore}/100</span>
              </div>
            </div>

            {/* Quick Export Hint */}
            <div className="no-print mt-4 p-3 rounded-2xl bg-dark-900 border border-gold-500/20 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                جاهز للمشاركة أو الطباعة؟ اضغط على زر التصدير في الأعلى أو استخدم الاختصار:{" "}
                <kbd className="px-2 py-0.5 rounded bg-dark-850 border border-gold-500/30 text-gold-300 font-mono">
                  Ctrl + P
                </kbd>
              </span>
              <button
                onClick={handlePrint}
                className="text-gold-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>طباعة الآن</span>
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      <div className="no-print">
        <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      </div>

      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

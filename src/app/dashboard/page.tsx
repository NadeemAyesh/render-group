"use client";

import React, { useState } from "react";
import { useAuth } from "./layout";
import { hasPermission } from "@/lib/permissions";

interface MockJob {
  id: string;
  title: string;
  company: string;
  location: string;
  budget: string;
  duration: string;
  aiMatch: number; // e.g. 97%
  isDiasporaSponsor: boolean;
  skills: string[];
  description: string;
}

const MOCK_JOBS: MockJob[] = [
  {
    id: "job-101",
    title: "هندسة وبناء منصة SaaS متكاملة بـ Next.js 15 و PostgreSQL",
    company: "مجموعة الأفق الرقمية (شركة فلسطينية في دبي)",
    location: "عن بعد • الشتات والخليج",
    budget: "$1,200.00",
    duration: "14 يوم",
    aiMatch: 97,
    isDiasporaSponsor: true,
    skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    description:
      "نبحث عن مهندس برمجيات فلسطيني متمكن لتطوير البنية الأمامية والخلفية لمنصة حجز وإدارة استشارات سحابية مع ربط بوابات الدفع.",
  },
  {
    id: "job-102",
    title: "تطوير تطبيق هواتف ذكية (iOS & Android) باستخدام Flutter",
    company: "ابتكار للتقنية (شركة ناشئة في رام الله)",
    location: "عن بعد • الضفة الغربية",
    budget: "$850.00",
    duration: "20 يوم",
    aiMatch: 92,
    isDiasporaSponsor: false,
    skills: ["Flutter", "Dart", "Firebase", "State Management"],
    description:
      "المشروع يتطلب بناء تطبيق لطلب وتتبع الخدمات المحلية مع إشعارات لحظية ولوحة تحكم متجاوبة.",
  },
  {
    id: "job-103",
    title: "توليد محتوى تسويقي وفيديوهات ترويجية بأدوات Veo 3.1 و GPT Image",
    company: "وكالة الإبداع العربي (الكويت)",
    location: "عن بعد • الخليج العربي",
    budget: "$600.00",
    duration: "7 أيام",
    aiMatch: 89,
    isDiasporaSponsor: true,
    skills: ["Veo 3.1", "GPT Image 2", "Nano Banana", "مونتاج فيديو"],
    description:
      "إنشاء 5 حملات فيديو سينمائية متحركة لمنتجات تجارة إلكترونية بالاعتماد على استوديو أدوات الذكاء الاصطناعي الخاص بـ Render Group.",
  },
];

export default function TalentDashboardPage() {
  const { currentUser } = useAuth();
  const [selectedJobForProposal, setSelectedJobForProposal] = useState<MockJob | null>(null);
  const [proposalRate, setProposalRate] = useState<string>("1100");
  const [proposalDays, setProposalDays] = useState<string>("12");
  const [proposalLetter, setProposalLetter] = useState<string>(
    "تحياتي، اطلعت على متطلبات المشروع وبفضل خبرتي العميقة في Next.js 15 وبناء الأنظمة السحابية يسعدني تنفيذ العمل بأعلى معايير الأداء والـ SEO."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Check Action-level permissions
  const canSubmitProposal = hasPermission(currentUser, "action.jobs.submit_proposal");
  const canDeleteJob = hasPermission(currentUser, "action.jobs.delete");
  const canPublishContent = hasPermission(currentUser, "action.content.publish");

  const handleOpenProposal = (job: MockJob) => {
    setSelectedJobForProposal(job);
    setSubmittedSuccess(false);
  };

  const handleSendProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSelectedJobForProposal(null);
        setSubmittedSuccess(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-8">
      
      {/* ================= PERMISSIONS & ROLE STATUS BANNER ================= */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white">
              أنت تتصفح اللوحة بدور:{" "}
              <strong className="text-gold-400 font-mono">[{currentUser.role}]</strong>
            </span>
            {currentUser.customGrantedPermissions.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                +{currentUser.customGrantedPermissions.length} صلاحية استثنائية ممنوحة!
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">
            الصلاحيات تتوارث شجرياً (Menu ➜ Page ➜ Action). لاحظ كيف تتفعل الأزرار وتتغير حسب الدور!
          </p>
        </div>

        {/* Action Permission Diagnostic Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1 ${
              canSubmitProposal
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-red-500/15 text-red-300 border border-red-500/30 opacity-70"
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">
              {canSubmitProposal ? "check_circle" : "cancel"}
            </span>
            action.jobs.submit_proposal
          </span>

          <span
            className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-semibold flex items-center gap-1 ${
              canDeleteJob
                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                : "bg-gray-800 text-gray-500 border border-gray-700"
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">
              {canDeleteJob ? "lock_open" : "lock"}
            </span>
            action.jobs.delete
          </span>
        </div>
      </div>

      {/* ================= METRICS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">مشاريع متوافقة بالـ AI</span>
            <span className="material-symbols-outlined text-gold-400 text-[22px]">psychology</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">24 مشروع</span>
            <span className="block text-[11px] text-emerald-400 mt-1">تطابق يفوق 85% لمهاراتك</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">عروضي النشطة</span>
            <span className="material-symbols-outlined text-gold-400 text-[22px]">send_and_archive</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold gold-gradient-text">3 عروض</span>
            <span className="block text-[11px] text-gray-400 mt-1">قيد دراسة أصحاب الأعمال</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">عقود منجزة ومحمية</span>
            <span className="material-symbols-outlined text-gold-400 text-[22px]">verified</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">14 عقد</span>
            <span className="block text-[11px] text-gold-400 mt-1">تقييم ممتاز 5.0 ★</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">الرصيد القابل للسحب</span>
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">account_balance_wallet</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-400">$120.00</span>
            <span className="block text-[11px] text-gray-400 mt-1">جاهز للسحب (USDT / Bank)</span>
          </div>
        </div>

      </div>

      {/* ================= JOBS & PROJECTS FEED ================= */}
      <div id="jobs-feed" className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gold-500/15">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[24px]">work_history</span>
              المشاريع والفرص الموصى بها لك بالذكاء الاصطناعي
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              تمت مطابقتها تلقائياً استناداً إلى خبراتك المسجلة وسجل إنجازاتك
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">ترتيب حسب:</span>
            <select className="px-3 py-1.5 rounded-xl bg-dark-900 border border-gold-500/25 text-xs text-gray-200 focus:outline-none">
              <option>أعلى تطابق بالـ AI (الأفضل لك)</option>
              <option>الميزانية الأعلى أولاً</option>
              <option>الأحدث نشراً</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {MOCK_JOBS.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-dark-900/90 border border-gold-500/20 hover:border-gold-500/50 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white hover:text-gold-400 transition-colors cursor-pointer text-lg">
                      {job.title}
                    </span>
                    {job.isDiasporaSponsor && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30 flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[13px]">public</span>
                        شريك شتات فلسطيني
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-gold-500">domain</span>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">place</span>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-gray-400">schedule</span>
                      المدة المقدرة: {job.duration}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-dark-850 text-gold-300 border border-gold-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Left Side Budget & AI Match Badge */}
                <div className="flex flex-col md:items-end justify-between gap-4 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/15 border border-gold-500/30 mb-2">
                      <span className="material-symbols-outlined text-gold-400 text-[16px]">auto_awesome</span>
                      <span className="text-xs font-bold text-gold-300">
                        {job.aiMatch}% تطابق AI
                      </span>
                    </div>
                    <span className="block text-xl font-bold font-mono text-white">
                      {job.budget}
                    </span>
                    <span className="block text-[10px] text-gray-400">ميزانية معتمدة في الضمان</span>
                  </div>

                  {/* Actions (Enforcing RBAC action permissions) */}
                  <div className="flex items-center gap-2">
                    {canDeleteJob && (
                      <button
                        title="صلاحية إدارية: action.jobs.delete"
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}

                    <button
                      disabled={!canSubmitProposal}
                      onClick={() => handleOpenProposal(job)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                        canSubmitProposal
                          ? "gold-button-gradient text-dark-950"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                      }`}
                    >
                      <span>
                        {canSubmitProposal ? "تقديم عرض الآن" : "صلاحية التقديم مقيدة"}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">
                        {canSubmitProposal ? "arrow_back" : "lock"}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= PROPOSALS TRACKER (عروضي المقدمة) ================= */}
      <div id="proposals-tracker" className="p-6 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gold-500/15">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-gold-400 text-[20px]">send_and_archive</span>
            تتبع العروض المقدمة من طرفك (Proposals Tracker)
          </h3>
          <span className="text-xs text-gold-400 font-mono">3 عروض نشطة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gold-500/15 text-gray-400 pb-2">
                <th className="py-2.5 font-semibold">المشروع</th>
                <th className="py-2.5 font-semibold">الجهة صاحبة العمل</th>
                <th className="py-2.5 font-semibold">عرضك المالي</th>
                <th className="py-2.5 font-semibold">المدة المقترحة</th>
                <th className="py-2.5 font-semibold">حالة العرض</th>
                <th className="py-2.5 font-semibold">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              <tr>
                <td className="py-3.5 font-bold text-white">تطوير لوحة تحكم سحابية لشركة عقارية</td>
                <td className="py-3.5 text-gray-300">مجموعة الاستثمار (القدس)</td>
                <td className="py-3.5 font-mono text-emerald-400 font-bold">$900.00</td>
                <td className="py-3.5 text-gray-300">10 أيام</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    تم قبولك • بانتظار بدء العمل
                  </span>
                </td>
                <td className="py-3.5">
                  <button className="text-gold-400 hover:underline font-bold">عرض العقد</button>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">تصميم واجهات وتجربة مستخدم لتطبيق تجارة</td>
                <td className="py-3.5 text-gray-300">دار المعمار (الدوحة)</td>
                <td className="py-3.5 font-mono text-emerald-400 font-bold">$400.00</td>
                <td className="py-3.5 text-gray-300">5 أيام</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30 text-[10px] font-semibold">
                    قيد المراجعة الفنية
                  </span>
                </td>
                <td className="py-3.5">
                  <button className="text-gray-400 hover:text-white">تعديل العرض</button>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 font-bold text-white">تدقيق وحماية أمنية لمتجر إلكتروني</td>
                <td className="py-3.5 text-gray-300">شبكة رواد الأعمال (لندن)</td>
                <td className="py-3.5 font-mono text-emerald-400 font-bold">$650.00</td>
                <td className="py-3.5 text-gray-300">7 أيام</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-semibold">
                    مقابلة مجدولة غداً
                  </span>
                </td>
                <td className="py-3.5">
                  <button className="text-blue-400 hover:underline font-bold">فتح المحادثة</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: SUBMIT PROPOSAL ================= */}
      {selectedJobForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-6">
            
            <button
              onClick={() => setSelectedJobForProposal(null)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-[15px]">work</span>
                تقديم عرض على: {selectedJobForProposal.company}
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedJobForProposal.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                الميزانية المتاحة للمشروع:{" "}
                <strong className="text-gold-400 font-mono">
                  {selectedJobForProposal.budget}
                </strong>
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-400 text-[48px]">check_circle</span>
                <h4 className="text-base font-bold text-white">تم إرسال عرضك بنجاح!</h4>
                <p className="text-xs text-emerald-300">
                  تم إشعار صاحب العمل وسيصلك تنبيه فور مراجعة العرض وبدء التواصل المباشر.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      قيمة العرض المالي المطلوب ($ USD)
                    </label>
                    <input
                      type="number"
                      value={proposalRate}
                      onChange={(e) => setProposalRate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-sm font-mono text-emerald-400 focus:outline-none focus:border-gold-500"
                    />
                    <span className="text-[10px] text-gray-400 block mt-1">
                      صافي مستحقاتك بعد خصم ضمان المنصة:{" "}
                      <strong className="text-white font-mono">
                        ${(Number(proposalRate || 0) * 0.95).toFixed(2)}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      مدة التسليم المتوقعة (بالأيام)
                    </label>
                    <input
                      type="number"
                      value={proposalDays}
                      onChange={(e) => setProposalDays(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-sm font-mono text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-white">
                      رسالة العرض الفني (Cover Letter)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProposalLetter(
                          `تحياتي، اطلعت على متطلبات ${selectedJobForProposal.title}. كمهندس برمجيات متخصص في ${selectedJobForProposal.skills.join(
                            " و "
                          )}، قمت بإنجاز مشاريع سابقة مشابهة حققت كفاءة تشغيلية 99%. خطة العمل ستتضمن مرحلة التصميم المعماري، التطوير السريع، والاختبار الشامل مع تسليم موثق.`
                        )
                      }
                      className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      إعادة الصياغة بالذكاء الاصطناعي ✨
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={proposalLetter}
                    onChange={(e) => setProposalLetter(e.target.value)}
                    className="w-full p-3 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-gray-200 focus:outline-none focus:border-gold-500 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setSelectedJobForProposal(null)}
                    className="px-4 py-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-300 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSendProposal}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <span>{isSubmitting ? "جاري الإرسال..." : "تأكيد إرسال العرض"}</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

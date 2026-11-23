"use client";

import React, { useState, useEffect } from "react";
import {
  getFAQs,
  saveFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  FAQItem,
  getSupportTickets,
  updateSupportTicketStatus,
  addTicketReply,
  deleteSupportTicket,
  SupportTicket,
  getAiSupportConfig,
  saveAiSupportConfig,
  AiSupportConfig,
  DEFAULT_AI_SUPPORT_CONFIG,
} from "@/lib/support-service";
import { getSiteSettings, saveSiteSettings, SiteSettings } from "@/lib/site-settings-service";

export const SupportAdminSection: React.FC = () => {
  const [subTab, setSubTab] = useState<"ai-bot" | "social-contact" | "tickets" | "faqs">("ai-bot");

  // AI Support Bot Configuration State
  const [aiConfig, setAiConfig] = useState<AiSupportConfig>(DEFAULT_AI_SUPPORT_CONFIG);
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [aiSaveSuccess, setAiSaveSuccess] = useState(false);

  // Social & Direct Contact Channels State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());
  const [socialForm, setSocialForm] = useState({
    supportWhatsapp: siteSettings.supportWhatsapp || "+970 599 908 299",
    supportPhone: siteSettings.supportPhone || "+970 599 908 299",
    supportEmail: siteSettings.supportEmail || "support@renderlancer.ps",
    officialFacebook: siteSettings.officialFacebook || "https://www.facebook.com/Rendergroup.studio/",
    officialInstagram: siteSettings.officialInstagram || "https://www.instagram.com/render.group_studio/",
    officialTelegram: siteSettings.officialTelegram || "@RenderLancer_Support",
    officialTwitter: siteSettings.officialTwitter || "https://x.com/renderlancer",
    officialLinkedIn: siteSettings.officialLinkedIn || "https://linkedin.com/company/renderlancer",
  });
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialSaveSuccess, setSocialSaveSuccess] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState<{
    category: FAQItem["category"];
    question: string;
    answer: string;
    order: number;
    published: boolean;
  }>({
    category: "general",
    question: "",
    answer: "",
    order: 1,
    published: true,
  });

  useEffect(() => {
    setAiConfig(getAiSupportConfig());
    setTickets(getSupportTickets());
    setFaqs(getFAQs());
    const currentSettings = getSiteSettings();
    setSiteSettings(currentSettings);
    setSocialForm({
      supportWhatsapp: currentSettings.supportWhatsapp || "+970 599 908 299",
      supportPhone: currentSettings.supportPhone || "+970 599 908 299",
      supportEmail: currentSettings.supportEmail || "support@renderlancer.ps",
      officialFacebook: currentSettings.officialFacebook || "https://www.facebook.com/Rendergroup.studio/",
      officialInstagram: currentSettings.officialInstagram || "https://www.instagram.com/render.group_studio/",
      officialTelegram: currentSettings.officialTelegram || "@RenderLancer_Support",
      officialTwitter: currentSettings.officialTwitter || "https://x.com/renderlancer",
      officialLinkedIn: currentSettings.officialLinkedIn || "https://linkedin.com/company/renderlancer",
    });

    const handleTicketsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportTicket[]>;
      if (customEvent.detail) setTickets(customEvent.detail);
    };

    const handleFaqsChange = (e: Event) => {
      const customEvent = e as CustomEvent<FAQItem[]>;
      if (customEvent.detail) setFaqs(customEvent.detail);
    };

    window.addEventListener("renderlancer_tickets_change", handleTicketsChange);
    window.addEventListener("renderlancer_faqs_change", handleFaqsChange);
    return () => {
      window.removeEventListener("renderlancer_tickets_change", handleTicketsChange);
      window.removeEventListener("renderlancer_faqs_change", handleFaqsChange);
    };
  }, []);

  // Handle Save AI Bot Config
  const handleSaveAiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAi(true);
    saveAiSupportConfig(aiConfig);
    setTimeout(() => {
      setIsSavingAi(false);
      setAiSaveSuccess(true);
      setTimeout(() => setAiSaveSuccess(false), 3000);
    }, 400);
  };

  // Handle Save Social & Contact Channels
  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocial(true);
    saveSiteSettings(socialForm);
    setTimeout(() => {
      setIsSavingSocial(false);
      setSocialSaveSuccess(true);
      setTimeout(() => setSocialSaveSuccess(false), 3000);
    }, 400);
  };

  // Ticket Operations
  const handleStatusChange = (id: string, status: SupportTicket["status"]) => {
    updateSupportTicketStatus(id, status);
    setTickets(getSupportTickets());
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status });
    }
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;
    addTicketReply(selectedTicket.id, {
      sender: "admin",
      message: replyMessage.trim(),
    });
    setReplyMessage("");
    const updatedTickets = getSupportTickets();
    setTickets(updatedTickets);
    const updatedSelected = updatedTickets.find((t) => t.id === selectedTicket.id);
    if (updatedSelected) setSelectedTicket(updatedSelected);
  };

  const handleDeleteTicket = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه التذكرة نهائياً؟")) {
      deleteSupportTicket(id);
      setTickets(getSupportTickets());
      if (selectedTicket?.id === id) setSelectedTicket(null);
    }
  };

  // FAQ Operations
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      category: "general",
      question: "",
      answer: "",
      order: faqs.length + 1,
      published: true,
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FAQItem) => {
    setEditingFaq(item);
    setFaqForm({
      category: item.category,
      question: item.question,
      answer: item.answer,
      order: item.order,
      published: item.published,
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    if (editingFaq) {
      updateFAQ(editingFaq.id, faqForm);
    } else {
      addFAQ(faqForm);
    }

    setFaqs(getFAQs());
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال الشائع؟")) {
      deleteFAQ(id);
      setFaqs(getFAQs());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner and Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold-500 text-[24px]">support_agent</span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              إدارة الدعم الفني، الذكاء الاصطناعي، وقنوات التواصل الموحدة
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            تحكم كامل بمساعد الـ AI الذكي (Render AI Agent)، حسابات السوشيال، تذاكر الدعم، وبنك الأسئلة الشائعة (FAQ)
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-dark-950 rounded-xl border border-slate-200 dark:border-dark-800 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setSubTab("ai-bot")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              subTab === "ai-bot"
                ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span>وكيل الـ AI الذكي</span>
          </button>

          <button
            onClick={() => setSubTab("social-contact")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              subTab === "social-contact"
                ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>السوشيال والواتساب</span>
          </button>

          <button
            onClick={() => setSubTab("tickets")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              subTab === "tickets"
                ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
            <span>تذاكر الدعم ({tickets.length})</span>
          </button>

          <button
            onClick={() => setSubTab("faqs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              subTab === "faqs"
                ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            <span>الأسئلة الشائعة FAQ ({faqs.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: AI SUPPORT AGENT CONFIG ================= */}
      {subTab === "ai-bot" && (
        <form onSubmit={handleSaveAiConfig} className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>إعدادات مساعد الدعم الذكي (Free AI Support Agent)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                يقوم هذا العميل الذكي بالرد على كافة استفسارات الزوار والعملاء في الأيقونة العائمة تلقائياً 24/7 مجاناً.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-dark-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-800">
              <input
                type="checkbox"
                checked={aiConfig.enabled}
                onChange={(e) => setAiConfig({ ...aiConfig, enabled: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-gray-200">تفعيل المساعد الذكي</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
                اسم الوكيل الذكي (Agent Name)
              </label>
              <input
                type="text"
                required
                value={aiConfig.agentName}
                onChange={(e) => setAiConfig({ ...aiConfig, agentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
                صفة / مسمى الوكيل (Role)
              </label>
              <input
                type="text"
                required
                value={aiConfig.agentRole}
                onChange={(e) => setAiConfig({ ...aiConfig, agentRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
              رسالة الترحيب الأولى للمستخدمين (Greeting Message)
            </label>
            <input
              type="text"
              required
              value={aiConfig.greetingMessage}
              onChange={(e) => setAiConfig({ ...aiConfig, greetingMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
              التعليمات الأساسية وقاعدة المعرفة (System Prompt & Knowledge Base)
            </label>
            <textarea
              rows={6}
              value={aiConfig.systemPrompt}
              onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              يحدد هذا الموجه سلوك المساعد، طريقة توجيه العملاء للوظائف واستوديو الـ AI، والإجابة عن الضمان المالي Escrow وقنوات السحب.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
                محرك الذكاء الاصطناعي (AI Provider)
              </label>
              <input
                type="text"
                disabled
                value="Gemini Pro 1.5 Flash + Built-in Intelligent Agent (مجاني وتلقائي)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-dark-950/50 border border-slate-200 dark:border-dark-800 text-xs text-slate-500 dark:text-gray-400 cursor-not-allowed font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1.5">
                حالة التكلفة والتشغيل (Cost & Quota)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>مجاني 100% بدون استهلاك رصيد خارجي مع وكيل مدمج عالي الدقة</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between">
            {aiSaveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>تم حفظ وتحديث إعدادات وكيل الذكاء الاصطناعي بنجاح!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSavingAi}
              className="px-6 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow hover:scale-105 transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isSavingAi ? "جاري الحفظ..." : "حفظ إعدادات الـ AI Agent"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 2: SOCIAL & CONTACT CHANNELS ================= */}
      {subTab === "social-contact" && (
        <form onSubmit={handleSaveSocial} className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-dark-800 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-500 text-[20px]">share</span>
              <span>روابط حسابات السوشيال وقنوات التواصل المباشرة (Social & Support Channels)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              تظهر هذه البيانات في الأيقونة العائمة (Bottom Left)، صفحة اتصل بنا (Contact Us)، وتذييل المنصة (Footer).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">chat</span>
                <span>رقم واتساب الدعم الفني المباشر</span>
              </label>
              <input
                type="text"
                required
                value={socialForm.supportWhatsapp}
                onChange={(e) => setSocialForm({ ...socialForm, supportWhatsapp: e.target.value })}
                placeholder="+970 599 908 299"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Direct Phone */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">call</span>
                <span>رقم هاتف الاتصال المباشر</span>
              </label>
              <input
                type="text"
                required
                value={socialForm.supportPhone}
                onChange={(e) => setSocialForm({ ...socialForm, supportPhone: e.target.value })}
                placeholder="+970 599 908 299"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Facebook */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold">f</span>
                <span>رابط فيسبوك الرسمي (Render Group Studio)</span>
              </label>
              <input
                type="url"
                required
                value={socialForm.officialFacebook}
                onChange={(e) => setSocialForm({ ...socialForm, officialFacebook: e.target.value })}
                placeholder="https://www.facebook.com/Rendergroup.studio/"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Instagram */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-pink-500 text-[18px]">photo_camera</span>
                <span>رابط إنستغرام الرسمي (@render.group_studio)</span>
              </label>
              <input
                type="url"
                required
                value={socialForm.officialInstagram}
                onChange={(e) => setSocialForm({ ...socialForm, officialInstagram: e.target.value })}
                placeholder="https://www.instagram.com/render.group_studio/"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Official Email */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">mail</span>
                <span>البريد الإلكتروني الرسمي للدعم</span>
              </label>
              <input
                type="email"
                required
                value={socialForm.supportEmail}
                onChange={(e) => setSocialForm({ ...socialForm, supportEmail: e.target.value })}
                placeholder="support@renderlancer.ps"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Telegram */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-500 text-[18px]">send</span>
                <span>معرف تيليجرام الرسمي</span>
              </label>
              <input
                type="text"
                value={socialForm.officialTelegram}
                onChange={(e) => setSocialForm({ ...socialForm, officialTelegram: e.target.value })}
                placeholder="@RenderLancer_Support"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-dark-800 flex items-center justify-between">
            {socialSaveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>تم تحديث روابط التواصل والسوشيال في كامل المنظومة!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSavingSocial}
              className="px-6 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-2 shadow hover:scale-105 transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isSavingSocial ? "جاري التحديث..." : "حفظ قنوات التواصل"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 3: SUPPORT TICKETS ================= */}
      {subTab === "tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Tickets List (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                تذاكر واستفسارات المستخدمين ({tickets.length})
              </h3>
              <span className="text-[10px] text-gray-400">تحديث فوري</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {tickets.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">لا توجد أي تذاكر واردة حالياً.</div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTicket?.id === t.id
                        ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
                        : "bg-slate-50 dark:bg-dark-950 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {t.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          t.status === "new"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                            : t.status === "in_progress"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {t.status === "new" && "جديدة"}
                        {t.status === "in_progress" && "قيد المتابعة"}
                        {t.status === "resolved" && "تم الحل"}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 truncate">
                      {t.subject}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                      <span className="font-mono">#{t.id}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Details & Action Panel (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-500">#{selectedTicket.id}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      المرسل: <strong className="text-slate-800 dark:text-gray-200">{selectedTicket.name}</strong> • {selectedTicket.email}
                      {selectedTicket.phone && <span> • {selectedTicket.phone}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value as any)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 font-bold focus:outline-none"
                    >
                      <option value="new">جديدة</option>
                      <option value="in_progress">قيد المتابعة</option>
                      <option value="resolved">تم الحل والاعتماد</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTicket(selectedTicket.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="حذف التذكرة"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 text-xs text-slate-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {selectedTicket.message}
                </div>

                {/* Replies Thread */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-bold text-gray-400 block">سجل الردود والمتابعة:</span>
                    {selectedTicket.replies.map((r) => (
                      <div
                        key={r.id}
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          r.sender === "admin"
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 mr-4"
                            : "bg-slate-100 dark:bg-dark-800 text-slate-900 dark:text-white ml-4"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px] font-bold">
                          <span>{r.sender === "admin" ? "فريق الإدارة (Super Admin)" : "المستخدم"}</span>
                          <span>{r.timestamp}</span>
                        </div>
                        <p>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Form */}
                <form onSubmit={handleSendTicketReply} className="pt-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-gray-200">
                    إرسال رد رسمي للمستخدم
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="اكتب رد الدعم الفني هنا..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!replyMessage.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs hover:bg-gold-400 disabled:opacity-40 transition-all shadow"
                    >
                      إرسال الرد
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-center text-gray-400 text-xs">
                <span className="material-symbols-outlined text-[40px] block mb-2 text-slate-300 dark:text-dark-700">
                  contact_support
                </span>
                اختر تذكرة من القائمة لمراجعة تفاصيلها والرد عليها أو تغيير حالتها.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 4: FAQS MANAGEMENT ================= */}
      {subTab === "faqs" && (
        <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-500 text-[20px]">quiz</span>
                <span>إدارة الأسئلة الشائعة (FAQ Management)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                تظهر هذه الأسئلة في صفحة الأسئلة الشائعة العامة (/faq) وفي قاعدة معارف وكيل الـ AI.
              </p>
            </div>

            <button
              onClick={handleOpenAddFaq}
              className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-gold-400 font-bold border border-amber-500/20">
                      {f.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.question}</h4>
                    {!f.published && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 dark:bg-dark-800 text-gray-500">
                        مسودة غير منشورة
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{f.answer}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditFaq(f)}
                    className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                    title="تعديل السؤال"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(f.id)}
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="حذف السؤال"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT FAQ ================= */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingFaq ? "تعديل السؤال الشائع" : "إضافة سؤال شائع جديد"}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveFaqSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">
                  القسم / التصنيف
                </label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="general">عام حول المنظومة</option>
                  <option value="escrow">الضمان المالي وسحب الأرباح (Escrow)</option>
                  <option value="ai-studio">استوديو أدوات الذكاء الاصطناعي</option>
                  <option value="freelancer">المستقلون والمواهب</option>
                  <option value="client">الشركات وأصحاب الأعمال</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">
                  نص السؤال <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-1">
                  الإجابة التفصيلية <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqForm.published}
                    onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-gray-200">نشر السؤال فوراً</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-dark-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-700 dark:text-gray-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs"
                >
                  حفظ السؤال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

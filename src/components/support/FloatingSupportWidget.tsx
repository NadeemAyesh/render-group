"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getSiteSettings, SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-service";
import { getAiSupportConfig, AiSupportConfig, DEFAULT_AI_SUPPORT_CONFIG } from "@/lib/support-service";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export const FloatingSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai-chat" | "channels">("ai-chat");
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [aiConfig, setAiConfig] = useState<AiSupportConfig>(DEFAULT_AI_SUPPORT_CONFIG);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
    const aiConf = getAiSupportConfig();
    setAiConfig(aiConf);

    // Initial greeting from AI
    setMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        text: aiConf.greetingMessage || DEFAULT_AI_SUPPORT_CONFIG.greetingMessage,
        time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) setSettings(customEvent.detail);
    };

    const handleAiConfigChange = (e: Event) => {
      const customEvent = e as CustomEvent<AiSupportConfig>;
      if (customEvent.detail) {
        setAiConfig(customEvent.detail);
      }
    };

    window.addEventListener("renderlancer_settings_change", handleSettingsChange);
    window.addEventListener("renderlancer_ai_config_change", handleAiConfigChange);
    return () => {
      window.removeEventListener("renderlancer_settings_change", handleSettingsChange);
      window.removeEventListener("renderlancer_ai_config_change", handleAiConfigChange);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          systemPrompt: aiConfig.systemPrompt,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "شكراً لتواصلك. فريق الدعم الفني متواجد أيضاً على واتساب المباشر!";

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: `أهلاً بك! يمكنك أيضاً التواصل المباشر مع فريق الدعم الفني عبر واتساب: ${settings.supportWhatsapp}`,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "كيف أسحب أرباحي في غزة أو الضفة؟",
    "ما هي أدوات استوديو الـ AI المتاحة؟",
    "كيف يضمن نظام Escrow أموالي؟",
    "أريد رقم الواتساب وحسابات السوشيال",
  ];

  const handleQuickQuestion = (q: string) => {
    setInputMessage(q);
  };

  // Format whatsapp URL: remove spaces, symbols, ensure format
  const whatsappClean = (settings.supportWhatsapp || "+970599908299").replace(/[^0-9]/g, "");

  return (
    <div className="fixed bottom-20 xl:bottom-6 left-4 sm:left-6 z-50 flex flex-col items-start select-none font-sans" dir="rtl">
      {/* Expanded Support Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-32px)] sm:w-[410px] max-h-[70vh] sm:max-h-[580px] h-[520px] bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 text-white flex items-center justify-between border-b border-gold-500/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-inner">
                  <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-950 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{aiConfig.agentName || "ريندر بوت • Render AI"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">مساعد ذكي</span>
                </h3>
                <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                  {aiConfig.agentRole || "الدعم الفني واستشارات المنظومة"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="إغلاق"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-bar */}
          <div className="flex items-center border-b border-slate-100 dark:border-dark-800 bg-slate-50 dark:bg-dark-950/60 p-1.5 gap-1.5">
            <button
              onClick={() => setActiveTab("ai-chat")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "ai-chat"
                  ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>المساعد الذكي (AI)</span>
            </button>
            <button
              onClick={() => setActiveTab("channels")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "channels"
                  ? "bg-white dark:bg-dark-800 text-amber-600 dark:text-gold-400 shadow-sm"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>قنوات التواصل والسوشيال</span>
            </button>
          </div>

          {/* Tab 1: AI Support Chat */}
          {activeTab === "ai-chat" && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-dark-900/60">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs shadow-md"
                          : "bg-white dark:bg-dark-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-dark-700 rounded-bl-xs shadow-sm whitespace-pre-line"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-white dark:bg-dark-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-700 w-fit">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] mr-1">{aiConfig.agentName} يكتب الرد...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-3 py-1.5 border-t border-slate-200/60 dark:border-dark-800 overflow-x-auto flex gap-1.5 bg-slate-100/50 dark:bg-dark-950/40 no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-[11px] text-slate-700 dark:text-gray-300 hover:border-gold-500 hover:text-amber-600 dark:hover:text-gold-400 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-dark-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اطرح استفسارك على المساعد الذكي..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-gold-500 text-dark-950 font-bold flex items-center justify-center hover:bg-gold-400 disabled:opacity-40 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Channels & Socials */}
          {activeTab === "channels" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-dark-900/60">
              
              {/* WhatsApp & Direct Call Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">واتساب وهاتف التواصل المباشر</h4>
                    <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                      {settings.supportPhone || "+970 599 908 299"}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  <span>محادثة</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </a>
              </div>

              {/* Social Accounts Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                  الحسابات الرسمية على مواقع التواصل
                </span>

                {/* Facebook */}
                <a
                  href={settings.officialFacebook || "https://www.facebook.com/Rendergroup.studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700/80 flex items-center justify-between hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      f
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        Facebook • Render Group Studio
                      </h5>
                      <p className="text-[10px] text-gray-400">@Rendergroup.studio</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 text-[18px]">
                    arrow_forward
                  </span>
                </a>

                {/* Instagram */}
                <a
                  href={settings.officialInstagram || "https://www.instagram.com/render.group_studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700/80 flex items-center justify-between hover:border-pink-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
                        Instagram • @render.group_studio
                      </h5>
                      <p className="text-[10px] text-gray-400">معارض ومشاريع الاستوديو والـ AI</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-pink-500 text-[18px]">
                    arrow_forward
                  </span>
                </a>
              </div>

              {/* Direct Links to Pages */}
              <div className="pt-2 border-t border-slate-200 dark:border-dark-800 grid grid-cols-2 gap-2">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-center hover:border-gold-500 transition-all"
                >
                  <span className="material-symbols-outlined text-gold-500 text-[20px] block mb-1">
                    support_agent
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-gray-200 block">صفحة التواصل</span>
                  <span className="text-[10px] text-gray-400">فتح تذكرة دعم</span>
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-center hover:border-gold-500 transition-all"
                >
                  <span className="material-symbols-outlined text-gold-500 text-[20px] block mb-1">
                    quiz
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-gray-200 block">الأسئلة الشائعة</span>
                  <span className="text-[10px] text-gray-400">إجابات سريعة وواضحة</span>
                </Link>
              </div>

            </div>
          )}

          {/* Footer Info Strip */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-dark-950 border-t border-slate-200 dark:border-dark-800 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-emerald-500">verified</span>
              <span>Render Group Ecosystem</span>
            </span>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-amber-600 dark:text-gold-400 hover:underline font-semibold"
            >
              مكتب الدعم الموحد
            </Link>
          </div>

        </div>
      )}

      {/* Floating Bottom Button (Bottom Left Corner) */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="الدعم الفني والتواصل"
          className="relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 text-white border-2 border-gold-500 shadow-xl hover:shadow-gold-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {/* Animated icon or badge */}
          <div className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] sm:text-[24px] text-gold-400 group-hover:rotate-12 transition-transform">
              {isOpen ? "close" : "support_agent"}
            </span>
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-dark-950 animate-ping" />
            )}
          </div>

          <span className="hidden sm:inline text-xs font-bold tracking-wide text-white group-hover:text-gold-300">
            {isOpen ? "إغلاق النافذة" : "الدعم الفني والسوشيال"}
          </span>

          {!isOpen && (
            <span className="hidden sm:flex items-center gap-0.5 text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>متصل</span>
            </span>
          )}
        </button>

        {/* Floating Quick Hint Tooltip when closed */}
        {!isOpen && (
          <div className="absolute left-0 bottom-full mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-dark-950 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-lg border border-gold-500/30 whitespace-nowrap">
            مساعد الـ AI الذكي • واتساب • فيسبوك وإنستغرام
          </div>
        )}
      </div>
    </div>
  );
};

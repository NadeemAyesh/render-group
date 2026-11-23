"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import { getSiteSettings, SiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-service";
import { createSupportTicket } from "@/lib/support-service";

export default function ContactPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState<"general" | "technical" | "escrow" | "ai-studio" | "partnerships">("general");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    setSettings(getSiteSettings());
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) setSettings(customEvent.detail);
    };
    window.addEventListener("renderlancer_settings_change", handleSettingsChange);
    return () => window.removeEventListener("renderlancer_settings_change", handleSettingsChange);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = createSupportTicket({
        name: fullName,
        email,
        phone,
        department,
        priority,
        subject,
        message,
      });

      setTicketId(ticket.id);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Reset fields
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 600);
  };

  const cleanWhatsapp = (settings.supportWhatsapp || "+970599908299").replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-gold-400 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-[16px]">contact_support</span>
            <span>مركز الاتصال والتواصل الموحد</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            تواصل مع فريق <span className="text-gradient-gold">Render Group</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
            نحن هنا لمساعدتك في كل ما يتعلق بمنظومة العمل الحر، استوديو أدوات الذكاء الاصطناعي، شحن الرصيد والضمان المالي، أو شراكات العمل مع شركات فلسطين والشتات.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Secondary: Direct Contact Cards & Socials (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick WhatsApp & Phone Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">واتساب الدعم السريع</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">رد فوري ومتابعة مباشرة مع الإدارة</p>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-emerald-500/20 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block mb-0.5">الرقم المعتمد:</span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                    {settings.supportPhone || "+970 599 908 299"}
                  </span>
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <span>بدء المحادثة</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                متاح يومياً من الساعة 9:00 صباحاً وحتى 11:00 مساءً بتوقيت القدس الشريف للرد على الاستفسارات الفنية والمالية.
              </p>
            </div>

            {/* Official Social Media Channels */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-500 text-[20px]">public</span>
                <span>الحسابات الرسمية على مواقع التواصل</span>
              </h3>

              <div className="space-y-3">
                {/* Facebook Card */}
                <a
                  href={settings.officialFacebook || "https://www.facebook.com/Rendergroup.studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-center justify-between hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      f
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        Facebook • Render Group Studio
                      </h4>
                      <p className="text-[11px] text-gray-400">تابع أخبار المنظومة والإعلانات الرسمية</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 text-[18px]">
                    arrow_forward
                  </span>
                </a>

                {/* Instagram Card */}
                <a
                  href={settings.officialInstagram || "https://www.instagram.com/render.group_studio/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-800 flex items-center justify-between hover:border-pink-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
                        Instagram • @render.group_studio
                      </h4>
                      <p className="text-[11px] text-gray-400">معارض الإبداع الرقمي ومخرجات الـ AI</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-pink-500 text-[18px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Email & Offices Info */}
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-sm space-y-3 text-xs text-slate-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-500 text-[20px] mt-0.5">mail</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white font-semibold">البريد الإلكتروني الرسمي:</strong>
                  <span className="font-mono">{settings.supportEmail || "support@renderlancer.ps"}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gold-500 text-[20px] mt-0.5">location_on</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white font-semibold">المقر ونقاط التمثيل:</strong>
                  <span>فلسطين (غزة، رام الله، القدس) • دبي (الإمارات العربية المتحدة)</span>
                </div>
              </div>
            </div>

            {/* Link to FAQ */}
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-center">
              <p className="text-xs text-slate-700 dark:text-gray-300 mb-2">
                هل تبحث عن إجابات جاهزة بخصوص الضمان وسحب الأرباح واستوديو الـ AI؟
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-gold-400 hover:underline"
              >
                <span>تصفح قسم الأسئلة الشائعة (FAQ)</span>
                <span className="material-symbols-outlined text-[16px]">quiz</span>
              </Link>
            </div>

          </div>

          {/* Right: Support Ticket Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-dark-800 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">إرسال استفسار أو تذكرة دعم فني</h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400">تصل التذكرة مباشرة إلى لوحة Super Admin للمتابعة والرد</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-gold-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
                </div>
              </div>

              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-[32px]">done</span>
                  </div>
                  <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    تم استلام طلبك بنجاح!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                    تم تسجيل تذكرتك برقم مرجعي <span className="font-mono font-bold text-slate-900 dark:text-white">#{ticketId}</span>. سيقوم فريق الدعم الفني بمراجعة التفاصيل والتواصل معك عبر البريد الإلكتروني أو الهاتف في أقرب وقت.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-dark-950 font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      إرسال استفسار آخر
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        الاسم بالكامل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: أحمد خليل"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        البريد الإلكتروني <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        رقم الهاتف / واتساب
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+970 59..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                        قسم الاستفسار
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="general">استفسار عام</option>
                        <option value="technical">دعم فني ومشاكل تقنية</option>
                        <option value="escrow">الضمان المالي وسحب الأرباح (Escrow)</option>
                        <option value="ai-studio">استوديو الذكاء الاصطناعي وباقات الـ AI</option>
                        <option value="partnerships">شراكات وتوظيف شركات</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      عنوان الرسالة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="موضوع الاستفسار باختصار"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      تفاصيل الرسالة <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="يرجى كتابة كافة التفاصيل لمساعدتك بأفضل وأسرع شكل ممكن..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>{isSubmitting ? "جاري الإرسال..." : "إرسال التذكرة الآن"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

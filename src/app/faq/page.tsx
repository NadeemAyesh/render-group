"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import { getFAQs, FAQItem } from "@/lib/support-service";

export default function FAQPage() {
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  useEffect(() => {
    setFaqs(getFAQs());
    const handleFaqsChange = (e: Event) => {
      const customEvent = e as CustomEvent<FAQItem[]>;
      if (customEvent.detail) setFaqs(customEvent.detail);
    };
    window.addEventListener("renderlancer_faqs_change", handleFaqsChange);
    return () => window.removeEventListener("renderlancer_faqs_change", handleFaqsChange);
  }, []);

  const categories = [
    { id: "all", label: "جميع الأسئلة", icon: "all_inclusive" },
    { id: "escrow", label: "الضمان المالي والسحب", icon: "security" },
    { id: "ai-studio", label: "استوديو أدوات الـ AI", icon: "smart_toy" },
    { id: "freelancer", label: "المستقلون والمواهب", icon: "person" },
    { id: "client", label: "الشركات وأصحاب الأعمال", icon: "domain" },
    { id: "general", label: "عام وحول المنظومة", icon: "info" },
  ];

  const filteredFaqs = faqs
    .filter((f) => f.published)
    .filter((f) => (selectedCategory === "all" ? true : f.category === selectedCategory))
    .filter((f) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-gold-400 text-xs font-bold mb-4">
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            <span>مركز المساعدة والمعرفة الموحد</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            الأسئلة الشائعة والأكثر تكراراً (FAQ)
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed">
            إجابات واضحة ومباشرة حول العمل الحر، الضمان المالي Escrow، استوديو الذكاء الاصطناعي، وطرق سحب الأرباح.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سؤالك هنا (مثال: سحب الأرباح، استوديو الـ AI، الضمان)..."
              className="w-full pl-10 pr-12 py-3 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-gray-400 shadow-md focus:outline-none focus:border-amber-500"
            />
            <span className="material-symbols-outlined absolute right-4 top-3.5 text-gray-400 text-[20px]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-3.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                selectedCategory === c.id
                  ? "bg-gold-500 text-dark-950 shadow-md scale-105"
                  : "bg-white dark:bg-dark-900 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-dark-800 hover:border-gold-500/50"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800">
              <span className="material-symbols-outlined text-gray-400 text-[48px] mb-2">find_in_page</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200">لم يتم العثور على نتائج</h3>
              <p className="text-xs text-gray-400 mt-1">جرب البحث بكلمات مختلفة أو تواصل مع الدعم الفني مباشرة.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all border ${
                    isExpanded
                      ? "bg-white dark:bg-dark-900 border-amber-500/50 shadow-lg"
                      : "bg-white dark:bg-dark-900/60 border-slate-200 dark:border-dark-800 hover:border-slate-300 dark:hover:border-dark-700"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${
                          isExpanded
                            ? "bg-gold-500 text-dark-950"
                            : "bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-gray-300"
                        }`}
                      >
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`material-symbols-outlined text-gray-400 transition-transform duration-200 text-[20px] ${
                        isExpanded ? "rotate-180 text-amber-500" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed border-t border-slate-100 dark:border-dark-800/80 mr-11">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-950 via-dark-900 to-dark-950 border border-gold-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white mb-1">لم تجد إجابة لسؤالك؟</h3>
            <p className="text-xs text-gray-400 max-w-md">
              فريق خدمة عملاء Render Group والمساعد الذكي في خدمتك دائماً عبر الواتساب والمحادثة المباشرة.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">contact_support</span>
              <span>تواصل مع الإدارة</span>
            </Link>
          </div>
        </div>

      </main>

      <Footer onOpenActivation={() => setIsActivationOpen(true)} />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

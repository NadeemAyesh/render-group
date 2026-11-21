"use client";

import React, { useState } from "react";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = () => {
    if (!code.trim()) {
      setMessage({ type: "error", text: "يرجى إدخال رمز تفعيل صالح." });
      return;
    }
    setMessage({
      type: "success",
      text: `تم تفعيل باقة Render Studio الشاملة بنجاح عبر الكود (${code.toUpperCase()})! صالح لمدة 30 يوماً.`,
    });
  };

  const handleWalletPay = () => {
    setMessage({
      type: "success",
      text: "تم خصم 29$ من رصيد محفظة العمل الحر وتفعيل وصول كافة الأدوات الـ 12 بنجاح!",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-lg">
            <span className="material-symbols-outlined text-[28px]">token</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">إدارة اشتراكات Render Studio</h3>
            <p className="text-xs text-gold-400">تحكم بترخيص ووصول الأدوات الـ 12 الموحدة</p>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-red-500/20 border border-red-500/40 text-red-300"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {message.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Option 1: Activation Code */}
        <div className="p-4 rounded-2xl bg-dark-950/80 border border-gold-500/20 mb-4">
          <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gold-500 text-[16px]">vpn_key</span>
            إدخال كود التفعيل (Activation Code)
          </label>
          <p className="text-[11px] text-gray-400 mb-3">
            إذا كان لديك كود صادر من Render Group أو أحد وكلائنا في غزة والضفة:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: RENDER-GOLD-2026"
              className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs font-mono text-gold-300 placeholder:text-gray-600 focus:outline-none focus:border-gold-500"
            />
            <button
              onClick={handleRedeem}
              className="px-5 py-2.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shrink-0"
            >
              تفعيل
            </button>
          </div>
        </div>

        {/* Option 2: Freelance Wallet Balance */}
        <div className="p-4 rounded-2xl bg-dark-950/80 border border-gold-500/20">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-[16px]">
                account_balance_wallet
              </span>
              الدفع من رصيد أرباح العمل الحر
            </label>
            <span className="text-xs font-mono text-emerald-400 font-bold">$120.00 متاح</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
            وفّر على نفسك عمولات البطاقات الدولية، وفعّل باقة الاستوديو الشاملة (الوصول لجميع الأدوات
            الـ 12 لمدة 30 يوماً) بخصم <strong>$29.00</strong> فقط من محفظتك المكتسبة من المشاريع.
          </p>
          <button
            onClick={handleWalletPay}
            className="w-full py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>تفعيل الباقة بـ $29 من رصيد العمل الحر</span>
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

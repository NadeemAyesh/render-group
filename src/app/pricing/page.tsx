"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ActivationModal } from "@/components/studio/ActivationModal";
import {
  getPlans,
  PricingPlan,
  getUserSubscription,
  subscribeUserToPlan,
  UserSubscription,
} from "@/lib/subscription-service";
import { getActiveSession, AuthUser } from "@/lib/auth-service";

export default function PricingPage() {
  const router = useRouter();
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentSub, setCurrentSub] = useState<UserSubscription | null>(null);

  // Subscribe Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_PALESTINE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const loadedPlans = getPlans().filter((p) => p.active);
    setPlans(loadedPlans);

    const session = getActiveSession();
    if (session) {
      setCurrentUser(session);
      const sub = getUserSubscription(session.email);
      setCurrentSub(sub);
    }
  }, []);

  const handleOpenCheckout = (plan: PricingPlan) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutSuccess(false);
  };

  const handleConfirmSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);

      const email = currentUser?.email || "guest@render.ps";
      const name = currentUser?.fullName || "مستخدم جديد";
      const role = currentUser?.role || "JOB_SEEKER";

      const channelName =
        paymentMethod === "BANK_PALESTINE"
          ? "بنك فلسطين (حساب / بطاقة)"
          : paymentMethod === "USDT"
          ? "محفظة USDT (TRC-20)"
          : paymentMethod === "PAYONEER"
          ? "Payoneer"
          : "تفعيل ترويجي مجاني";

      const updatedSub = subscribeUserToPlan(
        email,
        name,
        role,
        selectedPlanForCheckout.id,
        billingCycle,
        channelName
      );
      setCurrentSub(updatedSub);

      setTimeout(() => {
        setSelectedPlanForCheckout(null);
        router.push("/ai-studio");
      }, 1800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans selection:bg-gold-500 selection:text-dark-950">
      <Navbar onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-gold-500/20">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          
          {/* Free 3-Day Trial Badge Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-6 shadow-lg shadow-emerald-500/10 animate-bounce">
            <span className="material-symbols-outlined text-[18px] text-emerald-400">card_giftcard</span>
            <span>هدية الانطلاق: 3 أيام تجربة مجانية بالكامل (50 صورة 4K + 3 فيديوهات سينمائية + 200 شات)</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            خطط وباقات <span className="gold-gradient-text">الذكاء الاصطناعي</span> والعمل الحر
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            احصل على أقوى ترسانة أدوات ذكاء اصطناعي (Render Studio) مع دعم مدفوعات بنك فلسطين وUSDT، وامتيازات حصرية للمستقلين وأصحاب الأعمال.
          </p>

          {/* Active Subscription Alert if logged in */}
          {currentSub && (
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-dark-900 border border-gold-500/30 flex items-center justify-between text-right mb-8">
              <div className="space-y-0.5">
                <span className="text-xs text-gray-400">اشتراكك الحالي المعتمد:</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {currentSub.planName}
                </h4>
                <span className="text-[11px] text-gold-400">
                  المتبقي: {currentSub.imagesTotal - currentSub.imagesUsed} صورة • {currentSub.videosTotal - currentSub.videosUsed} فيديو • ينتهي خلال {currentSub.daysRemaining} أيام
                </span>
              </div>
              <Link
                href="/ai-studio"
                className="px-4 py-2 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs shrink-0"
              >
                دخول الاستوديو
              </Link>
            </div>
          )}

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-dark-800 shadow-2xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "gold-button-gradient text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              دفع شهري (تجديد مرن)
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "gold-button-gradient text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>دفع سنوي</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                وفر 20%
              </span>
            </button>
          </div>

        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isFree = plan.priceMonthly === 0;
            const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
            const isUserCurrentPlan = currentSub?.planId === plan.id && currentSub.status !== "EXPIRED";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 group ${
                  plan.popular
                    ? "bg-dark-900 border-2 border-gold-500 shadow-2xl shadow-gold-500/10 lg:-translate-y-2"
                    : isFree
                    ? "bg-dark-900 border-2 border-emerald-500/40 shadow-xl"
                    : "glass-card border border-gold-500/25 hover:border-gold-500/60"
                }`}
              >
                {/* Popular or Free Tag */}
                {plan.badge && (
                  <div className="absolute -top-3.5 right-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                        plan.popular
                          ? "gold-button-gradient text-dark-950"
                          : isFree
                          ? "bg-emerald-500 text-dark-950"
                          : "bg-dark-800 text-gold-400 border border-gold-500/40"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title & English */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                      {plan.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono block">
                      {plan.nameEn}
                    </span>
                  </div>

                  {/* Pricing Number */}
                  <div className="pt-2 pb-4 border-b border-gold-500/15">
                    {isFree ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono text-emerald-400">0$</span>
                          <span className="text-xs text-gray-400">مجاناً بالكامل</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                          صلاحية تجريبية فورية لمدة 3 أيام
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold font-mono text-white group-hover:text-gold-400 transition-colors">
                            ${price}
                          </span>
                          <span className="text-xs text-gray-400">
                            /{billingCycle === "yearly" ? "سنوياً" : "شهرياً"}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          {billingCycle === "yearly" ? "يتم التحصيل سنوياً (وفرت شهرين مجاناً)" : "تجديد شهري تلقائي بدون التزام"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quota Highlights Card */}
                  <div className="p-3 rounded-2xl bg-dark-950/80 border border-gold-500/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-gold-400">photo_library</span>
                        توليد الصور 4K:
                      </span>
                      <strong className="text-white font-mono">{plan.imagesQuota} صورة</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-amber-400">movie</span>
                        فيديو سينمائي:
                      </span>
                      <strong className="text-white font-mono">{plan.videosQuota} فيديو</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-blue-400">chat</span>
                        ريندر شات AI:
                      </span>
                      <strong className="text-white font-mono">{plan.chatQuota} محادثة</strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[11px] font-bold text-gray-300 block">المزايا والحقوق المشمولة:</span>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-emerald-400 text-[16px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-6 mt-6 border-t border-gold-500/15">
                  {isUserCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>باقتك الحالية النشطة</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(plan)}
                      className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] ${
                        plan.popular
                          ? "gold-button-gradient text-dark-950 font-black shadow-gold-500/25"
                          : isFree
                          ? "bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black shadow-emerald-500/20"
                          : "bg-dark-850 hover:bg-dark-800 text-white border border-gold-500/30 hover:border-gold-500"
                      }`}
                    >
                      <span>
                        {isFree
                          ? "تفعيل التجربة المجانية (3 أيام)"
                          : `الاشتراك في ${plan.name.split(" ")[1] || "الباقة"}`}
                      </span>
                      <span className="material-symbols-outlined text-[16px]">
                        {isFree ? "rocket_launch" : "arrow_back"}
                      </span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 w-full border-t border-gold-500/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            مقارنة المزايا الشاملة بين الباقات
          </h2>
          <p className="text-xs text-gray-400">
            اختر الباقة التي تتناسب مع احتياجاتك الاحترافية سواء كنت مستقلاً أو شركة أو وكالة تسويق
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-gold-500/30 overflow-x-auto shadow-2xl">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gold-500/20 bg-dark-900/80 text-gray-300">
                <th className="p-4 md:p-5 font-bold text-white">الميزة والخدمة</th>
                <th className="p-4 md:p-5 font-bold text-emerald-400">التجربة المجانية (3 أيام)</th>
                <th className="p-4 md:p-5 font-bold text-gold-400">المستقل المحترف (Pro)</th>
                <th className="p-4 md:p-5 font-bold text-blue-400">الشركات (Agency)</th>
                <th className="p-4 md:p-5 font-bold text-amber-400">المؤسسات (Enterprise)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              <tr>
                <td className="p-4 font-bold text-white">الصور الفائقة 4K (GPT Image 2)</td>
                <td className="p-4 font-mono text-gray-300">50 صورة</td>
                <td className="p-4 font-mono text-gold-400 font-bold">500 صورة</td>
                <td className="p-4 font-mono text-blue-400 font-bold">2,000 صورة</td>
                <td className="p-4 font-mono text-amber-400 font-bold">10,000 صورة</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">الفيديو السينمائي (Veo 3.1 & Seedance)</td>
                <td className="p-4 font-mono text-gray-300">3 فيديوهات</td>
                <td className="p-4 font-mono text-gold-400 font-bold">30 فيديو</td>
                <td className="p-4 font-mono text-blue-400 font-bold">150 فيديو</td>
                <td className="p-4 font-mono text-amber-400 font-bold">800 فيديو</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">مساعد ريندر شات الذكي</td>
                <td className="p-4 font-mono text-gray-300">200 استفسار</td>
                <td className="p-4 font-mono text-gold-400 font-bold">2,000 استفسار</td>
                <td className="p-4 font-mono text-blue-400 font-bold">10,000 استفسار</td>
                <td className="p-4 font-mono text-amber-400 font-bold">غير محدود</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">عمولة المنصة على أرباح العمل الحر</td>
                <td className="p-4 text-gray-400">10%</td>
                <td className="p-4 text-emerald-400 font-bold">0% (بدون أي عمولة)</td>
                <td className="p-4 text-emerald-400 font-bold">0% (بدون أي عمولة)</td>
                <td className="p-4 text-emerald-400 font-bold">0% + ضمان مخصص</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">دعم السحب الفوري (بنك فلسطين & USDT)</td>
                <td className="p-4 text-gray-400">خلال 48 ساعة</td>
                <td className="p-4 text-emerald-400 font-bold">فوري لحظي</td>
                <td className="p-4 text-emerald-400 font-bold">فوري لحظي</td>
                <td className="p-4 text-emerald-400 font-bold">حساب مصرفي مخصص</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">نشر ومطابقة الوظائف الذكية</td>
                <td className="p-4 text-gray-400">تقديم عادي</td>
                <td className="p-4 text-gold-400 font-bold">أولوية 2x بالـ AI Match</td>
                <td className="p-4 text-blue-400 font-bold">نشر غير محدود للوظائف</td>
                <td className="p-4 text-amber-400 font-bold">إدارة توظيف مخصصة</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-6 lg:px-12 w-full border-t border-gold-500/20 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">الأسئلة الشائعة حول الباقات والاشتراكات</h2>
          <p className="text-xs text-gray-400">كل ما تحتاج لمعرفته حول التجربة المجانية ووسائل الدفع في فلسطين</p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">help</span>
              كيف تعمل التجربة المجانية (3 أيام)؟
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              عند تسجيلك في المنصة، يتم تفعيل باقة الـ 3 أيام فورياً مجاناً، وتحصل على 50 صورة 4K و 3 فيديوهات سينمائية و 200 رسالة في ريندر شات بدون الحاجة لإدخال بطاقة بنكية. بعد انتهاء الـ 3 أيام يمكنك الترقية إلى باقة Pro أو Agency لمتابعة الإنتاج.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">account_balance</span>
              ما هي وسائل الدفع المدعومة في فلسطين والشتات؟
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              ندعم الدفع المباشر عبر بطاقات وحسابات **بنك فلسطين**، وشبكة العملات الرقمية المستقرة **USDT (TRC-20)** بدون قيود مصرفية، بالإضافة إلى **Payoneer** والبطاقات الائتمانية العالمية (Visa / MasterCard).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/20 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-400 text-[18px]">swap_horiz</span>
              هل يمكنني ترقية أو إلغاء اشتراكي في أي وقت؟
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              نعم بكل تأكيد. يمكنك ترقية باقتك فوراً للاستفادة من رصيد صور وفيديوهات إضافي، كما يمكنك إلغاء التجديد التلقائي بضغطة زر واحدة من لوحة تحكمك دون أي تعقيد.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MODAL: CHECKOUT / SUBSCRIBE ================= */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 md:p-8 border border-gold-500/40 shadow-2xl space-y-6">
            
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-[15px]">credit_card</span>
                تأكيد الاشتراك وتفعيل الباقة
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedPlanForCheckout.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {selectedPlanForCheckout.isTrial
                  ? "تفعيل فوري مجاني لمدة 3 أيام مع 50 صورة و 3 فيديوهات"
                  : `المبلغ المطلوب: $${
                      billingCycle === "yearly"
                        ? selectedPlanForCheckout.priceYearly
                        : selectedPlanForCheckout.priceMonthly
                    } (${billingCycle === "yearly" ? "سنوياً" : "شهرياً"})`}
              </p>
            </div>

            {checkoutSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-400 text-[48px]">check_circle</span>
                <h4 className="text-lg font-bold text-white">تم تفعيل الباقة بنجاح!</h4>
                <p className="text-xs text-emerald-300">
                  تم شحن رصيد الاستوديو الخاص بك ({selectedPlanForCheckout.imagesQuota} صورة و {selectedPlanForCheckout.videosQuota} فيديو). جاري تحويلك إلى الاستوديو...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubscription} className="space-y-4">
                
                {/* User info confirmation */}
                <div className="p-3.5 rounded-2xl bg-dark-900 border border-gold-500/20 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحساب المستفيد:</span>
                    <strong className="text-white">{currentUser?.fullName || "مستخدم جديد"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">البريد الإلكتروني:</span>
                    <strong className="text-gold-400 font-mono">{currentUser?.email || "غير مسجل"}</strong>
                  </div>
                </div>

                {/* Payment Method Selector if paid */}
                {!selectedPlanForCheckout.isTrial && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white">اختر وسيلة الدفع المفضلة:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("BANK_PALESTINE")}
                        className={`p-3 rounded-xl border text-right transition-all ${
                          paymentMethod === "BANK_PALESTINE"
                            ? "bg-gold-500/15 border-gold-500 text-gold-300"
                            : "bg-dark-900 border-gold-500/20 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="block text-xs font-bold">بنك فلسطين</span>
                        <span className="text-[10px] text-gray-400">حساب / فيزا محلي</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("USDT")}
                        className={`p-3 rounded-xl border text-right transition-all ${
                          paymentMethod === "USDT"
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-300"
                            : "bg-dark-900 border-gold-500/20 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="block text-xs font-bold">USDT (TRC20)</span>
                        <span className="text-[10px] text-gray-400">دفع فوري بالكريبتو</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("PAYONEER")}
                        className={`p-3 rounded-xl border text-right transition-all ${
                          paymentMethod === "PAYONEER"
                            ? "bg-blue-500/15 border-blue-500 text-blue-300"
                            : "bg-dark-900 border-gold-500/20 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="block text-xs font-bold">Payoneer / Card</span>
                        <span className="text-[10px] text-gray-400">دولي وسريع</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
                >
                  <span>
                    {isProcessing
                      ? "جاري المعالجة وتفعيل الباقة..."
                      : selectedPlanForCheckout.isTrial
                      ? "تأكيد التفعيل المجاني فوراً (3 أيام)"
                      : "تأكيد الدفع والاشتراك السحابي"}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedPlanForCheckout.isTrial ? "bolt" : "lock"}
                  </span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
      <ActivationModal isOpen={isActivationOpen} onClose={() => setIsActivationOpen(false)} />
    </div>
  );
}

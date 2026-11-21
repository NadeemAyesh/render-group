"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthRole, registerNewUser, getRedirectUrlForRole } from "@/lib/auth-service";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "EMPLOYER">("JOB_SEEKER");
  const [fullName, setFullName] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+970");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("فلسطين - قطاع غزة");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("يرجى إدخال رقم الجوال للمتابعة والتحقق.");
      return;
    }

    if (selectedRole === "EMPLOYER" && !companyName.trim()) {
      setError("يرجى كتابة اسم المنشأة أو الشركة.");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب ألا تقل عن 6 خانات.");
      return;
    }

    if (!agreeTerms) {
      setError("يرجى الموافقة على شروط الاستخدام وسياسة الضمان المالي.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const fullPhone = `${phoneCountryCode} ${phoneNumber.trim()}`;
      const newUser = {
        id: `u-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: fullPhone,
        role: selectedRole as AuthRole,
        location: location,
        companyName: selectedRole === "EMPLOYER" ? companyName.trim() : undefined,
        avatar: fullName.trim().slice(0, 2).toUpperCase(),
      };

      registerNewUser(newUser, password);
      router.push(getRedirectUrlForRole(selectedRole));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Theme Switcher */}
      <div className="absolute top-6 left-6 z-20">
        <ThemeToggle compact />
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center z-10 px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">all_inclusive</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Render<span className="text-gold-500">Lancer</span>
          </span>
        </Link>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          إنشاء حساب جديد في المنظومة
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          انضم لأكبر شبكة للعمل الحر واستوديو الذكاء الاصطناعي لكفاءات فلسطين والشتات
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-gold-500/30 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection: Exactly 2 Roles (Job Seeker or Company) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-white">
              حدد نوع الحساب (باحث عن عمل أو شركة):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("JOB_SEEKER")}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  selectedRole === "JOB_SEEKER"
                    ? "bg-gold-500/15 border-gold-500 text-gold-300 shadow-md ring-1 ring-gold-500/50"
                    : "bg-dark-900 border-gold-500/20 text-gray-400 hover:border-gold-500/40"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">person</span>
                  </div>
                  {selectedRole === "JOB_SEEKER" && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold-500 text-dark-950 font-bold">
                      تم التحديد ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">باحث عن عمل / مستقل</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    أمتلك مهارات وأرغب بالتقديم على المشاريع والوظائف واستخدام استوديو أدوات الـ AI.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("EMPLOYER")}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                  selectedRole === "EMPLOYER"
                    ? "bg-blue-500/15 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500/50"
                    : "bg-dark-900 border-gold-500/20 text-gray-400 hover:border-gold-500/40"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
                  </div>
                  {selectedRole === "EMPLOYER" && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500 text-dark-950 font-bold">
                      تم التحديد ✓
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">صاحب عمل أو شركة</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                    أبحث عن كفاءات فلسطينية متميزة وأريد نشر مشاريع وتوظيف المستقلين بالضمان المالي.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 pt-2">
            
            {/* Row 1: Full Name & Mobile Phone (رقم الجوال في البداية) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>الاسم الكامل</span>
                  <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد خليل النجار"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                    badge
                  </span>
                </div>
              </div>

              {/* Phone Field at the Beginning */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>رقم الجوال / الهاتف</span>
                  <span className="text-gold-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="px-2.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-gold-400 focus:outline-none focus:border-gold-500 cursor-pointer font-mono shrink-0"
                  >
                    <option value="+970">🇵🇸 +970</option>
                    <option value="+972">🇵🇸 +972</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+962">🇯🇴 +962</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+20">🇪🇬 +20</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+90">🇹🇷 +90</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      placeholder="059xxxxxxx أو 59xxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-mono text-left dir-ltr"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                      smartphone
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Company or Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedRole === "EMPLOYER" ? (
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                    <span>اسم المنشأة أو الشركة</span>
                    <span className="text-gold-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: شركة الأفق للحلول الرقمية"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                      corporate_fare
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">مجال التخصص والمهارة الأساسية</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option>تطوير البرمجيات والذكاء الاصطناعي (Full Stack & AI)</option>
                    <option>تصميم واجهات وتجربة المستخدم (UI/UX & Figma)</option>
                    <option>صناعة الفيديو والموشن جرافيك (Motion & 3D)</option>
                    <option>التسويق الرقمي وإدارة الحملات (Digital Marketing)</option>
                    <option>إدارة الأعمال والتحليل المالي (FinTech & Business)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">الموقع الجغرافي</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option>فلسطين - قطاع غزة</option>
                  <option>فلسطين - الضفة الغربية (رام الله / نابلس / الخليل)</option>
                  <option>فلسطين - القدس الشريف</option>
                  <option>الشتات الفلسطيني • الإمارات ودول الخليج</option>
                  <option>الشتات الفلسطيني • أوروبا وأمريكا</option>
                  <option>دولة أخرى</option>
                </select>
              </div>
            </div>

            {/* Row 3: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>البريد الإلكتروني</span>
                  <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                    mail
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>كلمة المرور</span>
                  <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gold-500/30 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 font-sans"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[18px]">
                    lock
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded mt-0.5 cursor-pointer"
                />
                <span className="leading-relaxed">
                  أوافق على <strong className="text-gold-400">شروط الاستخدام</strong>، وسياسة حماية
                  المدفوعات بالضمان المالي (Escrow)، وحفظ البيانات بأمان.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl gold-button-gradient text-dark-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-500/25 transition-all mt-4 disabled:opacity-50"
            >
              <span>{isLoading ? "جاري إنشاء الحساب والدخول..." : "إنشاء الحساب وبدء الاستخدام"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gold-500/15">
            <span>لديك حساب بالفعل؟ </span>
            <Link href="/login" className="text-gold-400 hover:underline font-bold">
              تسجيل الدخول هنا
            </Link>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

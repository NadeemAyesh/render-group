import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl gold-button-gradient flex items-center justify-center text-dark-950 font-bold mb-6 shadow-xl shadow-gold-500/20">
        <span className="material-symbols-outlined text-[44px]">search_off</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
        404 - <span className="gold-gradient-text">الصفحة غير موجودة</span>
      </h1>
      <p className="text-gray-400 max-w-md text-sm md:text-base mb-8 leading-relaxed">
        عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl gold-button-gradient text-dark-950 font-bold text-sm shadow-lg shadow-gold-500/20 hover:scale-105 transition-all"
        >
          العودة للرئيسية
        </Link>
        <Link
          href="/courses"
          className="px-6 py-3 rounded-xl bg-dark-900 border border-gold-500/30 text-white font-semibold text-sm hover:bg-dark-850 hover:border-gold-500/60 transition-all"
        >
          أكاديمية الدورات
        </Link>
      </div>
    </div>
  );
}

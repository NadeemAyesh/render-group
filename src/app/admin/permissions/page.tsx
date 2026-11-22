"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPermissionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin?tab=permissions");
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center text-gold-400">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-gray-300">جارٍ نقلك إلى لوحة التحكم الإدارية الموحدة...</p>
      </div>
    </div>
  );
}

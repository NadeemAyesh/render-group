"use client";

import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC<{ compact?: boolean }> = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("renderlancer_theme") as "light" | "dark" | null;
    const initialTheme = saved || "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const handleStorageChange = () => {
      const current = (localStorage.getItem("renderlancer_theme") as "light" | "dark") || "light";
      setTheme(current);
      applyTheme(current);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    if (typeof document !== "undefined") {
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    localStorage.setItem("renderlancer_theme", t);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "light" ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح"}
      title={theme === "light" ? "التبديل إلى الوضع الداكن (Dark Mode)" : "التبديل إلى الوضع الفاتح (Light Mode)"}
      className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${
        theme === "light"
          ? "bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-amber-500/10"
          : "bg-dark-900 hover:bg-dark-850 text-gold-400 border-gold-500/30 shadow-gold-500/10"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-200 select-none">
        {theme === "light" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};

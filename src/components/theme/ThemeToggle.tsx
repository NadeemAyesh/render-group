"use client";

import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC<{ compact?: boolean }> = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check initial state from DOM class directly or localStorage
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const saved = localStorage.getItem("renderlancer_theme") as "light" | "dark" | null;
    const initialTheme = saved || (isDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme, false);

    const handleThemeChange = (e?: Event) => {
      const customDetail = (e as CustomEvent)?.detail;
      const current = customDetail || (localStorage.getItem("renderlancer_theme") as "light" | "dark") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
      setTheme(current);
    };

    window.addEventListener("renderlancer_theme_change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("renderlancer_theme_change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const applyTheme = (t: "light" | "dark", broadcast = true) => {
    if (typeof document !== "undefined") {
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    try {
      localStorage.setItem("renderlancer_theme", t);
    } catch {}

    if (broadcast && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("renderlancer_theme_change", { detail: t }));
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme, true);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "light" ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح"}
      title={theme === "light" ? "التبديل إلى الوضع الداكن (Dark Mode)" : "التبديل إلى الوضع الفاتح (Light Mode)"}
      className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${
        theme === "light"
          ? "bg-amber-100/90 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-amber-500/10"
          : "bg-dark-900 hover:bg-dark-850 text-gold-400 border-gold-500/30 shadow-gold-500/10"
      }`}
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-200 select-none">
        {theme === "light" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};

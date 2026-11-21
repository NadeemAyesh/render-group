// Authentication & Session Service
// Supports Multi-Role Login, Dynamic Registration, and Role-Based Redirection

export type AuthRole = "JOB_SEEKER" | "EMPLOYER" | "SUPER_ADMIN" | "CONTENT_EDITOR";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: AuthRole;
  location?: string;
  avatar?: string;
  companyName?: string;
}

export const ROLE_LABELS: Record<AuthRole, { ar: string; badgeClass: string; color: string }> = {
  JOB_SEEKER: {
    ar: "باحث عن عمل / مستقل",
    badgeClass: "bg-gold-500/15 text-gold-300 border-gold-500/30",
    color: "#D4AF37",
  },
  EMPLOYER: {
    ar: "صاحب عمل / شركة",
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    color: "#3B82F6",
  },
  SUPER_ADMIN: {
    ar: "مدير النظام (Super Admin)",
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    color: "#A855F7",
  },
  CONTENT_EDITOR: {
    ar: "محرر وكاتب محتوى",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    color: "#10B981",
  },
};

// Pre-seeded demo accounts for instant evaluation
export const DEMO_ACCOUNTS: Record<string, { user: AuthUser; password: string; redirectUrl: string }> = {
  "talent@render.ps": {
    user: {
      id: "u-talent",
      fullName: "أحمد خليل النجار",
      email: "talent@render.ps",
      role: "JOB_SEEKER",
      location: "فلسطين - قطاع غزة",
      avatar: "أ.ن",
    },
    password: "password123",
    redirectUrl: "/dashboard",
  },
  "employer@render.ps": {
    user: {
      id: "u-employer",
      fullName: "مجموعة الأفق الرقمية",
      email: "employer@render.ps",
      role: "EMPLOYER",
      location: "الشتات الفلسطيني • دبي",
      companyName: "Horizon Digital Group",
      avatar: "أ.ف",
    },
    password: "password123",
    redirectUrl: "/dashboard/employer",
  },
  "admin@render.ps": {
    user: {
      id: "u-admin",
      fullName: "المهندس معاذ (المدير العام)",
      email: "admin@render.ps",
      role: "SUPER_ADMIN",
      location: "الإدارة العامة المركزية",
      avatar: "SA",
    },
    password: "admin123",
    redirectUrl: "/admin",
  },
};

const SESSION_STORAGE_KEY = "renderlancer_active_session";
const REGISTERED_USERS_KEY = "renderlancer_registered_users";

// Helper to get registered users stored in browser storage
export function getRegisteredUsers(): Record<string, { user: AuthUser; password: string; redirectUrl: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save newly registered user locally for subsequent logins
export function registerNewUser(user: AuthUser, password: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRegisteredUsers();
    existing[user.email.toLowerCase()] = {
      user,
      password,
      redirectUrl: getRedirectUrlForRole(user.role),
    };
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
    setActiveSession(user);
  } catch (err) {
    console.error("Failed to store user:", err);
  }
}

export function getActiveSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setActiveSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  // Set cookie for potential middleware inspection
  document.cookie = `renderlancer_role=${user.role}; path=/; max-age=604800`;
  document.cookie = `renderlancer_user=${encodeURIComponent(user.fullName)}; path=/; max-age=604800`;
  
  // Dispatch reactive event so UI elements update instantly
  window.dispatchEvent(new CustomEvent("renderlancer_auth_change", { detail: user }));
}

export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  document.cookie = "renderlancer_role=; path=/; max-age=0";
  document.cookie = "renderlancer_user=; path=/; max-age=0";
  
  window.dispatchEvent(new CustomEvent("renderlancer_auth_change", { detail: null }));
}

export function getRedirectUrlForRole(role: AuthRole): string {
  switch (role) {
    case "JOB_SEEKER":
      return "/dashboard";
    case "EMPLOYER":
      return "/dashboard/employer";
    case "SUPER_ADMIN":
    case "CONTENT_EDITOR":
      return "/admin";
    default:
      return "/dashboard";
  }
}

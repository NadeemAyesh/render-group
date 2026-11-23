// Authentication & User Management Service
// Full multi-role enterprise security with Super Admin, Companies, Freelancers, and CMS roles

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
  status?: "ACTIVE" | "SUSPENDED";
  verified?: boolean;
  joinedDate?: string;
}

export const ROLE_LABELS: Record<AuthRole, { ar: string; badgeClass: string; color: string }> = {
  JOB_SEEKER: {
    ar: "باحث عن عمل / مستقل",
    badgeClass: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 font-bold",
    color: "#D4AF37",
  },
  EMPLOYER: {
    ar: "صاحب عمل / شركة",
    badgeClass: "bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30 font-bold",
    color: "#3B82F6",
  },
  SUPER_ADMIN: {
    ar: "مدير النظام العام (Super Admin)",
    badgeClass: "bg-amber-200 text-amber-950 border-amber-400 dark:bg-gold-500/25 dark:text-gold-200 dark:border-gold-500/50 font-black",
    color: "#D4AF37",
  },
  CONTENT_EDITOR: {
    ar: "محرر وكاتب محتوى",
    badgeClass: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-bold",
    color: "#10B981",
  },
};

// Official System Accounts
export const CORE_SYSTEM_ACCOUNTS: Record<string, { user: AuthUser; password: string; redirectUrl: string }> = {
  "admin@renderlancer.ps": {
    user: {
      id: "u-super-admin-nadeem",
      fullName: "المهندس نديم (المدير العام التنفيذي - Super Admin)",
      email: "admin@renderlancer.ps",
      role: "SUPER_ADMIN",
      location: "الإدارة العامة المركزية • فلسطين والشتات",
      avatar: "SA",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-01-01",
    },
    password: "Admin@Render2026",
    redirectUrl: "/admin",
  },
  "admin@render.ps": {
    user: {
      id: "u-super-admin-primary",
      fullName: "المهندس نديم (المدير العام التنفيذي - Super Admin)",
      email: "admin@render.ps",
      role: "SUPER_ADMIN",
      location: "الإدارة العامة المركزية • فلسطين والشتات",
      avatar: "SA",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-01-01",
    },
    password: "Admin@Render2026",
    redirectUrl: "/admin",
  },
  "company@render.ps": {
    user: {
      id: "u-company-alquds",
      fullName: "م. سامر الشوا (شركة القدس للحلول الذكية)",
      email: "company@render.ps",
      phone: "+970 599 888 777",
      role: "EMPLOYER",
      location: "فلسطين - رام الله • الشتات (دبي)",
      companyName: "شركة القدس للحلول الذكية • Al-Quds Smart Solutions",
      avatar: "ق.ذ",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-02-18",
    },
    password: "Company@2026",
    redirectUrl: "/dashboard/employer",
  },
  "contact@wsaglobal.com": {
    user: {
      id: "u-company-wsa-global",
      fullName: "WSA Global (الإدارة والتوظيف)",
      email: "contact@wsaglobal.com",
      phone: "+970 599 334 556",
      role: "EMPLOYER",
      location: "فلسطين والشرق الأوسط • الشتات (دولي)",
      companyName: "WSA Global",
      avatar: "WSA",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-11-23",
    },
    password: "WSA@Global2026",
    redirectUrl: "/dashboard/employer",
  },
  "wsa@render.ps": {
    user: {
      id: "u-company-wsa-render",
      fullName: "WSA Global (الإدارة والتوظيف)",
      email: "wsa@render.ps",
      phone: "+970 599 334 556",
      role: "EMPLOYER",
      location: "فلسطين والشرق الأوسط • الشتات (دولي)",
      companyName: "WSA Global",
      avatar: "WSA",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-11-23",
    },
    password: "WSA@Global2026",
    redirectUrl: "/dashboard/employer",
  },
  "jobseeker@render.ps": {
    user: {
      id: "u-jobseeker-tariq",
      fullName: "طارق منصور القدوة",
      email: "jobseeker@render.ps",
      phone: "+970 592 111 222",
      role: "JOB_SEEKER",
      location: "فلسطين - قطاع غزة (عن بعد)",
      avatar: "ط.م",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-02-20",
    },
    password: "User@2026",
    redirectUrl: "/dashboard",
  },
  "user@render.ps": {
    user: {
      id: "u-jobseeker-tariq-alias",
      fullName: "طارق منصور القدوة",
      email: "user@render.ps",
      phone: "+970 592 111 222",
      role: "JOB_SEEKER",
      location: "فلسطين - قطاع غزة (عن بعد)",
      avatar: "ط.م",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-02-20",
    },
    password: "User@2026",
    redirectUrl: "/dashboard",
  },
  "talent@render.ps": {
    user: {
      id: "u-talent-ahmed",
      fullName: "أحمد خليل النجار",
      email: "talent@render.ps",
      phone: "+970 599 123 456",
      role: "JOB_SEEKER",
      location: "فلسطين - قطاع غزة (عن بعد)",
      avatar: "أ.ن",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-02-15",
    },
    password: "password123",
    redirectUrl: "/dashboard",
  },
  "employer@render.ps": {
    user: {
      id: "u-employer-horizon",
      fullName: "مجموعة الأفق الرقمية (شركة معتمدة)",
      email: "employer@render.ps",
      phone: "+971 4 000 0000",
      role: "EMPLOYER",
      location: "الشتات الفلسطيني • دبي",
      companyName: "Horizon Digital Group",
      avatar: "أ.ف",
      status: "ACTIVE",
      verified: true,
      joinedDate: "2026-02-10",
    },
    password: "password123",
    redirectUrl: "/dashboard/employer",
  },
};

// Alias for backwards compatibility
export const DEMO_ACCOUNTS = CORE_SYSTEM_ACCOUNTS;

const SESSION_STORAGE_KEY = "renderlancer_active_session";
const REGISTERED_USERS_KEY = "renderlancer_registered_users";

// Helper to get registered users stored in browser storage
export function getRegisteredUsers(): Record<string, { user: AuthUser; password: string; redirectUrl: string }> {
  if (typeof window === "undefined") return { ...CORE_SYSTEM_ACCOUNTS };
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const custom = raw ? JSON.parse(raw) : {};
    return { ...CORE_SYSTEM_ACCOUNTS, ...custom };
  } catch {
    return { ...CORE_SYSTEM_ACCOUNTS };
  }
}

// Get array of all users for Super Admin management table
export function getAllUsersArray(): AuthUser[] {
  const all = getRegisteredUsers();
  return Object.values(all).map((entry) => entry.user);
}

// Save newly registered user locally for subsequent logins
export function registerNewUser(user: AuthUser, password: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[user.email.toLowerCase()] = {
      user: {
        ...user,
        status: user.status || "ACTIVE",
        verified: user.verified || false,
        joinedDate: user.joinedDate || new Date().toISOString().split("T")[0],
      },
      password,
      redirectUrl: getRedirectUrlForRole(user.role),
    };
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
    setActiveSession(user);
  } catch (err) {
    console.error("Failed to store user:", err);
  }
}

// Super Admin Update User Status
export function adminUpdateUser(email: string, updates: Partial<AuthUser>): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const key = email.toLowerCase();
    if (existing[key]) {
      existing[key].user = { ...existing[key].user, ...updates };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.error("Failed to update user:", err);
  }
}

// Super Admin Delete User
export function adminDeleteUser(email: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const key = email.toLowerCase();
    if (existing[key]) {
      delete existing[key];
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.error("Failed to delete user:", err);
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
  document.cookie = `renderlancer_role=${user.role}; path=/; max-age=604800`;
  document.cookie = `renderlancer_user=${encodeURIComponent(user.fullName)}; path=/; max-age=604800`;
  
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

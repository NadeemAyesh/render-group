// Site & System Settings Service for RenderLancer & Render Group Studio
// Manages global configurations, operating modes, financial rates, and AI engine defaults.

export interface SiteSettings {
  // 1. Branding & Identity
  siteName: string;
  siteTagline: string;
  metaDescription: string;
  defaultCurrency: string;
  copyrightText: string;

  // 2. System Operations & Live Toggles
  maintenanceMode: boolean;
  maintenanceNotice: string;
  allowUserRegistration: boolean;
  allowJobPosting: boolean;
  enableAiStudioFreeTier: boolean;
  requireCompanyVerification: boolean;

  // 3. Financial & Escrow Rates
  platformFeePercent: number;
  minWithdrawalUsd: number;
  freeTrialDays: number;
  freeTrialImagesQuota: number;
  freeTrialVideosQuota: number;

  // 4. AI Engine Defaults
  defaultImageModel: string;
  defaultVideoModel: string;
  aiRateLimitPerMin: number;

  // 5. Contact & Social Channels
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  officialTelegram: string;
  officialTwitter: string;
  officialLinkedIn: string;
  officialFacebook: string;
  officialInstagram: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // Branding & Identity
  siteName: "RenderLancer • ريندر لانسر",
  siteTagline: "منظومة العمل الحر الموحدة وترسانة أدوات الذكاء الاصطناعي",
  metaDescription:
    "بوابة تمكين الكفاءات الفلسطينية وربطها بالشركات الإقليمية والعالمية مع أدوات الإنتاج السينمائي والضمان المالي Escrow",
  defaultCurrency: "USD ($)",
  copyrightText: "© 2026 Render Group Ecosystem. جميع الحقوق محفوظة لكفاءات فلسطين والشتات.",

  // System Operations & Live Toggles
  maintenanceMode: false,
  maintenanceNotice: "نقوم حالياً بترقية خوادم الذكاء الاصطناعي السحابية. سنعود خلال دقائق معدودة.",
  allowUserRegistration: true,
  allowJobPosting: true,
  enableAiStudioFreeTier: true,
  requireCompanyVerification: true,

  // Financial & Escrow Rates
  platformFeePercent: 5,
  minWithdrawalUsd: 50,
  freeTrialDays: 3,
  freeTrialImagesQuota: 50,
  freeTrialVideosQuota: 3,

  // AI Engine Defaults
  defaultImageModel: "GPT Image 2 (HD Photo)",
  defaultVideoModel: "Veo 3.1 & Seedance 2.0 (4K)",
  aiRateLimitPerMin: 60,

  // Contact & Social Channels
  supportEmail: "support@renderlancer.ps",
  supportPhone: "+970 599 908 299",
  supportWhatsapp: "+970 599 908 299",
  officialTelegram: "@RenderLancer_Support",
  officialTwitter: "https://x.com/renderlancer",
  officialLinkedIn: "https://linkedin.com/company/renderlancer",
  officialFacebook: "https://www.facebook.com/Rendergroup.studio/",
  officialInstagram: "https://www.instagram.com/render.group_studio/",
};

const SETTINGS_STORAGE_KEY = "renderlancer_system_settings";

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const current = getSiteSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("renderlancer_settings_change", { detail: updated }));
    return updated;
  } catch (err) {
    console.error("Failed to save site settings:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function resetSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("renderlancer_settings_change", { detail: DEFAULT_SITE_SETTINGS }));
  return DEFAULT_SITE_SETTINGS;
}

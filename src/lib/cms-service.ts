// Site Content Management Service (CMS)
// Enables Super Admin to customize homepage, about page, statistics, and platform messaging in real time.

export interface SiteContent {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  aboutStory: string;
  aboutVision: string;
  statTalents: string;
  statVolume: string;
  statSatisfaction: string;
  contactEmail: string;
  contactPhone: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroBadge: "منظومة Render Group الموحدة: العمل الحر + ترسانة الذكاء الاصطناعي الشاملة",
  heroTitle: "RENDER GROUP",
  heroHighlight: "STUDIO & FREELANCE",
  heroDescription:
    "منصتك الشاملة للإبداع الرقمي والعمل الحر. نصنع المستقبل بتمكين الكفاءات الفلسطينية بأدوات الذكاء الاصطناعي الأكثر تطوراً في العالم، مع إدارة اشتراكاتك وربط مواهب الوطن بالشركات العالمية في مكان واحد.",
  aboutStory:
    "مجموعة Render Group هي تكتل تقني وإبداعي رائد يجمع بين سوق العمل الحر الرقمي المتخصص (RenderLancer) وترسانة أدوات الإنتاج بالذكاء الاصطناعي الموحدة (Render Studio). تأسست برؤية استراتيجية لربط نخبة كفاءات فلسطين في قطاع غزة والضفة والقدس بشركات الشتات ورؤوس الأموال العالمية، مع تجاوز تحديات الحصار والتحويلات المالية.",
  aboutVision:
    "بناء اقتصاد رقمي فلسطيني حر ومستدام، يُمكّن آلاف المبرمجين والمصممين وصناع المحتوى من الوصول لأقوى عناقيد الحوسبة والذكاء الاصطناعي السحابية، ويوفر بيئة تعاقد وضمان مالي محمي 100%.",
  statTalents: "+2,850",
  statVolume: "$180,000+",
  statSatisfaction: "99.4%",
  contactEmail: "contact@rendergroup.ps",
  contactPhone: "+970 599 000 000",
};

const CMS_STORAGE_KEY = "renderlancer_site_content";

export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: Partial<SiteContent>): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  try {
    const current = getSiteContent();
    const updated = { ...current, ...content };
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("renderlancer_cms_change", { detail: updated }));
    return updated;
  } catch (err) {
    console.error("Failed to save site content:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

export function resetSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_SITE_CONTENT;
  localStorage.removeItem(CMS_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("renderlancer_cms_change", { detail: DEFAULT_SITE_CONTENT }));
  return DEFAULT_SITE_CONTENT;
}

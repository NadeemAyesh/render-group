// Subscriptions & Pricing Plans Management Service
// Full support for 3-Day Free AI Trial (50 images, 3 videos), paid tiers, and Super Admin control

export interface PricingPlan {
  id: string;
  name: string;
  nameEn: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  durationDays: number;
  imagesQuota: number; // e.g. 50
  videosQuota: number; // e.g. 3
  chatQuota: number;   // e.g. 200
  features: string[];
  active: boolean;     // Toggle enabled/disabled by Super Admin
  isTrial?: boolean;
  popular?: boolean;
  targetRole?: "JOB_SEEKER" | "EMPLOYER" | "ALL";
}

export interface UserSubscription {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userRole: string;
  planId: string;
  planName: string;
  billingCycle: "trial" | "monthly" | "yearly";
  price: number;
  status: "ACTIVE" | "TRIAL" | "EXPIRED" | "SUSPENDED";
  startDate: string;
  expiresAt: string;
  daysRemaining: number;
  imagesTotal: number;
  imagesUsed: number;
  videosTotal: number;
  videosUsed: number;
  chatTotal: number;
  chatUsed: number;
  paymentMethod?: string;
}

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "plan-trial",
    name: "باقة التجربة المجانية (3 أيام)",
    nameEn: "3-Day Free AI Trial",
    badge: "هدية الانضمام",
    priceMonthly: 0,
    priceYearly: 0,
    durationDays: 3,
    imagesQuota: 50,
    videosQuota: 3,
    chatQuota: 200,
    active: true,
    isTrial: true,
    popular: false,
    targetRole: "ALL",
    features: [
      "50 صورة 4K فائقة الجودة (GPT Image 2)",
      "3 فيديوهات سينمائية (Veo 3.1 & Seedance)",
      "200 محادثة ذكية متصلة بالإنترنت في Render Chat",
      "صلاحية تجريبية كاملة لمدة 3 أيام مجاناً",
      "لا يتطلب إدخال أي بطاقة بنكية أو رسوم خفية",
    ],
  },
  {
    id: "plan-pro",
    name: "باقة المستقل المحترف (Pro Freelancer)",
    nameEn: "Pro Freelancer Tier",
    badge: "الأكثر طلباً",
    priceMonthly: 29,
    priceYearly: 279,
    durationDays: 30,
    imagesQuota: 500,
    videosQuota: 30,
    chatQuota: 2000,
    active: true,
    popular: true,
    targetRole: "JOB_SEEKER",
    features: [
      "500 صورة 4K شهرية بكافة أدوات الاستوديو",
      "30 فيديو سينمائي بمعدل 60 إطار في الثانية",
      "وصول غير محدود لـ Render Chat مع فحص الأكواد",
      "سحب فوري لأرباح العمل الحر بدون عمولة للمنصة",
      "شارة المستقل المعتمد وأولوية 2x في مطابقة الوظائف",
      "تراخيص تجارية كاملة للمخرجات الفنية",
    ],
  },
  {
    id: "plan-agency",
    name: "باقة الاستوديو والشركات (Studio Agency)",
    nameEn: "Agency & Business Studio",
    badge: "للفرق والشركات",
    priceMonthly: 89,
    priceYearly: 850,
    durationDays: 30,
    imagesQuota: 2000,
    videosQuota: 150,
    chatQuota: 10000,
    active: true,
    popular: false,
    targetRole: "EMPLOYER",
    features: [
      "2,000 صورة 4K فائقة الدقة والوضوح شهرياً",
      "150 فيديو سينمائي بدون أي علامة مائية",
      "إتاحة كافة أدوات الاستوديو الـ 12 المتقدمة",
      "نشر غير محدود للوظائف مع شارة توثيق الشركة الذهبية",
      "لوحة إدارة فريق العمل واستعراض متقدم للـ ATS",
      "دعم فني مخصص 24/7 عبر واتساب وهاتف مباشر",
    ],
  },
  {
    id: "plan-enterprise",
    name: "باقة الشتات والمؤسسات الكبرى (Diaspora Enterprise)",
    nameEn: "Enterprise & Diaspora Sponsor",
    badge: "حلول مخصصة",
    priceMonthly: 249,
    priceYearly: 2400,
    durationDays: 30,
    imagesQuota: 10000,
    videosQuota: 800,
    chatQuota: 50000,
    active: true,
    popular: false,
    targetRole: "ALL",
    features: [
      "توليد موسّع وسيرفرات GPU مخصصة (NVIDIA H100)",
      "رعاية تعاقدات كفاءات غزة والضفة الغربية في الضمان",
      "تخصيص كامل لواجهات API واستوديو الذكاء الاصطناعي",
      "حساب بنكي معتمد وفواتير ضريبية رسمية",
      "مدير حسابات تنفيذي مخصص ومرافقة تقنية مستمرة",
    ],
  },
];

export const INITIAL_SUBSCRIPTIONS: UserSubscription[] = [
  {
    id: "sub-101",
    userName: "م. سامر الشوا (شركة القدس للحلول الذكية)",
    userEmail: "company@render.ps",
    userRole: "صاحب عمل / شركة",
    planId: "plan-agency",
    planName: "باقة الاستوديو والشركات (Studio Agency)",
    billingCycle: "monthly",
    price: 89,
    status: "ACTIVE",
    startDate: "2026-02-18",
    expiresAt: "2026-03-20",
    daysRemaining: 26,
    imagesTotal: 2000,
    imagesUsed: 420,
    videosTotal: 150,
    videosUsed: 35,
    chatTotal: 10000,
    chatUsed: 1200,
    paymentMethod: "بطاقة ائتمان / بنك فلسطين",
  },
  {
    id: "sub-102",
    userName: "طارق منصور القدوة",
    userEmail: "jobseeker@render.ps",
    userRole: "باحث عن عمل / مستقل",
    planId: "plan-trial",
    planName: "باقة التجربة المجانية (3 أيام)",
    billingCycle: "trial",
    price: 0,
    status: "TRIAL",
    startDate: "2026-02-21",
    expiresAt: "2026-02-24",
    daysRemaining: 2,
    imagesTotal: 50,
    imagesUsed: 12,
    videosTotal: 3,
    videosUsed: 1,
    chatTotal: 200,
    chatUsed: 45,
    paymentMethod: "تفعيل مجاني ترويجي",
  },
  {
    id: "sub-103",
    userName: "أحمد خليل النجار",
    userEmail: "talent@render.ps",
    userRole: "باحث عن عمل / مستقل",
    planId: "plan-pro",
    planName: "باقة المستقل المحترف (Pro Freelancer)",
    billingCycle: "monthly",
    price: 29,
    status: "ACTIVE",
    startDate: "2026-02-15",
    expiresAt: "2026-03-17",
    daysRemaining: 23,
    imagesTotal: 500,
    imagesUsed: 180,
    videosTotal: 30,
    videosUsed: 14,
    chatTotal: 2000,
    chatUsed: 620,
    paymentMethod: "USDT (TRC20)",
  },
  {
    id: "sub-104",
    userName: "مجموعة الأفق الرقمية",
    userEmail: "employer@render.ps",
    userRole: "صاحب عمل / شركة",
    planId: "plan-agency",
    planName: "باقة الاستوديو والشركات (Studio Agency)",
    billingCycle: "monthly",
    price: 89,
    status: "ACTIVE",
    startDate: "2026-02-10",
    expiresAt: "2026-03-12",
    daysRemaining: 18,
    imagesTotal: 2000,
    imagesUsed: 940,
    videosTotal: 150,
    videosUsed: 80,
    chatTotal: 10000,
    chatUsed: 3100,
    paymentMethod: "Payoneer Global",
  },
  {
    id: "sub-105",
    userName: "رامي كنعان (تجربة منتهية)",
    userEmail: "rami.kanan@gmail.com",
    userRole: "باحث عن عمل / مستقل",
    planId: "plan-trial",
    planName: "باقة التجربة المجانية (3 أيام)",
    billingCycle: "trial",
    price: 0,
    status: "EXPIRED",
    startDate: "2026-02-10",
    expiresAt: "2026-02-13",
    daysRemaining: 0,
    imagesTotal: 50,
    imagesUsed: 50,
    videosTotal: 3,
    videosUsed: 3,
    chatTotal: 200,
    chatUsed: 200,
    paymentMethod: "منتهي - بانتظار الترقية",
  },
];

const PLANS_STORAGE_KEY = "renderlancer_pricing_plans";
const SUBSCRIPTIONS_STORAGE_KEY = "renderlancer_user_subscriptions";

// ================= PLANS CRUD =================
export function getPlans(): PricingPlan[] {
  if (typeof window === "undefined") return DEFAULT_PLANS;
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(DEFAULT_PLANS));
      return DEFAULT_PLANS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PLANS;
  }
}

export function savePlans(plans: PricingPlan[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    window.dispatchEvent(new CustomEvent("renderlancer_plans_change", { detail: plans }));
  } catch (err) {
    console.error("Failed to save plans:", err);
  }
}

export function togglePlanStatus(planId: string): void {
  const current = getPlans();
  const updated = current.map((p) =>
    p.id === planId ? { ...p, active: !p.active } : p
  );
  savePlans(updated);
}

export function updatePlan(planId: string, updates: Partial<PricingPlan>): void {
  const current = getPlans();
  const updated = current.map((p) => (p.id === planId ? { ...p, ...updates } : p));
  savePlans(updated);
}

export function createPlan(newPlan: PricingPlan): void {
  const current = getPlans();
  savePlans([...current, newPlan]);
}

export function deletePlan(planId: string): void {
  const current = getPlans();
  savePlans(current.filter((p) => p.id !== planId));
}

// ================= SUBSCRIPTIONS MANAGEMENT =================
export function getSubscriptions(): UserSubscription[] {
  if (typeof window === "undefined") return INITIAL_SUBSCRIPTIONS;
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(INITIAL_SUBSCRIPTIONS));
      return INITIAL_SUBSCRIPTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBSCRIPTIONS;
  }
}

export function saveSubscriptions(subs: UserSubscription[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subs));
    window.dispatchEvent(new CustomEvent("renderlancer_subscriptions_change", { detail: subs }));
  } catch (err) {
    console.error("Failed to save subscriptions:", err);
  }
}

// Get subscription for a specific email, or activate 3-day trial automatically
export function getUserSubscription(email: string): UserSubscription {
  const all = getSubscriptions();
  const found = all.find((s) => s.userEmail.toLowerCase() === email.toLowerCase());
  if (found) return found;

  // Create default 3-day trial if user is new
  const trialPlan = getPlans().find((p) => p.isTrial) || DEFAULT_PLANS[0];
  const newSub: UserSubscription = {
    id: `sub-${Date.now()}`,
    userName: email.split("@")[0],
    userEmail: email.toLowerCase(),
    userRole: "مستخدم جديد",
    planId: trialPlan.id,
    planName: trialPlan.name,
    billingCycle: "trial",
    price: 0,
    status: "TRIAL",
    startDate: new Date().toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    daysRemaining: 3,
    imagesTotal: trialPlan.imagesQuota,
    imagesUsed: 0,
    videosTotal: trialPlan.videosQuota,
    videosUsed: 0,
    chatTotal: trialPlan.chatQuota,
    chatUsed: 0,
    paymentMethod: "تجربة مجانية 3 أيام",
  };

  saveSubscriptions([newSub, ...all]);
  return newSub;
}

// Subscribe user to a paid plan
export function subscribeUserToPlan(
  email: string,
  userName: string,
  userRole: string,
  planId: string,
  cycle: "monthly" | "yearly" = "monthly",
  paymentMethod: string = "بطاقة ائتمان / بنك فلسطين"
): UserSubscription {
  const all = getSubscriptions();
  const plans = getPlans();
  const plan = plans.find((p) => p.id === planId) || DEFAULT_PLANS[1];

  const durationDays = cycle === "yearly" ? 365 : plan.durationDays;
  const price = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

  const newSub: UserSubscription = {
    id: `sub-${Date.now()}`,
    userName,
    userEmail: email.toLowerCase(),
    userRole,
    planId: plan.id,
    planName: plan.name,
    billingCycle: cycle,
    price,
    status: "ACTIVE",
    startDate: new Date().toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + durationDays * 86400000).toISOString().split("T")[0],
    daysRemaining: durationDays,
    imagesTotal: plan.imagesQuota,
    imagesUsed: 0,
    videosTotal: plan.videosQuota,
    videosUsed: 0,
    chatTotal: plan.chatQuota,
    chatUsed: 0,
    paymentMethod,
  };

  const filtered = all.filter((s) => s.userEmail.toLowerCase() !== email.toLowerCase());
  saveSubscriptions([newSub, ...filtered]);
  return newSub;
}

// Super Admin: Toggle subscription status (Active / Suspended)
export function adminToggleSubscriptionStatus(subId: string): void {
  const all = getSubscriptions();
  const updated = all.map((s) => {
    if (s.id === subId) {
      const nextStatus = s.status === "ACTIVE" || s.status === "TRIAL" ? ("SUSPENDED" as const) : ("ACTIVE" as const);
      return { ...s, status: nextStatus };
    }
    return s;
  });
  saveSubscriptions(updated);
}

// Super Admin: Extend subscription days
export function adminExtendSubscription(subId: string, additionalDays: number): void {
  const all = getSubscriptions();
  const updated = all.map((s) => {
    if (s.id === subId) {
      const newDays = s.daysRemaining + additionalDays;
      const newExp = new Date(Date.now() + newDays * 86400000).toISOString().split("T")[0];
      return {
        ...s,
        daysRemaining: newDays,
        expiresAt: newExp,
        status: "ACTIVE" as const,
      };
    }
    return s;
  });
  saveSubscriptions(updated);
}

// Super Admin: Change user plan
export function adminChangeUserPlan(subId: string, newPlanId: string): void {
  const all = getSubscriptions();
  const plans = getPlans();
  const plan = plans.find((p) => p.id === newPlanId);
  if (!plan) return;

  const updated = all.map((s) => {
    if (s.id === subId) {
      return {
        ...s,
        planId: plan.id,
        planName: plan.name,
        imagesTotal: plan.imagesQuota,
        videosTotal: plan.videosQuota,
        chatTotal: plan.chatQuota,
        status: "ACTIVE" as const,
      };
    }
    return s;
  });
  saveSubscriptions(updated);
}

// Super Admin: Add extra credits (images/videos)
export function adminAddCredits(subId: string, extraImages: number, extraVideos: number): void {
  const all = getSubscriptions();
  const updated = all.map((s) => {
    if (s.id === subId) {
      return {
        ...s,
        imagesTotal: s.imagesTotal + extraImages,
        videosTotal: s.videosTotal + extraVideos,
      };
    }
    return s;
  });
  saveSubscriptions(updated);
}

// Deduct usage quota when user generates in AI Studio
export function consumeCredit(email: string, type: "image" | "video" | "chat"): { allowed: boolean; remaining: number; message?: string } {
  const sub = getUserSubscription(email);

  if (sub.status === "SUSPENDED") {
    return { allowed: false, remaining: 0, message: "تم تجميد اشتراكك من قِبل إدارة المنصة." };
  }
  if (sub.status === "EXPIRED" || sub.daysRemaining <= 0) {
    return { allowed: false, remaining: 0, message: "انتهت فترة اشتراكك أو تجربتك المجانية (3 أيام). يرجى الترقية لإكمال الاستخدام." };
  }

  if (type === "video") {
    if (sub.videosUsed >= sub.videosTotal) {
      return { allowed: false, remaining: 0, message: `استهلكت كامل رصيد الفيديوهات المتاح (${sub.videosTotal} فيديو). يرجى الترقية إلى باقة أعلى.` };
    }
    sub.videosUsed += 1;
    saveSubscriptions(getSubscriptions().map((s) => (s.id === sub.id ? sub : s)));
    return { allowed: true, remaining: sub.videosTotal - sub.videosUsed };
  } else if (type === "image") {
    if (sub.imagesUsed >= sub.imagesTotal) {
      return { allowed: false, remaining: 0, message: `استهلكت كامل رصيد الصور المتاح (${sub.imagesTotal} صورة). يرجى الترقية إلى باقة أعلى.` };
    }
    sub.imagesUsed += 1;
    saveSubscriptions(getSubscriptions().map((s) => (s.id === sub.id ? sub : s)));
    return { allowed: true, remaining: sub.imagesTotal - sub.imagesUsed };
  } else {
    if (sub.chatUsed >= sub.chatTotal) {
      return { allowed: false, remaining: 0, message: "استهلكت كامل رصيد المحادثات المتاح." };
    }
    sub.chatUsed += 1;
    saveSubscriptions(getSubscriptions().map((s) => (s.id === sub.id ? sub : s)));
    return { allowed: true, remaining: sub.chatTotal - sub.chatUsed };
  }
}

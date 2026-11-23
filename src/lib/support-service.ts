// Support, FAQ, and AI Support Agent Service for RenderLancer & Render Group Studio
// Fully integrated with Admin Dashboard, Floating Widget, Contact Page, and FAQ Page

export interface FAQItem {
  id: string;
  category: "freelancer" | "client" | "ai-studio" | "escrow" | "general";
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  department: "general" | "technical" | "escrow" | "ai-studio" | "partnerships";
  priority: "low" | "medium" | "high";
  message: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
  replies?: {
    id: string;
    sender: "admin" | "user" | "ai";
    message: string;
    timestamp: string;
  }[];
}

export interface AiSupportConfig {
  agentName: string;
  agentRole: string;
  systemPrompt: string;
  greetingMessage: string;
  enabled: boolean;
  model: string;
  temperature: number;
}

export const DEFAULT_AI_SUPPORT_CONFIG: AiSupportConfig = {
  agentName: "ريندر بوت • Render AI",
  agentRole: "مساعد الدعم الفني الذكي لمنظومة Render Group",
  systemPrompt: `أنت ريندر بوت (Render AI Assistant)، المساعد الذكي المعتمد لمنظومة Render Group (RenderLancer & Render Studio).
مهمتك:
1. الترحيب بالمستخدمين وتقديم إجابات سريعة وواضحة ودقيقة ومهذبة باللغة العربية.
2. توجيه المستقلين لكيفية بناء السيرة الذاتية بـ ATS Builder، التقدم للوظائف، وسحب الأرباح عبر بنك فلسطين، PalPay، أو USDT.
3. مساعدة الشركات وأصحاب المشاريع في نشر الوظائف وشحن المحفظة ونظام الضمان المالي Escrow.
4. تقديم شرح حول استوديو أدوات الذكاء الاصطناعي الـ 12 المتطورة (توليد الصور، الفيديو السينمائي، الصوت، والتصميم).
5. توفير روابط التواصل المباشر عند الحاجة (واتساب: +970 599 908 299، فيسبوك، إنستغرام، أو عبر فتح تذكرة دعم).
كن ودوداً، مختصراً، ومشجعاً دائماً.`,
  greetingMessage: "مرحباً بك في ريندر! 👋 أنا مساعد الدعم الفني الذكي، كيف يمكنني مساعدتك اليوم في منصة العمل الحر واستوديو الذكاء الاصطناعي؟",
  enabled: true,
  model: "Gemini Pro / Built-in Intelligent Agent",
  temperature: 0.7,
};

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "general",
    question: "ما هي منظومة Render Group (ريندر لانسر وريندر ستوديو)؟",
    answer: "منظومة تقنية وإبداعية متكاملة تهدف لتمكين الكفاءات الفلسطينية وربطها بالشركات الإقليمية والعالمية، تجمع بين سوق العمل الحر الموثوق (RenderLancer) وترسانة أدوات الإنتاج بالذكاء الاصطناعي الموحدة (Render Studio).",
    order: 1,
    published: true,
  },
  {
    id: "faq-2",
    category: "escrow",
    question: "كيف يضمن نظام Escrow حقوق المستقلين وأصحاب المشاريع؟",
    answer: "يقوم العميل بإيداع قيمة المشروع مسبقاً في حساب الضمان الآمن للمنصة قبل بدء المستقل بالعمل. لا يتم تحرير المبلع لحساب المستقل إلا بعد تسليم العمل واعتماده بالكامل، مما يضمن 100% من حقوق الطرفين ويمنع الاحتيال.",
    order: 2,
    published: true,
  },
  {
    id: "faq-3",
    category: "escrow",
    question: "ما هي وسائل سحب الأرباح المتاحة للمستقلين في غزة والضفة؟",
    answer: "نوفر قنوات دفع متعددة ومرنة لتجاوز تحديات الحصار: التحويل المصرفي المباشر لبنك فلسطين، المحافظ الرقمية المحلية (PalPay)، السحب عبر العملة الرقمية USDT (TRC-20)، وحسابات Payoneer العالمية.",
    order: 3,
    published: true,
  },
  {
    id: "faq-4",
    category: "ai-studio",
    question: "ما الأدوات المتاحة في استوديو الـ AI (Render Studio)؟",
    answer: "يتضمن الاستوديو 12 أداة ذكاء اصطناعي رائدة موحدة، تشمل: توليد الصور عالية الدقة (GPT Image 2)، إنتاج الفيديو السينمائي (Veo 3.1 & Seedance 2.0)، استنساخ وتوليد الصوت الواقعي (ElevenLabs & Suno)، صانع السيرة الذاتية الذكي ATS، وغيرها الكثير.",
    order: 4,
    published: true,
  },
  {
    id: "faq-5",
    category: "freelancer",
    question: "كيف يمكنني البدء كمستقل والتقدم للوظائف؟",
    answer: "سجل حساب جديد بصفتك 'مستقل / باحث عن عمل'، أنشئ سيرتك الذاتية المتوافقة مع أنظمة الفرز العالمية عبر أداة ATS CV Builder، ثم تصفح سوق الوظائف وقدم عروضك على المشاريع المناسبة لمهاراتك.",
    order: 5,
    published: true,
  },
  {
    id: "faq-6",
    category: "client",
    question: "كيف تقوم الشركات بالتوظيف والتعاقد مع الكفاءات؟",
    answer: "تسجل الشركة حساب جهة عمل، ويمكنها نشر وظائف ومشاريع جديدة في دقائق مع تحديد الميزانية، أو تصفح دليل المواهب واختيار الكفاءات والتواصل والتعاقد المباشر معهم تحت مظلة الضمان المالي المعتمد.",
    order: 6,
    published: true,
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-101",
    name: "م. إبراهيم المصري",
    email: "ibrahim@example.com",
    phone: "+970 599 112 233",
    subject: "استفسار بخصوص السحب عبر USDT",
    department: "escrow",
    priority: "high",
    message: "قمت بطلب سحب أرباح بقيمة $600 إلى محفظة TRC-20، وأود التأكد من وقت التنفيذ.",
    status: "in_progress",
    createdAt: "اليوم 12:15 م",
    replies: [
      {
        id: "rep-1",
        sender: "admin",
        message: "أهلاً م. إبراهيم، تتم معالجة سحوبات العملات الرقمية خلال ساعتين بحد أقصى. طلبك قيد التأكيد على البلوكشين حالياً.",
        timestamp: "اليوم 12:45 م",
      },
    ],
  },
  {
    id: "tkt-102",
    name: "سارة النتشة",
    email: "sara.design@example.com",
    subject: "تفعيل اشتراك استوديو الـ AI للشركات",
    department: "ai-studio",
    priority: "medium",
    message: "هل يمكن الحصول على فاتورة ضريبية رسمية لاشتراك باقة الفريق السنوي في استوديو الـ AI؟",
    status: "new",
    createdAt: "أمس 04:30 م",
  },
];

const FAQS_STORAGE_KEY = "renderlancer_faqs_data";
const TICKETS_STORAGE_KEY = "renderlancer_support_tickets";
const AI_CONFIG_STORAGE_KEY = "renderlancer_ai_support_config";

// --- FAQ Management ---
export function getFAQs(): FAQItem[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(FAQS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
      return DEFAULT_FAQS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FAQS;
  }
}

export function saveFAQs(faqs: FAQItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs));
  window.dispatchEvent(new CustomEvent("renderlancer_faqs_change", { detail: faqs }));
}

export function addFAQ(faq: Omit<FAQItem, "id">): FAQItem {
  const all = getFAQs();
  const newItem: FAQItem = {
    ...faq,
    id: "faq-" + Date.now(),
  };
  const updated = [...all, newItem];
  saveFAQs(updated);
  return newItem;
}

export function updateFAQ(id: string, updates: Partial<FAQItem>): FAQItem | null {
  const all = getFAQs();
  const index = all.findIndex((f) => f.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], ...updates };
  saveFAQs(all);
  return all[index];
}

export function deleteFAQ(id: string): boolean {
  const all = getFAQs();
  const filtered = all.filter((f) => f.id !== id);
  if (filtered.length === all.length) return false;
  saveFAQs(filtered);
  return true;
}

// --- Support Tickets Management ---
export function getSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") return INITIAL_TICKETS;
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveSupportTickets(tickets: SupportTicket[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new CustomEvent("renderlancer_tickets_change", { detail: tickets }));
}

export function createSupportTicket(ticket: Omit<SupportTicket, "id" | "status" | "createdAt">): SupportTicket {
  const all = getSupportTickets();
  const newTicket: SupportTicket = {
    ...ticket,
    id: "tkt-" + (Math.floor(100 + Math.random() * 900)),
    status: "new",
    createdAt: new Date().toLocaleString("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    replies: [],
  };
  const updated = [newTicket, ...all];
  saveSupportTickets(updated);
  return newTicket;
}

export function updateSupportTicketStatus(id: string, status: SupportTicket["status"]): void {
  const all = getSupportTickets();
  const ticket = all.find((t) => t.id === id);
  if (ticket) {
    ticket.status = status;
    saveSupportTickets([...all]);
  }
}

export function addTicketReply(ticketId: string, reply: { sender: "admin" | "user" | "ai"; message: string }): void {
  const all = getSupportTickets();
  const ticket = all.find((t) => t.id === ticketId);
  if (ticket) {
    if (!ticket.replies) ticket.replies = [];
    ticket.replies.push({
      id: "rep-" + Date.now(),
      sender: reply.sender,
      message: reply.message,
      timestamp: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
    });
    saveSupportTickets([...all]);
  }
}

export function deleteSupportTicket(id: string): void {
  const all = getSupportTickets();
  saveSupportTickets(all.filter((t) => t.id !== id));
}

// --- AI Support Config Management ---
export function getAiSupportConfig(): AiSupportConfig {
  if (typeof window === "undefined") return DEFAULT_AI_SUPPORT_CONFIG;
  try {
    const raw = localStorage.getItem(AI_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_AI_SUPPORT_CONFIG;
    return { ...DEFAULT_AI_SUPPORT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_SUPPORT_CONFIG;
  }
}

export function saveAiSupportConfig(config: Partial<AiSupportConfig>): AiSupportConfig {
  if (typeof window === "undefined") return DEFAULT_AI_SUPPORT_CONFIG;
  const current = getAiSupportConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("renderlancer_ai_config_change", { detail: updated }));
  return updated;
}

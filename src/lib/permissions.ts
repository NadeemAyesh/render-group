// Permission Tree Registry: Menu -> Page -> Action
// Granular 3-Tier Hierarchical RBAC for RenderLancer & Admin

export type PermissionType = "menu" | "page" | "action";

export interface PermissionNode {
  id: string; // e.g. "menu.jobs", "page.jobs.list", "action.jobs.delete"
  type: PermissionType;
  labelArabic: string;
  labelEnglish: string;
  description: string;
  parent?: string; // Links Action -> Page -> Menu
}

// 1. THE COMPLETE 3-TIER PERMISSION TREE
export const PERMISSIONS_TREE: PermissionNode[] = [
  // --- MENU LEVEL ---
  {
    id: "menu.dashboard",
    type: "menu",
    labelArabic: "قائمة لوحة التحكم الرئيسية",
    labelEnglish: "Dashboard Menu",
    description: "إظهار أو إخفاء عنصر لوحة التحكم في السايدبار",
  },
  {
    id: "menu.jobs",
    type: "menu",
    labelArabic: "قائمة المشاريع والوظائف",
    labelEnglish: "Jobs & Projects Menu",
    description: "إظهار قائمة المشاريع وسوق العمل الحر",
  },
  {
    id: "menu.proposals",
    type: "menu",
    labelArabic: "قائمة العروض والتقديمات",
    labelEnglish: "Proposals Menu",
    description: "إظهار قائمة عروض العمل المقدمة",
  },
  {
    id: "menu.studio",
    type: "menu",
    labelArabic: "قائمة استوديو الذكاء الاصطناعي",
    labelEnglish: "AI Studio Menu",
    description: "إظهار قائمة أدوات وتراخيص الاستوديو",
  },
  {
    id: "menu.content",
    type: "menu",
    labelArabic: "قائمة إدارة المحتوى والأكاديمية",
    labelEnglish: "Content Management Menu",
    description: "إظهار قسم كتابة المحتوى والمقالات",
  },
  {
    id: "menu.users_roles",
    type: "menu",
    labelArabic: "قائمة المستخدمين والصلاحيات",
    labelEnglish: "Users & RBAC Menu",
    description: "إظهار قسم إدارة المستخدمين وتعيين الصلاحيات",
  },
  {
    id: "menu.finance",
    type: "menu",
    labelArabic: "قائمة المالية والضمان Escrow",
    labelEnglish: "Finance & Escrow Menu",
    description: "إظهار قسم المعاملات المالية والسحوبات",
  },

  // --- PAGE LEVEL ---
  {
    id: "page.jobs.browse",
    type: "page",
    parent: "menu.jobs",
    labelArabic: "صفحة تصفح المشاريع والوظائف",
    labelEnglish: "Browse Jobs Page",
    description: "صلاحية فتح صفحة البحث واستعراض المشاريع",
  },
  {
    id: "page.jobs.create",
    type: "page",
    parent: "menu.jobs",
    labelArabic: "صفحة نشر مشروع جديد",
    labelEnglish: "Post New Job Page",
    description: "صلاحية فتح شاشة إنشاء ونشر مناقصة/وظيفة",
  },
  {
    id: "page.proposals.my_list",
    type: "page",
    parent: "menu.proposals",
    labelArabic: "صفحة تتبع عروضي",
    labelEnglish: "My Proposals Page",
    description: "صلاحية فتح شاشة العروض المقدمة من المستقل",
  },
  {
    id: "page.content.articles",
    type: "page",
    parent: "menu.content",
    labelArabic: "صفحة إدارة المقالات والكورسات",
    labelEnglish: "Articles & Courses Page",
    description: "صلاحية فتح محرر مقالات وأخبار Render Group",
  },
  {
    id: "page.admin.permissions_tree",
    type: "page",
    parent: "menu.users_roles",
    labelArabic: "صفحة شجرة الصلاحيات والأدوار",
    labelEnglish: "Permissions Tree Page",
    description: "شاشة التحكم بصلاحيات الأدوار والمستخدمين",
  },
  {
    id: "page.admin.users_list",
    type: "page",
    parent: "menu.users_roles",
    labelArabic: "صفحة قائمة المستخدمين",
    labelEnglish: "Users List Page",
    description: "صلاحية فتح جدول كافة المستخدمين وتعديلهم",
  },

  // --- ACTION LEVEL ---
  {
    id: "action.jobs.submit_proposal",
    type: "action",
    parent: "page.jobs.browse",
    labelArabic: "إجراء: تقديم عرض مالي وفني على المشروع",
    labelEnglish: "Action: Submit Proposal",
    description: "القدرة على النقر وتقديم العرض للمستقل",
  },
  {
    id: "action.jobs.delete",
    type: "action",
    parent: "page.jobs.browse",
    labelArabic: "إجراء: حذف أو إلغاء وظيفة",
    labelEnglish: "Action: Delete Job",
    description: "صلاحية حذف أي مشروع من المنصة",
  },
  {
    id: "action.jobs.approve_contract",
    type: "action",
    parent: "page.jobs.browse",
    labelArabic: "إجراء: قبول العرض وتوقيع العقد",
    labelEnglish: "Action: Approve Contract",
    description: "صلاحية توقيع العقد وقبول المستقل",
  },
  {
    id: "action.content.publish",
    type: "action",
    parent: "page.content.articles",
    labelArabic: "إجراء: نشر المقال للعامة",
    labelEnglish: "Action: Publish Content",
    description: "صلاحية اعتماد ونشر المقالات والأخبار",
  },
  {
    id: "action.content.delete",
    type: "action",
    parent: "page.content.articles",
    labelArabic: "إجراء: حذف المقالات",
    labelEnglish: "Action: Delete Content",
    description: "صلاحية حذف المحتوى من المنصة",
  },
  {
    id: "action.users.grant_custom_permission",
    type: "action",
    parent: "page.admin.permissions_tree",
    labelArabic: "إجراء: منح صلاحية استثنائية لمستخدم",
    labelEnglish: "Action: Grant Custom Override",
    description: "منح مستخدم صلاحية محددة خارج دوره الأساسي",
  },
  {
    id: "action.finance.release_escrow",
    type: "action",
    parent: "menu.finance",
    labelArabic: "إجراء: تحرير أموال الضمان المالي Escrow",
    labelEnglish: "Action: Release Escrow Funds",
    description: "صلاحية تحرير الأرباح للمستقل بعد تسليم العمل",
  },
];

// 2. PRE-CONFIGURED ROLES
export interface SystemRole {
  name: string;
  labelArabic: string;
  isSuperAdmin?: boolean;
  defaultPermissions: string[];
}

export const SYSTEM_ROLES: Record<string, SystemRole> = {
  SUPER_ADMIN: {
    name: "SUPER_ADMIN",
    labelArabic: "مدير النظام الشامل (Super Admin)",
    isSuperAdmin: true,
    defaultPermissions: PERMISSIONS_TREE.map((p) => p.id), // All permissions!
  },
  CONTENT_EDITOR: {
    name: "CONTENT_EDITOR",
    labelArabic: "محرر وكاتب محتوى (Content Editor)",
    defaultPermissions: [
      "menu.dashboard",
      "menu.content",
      "page.content.articles",
      "action.content.publish",
      "action.content.delete",
    ],
  },
  JOB_SEEKER: {
    name: "JOB_SEEKER",
    labelArabic: "باحث عن عمل ومستقل (Job Seeker / Talent)",
    defaultPermissions: [
      "menu.dashboard",
      "menu.jobs",
      "menu.proposals",
      "menu.studio",
      "page.jobs.browse",
      "page.proposals.my_list",
      "action.jobs.submit_proposal",
    ],
  },
  EMPLOYER: {
    name: "EMPLOYER",
    labelArabic: "صاحب عمل أو شركة (Employer / Client)",
    defaultPermissions: [
      "menu.dashboard",
      "menu.jobs",
      "menu.proposals",
      "page.jobs.browse",
      "page.jobs.create",
      "action.jobs.approve_contract",
    ],
  },
};

// 3. USER PERMISSION RESOLUTION ENGINE
export interface UserSessionState {
  id: string;
  fullName: string;
  role: string;
  customGrantedPermissions: string[]; // Specific extra permissions
  customDeniedPermissions: string[]; // Specific revoked permissions
}

export function hasPermission(
  user: UserSessionState,
  permissionId: string
): boolean {
  // Super admin always has everything
  if (user.role === "SUPER_ADMIN") return true;

  // Direct denial override wins first
  if (user.customDeniedPermissions?.includes(permissionId)) return false;

  // Direct custom grant override wins next
  if (user.customGrantedPermissions?.includes(permissionId)) return true;

  // Otherwise check base role permissions
  const role = SYSTEM_ROLES[user.role];
  if (!role) return false;

  return role.defaultPermissions.includes(permissionId);
}

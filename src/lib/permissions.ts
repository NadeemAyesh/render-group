// Permission Tree Registry: Menu -> Page -> Action
// Granular 3-Tier Hierarchical RBAC for RenderLancer & Admin

export type PermissionType = "menu" | "page" | "action";

export interface PermissionNode {
  id: string; // e.g. "menu.jobs", "page.jobs.browse", "action.jobs.delete"
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
    id: "page.courses.manage",
    type: "page",
    parent: "menu.content",
    labelArabic: "صفحة إدارة الدورات والتكليفات المركزية",
    labelEnglish: "Manage Courses & Assignments Page",
    description: "شاشة تحكم السوبر أدمن بإضافة الدورات والدروس وفحص التكليفات",
  },
  {
    id: "page.courses.browse",
    type: "page",
    parent: "menu.content",
    labelArabic: "صفحة تصفح الأكاديمية والدورات",
    labelEnglish: "Browse Courses Academy Page",
    description: "تصفح الدورات ومتابعة فيديوهات اليوتيوب",
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
  {
    id: "action.courses.create",
    type: "action",
    parent: "page.courses.manage",
    labelArabic: "إجراء: إنشاء وتعديل الدورات والدروس",
    labelEnglish: "Action: Create/Edit Courses",
    description: "صلاحية إضافة دورة جديدة ورفع روابط دروس اليوتيوب والتكليفات",
  },
  {
    id: "action.courses.delete",
    type: "action",
    parent: "page.courses.manage",
    labelArabic: "إجراء: حذف أو أرشفة دورة تدريبية",
    labelEnglish: "Action: Delete Course",
    description: "صلاحية حذف دورة تدريبية وتكليفاتها",
  },
  {
    id: "action.courses.grade",
    type: "action",
    parent: "page.courses.manage",
    labelArabic: "إجراء: تقييم وتصحيح تكليفات الطلاب",
    labelEnglish: "Action: Grade & Review Assignments",
    description: "صلاحية كتابة الملاحظات ورصد الدرجات واعتماد أو طلب تعديل التكليف",
  },
  {
    id: "action.courses.submit",
    type: "action",
    parent: "page.courses.browse",
    labelArabic: "إجراء: تسليم تكليف الدورة للمراجعة",
    labelEnglish: "Action: Submit Course Assignment",
    description: "القدرة على إرسال روابط وملاحظات التكليف العملي للمشرفين",
  },
];

// 2. PRE-CONFIGURED ROLES
export interface SystemRole {
  name: string;
  labelArabic: string;
  isSuperAdmin?: boolean;
  defaultPermissions: string[];
}

export const DEFAULT_SYSTEM_ROLES: Record<string, SystemRole> = {
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
      "page.courses.manage",
      "page.courses.browse",
      "action.content.publish",
      "action.content.delete",
      "action.courses.create",
      "action.courses.grade",
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
      "menu.content",
      "page.jobs.browse",
      "page.proposals.my_list",
      "page.courses.browse",
      "action.jobs.submit_proposal",
      "action.courses.submit",
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

export const SYSTEM_ROLES = DEFAULT_SYSTEM_ROLES;

// Storage Keys
const ROLES_STORAGE_KEY = "renderlancer_roles_config";
const USER_OVERRIDES_STORAGE_KEY = "renderlancer_user_overrides";

// 3. PERSISTENT STORAGE HELPERS FOR ROLES
export function getStoredRoles(): Record<string, SystemRole> {
  if (typeof window === "undefined") return { ...DEFAULT_SYSTEM_ROLES };
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SYSTEM_ROLES };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SYSTEM_ROLES, ...parsed };
  } catch {
    return { ...DEFAULT_SYSTEM_ROLES };
  }
}

export function saveStoredRoles(roles: Record<string, SystemRole>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
  } catch (err) {
    console.error("Failed to save roles to localStorage", err);
  }
}

export function toggleRolePermission(roleKey: string, permissionId: string): Record<string, SystemRole> {
  const roles = getStoredRoles();
  const role = roles[roleKey];
  if (!role || role.isSuperAdmin) return roles; // Super Admin retains all permissions

  const current = role.defaultPermissions || [];
  const exists = current.includes(permissionId);
  const updated = exists ? current.filter((id) => id !== permissionId) : [...current, permissionId];

  const newRoles = {
    ...roles,
    [roleKey]: {
      ...role,
      defaultPermissions: updated,
    },
  };
  saveStoredRoles(newRoles);
  return newRoles;
}

export function setAllRolePermissions(roleKey: string, enableAll: boolean): Record<string, SystemRole> {
  const roles = getStoredRoles();
  const role = roles[roleKey];
  if (!role || role.isSuperAdmin) return roles;

  const newRoles = {
    ...roles,
    [roleKey]: {
      ...role,
      defaultPermissions: enableAll ? PERMISSIONS_TREE.map((p) => p.id) : [],
    },
  };
  saveStoredRoles(newRoles);
  return newRoles;
}

export function resetRolesToDefaults(): Record<string, SystemRole> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ROLES_STORAGE_KEY);
  }
  return { ...DEFAULT_SYSTEM_ROLES };
}

// 4. PERSISTENT STORAGE HELPERS FOR USER OVERRIDES
export interface UserPermissionOverride {
  granted: string[]; // Force Allow
  denied: string[];  // Force Deny (Revoke)
}

export function getStoredUserOverrides(): Record<string, UserPermissionOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USER_OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredUserOverrides(overrides: Record<string, UserPermissionOverride>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error("Failed to save user overrides", err);
  }
}

export function getUserOverrides(userId: string): UserPermissionOverride {
  const all = getStoredUserOverrides();
  return all[userId] || { granted: [], denied: [] };
}

export function setUserPermissionOverride(
  userId: string,
  permissionId: string,
  action: "inherit" | "grant" | "deny"
): Record<string, UserPermissionOverride> {
  const all = getStoredUserOverrides();
  const current = all[userId] || { granted: [], denied: [] };

  let granted = current.granted.filter((id) => id !== permissionId);
  let denied = current.denied.filter((id) => id !== permissionId);

  if (action === "grant") {
    granted.push(permissionId);
  } else if (action === "deny") {
    denied.push(permissionId);
  }

  const updatedAll = {
    ...all,
    [userId]: { granted, denied },
  };

  saveStoredUserOverrides(updatedAll);
  return updatedAll;
}

export function resetUserOverrides(userId?: string): Record<string, UserPermissionOverride> {
  const all = getStoredUserOverrides();
  if (userId) {
    delete all[userId];
    saveStoredUserOverrides(all);
    return all;
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_OVERRIDES_STORAGE_KEY);
  }
  return {};
}

// 5. USER PERMISSION RESOLUTION ENGINE
export interface UserSessionState {
  id: string;
  fullName: string;
  role: string;
  customGrantedPermissions?: string[]; // Specific extra permissions
  customDeniedPermissions?: string[];  // Specific revoked permissions
}

export function hasPermission(
  user: UserSessionState,
  permissionId: string
): boolean {
  // Super admin always has everything
  if (user.role === "SUPER_ADMIN") return true;

  // Check persistent overrides if available
  const userOverride = getUserOverrides(user.id);
  const effectiveDenied = [
    ...(user.customDeniedPermissions || []),
    ...(userOverride.denied || []),
  ];
  const effectiveGranted = [
    ...(user.customGrantedPermissions || []),
    ...(userOverride.granted || []),
  ];

  // Direct denial override wins first
  if (effectiveDenied.includes(permissionId)) return false;

  // Direct custom grant override wins next
  if (effectiveGranted.includes(permissionId)) return true;

  // Otherwise check stored roles or default base role permissions
  const roles = getStoredRoles();
  const role = roles[user.role] || DEFAULT_SYSTEM_ROLES[user.role];
  if (!role) return false;

  return role.defaultPermissions.includes(permissionId);
}

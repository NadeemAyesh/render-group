# هيكل المشروع وتوجيهات التطوير (Project Structure & Setup Guide)
## منصة RenderLancer & Render Group Studio

---

### 1. هيكل المجلدات والملفات (Directory Tree)

```text
renderlancer/
├── docs/                                  # التوثيق الشامل والمخططات
│   ├── ARCHITECTURE.md                    # المعمارية الفنية للنظام وتدفق البيانات
│   ├── DATABASE_SCHEMA.md                 # توثيق الجداول والعلاقات العلائقية
│   ├── AI_STUDIO_SUBSCRIPTIONS.md         # دليل أدوات الذكاء الاصطناعي وإدارة الاشتراكات
│   ├── PROJECT_STRUCTURE.md               # هيكل المشروع وطريقة التثبيت
│   ├── RenderLancer_Executive_Dossier.pdf # ملف التوثيق الشامل التنفيذي (PDF)
│   └── renderlancer_dossier.html          # المصدر المهيأ لطباعة الـ PDF
│
├── prisma/                                # نماذج قاعدة البيانات
│   └── schema.prisma                      # مخطط Prisma الكامل مع pgvector
│
├── src/                                   # الكود المصدري للمشروع (Next.js 15 App Router)
│   ├── app/                               # مسارات الصفحات ومخدمات الـ API
│   │   ├── (auth)/                        # مسارات التوثيق (تسجيل دخول، إنشاء حساب)
│   │   ├── (marketplace)/                 # مسارات سوق العمل والمشاريع
│   │   │   ├── jobs/                      # تصفح ونشر الوظائف
│   │   │   └── freelancers/               # ملفات المستقلين والكفاءات
│   │   ├── (studio)/                      # مسارات استوديو أدوات الذكاء الاصطناعي
│   │   │   └── ai-hub/                    # لوحة إدارة الاشتراكات والأدوات الـ 12
│   │   ├── (cv-studio)/                   # مسارات صانع السيرة الذاتية
│   │   │   ├── builder/                   # المحرر المباشر وفاحص الـ ATS
│   │   │   └── preview/[id]/              # المعاينة والتصدير العام
│   │   ├── api/                           # واجهات برمجة التطبيقات الخلفية
│   │   │   ├── ai/                        # استدعاء نماذج Gemini و Render Studio
│   │   │   ├── subscriptions/             # تفعيل الرموز وإدارة الباقات
│   │   │   └── wallet/                    # الحركات المالية والسحب
│   │   ├── layout.tsx                     # الهيكل العام الداعم للـ RTL و IBM Plex Sans
│   │   └── page.tsx                       # الصفحة الرئيسية الفاخرة
│   │
│   ├── components/                        # المكونات القابلة لإعادة الاستخدام
│   │   ├── ui/                            # مكونات Shadcn UI المخصصة باللون الذهبي
│   │   ├── layout/                        # الهيدر، الفوتر، والسايدبار
│   │   ├── cv-builder/                    # مكونات صانع السيرة الذاتية وعارض الـ ATS
│   │   └── studio/                        # بطاقات الأدوات ومودال تفعيل الاشتراكات
│   │
│   ├── lib/                               # الدوال المساعدة والتهيئة
│   │   ├── db.ts                          # عميل Prisma Client
│   │   ├── ai-gemini.ts                   # تكامل Google Gemini SDK
│   │   └── wallet-escrow.ts               # منطق الضمان المالي والمحافظ
│   │
│   └── types/                             # تعاريف الـ TypeScript
│
├── renderlancer_preview.html              # ملف المعاينة التفاعلي الكامل المحدث
└── package.json                           # الحزم والمكتبات المعتمدة
```

---

### 2. الحزم والمكتبات الأساسية (Key Dependencies)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.0.0",
    "@google/genai": "^0.1.1",
    "ai": "^4.0.0",
    "zustand": "^5.0.0",
    "@react-pdf/renderer": "^4.1.0",
    "lucide-react": "^0.460.0",
    "tailwind-merge": "^2.5.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.6.0"
  }
}
```

---

### 3. خطوات التشغيل المحلي للمطورين (Local Development Steps)

```bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. إعداد متغيرات البيئة في ملف .env
# DATABASE_URL="postgresql://user:pass@localhost:5432/renderlancer?schema=public"
# GEMINI_API_KEY="your-gemini-api-key"

# 3. تهجير قاعدة البيانات (Prisma Migrations)
npx prisma migrate dev --name init_renderlancer_studio

# 4. تشغيل خادم التطوير
npm run dev
```
تفتح المنصة مباشرة على: `http://localhost:3000` بكامل ميزاتها ثنائية اللغة ودعم الـ RTL الأصيل.

# RenderLancer & Render Group Studio Ecosystem
> المنظومة الموحدة لتمكين الكفاءات الفلسطينية: العمل الحر، صانع السير الذاتية بالذكاء الاصطناعي (ATS)، واستوديو أدوات الإبداع الرقمي الـ 12.

---

## نظرة عامة
تم تصميم **RenderLancer** لشركة **Render Group** لتكون المنصة الأولى التي تدمج بين العمل الحر عالي القيمة وترسانة من 12 أداة ذكاء اصطناعي رائدة عالمياً (Veo 3.1, Seedance 2.0, GPT Image 2, Nano Banana Pro, Virtual Try-on, AI Avatar...)، مع صانع سير ذاتية متوافق تماماً مع أنظمة الـ ATS الدولية، وحلول مالية تتغلب على تحديات الحصار والمدفوعات في فلسطين (USDT, Payoneer, بنك فلسطين، والمحافظ المحلية).

---

## التقنيات المعتمدة (Tech Stack)
* **Frontend:** Next.js 15 (App Router), React 19, TypeScript
* **Styling & Theme:** Tailwind CSS, Executive Royal Gold (`#D4AF37`), Obsidian Dark Mode
* **Typography:** IBM Plex Sans Arabic (خط مؤسساتي رسمي فائق الوضوح)
* **Database & ORM:** PostgreSQL + `pgvector` (للبحث الدلالي بالذكاء الاصطناعي), Prisma ORM
* **AI Orchestration:** Google Gemini 2.5 Flash API + Vercel AI SDK
* **State Management:** Zustand

---

## التشغيل المحلي (Getting Started)

```bash
# 1. تثبيت الحزم
npm install

# 2. إعداد ملف البيئة
cp .env.example .env.local

# 3. تشغيل خادم التطوير
npm run dev
```

تفتح المنصة مباشرة على: `http://localhost:3000`

---

## التوثيق الهندسي الشامل
* **وثيقة الـ PDF الرسمية التنفيذية:** [`docs/RenderLancer_Executive_Dossier.pdf`](file:///docs/RenderLancer_Executive_Dossier.pdf)
* **المعمارية الهندسية:** [`docs/ARCHITECTURE.md`](file:///docs/ARCHITECTURE.md)
* **مخطط قاعدة البيانات والـ ERD:** [`docs/DATABASE_SCHEMA.md`](file:///docs/DATABASE_SCHEMA.md)
* **مخطط Prisma الكامل:** [`prisma/schema.prisma`](file:///prisma/schema.prisma)
* **دليل أدوات الاستوديو الـ 12 والتراخيص:** [`docs/AI_STUDIO_SUBSCRIPTIONS.md`](file:///docs/AI_STUDIO_SUBSCRIPTIONS.md)
* **هيكل المشروع وطريقة التثبيت:** [`docs/PROJECT_STRUCTURE.md`](file:///docs/PROJECT_STRUCTURE.md)

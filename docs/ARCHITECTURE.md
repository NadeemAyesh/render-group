# التوثيق المعماري للنظام (System Architecture Specification)
## منصة RenderLancer & Render Group Studio

---

### 1. الرؤية الهندسية (Architectural Vision)
تتبنى منصة **RenderLancer** معمارية حديثة قائمة على أسلوب **Full-Stack Modular Monolith** المعتمد على **Next.js 15 (App Router)**، مع الاتصال المباشر بخدمات الذكاء الاصطناعي (AI Orchestration Layer) وقواعد بيانات PostgreSQL المدعومة بالمتجهات (Vector DB).

تتيح هذه المعمارية تلبية متطلبات السرعة، والأداء اللحظي (Streaming)، والدعم الكامل لاتجاه الكتابة العربي (RTL First)، مع تكامل آمن وسلس بين سوق العمل الحر واستوديو أدوات الذكاء الاصطناعي التابع لـ **Render Group**.

```mermaid
graph TB
    subgraph ClientLayer["واجهة المستخدم (Client Layer)"]
        UI_Web["Next.js 15 App Router<br/>(Tailwind CSS + IBM Plex Sans Arabic)"]
        CV_Studio["AI CV Builder Engine<br/>(Zustand + React-PDF)"]
        AI_Hub["Render Group Studio Hub<br/>(Tool Subscriptions & Activation Keys)"]
    end

    subgraph AppLayer["طبقة التطبيق والخدمات (Application Layer)"]
        ServerActions["Next.js Server Actions & Route Handlers"]
        AuthService["Unified Auth & RBAC (JWT / Supabase Auth)"]
        AIEngine["AI Orchestration Engine<br/>(Google Gemini API + Vercel AI SDK)"]
        EscrowEngine["Escrow & Financial Ledger Service"]
    end

    subgraph DataLayer["طبقة البيانات والتخزين (Persistence & Storage)"]
        Postgres["PostgreSQL + pgvector<br/>(Relational Data + Semantic Embeddings)"]
        FileStorage["Cloudflare R2 / S3<br/>(CV PDFs, Avatars & AI Outputs)"]
        Cache["Redis / In-Memory Cache<br/>(Rate Limits & Active Sessions)"]
    end

    subgraph ExternalServices["الخدمات الخارجية ومزودات الذكاء (External AI APIs)"]
        GeminiAPI["Gemini 2.5 Flash<br/>(CV Optimizations & Proposals)"]
        RenderAI_Backends["Render Studio Microservices<br/>(Veo 3.1, Seedance, Nano Banana, Virtual Try-on)"]
        PayoutGateways["Payout Rails<br/>(Payoneer, USDT/Crypto, Bank of Palestine)"]
    end

    ClientLayer --> AppLayer
    AppLayer --> DataLayer
    AIEngine --> GeminiAPI
    AIEngine --> RenderAI_Backends
    EscrowEngine --> PayoutGateways
```

---

### 2. تدفقات البيانات والعمليات الأساسية (Core Data Flows)

#### التدفق 1: صانع السيرة الذاتية الذكي وفاحص الـ ATS (AI CV Flow)
```mermaid
sequenceDiagram
    autonumber
    actor User as المستقل
    participant UI as واجهة صانع السيرة
    participant API as خادم RenderLancer
    participant AI as محرك Gemini الذكي
    participant DB as قاعدة البيانات

    User->>UI: إدخال الخبرات والمهام الحالية
    UI->>API: إرسال النصوص الخام (Raw Bullets)
    API->>AI: طلب تحليل ATS واستبدال الكلمات بأفعال قوة
    AI-->>API: عودة النص المحسن + نقاط القوة + درجة ATS Score
    API->>DB: حفظ النسخة في جدول Resume
    API-->>UI: بث التحديث المباشر للمستخدم (Live Preview)
    User->>UI: النقر على "تصدير PDF"
    UI->>UI: توليد ملف PDF متوافق 100% مع أنظمة الفرز وتنزيله
```

#### التدفق 2: تفعيل وإدارة اشتراكات أدوات الذكاء الاصطناعي (AI Studio Subscription Flow)
```mermaid
sequenceDiagram
    autonumber
    actor User as المستخدم
    participant StudioUI as بوابة أدوات Render Studio
    participant SubService as نظام التراخيص
    participant Wallet as المحفظة الرقمية
    participant DB as قاعدة البيانات

    User->>StudioUI: طلب تفعيل أداة (مثل Veo 3.1 أو الباقة الشاملة)
    alt تفعيل بواسطة رمز تفعيل (Activation Code)
        User->>StudioUI: إدخال كود مثل (RENDER-GOLD-2026)
        StudioUI->>SubService: التحقق من صلاحية الكود
        SubService->>DB: تحديث جدول UserSubscription وإلغاء صلاحية الكود
        SubService-->>StudioUI: إتاحة الأداة والوصول الفوري
    else تفعيل من رصيد العمل الحر (Wallet Balance)
        User->>StudioUI: اختيار "الدفع من رصيد أرباح المنصة"
        StudioUI->>Wallet: فحص الرصيد المتاح (Available Balance)
        Wallet->>Wallet: خصم قيمة الاشتراك وتسجيل حركة Transaction
        Wallet->>SubService: تأكيد الدفع
        SubService->>DB: تفعيل الاشتراك لمدة شهر
        SubService-->>StudioUI: إشعار بنجاح التفعيل دون الحاجة لبطاقة فيزا
    end
```

#### التدفق 3: مطابقة المشاريع بالذكاء الاصطناعي (AI Job Matcher Flow)
1. يقوم صاحب العمل بنشر وظيفة أو مشروع جديد.
2. يقوم النظام بتوليد متجهات رياضية دلالية (Vector Embedding) لوصف المشروع ومتطلباته وتخزينه في `Job.jobEmbedding`.
3. بمجرد فتح المستقل للمنصة، يقوم استعلام `pgvector` بحساب مسافة جيب التمام (Cosine Distance):
   $$\text{Match \%} = (1 - \text{cosine\_distance}(\text{profileEmbedding}, \text{jobEmbedding})) \times 100$$
4. تُرتب الوظائف أمام المستقل حسب نسبة التوافق الأكثر دقة (مثلاً: 96% تطابق مع مهاراتك وخبراتك السابقة).

---

### 3. الأمان، التوثيق وصلاحيات النظام (Security & RBAC)

* **التوثيق الموحد (Single Sign-On - SSO):** حساب واحد مشفر باستخدام Argon2id / Bcrypt، مع استخدام جلسات JWT آمنة ومحمية بـ `HttpOnly Cookies`.
* **عزل الصلاحيات (Row-Level Security - RLS):**
  * لا يستطيع أي مستخدم الوصول لبيانات السيرة الذاتية أو المحفظة المالية لمستخدم آخر.
  * المشرفون فقط من يملكون صلاحيات إصدار أكواد التفعيل وتعديل الأسعار وإدارة الكورسات في لوحة الإشراف.
* **حماية التوليد بالذكاء الاصطناعي (Rate Limiting & Anti-Abuse):**
  * حدود يومية للعمليات التجريبية في الاستوديو.
  * مراقبة واستهلاك محدد في جدول `AIToolUsageLog` لمنع هجمات الاستنزاف.

import { NextResponse } from "next/server";

// Fallback intelligent responder based on knowledge base & system prompt
function generateSmartReply(userMessage: string, systemPrompt?: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("واتساب") || msg.includes("واتس") || msg.includes("رقم") || msg.includes("تلفون") || msg.includes("هاتف")) {
    return "يسعدنا دائماً تواصلك المباشر مع فريق الدعم الفني وإدارة Render Group عبر واتساب الرسمي: +970 599 908 299 أو عبر الاتصال المباشر على نفس الرقم. كما يمكنك متابعة أحدث الأعمال عبر حساباتنا في إنستغرام وفيسبوك!";
  }

  if (msg.includes("فيسبوك") || msg.includes("انستغرام") || msg.includes("سوشيال") || msg.includes("ميديا")) {
    return "حساباتنا الرسمية على منصات التواصل الاجتماعي:\n• فيسبوك: https://www.facebook.com/Rendergroup.studio/\n• إنستغرام: https://www.instagram.com/render.group_studio/\n• واتساب وهاتف: +970 599 908 299";
  }

  if (msg.includes("سحب") || msg.includes("ارباح") || msg.includes("أرباح") || msg.includes("فلوس") || msg.includes("usdt") || msg.includes("بنك") || msg.includes("palpay") || msg.includes("بايونير")) {
    return "في RenderLancer، نوفر قنوات سحب آمنة وسريعة لكفاءات غزة والضفة والشتات:\n1. بنك فلسطين (حوالات بنكية مباشرة)\n2. محفظة PalPay الإلكترونية\n3. العملات الرقمية USDT (TRC-20) بدون قيود\n4. حسابات Payoneer العالمية.\nيمكنك طلب السحب من لوحة التحكم المالية متى ما بلغت الحد الأدنى ($50).";
  }

  if (msg.includes("سيرة") || msg.includes("cv") || msg.includes("ats") || msg.includes("سيره")) {
    return "توفر المنصة أداة ATS CV Builder الاحترافية المصممة بالذكاء الاصطناعي لمساعدتك في بناء سيرة ذاتية متوافقة مع أنظمة الفرز العالمية للشركات. يمكنك الانتقال لصفحة صانع السيرة الذاتية عبر القائمة وتصديرها بصيغة PDF فوراً!";
  }

  if (msg.includes("وظائف") || msg.includes("وظيفة") || msg.includes("مشروع") || msg.includes("تقديم") || msg.includes("شغل")) {
    return "سوق العمل في RenderLancer يضم مشاريع نوعية وفرص عمل عن بُعد مع شركات فلسطينية وإقليمية وعالمية. تأكد من إكمال ملفك الشخصي وإضافة نماذج أعمالك (Portfolio) ثم تصفح قسم الوظائف لتقديم عروضك.";
  }

  if (msg.includes("ذكاء") || msg.includes("استوديو") || msg.includes("ai") || msg.includes("صور") || msg.includes("فيديو") || msg.includes("صوت")) {
    return "استوديو Render Studio يضم 12 أداة ذكاء اصطناعي رائدة موحدة، تشمل:\n• توليد الصور الفائقة (GPT Image 2)\n• صناعة الفيديو السينمائي (Veo 3.1 & Seedance 2.0)\n• الذكاء الصوتي والموسيقى (ElevenLabs & Suno)\n• تحسين الأداء وصانع السير الذاتية.\nيمكنك تجربة الأدوات أو شحن الرصيد من صفحة الاستوديو!";
  }

  if (msg.includes("ضمان") || msg.includes("escrow") || msg.includes("حقوق") || msg.includes("نصب") || msg.includes("امان")) {
    return "نظام الضمان المالي Escrow في ريندر يضمن حق المستقل وصاحب العمل بنسبة 100%. يقوم العميل بدفع قيمة المشروع مسبقاً وتظل محجوزة بأمان حتى تسليم العمل واعتماده، ولا يتم تحرير المبلغ إلا برضا الطرفين.";
  }

  if (msg.includes("مرحبا") || msg.includes("السلام") || msg.includes("هلا") || msg.includes("صباح") || msg.includes("مساء")) {
    return "أهلاً بك وسهلاً في منصة Render Connect & Studio! 🌟 أنا مساعد الدعم الفني الذكي المخصص لمساعدتك. كيف يمكنني خدمتك اليوم؟ يمكنك سؤالي عن الوظائف، استوديو الـ AI، طرق السحب، أو التواصل المباشر مع فريقنا.";
  }

  return "شكراً لتواصلك مع ريندر! نحن نسعد بدعمك. يمكنك طرح أي سؤال بخصوص استوديو الذكاء الاصطناعي، الوظائف، سحب الأرباح، أو بناء سيرتك الذاتية. كما يمكنك التواصل المباشر مع إدارتنا وفريق الدعم على واتساب: +970 599 908 299 أو زيارة صفحة 'اتصل بنا' والأسئلة الشائعة FAQ.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history, systemPrompt, customApiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${systemPrompt || "أنت مساعد الدعم الفني الذكي لمنظومة Render Group."}\n\nسؤال المستخدم: ${message}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              reply: generatedText,
              provider: "gemini-api",
            });
          }
        }
      } catch (apiErr) {
        console.warn("Gemini direct API call failed, using built-in intelligent agent:", apiErr);
      }
    }

    // Default intelligent knowledge agent fallback (100% reliable, zero token cost)
    const reply = generateSmartReply(message, systemPrompt);
    return NextResponse.json({
      reply,
      provider: "built-in-agent",
    });
  } catch (error) {
    console.error("Support chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

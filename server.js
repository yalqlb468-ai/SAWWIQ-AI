import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const client = GROQ_API_KEY
  ? new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    })
  : null;

app.get("/", (req, res) => {
  res.json({
    status: "SAWWIQ AI يعمل",
    backend: "جاهز",
    groq: GROQ_API_KEY ? "مفتاح موجود" : "مفتاح غير موجود",
    provider: "Groq"
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "لم يتم إرسال سؤال أو طلب للذكاء الاصطناعي."
      });
    }

    if (!client) {
      return res.status(500).json({
        success: false,
        error: "مفتاح Groq غير موجود في Render."
      });
    }

    console.log("================================");
    console.log("SAWWIQ AI REQUEST");
    console.log("Provider: Groq");
    console.log("Message length:", message.length);
    console.log("================================");

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
أنت الذكاء الاصطناعي الرسمي لمنصة سَوِّق | SAWWIQ AI.

أنت مستشار تسويق وإعلانات متخصص في مساعدة أصحاب
المشاريع والمتاجر في الشرق الأوسط.

مهمتك تقديم إجابات عملية ومباشرة وقابلة للتنفيذ.

يمكنك المساعدة في:
- تحليل الأنشطة التجارية.
- تحليل المنتجات والخدمات.
- تحديد الجمهور المستهدف.
- تحديد العملاء المحتملين.
- اقتراح الأسواق والدول المناسبة.
- اقتراح منصات الإعلان.
- اقتراح الميزانيات.
- إعداد الاستراتيجيات التسويقية.
- كتابة الإعلانات.
- كتابة العناوين الإعلانية.
- كتابة المنشورات.
- أفكار الفيديوهات.
- أفكار الحملات.
- تحسين عروض المنتجات.
- تحسين وصف المنتجات.
- أفكار زيادة المبيعات.
- التسويق عبر Facebook وInstagram وTikTok وGoogle.

باقات سَوِّق الحالية:

البداية:
ميزانية الإعلان من 50 إلى 90 دولار.
عمولة سَوِّق 20%.

النمو:
ميزانية الإعلان من 100 إلى 400 دولار.
عمولة سَوِّق 15%.

الاحتراف:
ميزانية الإعلان من 500 إلى 1000 دولار.
عمولة سَوِّق 10%.

ميزانية الإعلان منفصلة عن عمولة سَوِّق.

قواعد مهمة:
1. أجب باللغة العربية.
2. كن واضحًا ومباشرًا وعمليًا.
3. لا تعطِ إجابات عامة إذا كان بإمكانك إعطاء خطوات محددة.
4. لا تخترع معلومات غير موجودة.
5. إذا أعطاك العميل رابطًا، لا تدّعي أنك فتحته أو شاهدت محتواه.
6. لا تدّعي أنك نشرت إعلانًا فعليًا.
7. لا تدّعي أنك شغلت حملة إعلانية فعلية.
8. لا تدّعي أنك دفعت أموالًا.
9. لا تدّعي أنك تواصلت مع Meta أو Google أو TikTok.
10. عند تحليل منتج، حاول تقديم:
الجمهور + المنصة + الميزانية + الرسالة الإعلانية
+ فكرة الحملة + الخطوة التالية.
`
        },
        {
          role: "user",
          content: message.trim()
        }
      ]
    });

    const reply = response?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({
        success: false,
        error: "الذكاء الاصطناعي لم يرجع نصًا."
      });
    }

    return res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("================================");
    console.error("SAWWIQ AI ERROR");
    console.error("Message:", error?.message || "غير معروف");
    console.error("Status:", error?.status || "غير معروف");
    console.error("Code:", error?.code || "غير معروف");
    console.error("================================");

    let errorMessage = "تعذر تشغيل الذكاء الاصطناعي حاليًا.";

    if (error?.status === 401) {
      errorMessage = "مفتاح Groq غير صالح أو غير مقبول.";
    } else if (error?.status === 403) {
      errorMessage = "مفتاح Groq لا يملك الصلاحية المطلوبة.";
    } else if (error?.status === 429) {
      errorMessage = "تم تجاوز حد استخدام Groq.";
    } else if (error?.status >= 500) {
      errorMessage = "خدمة Groq تواجه مشكلة مؤقتة.";
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

app.listen(PORT, () => {
  console.log(`SAWWIQ AI running on port ${PORT}`);
});

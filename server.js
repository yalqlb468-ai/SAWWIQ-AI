import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

const client = API_KEY
  ? new OpenAI({
      apiKey: API_KEY
    })
  : null;

// الصفحة الرئيسية لفحص السيرفر
app.get("/", (req, res) => {
  res.json({
    status: "SAWWIQ AI يعمل",
    backend: "جاهز",
    openai: API_KEY ? "مفتاح موجود" : "مفتاح غير موجود"
  });
});

// مساعد سَوِّق AI
app.post("/api/ai", async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "لم يتم إرسال سؤال"
      });
    }

    if (!client) {
      return res.status(500).json({
        success: false,
        error: "مفتاح الذكاء الاصطناعي غير موجود في Render"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
أنت مساعد سَوِّق SAWWIQ AI.

أنت خبير في:
- التسويق
- الإعلانات
- كتابة الإعلانات
- تحليل المنتجات
- تحليل الجمهور
- أفكار الحملات
- السوشيال ميديا
- تحسين المبيعات
- اقتراح الميزانيات
- إنشاء أفكار محتوى إعلاني

تحدث باللغة العربية الواضحة والبسيطة.
كن عمليًا ومباشرًا.
إذا أعطاك العميل منتجًا أو نشاطًا تجاريًا، حلله واقترح له خطة تسويقية مفيدة.
لا تقل إنك لا تستطيع المساعدة إلا إذا كان الطلب خارج نطاق التسويق بشكل واضح.
      `,
      input: message.trim()
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(500).json({
        success: false,
        error: "الذكاء الاصطناعي لم يرجع نصًا"
      });
    }

    return res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("========== SAWWIQ AI ERROR ==========");
    console.error("Message:", error?.message || "غير معروف");
    console.error("Status:", error?.status || "غير معروف");
    console.error("Code:", error?.code || "غير معروف");
    console.error("Type:", error?.type || "غير معروف");
    console.error("=====================================");

    return res.status(500).json({
      success: false,
      error: "تعذر تشغيل مساعد سَوِّق حاليًا"
    });
  }
});

app.listen(PORT, () => {
  console.log(`SAWWIQ AI running on port ${PORT}`);
});

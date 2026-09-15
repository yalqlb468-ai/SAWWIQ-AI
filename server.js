import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey: apiKey
    })
  : null;

// فحص حالة السيرفر
app.get("/", (req, res) => {
  res.json({
    status: "SAWWIQ AI يعمل",
    backend: "جاهز",
    openai: apiKey ? "مفتاح موجود" : "مفتاح غير موجود"
  });
});

// الذكاء الاصطناعي
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "اكتب الرسالة أولا"
      });
    }

    if (!client) {
      return res.status(500).json({
        success: false,
        error: "مفتاح الذكاء الاصطناعي غير موجود في الخادم"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: message.trim()
    });

    const reply = response.output_text || "";

    if (!reply) {
      return res.status(500).json({
        success: false,
        error: "تم الاتصال بالذكاء الاصطناعي ولكن لم يصل رد"
      });
    }

    res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("========== SAWWIQ AI ERROR ==========");
    console.error("Message:", error?.message);
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Type:", error?.type);
    console.error("=====================================");

    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي",
      details: error?.message || "خطأ غير معروف"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SAWWIQ AI running on port ${PORT}`);
});

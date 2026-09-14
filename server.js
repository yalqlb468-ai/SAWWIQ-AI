import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "SAWWIQ AI يعمل",
    message: "Backend جاهز"
  });
});

app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "اكتب الرسالة أولا"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-mini",
      input: message
    });

    res.json({
      success: true,
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SAWWIQ AI running on port ${PORT}`);
});

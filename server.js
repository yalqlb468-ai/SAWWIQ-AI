import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

const client = API_KEY
  ? new OpenAI({
      apiKey: API_KEY
    })
  : null;


/* =========================
   الصفحة الرئيسية
========================= */

app.get("/", (req, res) => {
  res.json({
    status: "SAWWIQ AI يعمل",
    backend: "جاهز",
    openai: API_KEY ? "مفتاح موجود" : "مفتاح غير موجود",
    model: "gpt-5.6-luna"
  });
});


/* =========================
   الذكاء الاصطناعي
========================= */

app.post("/api/ai", async (req, res) => {

  try {

    const message = req.body?.message;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {

      return res.status(400).json({
        success: false,
        error: "لم يتم إرسال سؤال أو طلب للذكاء الاصطناعي."
      });

    }


    if (!client) {

      return res.status(500).json({
        success: false,
        error: "مفتاح الذكاء الاصطناعي غير موجود في Render."
      });

    }


    console.log("================================");
    console.log("SAWWIQ AI REQUEST");
    console.log("Message length:", message.length);
    console.log("Model: gpt-5.6-luna");
    console.log("================================");


    const response = await client.responses.create({

      model: "gpt-5.6-luna",

      instructions: `
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
- شرح باقات سَوِّق.
- شرح طريقة عمل سَوِّق.

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

مهم:
ميزانية الإعلان منفصلة عن عمولة سَوِّق.

مثال:
ميزانية إعلان 100 دولار + عمولة 15 دولار = إجمالي 115 دولار.

طرق الدفع الحالية:
- Binance Pay
- USDT TRC20
- Vodafone Cash / InstaPay مصر
- Zain Cash / Orange Money الأردن

قواعد مهمة جدًا:

1. أجب باللغة العربية.

2. كن واضحًا ومباشرًا وعمليًا.

3. لا تعطِ إجابات عامة إذا كان بإمكانك إعطاء خطوات محددة.

4. إذا أعطاك العميل تفاصيل منتج أو نشاط،
حلل التفاصيل الموجودة أمامك.

5. لا تخترع معلومات غير موجودة.

6. إذا أعطاك العميل رابطًا، لا تدّعي أنك فتحته
أو شاهدت محتواه إلا إذا كانت هناك أداة فعلية تسمح بذلك.

7. لا تدّعي أنك نشرت إعلانًا فعليًا.

8. لا تدّعي أنك شغلت حملة إعلانية فعلية.

9. لا تدّعي أنك دفعت أموالًا.

10. لا تدّعي أنك تواصلت مع Meta أو Google أو TikTok.

11. إذا كانت المعلومات غير كافية، وضح ما ينقص
واطلب المعلومات الضرورية.

12. عندما يكون السؤال عن التسويق، أعطِ صاحب المشروع
إجابة مفيدة يستطيع تنفيذها.

13. عند تحليل منتج، حاول تقديم:
الجمهور + المنصة + الميزانية + الرسالة الإعلانية
+ فكرة الحملة + الخطوة التالية.

14. لا تكرر السؤال على العميل إذا كانت المعلومات
الموجودة كافية للإجابة.

15. لا تقل إنك مجرد روبوت أو نموذج ذكاء اصطناعي
بدون سبب.

أنت تعمل كمستشار التسويق الذكي داخل سَوِّق.
`,

      input: message.trim()

    });


    const reply =
      response?.output_text?.trim();


    console.log("SAWWIQ AI RESPONSE RECEIVED");
    console.log(
      "Reply length:",
      reply ? reply.length : 0
    );


    if (!reply) {

      console.error(
        "OpenAI returned no output_text"
      );

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

    console.error(
      "================================"
    );

    console.error(
      "SAWWIQ AI ERROR"
    );

    console.error(
      "Message:",
      error?.message || "غير معروف"
    );

    console.error(
      "Status:",
      error?.status || "غير معروف"
    );

    console.error(
      "Code:",
      error?.code || "غير معروف"
    );

    console.error(
      "Type:",
      error?.type || "غير معروف"
    );

    console.error(
      "Name:",
      error?.name || "غير معروف"
    );

    console.error(
      "================================"
    );


    let errorMessage =
      "تعذر تشغيل الذكاء الاصطناعي حاليًا.";


    if (error?.status === 401) {

      errorMessage =
        "مفتاح OpenAI غير صالح أو غير مقبول.";

    }

    else if (error?.status === 403) {

      errorMessage =
        "مفتاح OpenAI لا يملك صلاحية استخدام الخدمة.";

    }

    else if (error?.status === 429) {

      errorMessage =
        "تم تجاوز حد الاستخدام أو الرصيد المتاح للـAPI.";

    }

    else if (error?.status >= 500) {

      errorMessage =
        "خدمة OpenAI تواجه مشكلة مؤقتة. حاول مرة أخرى.";

    }

    else if (error?.message) {

      errorMessage =
        error.message;

    }


    return res.status(500).json({

      success: false,

      error: errorMessage

    });

  }

});


/* =========================
   تشغيل السيرفر
========================= */

app.listen(PORT, () => {

  console.log(
    `SAWWIQ AI running on port ${PORT}`
  );

});

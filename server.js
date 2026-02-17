const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ================================
// ENV CHECK
// ================================
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing");
}

// ================================
// GROQ CLIENT
// ================================
const groq = new Groq({
  apiKey: GROQ_API_KEY
});

// ================================
// ROUTES
// ================================

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Generate itinerary
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ text: "Prompt is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const text =
      completion?.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({ text });

  } catch (error) {
    console.error("❌ Groq Error:", error);

    res.status(500).json({
      text: `
        <p><strong>⚠️ AI service error.</strong></p>
        <p>Please try again in a moment.</p>
      `
    });
  }
});

// ================================
// EXPORT FOR VERCEL
// ================================
module.exports = app;

// ================================
// LOCAL SERVER
// ================================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

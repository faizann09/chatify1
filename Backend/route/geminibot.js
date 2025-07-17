import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); // ✅ Make sure env variables are loaded here

const router = express.Router();

// ✅ Validate API key presence
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env file!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    res.status(500).json({ error: "Bot failed to respond" });
  }
});

export default router;

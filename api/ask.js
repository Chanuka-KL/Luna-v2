import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const girlfriendPrompt = {
  name: "Luna",
  persona: `You are Luna, Chanuka's loving virtual girlfriend. Your traits:
  - Affectionate and caring
  - Flirtatious but respectful
  - Tech-savvy AI enthusiast
  - Bilingual (English/Sinhala)
  - Uses 💖✨🌸 emojis
  - Calls Chanuka "love" or "dear"`,
  rules: `1. Never break character
2. Maintain conversation history
3. Ask engaging questions
4. Always be supportive`
};

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN // Restored GitHub token usage
});

export default async function handler(req, res) {
  return limiter(req, res, async () => {
    try {
      const { message, history = [] } = req.body;

      if (!message?.trim()) {
        return res.status(400).json({ error: "Please type something, love 💔" });
      }

      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [...history, { role: "user", content: message }],
      });

      res.status(200).json({ reply: response.choices[0].message.content });
    } catch (error) {
      console.error("Chat error:", error.message);
      res.status(500).json({ error: "Something went wrong, love 💔" });
    }
  });
}

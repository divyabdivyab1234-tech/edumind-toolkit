import Groq from "groq-sdk";
import { extractText } from "unpdf";

export const generateQuiz = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file uploaded" });

    // 1. Extract text from PDF
    const pdfBuffer = new Uint8Array(req.file.buffer);
    const { text } = await extractText(pdfBuffer);
    const fullText = Array.isArray(text) ? text.join(" ") : text;

    if (!fullText || fullText.length < 50) {
      return res.status(400).json({ message: "PDF content too short to generate a quiz." });
    }

    // 2. Initialize Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      Based on the following notes, generate:
      1. Exactly 5 Multiple Choice Questions (MCQs) with 4 options and the correct answer.
      2. Exactly 5 Viva questions for oral preparation with a sample answer.

      Return ONLY a raw JSON object with this exact structure:
      {
        "mcqs": [{"question": "...", "options": ["...", "...", "...", "..."], "answer": "..."}],
        "viva": [{"question": "...", "sampleAnswer": "..."}]
      }
      Notes: ${fullText.substring(0, 15000)}
    `;

    // 3. Call Groq with JSON mode enabled
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model:"llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0].message.content.trim();
    
    // Parse and send the response
    res.json(JSON.parse(responseText));

  } catch (error) {
    console.error("🔥 QUIZ ERROR:", error);
    res.status(500).json({ message: "Failed to generate quiz data." });
  }
};
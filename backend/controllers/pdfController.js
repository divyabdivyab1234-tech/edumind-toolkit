import Groq from "groq-sdk";
import { extractText } from "unpdf";
import dotenv from "dotenv";

dotenv.config();

export const generateKeypoints = async (req, res) => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    // 2. Extract Text from PDF
    const pdfBuffer = new Uint8Array(req.file.buffer); 
    const result = await extractText(pdfBuffer);
    
    let fullText = Array.isArray(result.text) 
      ? result.text.join(" ") 
      : (result.text || "");

    if (!fullText.trim()) {
      return res.status(400).json({ message: "PDF appears to be empty or unreadable." });
    }

    // 3. Initialize Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Analyze the following text and provide exactly 5 clear, professional bullet points summarizing the key information:\n\n${fullText.substring(0, 15000)}`;

    // 4. Call Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const output = chatCompletion.choices[0].message.content;

    // 5. Format Keypoints
    const keypoints = output
      .split("\n")
      .map(p => p.replace(/^[*-]\s*|^\d+\.\s*/, "").trim()) // Removes bullets or numbers
      .filter(p => p.length > 5); // Filters out empty or too short lines

    // 6. Send Success Response
    return res.json({ keypoints: keypoints.slice(0, 5) }); // Ensures exactly 5

  } catch (error) {
    console.error("🔥 Error during PDF Processing:", error);

    // Standard fallback error
    return res.status(500).json({ 
      message: "Processing failed", 
      details: error.message 
    });
  }
};
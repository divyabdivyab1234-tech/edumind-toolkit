import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

export const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    // Initialize Groq inside the handler for better environment variable loading
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Using the "instant" model for the fastest possible explanation
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
            Act as code explainer name urself anything u want  Explain the following ${language} code for a learner. 
            Break it down into:
            1. High-level Purpose.
            2. Line-by-Line Logic.
            3. Efficiency/Improvements.
            
            Code to explain:
            ${code}
          `,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const text = chatCompletion.choices[0].message.content;

    res.status(200).json({ success: true, explanation: text });

  } catch (error) {
    console.error("❌ Code Explainer Error:", error.message);
    
    // Updated error message to reflect the new infrastructure
    res.status(500).json({ 
      success: false, 
      message: "AI Service temporarily unavailable. Please check your Groq API quota." 
    });
  }
};
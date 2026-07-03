import Groq from "groq-sdk";

export const generateRoadmap = async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ message: "Topic is required" });

  try {
    // MOVE THIS LINE HERE (Inside the function)
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
            Create a 6-step learning roadmap for: "${topic}".
            Return ONLY a JSON array of objects. 
            Each object must have: "title", "description", "weeks", and "difficulty" (Easy/Medium/Hard).
            No markdown, no backticks, no explanatory text.
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }, 
    });

    let text = chatCompletion.choices[0].message.content.trim();
    const rawData = JSON.parse(text);
    
    const rawSteps = Array.isArray(rawData) ? rawData : (rawData.steps || Object.values(rawData)[0]);

    const roadmap = rawSteps.slice(0, 6).map((step, index) => ({
      id: index + 1,
      title: step.title || "Next Step",
      description: step.description || "Learn more about this topic.",
      weeks: step.weeks || 2,
      difficulty: step.difficulty || "Medium"
    }));

    res.json({ roadmap });
  } catch (error) {
    console.error("Groq AI Error:", error);
    res.status(500).json({ message: "Failed to generate roadmap via Groq" });
  }
};
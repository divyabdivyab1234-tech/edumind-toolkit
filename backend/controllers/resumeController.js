import Groq from 'groq-sdk';

// Initialize Groq securely
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const optimizeResumeSection = async (req, res) => {
  console.log("📥 Incoming Data to Expand:", req.body);

  try {
    const { 
      name, role, location, internshipCompany, experienceCompany, project1_title, project2_title,
      rawSummary, rawHardSkills, rawSoftSkills, rawInternship, rawExperience, rawProject1, rawProject2,
      rawCertifications, rawGoals, rawStrengths, rawWeaknesses, rawInterests 
    } = req.body;

    // Safety fallback check to ensure Groq doesn't receive completely blank primary strings
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ Error: GROQ_API_KEY is missing from process.env!");
      return res.status(500).json({ success: false, error: "Backend environment missing API Key Key." });
    }

    const systemInstruction = `You are an elite AI technical resume enhancer. Your job is to take basic, single-line inputs from a user and expand them into deep, comprehensive, high-impact professional summaries and descriptions.
    
    CRITICAL RULE: For summaries, projects, and goals, you must turn a 1-line basic input into a long, beautifully worded 5 to 6 line paragraph packed with technical keywords and action verbs. For internships and experience, turn the basic idea into 4 extremely dense bullet points. This text volume is required to completely fill an entire A4 page layout without leaving empty blank slots.
    
    Return your response strictly as a clean JSON object matching the requested schema. Do not wrap the JSON output in markdown code blocks like \`\`\`json.`;

    const userPrompt = `
      Take these raw basic inputs and expand them into professional, dense technical descriptions matching the target role: "${role || 'Developer'}":
      
      - Profile Summary Input: "${rawSummary || 'Looking for an entry role'}" -> Expand into a formal 5-6 line technical paragraph.
      - Hard Skills Input: "${rawHardSkills || 'Web development tools'}" -> Extrapolate into an array of 9 matching specialized tools/frameworks.
      - Soft Skills Input: "${rawSoftSkills || 'Team player'}" -> Extrapolate into an array of 6 modern behavioral skills.
      - Internship Input: "${rawInternship || 'Assisted with code and documentation'}" at company "${internshipCompany || 'Technical Institute'}" -> Expand into 4 long, deeply descriptive, space-filling bullet points separated by \\n.
      - Experience Input: "${rawExperience || 'Helped team handle workshop tools and diagnostics'}" at company "${experienceCompany || 'Industrial Center'}" -> Expand into 3 long, space-filling technical bullet points separated by \\n.
      - Project 1 ("${project1_title || 'Application Engine'}") Input: "${rawProject1 || 'built a database app'}" -> Expand this into a massive 5 to 6 line paragraph explaining the architecture, state management, UI implementation, and structural scaling optimization.
      - Project 2 ("${project2_title || 'System Tracker'}") Input: "${rawProject2 || 'made a project tracker'}" -> Expand this into another massive 5 to 6 line paragraph detailing backend endpoints, microservices, or custom CSS styling integration.
      - Certifications Input: "${rawCertifications || 'Technical course certificate'}" -> Convert into an array of 2 formal authority-verified certifications.
      - Goals Input: "${rawGoals || 'To work in a good team'}" -> Expand into a detailed multi-sentence professional milestone target.
      - Strengths Input: "${rawStrengths || 'hard working'}" -> Turn into 3 distinct highly professional operational performance traits.
      - Weaknesses Input: "${rawWeaknesses || 'impatient sometimes'}" -> Turn into 2 constructively framed developmental growth points.
      - Interests Input: "${rawInterests || 'tech trends'}" -> Turn into 3 research-oriented interest badges.

      Match this structural JSON format exactly:
      {
        "summary": "Expanded 5-6 line paragraph text",
        "hardSkills": ["Skill1", "Skill2"],
        "softSkills": ["Skill1", "Skill2"],
        "internshipTitle": "Technical Intern",
        "internshipBullets": "Bullet 1\\nBullet 2\\nBullet 3\\nBullet 4",
        "experienceTitle": "Technical Assistant",
        "experienceBullets": "Bullet 1\\nBullet 2\\nBullet 3",
        "project1_desc": "Expanded 5-6 line paragraph detailing project architectural depth matching user's short input",
        "project2_desc": "Expanded 5-6 line paragraph detailing second project architectural depth matching user's short input",
        "certifications": ["Cert 1", "Cert 2"]
        
      }
    `;

    // Connect to Groq API
    // Connect to Groq API
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ UPDATED CURRENT SUPPORTED MODEL
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    let rawJsonString = completion.choices[0].message.content.trim();
    
    // SANITIZATION CLEANUP: If the model accidentally sends markdown back, this strips it away cleanly
    if (rawJsonString.startsWith("```")) {
      rawJsonString = rawJsonString.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedResumeContent = JSON.parse(rawJsonString);

    return res.status(200).json({
      success: true,
      data: parsedResumeContent
    });

  } catch (error) {
    // Prints out the precise source of failure in your command terminal
    console.error("❌ GROQ CRASH DETAILS:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message || "The Groq AI engine failed to process the point expansion."
    });
  }
};
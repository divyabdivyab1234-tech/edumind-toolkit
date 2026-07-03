import React, { useState } from "react";
import axios from "axios";
import "./quizGenerator.css";

const QuizGenerator = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("mcq");
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    if (!file) return alert("Please upload a PDF first!");
    
    const formData = new FormData();
    formData.append("pdf", file);
    setLoading(true);
    setData(null);

    try {
      const res = await axios.post("http://localhost:5000/api/quiz/generate", formData);
      setData(res.data);
      setSelectedAnswers({});
    } catch (err) {
      alert("Error generating quiz. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: option });
  };

  return (
    <div className="header">
    <div className="quiz-page">
      <div className="quiz-header">
        <h2>🧠 AI Quiz & Viva Generator</h2>
        <p>Turn your PDF notes into interactive practice sessions</p>
        
        <div className="upload-section">
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="b" />
          <button onClick={handleGenerate} disabled={loading} className="build-btn">
            {loading ? "Analyzing Notes..." : "Generate Quiz"}
          </button>
        </div>
      </div>

      {data && (
        <div className="quiz-result-area">
          <div className="tab-bar">
            <button className={tab === "mcq" ? "active" : ""} onClick={() => setTab("mcq")}>MCQ Practice</button>
            <button className={tab === "viva" ? "active" : ""} onClick={() => setTab("viva")}>Viva Prep</button>
          </div>

          <div className="content-box">
            {tab === "mcq" ? (
             <div className="mcq-wrapper">
  {data.mcqs.map((q, i) => (
    <div key={i} className="quiz-card">
      <h4>{i + 1}. {q.question}</h4>
      <div className="options-list">
        {q.options.map((opt, oi) => {
          const userHasChosen = selectedAnswers[i] !== undefined;
          
          // SMARTER COMPARISON: Trim spaces and ignore case
          const cleanOption = opt.trim().toLowerCase();
          const cleanAnswer = q.answer.trim().toLowerCase();
          
          // Check if this specific button is what the user clicked
          const isSelected = selectedAnswers[i] === opt;
          
          // Check if this specific button IS the correct answer
          // We check if the option text matches the answer text OR 
          // if the answer is just a letter (like "B") and this is option B
          const isCorrect = cleanOption === cleanAnswer || 
                            (cleanAnswer.length === 1 && opt.startsWith(q.answer));

          let btnClass = "";
          if (userHasChosen) {
            if (isCorrect) {
              btnClass = "correct-reveal"; // Always show the right one in Green
            } else if (isSelected) {
              btnClass = "wrong-reveal"; // If user clicked this and it's not correct, show Red
            }
          }

          return (
            <button 
              key={oi} 
              onClick={() => !userHasChosen && handleSelectOption(i, opt)}
              className={`option-btn ${btnClass}`}
              disabled={userHasChosen}
            >
              {opt}
            </button>
          );
        })}
      </div>
      
      {/* FEEDBACK AREA */}
      {selectedAnswers[i] && (
        <div className={`feedback-message ${selectedAnswers[i].trim().toLowerCase() === q.answer.trim().toLowerCase() || selectedAnswers[i].startsWith(q.answer) ? "success" : "error"}`}>
          {selectedAnswers[i].trim().toLowerCase() === q.answer.trim().toLowerCase() || selectedAnswers[i].startsWith(q.answer)
            ? "✅ Correct! Great job." 
            : `❌ Incorrect. The right answer was: ${q.answer}`}
        </div>
      )}
    </div>
  ))}
</div>
            ) : (
              <div className="viva-wrapper">
                {data.viva.map((v, i) => (
                  <div key={i} className="viva-card">
                    <h4>Q: {v.question}</h4>
                    <details>
                      <summary>💡 View Suggested Answer</summary>
                      <div className="answer-text">{v.sampleAnswer}</div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      
      )}
    </div>
</div>
  );
};

export default QuizGenerator;
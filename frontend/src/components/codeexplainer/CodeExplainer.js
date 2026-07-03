import React, { useState } from 'react';
import axios from 'axios';
import './code.css'
export default function CodeExplainer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code) return alert("Please paste some code!");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/code/explain", { code, language });
      setResult(res.data.explanation);
    } catch (err) {
      alert("Analysis failed. Check backend.");
    }
    setLoading(false);
  };

  return (
    <div className="explainer-container">
      <div className="input-area">
        <select onChange={(e) => setLanguage(e.target.value)} className="lang-select">
          <option>JavaScript</option>
          <option>Python</option>
          <option>Java</option>
          <option>C++</option>
        </select>
        
        <textarea 
          placeholder="// Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-input"
        />
        
        <button onClick={handleExplain} disabled={loading} className="explain-btn">
          {loading ? "Analyzing Logic..." : "Explain Code"}
        </button>
      </div>

      {result && (
        <div className="result-area">
          <h3>Explanation:</h3>
          <div className="explanation-text">{result}</div>
        </div>
      )}
    </div>
  );
}
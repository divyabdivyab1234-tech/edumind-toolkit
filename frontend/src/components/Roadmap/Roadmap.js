import React, { useState,useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./Roadmap.css";

const Roadmap = () => {
  const [topic, setTopic] = useState("");
  const [steps, setSteps] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("https://edumind-toolkit.onrender.com/api/roadmap/generate", { topic });
      setSteps(res.data.roadmap);
      setCompletedIds([]); 
    } catch (err) {
      alert("Error generating roadmap.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (steps.length > 0 && completedIds.length === steps.length) {
    setShowSuccess(true);
  } else {
    setShowSuccess(false);
  }
}, [completedIds, steps]);

  const toggleStep = (id) => {
    setCompletedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const progress = steps.length ? Math.round((completedIds.length / steps.length) * 100) : 0;

  return (
    <div className="roadmap-root">
      {/* CENTERED HEADER & INPUT */}
      <section className="hero-section">
        <h1 className="main-title">AI Roadmap Architect</h1>
        <p className="subtitle">Transform your goals into a structured learning path</p>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="What do you want to learn?" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={handleGenerate} className="gen-btn" disabled={loading}>
            {loading ? "Architecting..." : "Generate Plan"}
          </button>
        </div>
      </section>

      {steps.length > 0 && (
        <div className="dashboard-layout">
          {/* TOP PROGRESS BAR */}
          <div className="progress-card">
            <div className="progress-info">
              <span>Your Mastery Journey</span>
              <span className="percent">{progress}%</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="visual-grid">
            {/* LEFT: STEP CARDS */}
            <div className="steps-column">
              {steps.map((step) => {
                const isDone = completedIds.includes(step.id);
                return (
                  <div key={step.id} className={`step-card ${isDone ? "active-step" : ""}`}>
                    <div className="step-header">
                      <span className="step-num">0{step.id}</span>
                      <button 
                        className={`done-btn ${isDone ? "is-done" : ""}`}
                        onClick={() => toggleStep(step.id)}
                      >
                        {isDone ? "✓ Completed" : "Mark as Done"}
                      </button>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <div className="step-footer">
                      <span className="tag">{step.difficulty}</span>
                      <span className="time">⏱ {step.weeks} Weeks</span>
                    </div>
                  </div>
                );
              })}
            </div>
            

            {/* RIGHT: DATA CHART */}
            <div className="chart-column">
              <div className="chart-box">
                <div class="t">
                <h3>Time Allocation Analysis</h3>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={steps}>
                    <XAxis dataKey="title" hide />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="weeks" radius={[4, 4, 0, 0]}>
                      {steps.map((entry) => (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={completedIds.includes(entry.id) ? "#10b981" : "#6366f1"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
  <div className="success-overlay">
    <div className="success-modal">
      
      <h1>Journey Completed!🎉
      
        "The beautiful thing about learning is that nobody can take it away from you."
      </h1>
      
     
    </div>
  </div>
)}
    </div>
  );
};

export default Roadmap;
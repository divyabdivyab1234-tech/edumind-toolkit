import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './resume.css';

const ResumeBuilder = () => {
  // 1. Core State Setup initialized with an auto-fallback pattern
  const [formData, setFormData] = useState({
    name: '', role: '', email: '', phone: '', location: '', company: '',
    rawSummary: '', rawHardSkills: '', rawSoftSkills: '',
    rawInternship: '', rawExperience: '', rawProject1: '', rawProject2: '',
    rawCertifications: '', rawGoals: '', rawStrengths: '', rawWeaknesses: '', rawInterests: '',
    
    summary: '', hardSkills: [], softSkills: [],
    internshipTitle: '', internshipCompany: '', internshipBullets: '',
    experienceTitle: '', experienceCompany: '', experienceBullets: '',
    project1_title: '', project1_desc: '',
    project2_title: '', project2_desc: '',
    certifications: []
  });

  const [loading, setLoading] = useState(false);

  // 2. AUTO-SELECT & LOAD HOOK: Executes immediately when the app components mount
  useEffect(() => {
    const savedData = localStorage.getItem('edumind_resume_cache');
    
    if (savedData) {
      console.log("⚡ Auto-selecting and loading your saved profile layout...");
      setFormData(JSON.parse(savedData));
    } else {
      console.log("🌱 No cache found. Auto-selecting default baseline profile details.");
      // Auto-select baseline credentials on first-time load to save layout typing time
      setFormData(prev => ({
        ...prev,
        name: 'B Divya',
        role: 'Full Stack Developer',
        email: 'divyabdivyab1234@gmail.com',
        phone: '6361139622',
        location: 'Ballari',
        company: 'Gttc',
        rawSummary: 'Analytical Full Stack Developer focused on digital automation workflows.',
        rawHardSkills: 'React, Node.js, HTML, CSS, JavaScript, MongoDB',
        rawSoftSkills: 'Analytical Thinking, Critical Troubleshooting, Technical Collaboration',
        rawInternship: 'Performing Web Development tasks, structuring professional layouts, and optimizing UI components.',
        internshipCompany: 'GTTC Ballari',
        rawExperience: 'Studying under C-20 syllabus framework and handling technical tooling systems.',
        experienceCompany: 'Government Tool Room & Training Centre',
        project1_title: 'AI-Driven Professional Resume Builder Engine',
        rawProject1: 'I created a MERN stack project for resume building that generates multi-section A4 layouts.',
        project2_title: 'Industrial Inventory Tracker Tool',
        rawProject2: 'Developed an automated asset tracker to log hardware components and validation logs.'
      }));
    }
  }, []);

  // 3. PERSISTENT SAVE EFFECT: Automatically runs and saves whenever ANY field is modified
  useEffect(() => {
    // Avoid saving completely blank layout allocations on initial boot cycle
    if (formData.name || formData.role) {
      localStorage.setItem('edumind_resume_cache', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const callAIResumeEngine = async () => {
    if (!formData.name || !formData.role) {
      alert("Please enter your Name and Target Title first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://edumind-toolkit.onrender.com/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          ...result.data
        }));
      } else {
        alert("Server Error: " + result.error);
      }
    } catch (err) {
      console.error("Connection failed:", err);
      alert("Could not connect to the backend server. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const exportDocument = () => {
    const element = document.getElementById('resume-canvas');
    html2pdf().set({
      margin: 0,
      filename: `${formData.name || 'Professional'}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  // Clear Cache Action Helper
  const clearSavedCache = () => {
    if (window.confirm("Are you sure you want to clear your saved input fields?")) {
      localStorage.removeItem('edumind_resume_cache');
      window.location.reload();
    }
  };

  return (
    <div className="workspace-container">
      
      {/* INPUT EDITOR PANEL */}
      <aside className="editor-sidebar">
        <div className="sidebar-header">
          <h2>Input Your Points</h2>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={clearSavedCache} className="btn-primary" style={{backgroundColor: '#ef4444'}}>Reset</button>
            <button onClick={exportDocument} className="btn-primary">Download PDF</button>
          </div>
        </div>

        <div className="form-group-stack">
          <h3>Contact Info</h3>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} />
          <input type="text" name="role" placeholder="Target Role" onChange={handleChange} value={formData.role} />
          <div className="field-row">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} />
          </div>
          <input type="text" name="location" placeholder="Location" onChange={handleChange} value={formData.location} />

          <h3>Give Your 1-Line Raw Points</h3>
          
          <label className="input-lbl">Brief Profile Summary Idea</label>
          <textarea name="rawSummary" placeholder="Summary ideas..." onChange={handleChange} value={formData.rawSummary} />

          <label className="input-lbl">Hard Skills (Basic keywords)</label>
          <input type="text" name="rawHardSkills" placeholder="React, Node, etc..." onChange={handleChange} value={formData.rawHardSkills} />

          <label className="input-lbl">Soft Skills (Basic keywords)</label>
          <input type="text" name="rawSoftSkills" placeholder="Communication, etc..." onChange={handleChange} value={formData.rawSoftSkills} />

          <label className="input-lbl">Internship History</label>
          <input type="text" name="internshipCompany" placeholder="Company/Institute Name" onChange={handleChange} value={formData.internshipCompany} />
          <textarea name="rawInternship" placeholder="Internship work details..." onChange={handleChange} value={formData.rawInternship} />

          <label className="input-lbl">Work/Technical Experience</label>
          <input type="text" name="experienceCompany" placeholder="Organization" onChange={handleChange} value={formData.experienceCompany} />
          <textarea name="rawExperience" placeholder="Experience details..." onChange={handleChange} value={formData.rawExperience} />

          <label className="input-lbl">Project 1 details</label>
          <input type="text" name="project1_title" placeholder="Project 1 Title" onChange={handleChange} value={formData.project1_title} />
          <textarea name="rawProject1" placeholder="Project details..." onChange={handleChange} value={formData.rawProject1} />

          <label className="input-lbl">Project 2 details</label>
          <input type="text" name="project2_title" placeholder="Project 2 Title" onChange={handleChange} value={formData.project2_title} />
          <textarea name="rawProject2" placeholder="Project details..." onChange={handleChange} value={formData.rawProject2} />

          <label className="input-lbl">Certifications</label>
          <input type="text" name="rawCertifications" placeholder="Certifications..." onChange={handleChange} value={formData.rawCertifications} />

          

          <button onClick={callAIResumeEngine} disabled={loading} className="btn-ai-engine">
            {loading ? 'Groq expanding your data...' : '✨ Expand 1-Liners Into Full Page'}
          </button>
        </div>
      </aside>

      {/* BLUEPRINT PREMIUM CANVAS */}
      <main className="preview-space">
        <div className="a4-document-blueprint" id="resume-canvas">
          
          <header className="premium-modern-header">
            <div className="header-identity">
              <h1>{formData.name || "YOUR NAME HERE"}</h1>
              <p className="subtitle-target">{formData.role || "TARGET PROFESSIONAL ROLE"}</p>
              <p className="profile-paragraph">{formData.summary || "Your expanded 5-6 line professional profile summary will generate here."}</p>
            </div>
            <div className="header-contact-panel">
              {formData.email && <p>✉️ {formData.email}</p>}
              {formData.phone && <p>📱 {formData.phone}</p>}
              {formData.location && <p>📍 {formData.location}</p>}
            </div>
          </header>

          <div className="document-body-split">
            <div className="column-left">
              <section className="segment-box">
                <h2 className="segment-title">Professional Internships</h2>
                {formData.internshipCompany && (
                  <div className="history-node">
                    <h3>{formData.internshipTitle || "Intern"}</h3>
                    <h4>{formData.internshipCompany}</h4>
                    <ul>
                      {formData.internshipBullets && formData.internshipBullets.split('\n').map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Technical Experience</h2>
                {formData.experienceCompany && (
                  <div className="history-node">
                    <h3>{formData.experienceTitle || "Technical Specialist"}</h3>
                    <h4>{formData.experienceCompany}</h4>
                    <ul>
                      {formData.experienceBullets && formData.experienceBullets.split('\n').map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Strategic Goals</h2>
                <p className="dense-body-text">{formData.goals}</p>
              </section>
            </div>

            <div className="column-right">
              <section className="segment-box">
                <h2 className="segment-title">Hard Skills</h2>
                <div className="badge-wrap-flex">
                  {formData.hardSkills && formData.hardSkills.map((sk, i) => <span key={i} className="skill-badge-dark">{sk}</span>)}
                </div>
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Soft Skills</h2>
                <div className="badge-wrap-flex">
                  {formData.softSkills && formData.softSkills.map((sk, i) => <span key={i} className="skill-badge-light">{sk}</span>)}
                </div>
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Key Projects</h2>
                {formData.project1_title && (
                  <div className="history-node" style={{marginBottom: '15px'}}>
                    <h3>{formData.project1_title}</h3>
                    <p className="dense-body-text">{formData.project1_desc}</p>
                  </div>
                )}
                {formData.project2_title && (
                  <div className="history-node">
                    <h3>{formData.project2_title}</h3>
                    <p className="dense-body-text">{formData.project2_desc}</p>
                  </div>
                )}
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Certifications</h2>
                <ul className="clean-list-item">
                  {formData.certifications && formData.certifications.map((c, i) => <li key={i}>📜 {c}</li>)}
                </ul>
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Core Metrics</h2>
                <h4>Strengths</h4>
                <ul className="clean-list-item">{formData.strengths && formData.strengths.map((s,i)=><li key={i}>➕ {s}</li>)}</ul>
                <h4 style={{marginTop: '5px'}}>Development Areas</h4>
                <ul className="clean-list-item">{formData.weaknesses && formData.weaknesses.map((w,i)=><li key={i}>🔄 {w}</li>)}</ul>
              </section>

              <section className="segment-box">
                <h2 className="segment-title">Interests</h2>
                <div className="badge-wrap-flex">
                  {formData.interests && formData.interests.map((int, i) => <span key={i} className="interest-tag">{int}</span>)}
                </div>
              </section>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default ResumeBuilder;
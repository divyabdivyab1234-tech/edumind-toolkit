import { useState } from "react";
import axios from "axios";
import "./Pdf.css";

export default function Pdf() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyPoints, setKeyPoints] = useState([]);

  // 🔹 BACKEND CHECK
 

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      alert("PDF uploaded successfully ✅");
    }
  };

  // ✅ FIXED FUNCTION
  const generateKeyPoints = async () => {
  if (!file) {
    alert("Please upload a PDF first");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    setLoading(true);
    setKeyPoints([]);

    const res = await axios.post(
     "https://edumind-toolkit.onrender.com/api/pdf/keypoints",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setKeyPoints(res.data.keypoints);
  } catch (error) {
    console.error(error);
    alert("Failed to generate key points");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="pdf-wrapper">
      <h1 >PDF Key Points Generator</h1>

      {/* UPLOAD BLOCK */}
      <div className="card upload-card">
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          hidden
          onChange={handleFileSelect}
        />

        <label htmlFor="pdfInput" className="upload-btn">
          Upload PDF
        </label>

        {fileName && <p className="file-name">📄 {fileName}</p>}
      </div>

      {/* GENERATE BLOCK */}
      <div className="card generate-card">
        <button
          className="generate-btn"
          onClick={generateKeyPoints}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Key Points"}
        </button>
      </div>

      {/* OUTPUT BLOCK */}
      <div className="card output-card">
        <h3>Generated Key Points</h3>

        {loading && <div className="loader"></div>}

        {!loading && keyPoints.length === 0 && (
          <p className="placeholder">
            Upload a PDF and generate key points to see results here.
          </p>
        )}

        <ul>
          {keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdfRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";

const app = express();

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in the .env file!");
} else {
  mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
}

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ADDED BACK: This line is required to parse JSON request bodies sent from your frontend React app
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/resume', resumeRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} does not exist on this server.`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
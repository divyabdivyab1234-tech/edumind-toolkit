import express from "express";
import multer from "multer";
import { generateQuiz } from "../controllers/quizController.js";

const router = express.Router();

// Memory storage is best for AI processing so we don't clutter the server with files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This route handles the PDF upload and triggers the Gemini AI
router.post("/generate", upload.single("pdf"), generateQuiz);

export default router;
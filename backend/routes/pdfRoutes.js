import express from "express";
import multer from "multer";
import { generateKeypoints } from "../controllers/pdfController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/keypoints", upload.single("pdf"), generateKeypoints);

export default router;

import express from 'express';
import { optimizeResumeSection } from '../controllers/resumeController.js';

const router = express.Router();

// The path here must be '/' because server.js already handles the '/api/resume' prefix
router.post('/', optimizeResumeSection);

export default router;
import express from 'express';
import { explainCode } from '../controllers/codeController.js';

const router = express.Router();

router.post('/explain', explainCode);

export default router;
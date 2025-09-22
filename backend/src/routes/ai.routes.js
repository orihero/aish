import express from 'express';
import { generateContent } from '../controllers/ai.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// AI Content Generation Routes
router.post('/generate-content', auth, generateContent);

export default router;

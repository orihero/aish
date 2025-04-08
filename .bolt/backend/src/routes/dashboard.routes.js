import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getEmployerDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/employer', auth, getEmployerDashboard);

export default router;
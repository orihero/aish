import express from 'express';
import { register, login, getProfile, forgotPassword, resetPassword, registerWithResume } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-with-resume', registerWithResume);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
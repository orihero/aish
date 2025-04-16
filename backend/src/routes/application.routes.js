import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { createApplication, getMyApplications, updateApplicationStatus } from '../controllers/application.controller.js';

const router = express.Router();

// Create application
router.post('/resumes/:resumeId/apply/:jobId', auth, createApplication);

// Get my applications
router.get('/me', auth, getMyApplications);

// Update application status
router.patch('/:applicationId', auth, updateApplicationStatus);

export default router; 
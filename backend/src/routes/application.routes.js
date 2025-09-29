import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { createApplication, getMyApplications, getJobApplications, getApplicationEvaluations, updateApplicationStatus } from '../controllers/application.controller.js';

const router = express.Router();

// Create application
router.post('/apply/:resumeId/:jobId', auth, createApplication);

// Get my applications
router.get('/me', auth, getMyApplications);

// Get applications for a specific job (for employers)
router.get('/job/:jobId', auth, getJobApplications);

// Get detailed evaluation data for a specific application
router.get('/:applicationId/evaluations', auth, getApplicationEvaluations);

// Update application status
router.patch('/:applicationId', auth, updateApplicationStatus);

export default router; 
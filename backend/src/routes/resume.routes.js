import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate, resumeValidation, applicationStatusValidation } from '../middleware/validate.middleware.js';
import {
  createResume,
  createManualResumeWithRegistration,
  analyzeResumeFile,
  getMyResumes,
  getResume,
  updateResume,
  deleteResume,
  applyToVacancy,
  updateApplicationStatus,
  updateParsedData,
  downloadResumePDF,
  getMyApplications
} from '../controllers/resume.controller.js';

const router = express.Router();

// Middleware to check if user is employee
const employeeAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied. Employees only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Public resume analysis endpoint
router.post('/analyze', upload.single('cvFile'), analyzeResumeFile);

// Public endpoint to create resume and register user
router.post('/register', [
  validate([
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('parsedData').isObject().withMessage('Resume data is required'),
    body('parsedData.basics.email').isEmail().withMessage('Valid email is required'),
    body('parsedData.basics.name').notEmpty().withMessage('Name is required')
  ])
], createManualResumeWithRegistration);

// Basic CRUD operations (employee only)
router.post('/', [
  employeeAuth,
  upload.single('cvFile'),
  validate([
    ...resumeValidation,
    body('cvFile').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('CV file is required');
      }
      return true;
    })
  ])
], createResume);
router.get('/my', employeeAuth, getMyResumes);
router.get('/:id', employeeAuth, getResume);
router.put('/:id', employeeAuth, upload.single('cvFile'), validate(resumeValidation), updateResume);
router.delete('/:id', employeeAuth, deleteResume);

// Parsed data operations
router.put('/:id/parsed-data', employeeAuth, updateParsedData);
router.get('/:id/download-pdf', employeeAuth, downloadResumePDF);

// Application operations
router.get('/applications/me', employeeAuth, getMyApplications);
router.post('/:resumeId/apply/:vacancyId', employeeAuth, applyToVacancy);

export default router;
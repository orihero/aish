import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate, resumeValidation, applicationStatusValidation } from '../middleware/validate.middleware.js';
import {
  createResume,
  getMyResumes,
  getResume,
  updateResume,
  deleteResume,
  applyToVacancy,
  updateApplicationStatus
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

// Basic CRUD operations (employee only)
router.post('/', employeeAuth, upload.single('cvFile'), validate(resumeValidation), createResume);
router.get('/my', employeeAuth, getMyResumes);
router.get('/:id', employeeAuth, getResume);
router.put('/:id', employeeAuth, upload.single('cvFile'), validate(resumeValidation), updateResume);
router.delete('/:id', employeeAuth, deleteResume);

// Application operations
router.post('/:resumeId/apply/:vacancyId', employeeAuth, applyToVacancy);

export default router;
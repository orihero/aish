import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { validate, vacancyValidation } from '../middleware/validate.middleware.js';
import {
  createVacancy,
  getVacancies,
  getVacancy,
  updateVacancy,
  deleteVacancy
} from '../controllers/vacancy.controller.js';

const router = express.Router();

// Middleware to check if user is employer or admin
const employerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'employer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Employers only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

router.post('/', employerAuth, validate(vacancyValidation), createVacancy);
router.get('/', getVacancies);
router.get('/:id', getVacancy);
router.put('/:id', employerAuth, validate(vacancyValidation), updateVacancy);
router.delete('/:id', employerAuth, deleteVacancy);

export default router;
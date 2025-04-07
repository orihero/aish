import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  createCompany,
  getCompanies,
  getCompany,
  getMyCompany,
  updateCompany,
  deleteCompany
} from '../controllers/company.controller.js';

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

router.post('/', employerAuth, createCompany);
router.get('/', getCompanies);
router.get('/my', auth, getMyCompany);
router.get('/:id', getCompany);
router.put('/:id', employerAuth, updateCompany);
router.delete('/:id', employerAuth, deleteCompany);

export default router;
import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
  getSkillIcons
} from '../controllers/skill.controller.js';

const router = express.Router();

// Only admin can manage skills
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Public routes
router.get('/', getSkills);
router.post('/icons', getSkillIcons);
router.get('/:id', getSkill);

// Protected routes (admin only)
router.post('/', adminAuth, createSkill);
router.put('/:id', adminAuth, updateSkill);
router.delete('/:id', adminAuth, deleteSkill);

export default router; 
import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory, getCategoryStats } from '../controllers/category.controller.js';

const router = express.Router();

// Only admin can manage categories
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

router.post('/', adminAuth, createCategory);
router.get('/', getCategories);
router.get('/stats', getCategoryStats);
router.get('/:id', getCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

export default router;
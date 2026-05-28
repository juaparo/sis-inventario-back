import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCategories);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.patch('/:id/status', authMiddleware, toggleCategoryStatus);

export default router;

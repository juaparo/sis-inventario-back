import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory
} from '../controllers/categoryController.js';
import { authMiddleware, authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, authorizeAction('categories_view'), getCategories);
router.post('/', authMiddleware, authorizeAction('categories_manage'), createCategory);
router.put('/:id', authMiddleware, authorizeAction('categories_manage'), updateCategory);

export default router;

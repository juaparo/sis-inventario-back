import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  toggleProductStatus
} from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.patch('/:id/status', authMiddleware, toggleProductStatus);

export default router;

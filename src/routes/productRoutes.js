import express from 'express';
import { createProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { authMiddleware, authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, authorizeAction('products_view'), getProducts);
router.post('/', authMiddleware, authorizeAction('products_edit'), createProduct);
router.put('/:id', authMiddleware, authorizeAction('products_edit'), updateProduct);

export default router;
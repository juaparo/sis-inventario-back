import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Búsqueda global
router.get('/', authMiddleware, globalSearch);

export default router;

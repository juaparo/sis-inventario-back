import express from 'express';
import { getMovements, createMovement } from '../controllers/movementController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMovements);
router.post('/', authMiddleware, createMovement);

export default router;

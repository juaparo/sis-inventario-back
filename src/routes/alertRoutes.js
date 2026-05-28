import express from 'express';
import { getAlerts, markAsRead } from '../controllers/alertController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAlerts);
router.patch('/:id/read', authMiddleware, markAsRead);

export default router;

import express from 'express';
import {
  getAlerts,
  getUnreadAlerts,
  marcarLeida,
  marcarTodasLeidas
} from '../controllers/alertController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// I - Interface Segregation: cada endpoint tiene una responsabilidad específica
// NOTA: /read-all debe ir ANTES que /:id/read para evitar conflicto de rutas
router.get('/', authMiddleware, getAlerts);
router.get('/unread', authMiddleware, getUnreadAlerts);
router.patch('/read-all', authMiddleware, marcarTodasLeidas);
router.patch('/:id/read', authMiddleware, marcarLeida);

export default router;

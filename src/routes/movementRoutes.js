import express from 'express';
import { createMovement, getMovements, exportReport } from '../controllers/movementController.js';
import { authMiddleware, authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener todos los movimientos
router.get('/', authMiddleware, getMovements);

// Crear un movimiento (requiere permiso específico)
router.post('/', authMiddleware, authorizeAction('movements_create'), createMovement);

// Exportar reporte
router.get('/report', authMiddleware, exportReport);

export default router;

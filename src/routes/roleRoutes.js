import express from 'express';
import { getRoles, createRole, updateRole, toggleRoleStatus } from '../controllers/roleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de roles están protegidas
router.get('/', authMiddleware, getRoles);
router.post('/', authMiddleware, createRole);
router.put('/:id', authMiddleware, updateRole);
router.patch('/:id/status', authMiddleware, toggleRoleStatus);

export default router;

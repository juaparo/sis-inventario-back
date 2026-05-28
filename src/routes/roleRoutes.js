import express from 'express';
import { getRoles, createRole, updateRole, toggleRoleStatus } from '../controllers/roleController.js';
import { authMiddleware, authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de roles están protegidas por auth y action
router.get('/', authMiddleware, authorizeAction('roles_view'), getRoles);
router.post('/', authMiddleware, authorizeAction('roles_manage'), createRole);
router.put('/:id', authMiddleware, authorizeAction('roles_manage'), updateRole);
router.patch('/:id/status', authMiddleware, authorizeAction('roles_manage'), toggleRoleStatus);

export default router;

import express from 'express';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../controllers/userController.js';
import { authMiddleware, authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de usuarios están protegidas por auth y action
router.get('/', authMiddleware, authorizeAction('users_view'), getUsers);
router.post('/', authMiddleware, authorizeAction('users_manage'), createUser);
router.put('/:id', authMiddleware, authorizeAction('users_manage'), updateUser);
router.patch('/:id/status', authMiddleware, authorizeAction('users_manage'), toggleUserStatus);

export default router;

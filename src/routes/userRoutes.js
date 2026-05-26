import express from 'express';
import { getUsers, createUser, updateUser, toggleUserStatus } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de usuarios están protegidas
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.patch('/:id/status', authMiddleware, toggleUserStatus);

export default router;

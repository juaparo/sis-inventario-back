import express from 'express';
import { getDashboardInfo } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeAction } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protegemos la ruta con authMiddleware y verificamos que pueda ver el dashboard
router.get('/', authMiddleware, authorizeAction('dashboard_view'), getDashboardInfo);

export default router;

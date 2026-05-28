const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const { authMiddleware } = require('../middlewares/auth'); // Descomentar si usas protección por token

// Endpoints emparejados con CategoriesService de Angular
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);

module.exports = router;
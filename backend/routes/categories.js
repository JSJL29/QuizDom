const express = require('express');
const categorieController = require('../controllers/categorieControllers');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, categorieController.getAllCategories);

router.post('/', authMiddleware, categorieController.createCategorie);

router.delete('/:id', authMiddleware, categorieController.deleteCategorie);

router.get('/id-by-title/:title', authMiddleware, categorieController.findCategoryIdByTitle);

module.exports = router;
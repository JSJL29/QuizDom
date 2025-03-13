const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, resultController.getAllResults);

router.get('/user', authMiddleware, resultController.getUserResults);

router.get('/categorie/:categorieId', authMiddleware, resultController.getResultsByCategorie);

router.post('/', authMiddleware, resultController.createResult);

router.delete('/:id', authMiddleware, resultController.deleteResult);

module.exports = router;
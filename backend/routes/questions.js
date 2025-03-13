const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionControllers');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');

router.get('/category/:id', authMiddleware, questionController.getQuestionsByCategory);

router.get('/all', authMiddleware, questionController.getAllQuestions);

router.post('/', authMiddleware, questionController.createQuestion);

router.put('/:id', authMiddleware, questionController.updateQuestion);

router.delete('/:id', authMiddleware, questionController.deleteQuestion);

module.exports = router;
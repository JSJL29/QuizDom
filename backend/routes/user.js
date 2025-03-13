const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, userController.getAllUsers);
router.put('/update', authMiddleware, userController.updateProfile);
router.get('/profile', authMiddleware, userController.getUserData); 

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public auth route
router.post('/login', authController.login);
module.exports = router;
const express = require('express');

const User = require('../models/user');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/registerUser', userController.registerUser);
router.post('/loginUser', userController.loginUser);
router.get('/userResponse/:userid&:quizid', isAuth, userController.userResponse);

module.exports = router;
const express = require('express');

const QuizResponse = require('../models/quizresponse');
const responseController = require('../controllers/response');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/registerResponse', responseController.registerQuizResponse);
router.get('/getResponseperQuiz/:quizid', isAuth, responseController.getStudentsperQuiz);

module.exports = router;
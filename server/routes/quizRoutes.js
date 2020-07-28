const express = require('express');

const Quiz = require('../models/quiz');
const quizController = require('../controllers/quiz');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/addQuiz',isAuth, quizController.addQuiz);
router.get('/getAllQuiz', quizController.getAllQuiz);
router.delete('/deleteQuiz/:quizid', isAuth, quizController.deleteQuiz);

module.exports = router;
const express = require('express');

const Quiz = require('../models/quiz');
const quizController = require('../controllers/quiz');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/addQuiz',isAuth, quizController.addQuiz);
router.get('/getAllQuiz', quizController.getAllQuiz);
router.delete('/deleteQuiz/:quizid', isAuth, quizController.deleteQuiz);
// sample link - localhost:3000/deleteQuiz/5f15237d1121583eb0d85c91

module.exports = router;
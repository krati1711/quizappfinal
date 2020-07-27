const express = require('express');

const Question = require('../models/questions');
const questionsController = require('../controllers/question');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/addQuestion', isAuth, questionsController.addQuestion);
router.get('/getQuestionsPerQuiz/:quizid', questionsController.getQuestionsPerQuiz);

module.exports = router;
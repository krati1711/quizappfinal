const mongoose = require('mongoose');

const Question = require('../models/questions');
const Quiz = require('../models/quiz');


// exports.addQuestion = (req, res, next) => {
//     const actualquestion = req.body.question;
//     const answer = req.body.correct_answer;
//     const incorrect = req.body.wrong_answer;
//     const quizid = req.body.quizId;

//     const options = [answer, incorrect];


//     const question = new Question({
//         question: actualquestion,
//         answer: answer,
//         options: options,
//         quizname: quizid
//     });

//     question
//         .save()
//         .then(result => {
//             return Quiz.findById(quizid);
//         })
//         .then(quiz => {
//             let tempQuiz = quiz;
//             quiz.questions.push(question);
//             return quiz.save();
//         })
//         .then(result => {
//             res.status(201).json({ message: 'Question Created!' });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };

/**
 * Returns message if new quiz is created
 * @param {body - question, correct answer, wrong answer, quizid} req 
 * @param {json with some message} res 
 * @param {'/question/addQuestion'} url 
 */
exports.addQuestion = async (req, res, next) => {
    const actualquestion = req.body.question;
    const answer = req.body.correct_answer;
    const incorrect = req.body.wrong_answer;
    const quizid = req.body.quizId;

    const options = [answer, incorrect];


    const question = new Question({
        question: actualquestion,
        answer: answer,
        options: options,
        quizname: quizid
    });

    try {
        // ------------------check if quizid valid --------------------------
        if (!mongoose.isValidObjectId(quizid)) {
            res.status(400).json({ message: 'Invalid ObjectId', status: 'fail' });
            throw new Error('Invalid ObjectId');
        }

        //--------------------check if quizid present in database-------------
        const isQuizPresent = await Quiz.findById(quizid);
        if (!isQuizPresent) {
            res.status(404).json({ message: 'Quiz not found', status: 'fail' });
            throw new Error('Quiz ID not found');
        }

        //saving question object in question collection
        const questionRetObj = await question.save();
        //adding is in questions array in quiz document
        isQuizPresent.questions.push(questionRetObj);
        //now saving document
        const finalQuizSave = await isQuizPresent.save();
        //----------all ok--------
        res.status(201).json({ message: 'Question Created!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

/**
 * Returns questions of a particular quiz
 * @param {params - quizid} req 
 * @param {json with questions} res 
 * @param {'/question/getQuestionsPerQuiz/:quizid'} url 
 */
exports.getQuestionsPerQuiz = async (req, res, next) => {
    const quizid = req.params.quizid;

    try{
        // ------------------check if quizid valid --------------------------
        if (!mongoose.isValidObjectId(quizid)) {
            res.status(400).json({ message: 'Invalid ObjectId', status: 'fail' });
            throw new Error('Invalid ObjectId');
        }

        //--------------------check if quizid present in database-------------
        const isQuizPresent = await Quiz.findById(quizid);
        if (!isQuizPresent) {
            res.status(404).json({ message: 'Quiz not found', status: 'fail' });
            throw new Error('Quiz ID not found');
        }

        // finding questions for that quizid
        const questions = await Question.find({ 'quizname': quizid });
        if (!questions) {
            res.status(404).json({ message: 'No Questions found for this quiz' });
            throw new Error('No Questions found for this quiz');
        }

        //all ok
        res.status(200).json({ message: 'Got All Quiz for that question', quizes: quizes });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

// exports.getQuestionsPerQuiz = (req, res, next) => {
//     const quizid = req.params.quizid;

//     if (quizid === 'undefined' || quizid == null) {

//         res.status(403).json({ message: 'invalid quizid' });
//         next();
//         return;
//     }
//     Question
//         .find({ 'quizname': quizid })
//         .then(quizes => {
//             res.status(200).json({
//                 message: 'Got All Quiz for that question',
//                 quizes: quizes
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// }
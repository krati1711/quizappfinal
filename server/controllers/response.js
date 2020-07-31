const mongoose = require('mongoose');

const User = require('../models/user');
const QuizResponse = require('../models/quizresponse');
const Response = require('../models/response');
const Quiz = require('../models/quiz');

/**
 * Save responses of a quiz given by that user
 * @param {body - responses, username, quizid} req 
 * @param {json with some message} res 
 * @param {'/response/registerResponse'} url 
 */
exports.registerQuizResponse = async (req, res, next) => {

    const responses = req.body.EachResponses;
    const username = req.body.username;
    const quizid = req.body.quizid;

    let userObj;
    let responsObjs = [];
    let responseIds = [];
    const tempdate = new Date();
    tempdate.setHours(tempdate.getHours() + 5);
    tempdate.setMinutes(tempdate.getMinutes() + 30);
    
    responses.forEach(response => {
        const tempResponse = new Response({
            questionid: response.questionid,
            question: response.question,
            chosenAnswer: response.chosenAnswer,
            answered: response.answered,
            timetaken: response.timeTaken,
            correctAnswer: response.correctAnswer
        });
        responsObjs.push(tempResponse);
    });

    try{
        // ---------------checking if objectid is valid---------- 
        if (!mongoose.isValidObjectId(quizid)) {
            res.status(400).json({ message: 'Invalid ObjectId', status: 'fail' });
            throw new Error('Invalid ObjectId');
        }

        // ----------------checking if this quizid is present in database
        const isQuizPresent = await Quiz.findById(quizid);
        if (!isQuizPresent) {
            res.status(404).json({ message: 'Quiz not found', status: 'fail' });
            throw new Error('Quiz ID not found');
        }

        // ------------checking if the user is present in database------------
        const user = await User.findById(username);
        if (!user) {
            res.status(404).json({ message: 'No such user found', status: 'fail' });
            throw new Error('No such user found');
        }

        //------------add all the responses in response table-----------------
        const responseRetObj = await Response.collection.insertMany(responsObjs);

        // -------------creating a quizresponse object to save-----------------
        responseIds = Object.values(responseRetObj.insertedIds);
        const quizResponseObj = new QuizResponse({
            quizid : quizid,
            responses: responseIds,
            username: username,
            dateofquiz: tempdate
        });

        // ---------------saving the quizresponse object-----------------
        const quizResponseRetObj = await quizResponseObj.save();

        // -----------------all ok; sending ok message------------------
        res.status(201).json({ message: 'Quiz Response Created!', status: 'All Good' });

    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
         next(err);
    }
}

/**
 * Get students who have given a particular quiz
 * @param {params - quizid} req 
 * @param {json with student details} res 
 * @param {'/response/getStudentsperQuiz/:quizid'} url 
 */
exports.getStudentsperQuiz = async (req, res, next) => {
    
    const quizid = req.params.quizid;
    let userIds = [];
    let userObjs = [];

    try {

        // ---------------checking if objectid is valid---------- 
        if (!mongoose.isValidObjectId(quizid)) {
            res.status(400).json({ message: 'Invalid ObjectId', status: 'fail' });
            throw new Error('Invalid ObjectId');
        }

        // ----------------checking if this quizid is present in database
        const isQuizPresent = await Quiz.findById(quizid);
        if (!isQuizPresent) {
            res.status(404).json({ message: 'Quiz not found', status: 'fail' });
            throw new Error('Quiz ID not found');
        }

        // ----------------get quizresponse objects of all users who gave that quiz 
        const quizResponseRetObj = await QuizResponse.find({quizid: quizid});
        //-----------------if no response found(if no one has given test)---------
        if (!quizResponseRetObj) {
            res.status(404).json({ message: 'No Response Found', status: 'fail'});
            throw new Error('No Response Found');
        }

        // adding all usernames or userids of users who gave this test
        userIds = quizResponseRetObj.map( x => x.username);

        // ----------------finding that users in database--------------------
        const usersRetObj = await User.find().where('_id').in(userIds).exec();

        // ---------------creating custom object to send ------------------
        usersRetObj.forEach(x => {
            tempObj = {
                userid: x._id,
                name: x.name
            }
            userObjs.push(tempObj);
        });

        // -----------------all ok; sending the users' object----------------------------------
        res.status(200).json({ message: 'We will wait', student: userObjs, status: 'success'});

    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
  };
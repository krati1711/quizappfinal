const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const QuizResponse = require('../models/quizresponse');
const Response = require('../models/response');
const Quiz = require('../models/quiz');

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../', 'keys') + '/private.key', 'utf8');

// exports.registerUser = (req, res, next) => {
//     const email = req.body.email;
//     const name = req.body.name;
//     const age = req.body.age;
//     const gender = req.body.gender;
//     const username = name.substring(0, 3) + name.substring(name.length - 3, name.length);
//     User.findOne({ username: username })
//         .then(user => {
//             if (user) {
//                 return res.status(200).json({ status: 'username already present', mystatuscode: 0 });
//                 next();
//             }
//             else {
//                 const newUser = new User({
//                     username: username,
//                     name: name,
//                     age: age,
//                     email: email,
//                     gender: gender
//                 });
//                 return newUser.save();
//             }
//         })
//         .then(result => {
//             const token = generateAccessToken(result.name);
//             res.status(201).json({ message: 'New User Created!', username: result.id, name: result.name, uname: result.username, mystatuscode: 1, token: token });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };

/**
 * Registers new users
 * @param {body - email, name, age, gender} req 
 * @param {json with token and username} res 
 * @param {'/user/registerUser'} url 
 */
exports.registerUser = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const username = name.substring(0, 3) + name.substring(name.length - 3, name.length);

    try {
        // checking if username is already present
        const user = await User.findOne({ username: username });
        if (user) {
            res.status(200).json({ status: 'username already present', mystatuscode: 0 });
            throw new Error('username already present');
        }

        // since no such username present, we make new user object and save it
        const newUser = new User({
            username: username,
            name: name,
            age: age,
            email: email,
            gender: gender
        });

        // new user saved
        const newUserSaved = await newUser.save();

        // some random ass token which is not even used, geneted and sent to user
        // const token = generateAccessToken(newUserSaved.name);
        res.status(201).json({ message: 'New User Created!', username: newUserSaved.id, name: newUserSaved.name, uname: newUserSaved.username, mystatuscode: 1 });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

// exports.loginUser = (req, res, next) => {
//     const name = req.body.name;
//     const quizid = req.body.quizid;
//     let tempuser;

//     User.findOne({ username: name })
//         .then(user => {
//             if (!user) {
//                 return res.status(200).json({ status: 'No such username present. Register first', mystatuscode: 0 });
//             }
//             // else {
//             //     const token = generateAccessToken(user.name);
//             //     res.status(201).json({ message: 'User Found!', username: user.id, name: user.name, mystatuscode: 1, token: token });
//             // }
//             tempuser = user;
//             return QuizResponse.find({ username: user.id }).where({ quizid: quizid }).exec()
//         })
//         .then(result => {
//             if (result.length) {
//                 return res.status(200).json({ status: 'Quiz Already Given', mystatuscode: 2 });
//             }
//             else {
//                 // const token = generateAccessToken(tempuser.name);
//                 // res.status(201).json({ message: 'User Found!', username: tempuser.id, name: tempuser.name, mystatuscode: 1, token: token });

//                 const token = jwt.sign({
//                     uname: tempuser.username,
//                     role: 'user'
//                 }, RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '20m' });
//                 res.status(200).json({ message: 'User Found!', username: tempuser.id, name: tempuser.name, token: token, mystatuscode: 1 });

//             }
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };

/**
 * Login for users
 * @param {body - name, quizid} req 
 * @param {json with token and questions} res 
 * @param {'/user/loginUser'} url 
 */
exports.loginUser = async (req, res, next) => {
    const name = req.body.name;
    const quizid = req.body.quizid;
    let tempuser;

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

        // --------------find user with that username is present------------------
        const user = await User.findOne({ username: name });
        if (!user) {
            res.status(200).json({ status: 'No such username present. Register first', mystatuscode: 0 });
            throw new Error('No such username present. Register first');
        }

        // -------------- find if username has given quiz----------
        const responses = await QuizResponse.find({ username: user.id }).where({ quizid: quizid }).exec();
        if (responses.length) {
            res.status(200).json({ status: 'Quiz Already Given', mystatuscode: 2 });
            throw new Error('Quiz Already Given');
        }

        // since user has not given quiz, create token and send questions
        const token = jwt.sign({ uname: tempuser.username, role: 'user' }, RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '20m' });
        res.status(200).json({ message: 'User Found!', username: tempuser.id, name: tempuser.name, token: token, mystatuscode: 1 });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign({ username: username, access: 'given' }, TOKEN_SECRET, { expiresIn: '1800s' });
}

/**
 * Get responses which user has given for that quiz
 * @param {params - userid, quizid} req 
 * @param {json with user details and responses} res 
 * @param {'/user/userResponse/:userid&:quizid'} url 
 */
exports.userResponse = async (req, res, next) => {
    const userid = req.params.userid;
    const quizid = req.params.quizid;

    try {

        // checking if objectid is valid---------- 
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

        // ------------checking if the user is present in database
        const user = await User.findById(userid);
        if (!user) {
            res.status(404).json({ message: 'No such user found', status: 'fail' });
            throw new Error('No such user found');
        }

        // ------------getting the quizresponse object of that user for quiz
        const QuizResponse = await QuizResponse.find({ username: user._id, quizid: quizid });

        // if user has not given that quiz
        if (!QuizResponse) {
            res.status(404).json({ message: 'User has not given this quiz', status: 'fail' });
            throw new Error('User has not given this quiz');
        }

        // -----------now getting responses (answers) of that user & quiz
        const responses = await Response.find().where('_id').in(QuizResponse[0].responses).exec();

        // ---------------all ok; send user details in responses ------------
        res.status(200).json({ status: 'Mic check all ok', user: user, responses: responses, mystatuscode: 1 });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
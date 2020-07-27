const jwt = require('jsonwebtoken');

const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const QuizResponse = require('../models/quizresponse');
const Response = require('../models/response');

const TOKEN_SECRET = 'df79sg7s9dfds7f79sdf9sd7dfsfmpq32'

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../' , 'keys') + '/private.key','utf8');

exports.registerUser = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const username = name.substring(0, 3) + name.substring(name.length - 3, name.length);
    User.findOne({ username: username })
        .then(user => {
            if (user) {
                return res.status(200).json({ status: 'username already present', mystatuscode: 0 });
                next();
            }
            else {
                const newUser = new User({
                    username: username,
                    name: name,
                    age: age,
                    email: email,
                    gender: gender
                });
                return newUser.save();
            }
        })
        .then(result => {
            const token = generateAccessToken(result.name);
            res.status(201).json({ message: 'New User Created!', username: result.id, name: result.name, uname: result.username, mystatuscode: 1, token: token });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.loginUser = (req, res, next) => {
    const name = req.body.name;
    const quizid = req.body.quizid;
    let tempuser;

    User.findOne({ username: name })
        .then(user => {
            if (!user) {
                return res.status(200).json({ status: 'No such username present. Register first', mystatuscode: 0 });
            }
            // else {
            //     const token = generateAccessToken(user.name);
            //     res.status(201).json({ message: 'User Found!', username: user.id, name: user.name, mystatuscode: 1, token: token });
            // }
            tempuser = user;
            return QuizResponse.find({username: user.id}).where({quizid: quizid}).exec()
        })
        .then(result => {
            if (result.length){
                return res.status(200).json({ status: 'Quiz Already Given', mystatuscode: 2 });
            }
            else{
                // const token = generateAccessToken(tempuser.name);
                // res.status(201).json({ message: 'User Found!', username: tempuser.id, name: tempuser.name, mystatuscode: 1, token: token });

                const token = jwt.sign({
                    uname: tempuser.username,
                    role: 'user'
                }, RSA_PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '20m'});
                res.status(200).json({message: 'User Found!', username: tempuser.id, name: tempuser.name, token: token, mystatuscode: 1 });

            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign({ username: username, access: 'given' }, TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.userResponse = (req, res, next) => {
    const userid = req.params.userid;
    const quizid = req.params.quizid;
    
    let user;

    User.findById(userid)
        .then(result => {
            user = result;
            return QuizResponse.find({ username: user._id, quizid: quizid })
        })
        .then(result => {
            return Response.find().where('_id').in(result[0].responses).exec();
        })
        .then(result => {
            res.status(200).json({ status: 'Mic check all ok', user: user, responses: result, mystatuscode: 1 });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
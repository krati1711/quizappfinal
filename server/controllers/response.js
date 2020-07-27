const User = require('../models/user');
const QuizResponse = require('../models/quizresponse');
const Response = require('../models/response');

exports.registerQuizResponse = (req, res, next) => {

    const responses = req.body.EachResponses;
    const username = req.body.username;
    const quizid = req.body.quizid;

    let userObj;
    let responsObjs = [];
    let responseIds = [];
    const tempdate = new Date();
    tempdate.setHours(tempdate.getHours() + 5);
    tempdate.setMinutes(tempdate.getMinutes() + 30);

    /*User.findOne({ username: username })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this username could not be found.');
                error.statusCode = 401;
                throw error;
            }
            userObj = user.id;
            // return User.findById(user.id);
        })
        .then(result1 => {
            // userObj = result1;
            console.log(result1);
            // res.status(200).json({ message: 'Post fetched' });
        })
        .catch(err => {
            console.log(" Error finding user - " + err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });*/

    /*responses.forEach(response => {
        const tempResponse = new Response({
            questionid: response.questionid,
            chosenAnswer: response.chosenAnswer,
            answered: response.answered,
            timetaken: response.timeTaken
        });

        tempResponse.save().then(result => {
            console.log("response result1 - " + result);
            responsObjs.push(result.id);
        })
        .catch(err => {
            console.log(" Error pushing responses - " + err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }); */

    //responsObj = responseFunction(responses);

    // ------------- take 2 --------------------
    
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
    
    Response.collection.insertMany(responsObjs).then( res => {
        // responseIds = res.ops.map(x => x._id);
        responseIds = Object.values(res.insertedIds);
        const quizResponseObj = new QuizResponse({
            quizid : quizid,
            responses: responseIds,
            username: username,
            dateofquiz: tempdate
        });
        return quizResponseObj.save();
    })
    .then(result => {
        res.status(201).json({ message: 'Quiz Response Created!', status: 'All Good' });
    })
    .catch(err => {
        console.log("Error saving final response - "+ err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
         next(err);
    });

    /*console.log('this is response - ' + responsObjs);
    const quizResponseObj = new QuizResponse({
        quizid : quizid,
        responses: responsObjs,
        username: username
    });*/

    /*quizResponseObj.save().then(result => {
        console.log(result);
        res.status(201).json({ message: 'Quiz Response Created!', status: 'All Good' });
    })
    .catch(err => {
        console.log("Error saving final response - "+ err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        // next(err);
    }); */
}

exports.getStudentsperQuiz = (req, res, next) => {
    
    const quizid = req.params.quizid;
    let userIds = [];
    let userObjs = [];
    QuizResponse.find({quizid: quizid})
      .then (result => {
          if (!result) {
              res.status(404).json({ message: 'Quiz not found', status: 'fail'});
          }
          userIds = result.map( x => x.username);
          return User.find().where('_id').in(userIds).exec();
      })
      .then(result => {
          result.forEach(x => {
              tempObj = {
                  userid: x._id,
                  name: x.name
              }
              userObjs.push(tempObj);
          });
          res.status(200).json({ message: 'We will wait', student: userObjs, status: 'success'});
      })
      .catch(err => {
          console.log("Error saving final response - "+ err);
          if (!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
      });
  };
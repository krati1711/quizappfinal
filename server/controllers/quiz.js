const Quiz = require('../models/quiz');
const quiz = require('../models/quiz');


exports.addQuiz = (req, res, next) => {
    const quizTitle = req.body.quizName;

    const quiz = new Quiz({
        quizName: quizTitle,
        isDeleted: false
    });

    quiz
        .save()
        .then(result => {
            res.status(200).json({ message: 'Quiz Created!' });
        })
        .catch(err => {
            
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getAllQuiz = (req, res ,next) => {
    Quiz
        .find({ isDeleted: false})
        .then(quizes => {
            res.status(200).json({
              message: 'All Quizzes are present.',
              quizes: quizes
            });
          })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
}

exports.deleteQuiz = (req, res, next) => {
  const quizid = req.params.quizid;

  Quiz.findById(quizid)
    .then(result=> {
      if(!result) {
        res.status(404).json({ message: 'Quiz not found', status: 'fail'});
      }
      result.isDeleted = true;
      return result.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Quiz deleted', status: 'success'});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}


const Quiz = require('../models/quiz');
const mongoose = require('mongoose');

/**
 * Returns message if new quiz is created
 * @param {body - quizname} req 
 * @param {json with some message} res 
 * @param {'/quiz/addQuiz'} url 
 */
exports.addQuiz = async (req, res, next) => {

  const quizTitle = req.body.quizName;
  const quiz = new Quiz({
    quizName: quizTitle,
    isDeleted: false
  });

  try{
    // saving the constructed object (quiz)
    const ifQuizCreated = await quiz.save();

    //--------------all ok------------------
    res.status(200).json({ message: 'Quiz Created!' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

/**
 * Returns list of all quiz ids and names
 * @param {} req 
 * @param {json with all quiz names} res 
 * @param {'/quiz/getAllQuiz'} url 
 */
exports.getAllQuiz = async (req, res, next) => {
  
  let quizobj = [];

  try {
    //getting all the quiz where they are not marked as deleted
    const quizes = await Quiz.find({ isDeleted: false });
    // if no quiz are found
    if (!quizes) {
      res.status(400).json({ message: 'No quiz found.' });
      throw new Error('No quiz found');
    }

    // making a custom object to send
    quizes.forEach(element => {
      const tempquizobj = { _id: element._id, quizName: element.quizName };
      quizobj.push(tempquizobj);
    });

    //------------all ok; sending custom object--------------------
    res.status(200).json({
      message: 'All Quizzes are present.',
      quizes: quizobj
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

/**
 * Soft Deletes the quiz by taking quizid
 * @param {params - quizid} req 
 * @param {json with some message} res 
 * @param {'/quiz/deleteQuiz/quizid'} url 
 */
exports.deleteQuiz = async (req, res, next) => {
  const quizid = req.params.quizid;

  try {
    // checking if objectid is valid---------- 
    if (!mongoose.isValidObjectId(quizid)) {
      res.status(400).json({ message: 'Invalid ObjectId', status: 'fail' });
      throw new Error('Invalid ObjectId');
    }
    //--------------------checking till here

    const isQuizPresent = await Quiz.findById(quizid);
    if (!isQuizPresent) {
      res.status(404).json({ message: 'Quiz not found', status: 'fail' });
      throw new Error('Quiz ID not found');
    }

    // soft delete
    isQuizPresent.isDeleted = true;
    const isDeleted = await isQuizPresent.save();

    //-----------all ok-----------------------
    res.status(200).json({ message: 'Quiz deleted', status: 'success' });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
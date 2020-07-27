const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    quizName: {
        type: String,
        required: true
    },
    timeperquiz: {
        type: Date,
        default: Date.now,
        required: true
    },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Questions'
    }
  ],
  isDeleted: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quizzes', quizSchema, 'Quizzes');
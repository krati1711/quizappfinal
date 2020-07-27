const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizResponseSchema = new Schema({
    quizid: {
        type: Schema.Types.ObjectId,
        ref: 'Quizzes',
        required: true
    },
    responses: [{
        type: Schema.Types.ObjectId,
        ref: 'Responses'
    }],
    username: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    dateofquiz: {
        type: Date,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('QuizResponses', quizResponseSchema, 'QuizResponses');
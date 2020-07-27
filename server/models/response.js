const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
    questionid: {
        type: Schema.Types.ObjectId,
        ref: 'Questions',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    chosenAnswer: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    timetaken: {
        type: Number,
        required: true
    },
    answered: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Responses', responseSchema, 'Responses');
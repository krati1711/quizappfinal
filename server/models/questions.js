const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        default: [],
        required: true
    },
    quizname: {
        type: Schema.Types.ObjectId,
        ref: 'Quizzes',
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Questions', questionSchema, 'Questions');

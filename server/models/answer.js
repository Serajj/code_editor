const mongoose = require('mongoose');


const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  cinput: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
 
  submission: {
    type: String,
    default: "",
  },
  submissionId: {
    type: Number,
  },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;

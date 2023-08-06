const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  testId: {
    type: Number,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});


const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  judgeId: {
    type: Number,
    required: true,
  },

  problemId: {
    type: Number,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  testCases: [testCaseSchema],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

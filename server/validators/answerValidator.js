const validator = require('validator');

const validateAnswer = (questionId, source) => {
  const errors = {};

  // Validate email
  if (!questionId) {
    errors.question = 'QuestionId is required';
  }

  // Validate password
  if (!source) {
    errors.source = 'Code is required (source)';
  } 

  // Return the validation result
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateAnswer;

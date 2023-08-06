const validator = require('validator');

const validateQuestion = (question, description ,source) => {
  const errors = {};

  // Validate email
  if (!question) {
    errors.question = 'Question is required';
  }

  // Validate description
  if (!description) {
    errors.description = 'Description is required';
  } 

  // Validate password
  if (!source) {
    errors.source = 'Source code is required';
  } 

  // Return the validation result
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateQuestion;

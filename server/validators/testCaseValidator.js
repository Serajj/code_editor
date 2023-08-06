const validator = require('validator');

const validateTestCase = (input, expectedOutput , questionId) => {
  const errors = {};

  // Validate input
  if (!input) {
    errors.input = 'Input is required';
  } 

  // Validate expectedOutput
  if (!expectedOutput) {
    errors.expectedOutput = 'Expected output is required';
  }

  // Validate questionId
  if (!questionId) {
    errors.questionId = 'questionId is required';
  }

  // Return the validation result
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateTestCase;

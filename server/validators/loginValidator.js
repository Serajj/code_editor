const validator = require('validator');

const validateLogin = (email, password) => {
  const errors = {};

  // Validate email
  if (!email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Return the validation result
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateLogin;

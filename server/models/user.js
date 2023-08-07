const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'participant'],
    default: 'participant',
  },

  isVerified: { type: Boolean, default: false },
  verificationToken: {
    type: String,
    default:"",
  },
  tokenExpiry: {
    type: Date,
  },

  avatar: {
    type: String,
    default:"",
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

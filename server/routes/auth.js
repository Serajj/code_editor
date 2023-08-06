// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateRegister = require('../validators/registerValidator');
const sendResponse = require('../utils/response');
const validateLogin = require('../validators/loginValidator');
const Question = require('../models/Question');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const role = "participant";
    // Validate user input
    const validationResult = validateRegister(name, email, password);
    if (!validationResult.isValid) {
        return res.json(sendResponse(false,"Validation error",validationResult.errors,400));
    }
  try {
    
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(sendResponse(false,"Email is already registered",[],401));
    }

    // Hash the password
     //encrypting password
     const salt = await bcrypt.genSalt();
     const hashedPassword  =  await bcrypt.hash(password+"",salt);
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET
      );
    res.status(200).json(sendResponse(true,"User registered successfully",{user:newUser,token},200));
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    // Validate user input
    const validationResult = validateLogin(email, password);
    if (!validationResult.isValid) {
        return res.status(200).json(sendResponse(false,"Validation error",validationResult.errors,400));
    }

  try {
   

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(sendResponse(false,"Invalid credentials.",[]));
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(200).json(sendResponse(false,"Wrong password.",[]));;
    }

    // Create and send a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json(sendResponse(true,"User logged successfully",{user:user,token},200));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


router.get('/all', async (req, res) => {
    try {
      const questions = await User.find({ role: 'participant' });
      res.status(200).json(sendResponse(true,"Participants fetched successfully",questions,200));
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

  router.get('/admindashboard', async (req, res) => {
    try {
      const questionsCount  = await Question.countDocuments();;
      const usersCount  = await User.countDocuments({ role: 'participant' });
      res.status(200).json(sendResponse(true,"Participants fetched successfully",{questionsCount , usersCount},200));
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

module.exports = router;

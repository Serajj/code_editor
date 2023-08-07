// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validateRegister = require("../validators/registerValidator");
const sendResponse = require("../utils/response");
const validateLogin = require("../validators/loginValidator");
const Question = require("../models/Question");
const authMiddleware = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const config = require("../config");
const sendEmail = require("../utils/sendEmail");

// Generate verification token and expiry date
const generateVerificationToken = () => {
  const verificationToken = uuid.v4();
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 10); // Expiry in 10 hour
  return { verificationToken, tokenExpiry };
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const role = "participant";
  // Validate user input
  const validationResult = validateRegister(name, email, password);
  if (!validationResult.isValid) {
    return res.json(
      sendResponse(false, "Validation error", validationResult.errors, 400)
    );
  }
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json(
        sendResponse(false, "Email is already registered", [], 401)
      );
    }

    // Hash the password
    //encrypting password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password + "", salt);

    // Generate verification token
    const { verificationToken, tokenExpiry } = generateVerificationToken();
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken: verificationToken,
      tokenExpiry,
    });

    await newUser.save();

    // Get the current host
    const currentHost = req.get("host");
    //send verification email
    // Compose email
    const emailContent = `
    <p>Hello, ${newUser.name}</p>
    <p>Click the following link to verify your email:</p>
    <a href="http://${currentHost}/api/auth/verify/${verificationToken}">Verify Email</a>
    `;

    const mailOptions = {
      from: config.email_user,
      to: newUser.email,
      subject: "Email Verification from code editor",
      html: emailContent,
    };
    const emailRes = sendEmail(mailOptions);
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );
    res
      .status(200)
      .json(
        sendResponse(
          true,
          "User registered successfully",
          { user: newUser, token },
          200
        )
      );
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Validate user input
  const validationResult = validateLogin(email, password);
  if (!validationResult.isValid) {
    return res
      .status(200)
      .json(
        sendResponse(false, "Validation error", validationResult.errors, 400)
      );
  }

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json(sendResponse(false, "Invalid credentials.", []));
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res
      .status(200)
      .json(sendResponse(false, "Email not verified please verify with verification link sent to your registered email address", [],401));
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(200).json(sendResponse(false, "Wrong password.", []));
    }

    // Create and send a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .json(
        sendResponse(
          true,
          "User logged successfully",
          { user: user, token },
          200
        )
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


//resend verification link
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if(!email){
      return res
      .status(200)
      .json(
        sendResponse(false, "Invalid email/Empty email , please provide valid email.", {}, 400)
      );
    }
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
      .status(200)
      .json(
        sendResponse(false, "Email not found", {}, 400)
      );
    }

    if (user.isVerified) {
      return res
      .status(200)
      .json(sendResponse(true, "Email already verified please login.", []));
    }


    // Generate a new verification token and expiry date
    const { verificationToken, tokenExpiry } = generateVerificationToken();

    user.verificationToken = verificationToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

     // Get the current host
     const currentHost = req.get("host");
     //send verification email
     // Compose email
     const emailContent = `
     <p>Hello, ${user.name}</p>
     <p>Click the following link to verify your email:</p>
     <a href="http://${currentHost}/api/auth/verify/${verificationToken}">Verify Email</a>
     `;
 const vlink = 'http://'+currentHost+'/api/auth/verify/'+verificationToken+'';
     const mailOptions = {
       from: config.email_user,
       to: user.email,
       subject: "Email Verification from code editor",
       html: emailContent,
     };
     const emailRes = sendEmail(mailOptions);
     return res
     .status(200)
     .json(
       sendResponse(
         true,
         "Verification email sent successfully",
         {vlink },
         200
       )
     );
  } catch (error) {
    console.error('Error:', error);
    return res
    .status(200)
    .json(
      sendResponse(false, "Something went wrong , please check valid email.", {}, 400)
    );
  }
});


// Verify email with token
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    if (now > user.tokenExpiry) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get("/all", async (req, res) => {
  try {
    const questions = await User.find({ role: "participant" });
    res
      .status(200)
      .json(
        sendResponse(true, "Participants fetched successfully", questions, 200)
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// API to search users by name and email (limit to 10)
router.get("/search", async (req, res) => {
  const { query } = req.query;
  const regexQuery = new RegExp(query, "i"); // 'i' flag for case-insensitive search

  try {
    const users = await User.find(
      {
        $or: [{ name: regexQuery }, { email: regexQuery }],
      },
      "name email"
    ).limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error searching users" });
  }
});

router.get("/admindashboard", async (req, res) => {
  try {
    const questionsCount = await Question.countDocuments();
    const usersCount = await User.countDocuments({ role: "participant" });
    res
      .status(200)
      .json(
        sendResponse(
          true,
          "Participants fetched successfully",
          { questionsCount, usersCount },
          200
        )
      );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, avatar } = req.body;
    const role = "participant";
    // Validate user input
    const password = "nopasswordisgiven"; //added this to pass validation only
    const email = "example@domain.com";
    const validationResult = validateRegister(name, email, password);
    if (!validationResult.isValid) {
      return res
        .status(400)
        .json(
          sendResponse(false, "Validation error", validationResult.errors, 400)
        );
    }
    //returns the updated document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true }
    );
    return res.status(200).json({ status: true, updatedUser });
  } catch (err) {
    return res
      .status(400)
      .json({
        status: false,
        message: "Something went wrong",
        error: err.message,
      });
  }
});

module.exports = router;

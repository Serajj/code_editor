const nodemailer = require('nodemailer');
const config = require('../config');

// Create a transporter
const transporter = nodemailer.createTransport({
    host: config.email_host,
    port: config.email_port,
    auth: {
      user: config.email_user,
      pass: config.email_password,
    },
  });
const sendEmail = (mailOptions)=>{
    try {
      console.log("Sending email");
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
}

module.exports = sendEmail;

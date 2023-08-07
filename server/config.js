// config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  sphereSecret: process.env.SPHERE_SECRET,
  sphereEndpoint: process.env.SPHERE_ENDPOINT,
  email_user:process.env.SMTP_USER,
  email_password:process.env.SMTP_PASS,
  email_host:process.env.SMTP_HOST,
  email_port:process.env.SMTP_PORT,
};

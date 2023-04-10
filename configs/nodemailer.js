const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: process.env.APPSETTING_EMAIL_ID,
      pass: process.env.APPSETTING_EMAIL_PASSWORD
    }
});

module.exports = transporter
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Function to send a password reset email using nodemailer
function sendPasswordResetEmail(email, resetLink) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'id.samael1@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'id.samael1@gmail.com',
    to: email,
    subject: 'Register - Create Password',
    text: `Click the following link to create your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export { sendPasswordResetEmail };

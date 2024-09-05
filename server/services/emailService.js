import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (customer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: 'Welcome to Our Customer Management System',
    html: `
      <h1>Welcome, ${customer.firstName}!</h1>
      <p>Thank you for registering with our Customer Management System.</p>
      <p>We're excited to have you on board!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

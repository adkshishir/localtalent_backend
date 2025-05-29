// src/services/mail.service.ts
import nodemailer from 'nodemailer';
import { config } from '../../config';

const transporter = nodemailer.createTransport({
  host: config.mailHost, // e.g. smtp.gmail.com or sandbox.smtp.mailtrap.io
  port: Number(config.mailPort || 587), // e.g. 587 for TLS, 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

export async function sendForgotPasswordEmail(to: string, token: string) {
  const resetLink = `${config.fontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"LocalTalent Support" <${config.mailFrom}>`,
    to,
    subject: 'Reset your password',
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

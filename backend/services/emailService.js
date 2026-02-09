import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for others
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"FYP SYSTEM" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

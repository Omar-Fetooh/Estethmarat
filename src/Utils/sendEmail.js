<<<<<<< HEAD
import nodemailer from "nodemailer";
export async function sendEmail(options) {
=======
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
>>>>>>> 56f5a82cb68da8f37ce1d757c0d834498815af40
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
<<<<<<< HEAD
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  // 2) define options
  const mailOptions = {
    to: options.email,
    from: "admins of <Estethmarat.com>",
=======
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  // 2) define mail options
  const mailOptions = {
    to: options.email,
    from: 'admins of <Estethmarat.com>',
>>>>>>> 56f5a82cb68da8f37ce1d757c0d834498815af40
    text: options.message,
    subject: options.subject,
    html: options.html,
  };
  // 3) send email
  await transporter.sendMail(mailOptions);
<<<<<<< HEAD
}
=======
};
>>>>>>> 56f5a82cb68da8f37ce1d757c0d834498815af40

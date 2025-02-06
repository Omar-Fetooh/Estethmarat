import nodemailer from "nodemailer";
export async function sendEmail(options) {
  // 1) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });
  // 2) define options
  const mailOptions = {
    to: options.email,
    from: "admins of <Estethmarat.com>",
    text: options.message,
    subject: options.subject,
    html: options.html,
  };
  // 3) send email
  await transporter.sendMail(mailOptions);
}

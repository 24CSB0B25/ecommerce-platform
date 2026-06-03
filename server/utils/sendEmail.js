const nodemailer = require("nodemailer");

const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const transporter =
      nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    console.log(
      "Sending email to:",
      to
    );

    const info =
      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,
        to,
        subject,
        html,
      });

    console.log(
      "Email sent:",
      info.messageId
    );
  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );
    throw error;
  }
};

module.exports = sendEmail;
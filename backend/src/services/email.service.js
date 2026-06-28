const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send Email
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
  from: `"HackRadar Alerts" <${process.env.EMAIL_USER}>`,
  to,
  subject,
  html,
});

console.log("========== EMAIL INFO ==========");
console.log(info);
console.log("================================");
    return info;
  } catch (error) {
    console.error("❌ Email sending failed");
    console.error(error.message);

    throw error;
  }
};

module.exports = {
  sendEmail,
};
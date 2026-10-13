const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  const { MAIL_USER, MAIL_PASS } = process.env

  if (!MAIL_USER || !MAIL_PASS) {
    throw new Error("Email delivery is not configured. Set MAIL_USER and MAIL_PASS in server/.env.")
  }

  const auth = { user: MAIL_USER, pass: MAIL_PASS }
  const transporter = process.env.MAIL_HOST
    ? nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === "true",
        auth,
      })
    : nodemailer.createTransport({
        service: process.env.MAIL_SERVICE || "gmail",
        auth,
      })

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || MAIL_USER,
    to: email,
    subject: title,
    html: body,
  })

  return info
}

module.exports = mailSender

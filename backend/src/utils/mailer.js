const nodemailer = require('nodemailer');
const { EmailSetting } = require('../models');
const { decrypt } = require('./secret');

// Mail settings saved in the admin (Email Settings) win; the SMTP_* variables are the fallback
async function getConfig() {
  const row = await EmailSetting.findByPk(1);
  const pass = row && decrypt(row.smtpPass);
  if (row && row.smtpUser && pass) {
    return {
      host: row.smtpHost || 'smtp.gmail.com',
      port: Number(row.smtpPort) || 587,
      user: row.smtpUser,
      pass,
      from: `"Pamban Swami Home Care" <${row.smtpUser}>`,
      enquiryEmail: row.enquiryEmail,
    };
  }
  if (!process.env.SMTP_HOST) return { enquiryEmail: row && row.enquiryEmail };
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    enquiryEmail: (row && row.enquiryEmail) || process.env.ENQUIRY_EMAIL,
  };
}

// Sends through SMTP when it is set up; otherwise prints the mail to the server console (dev mode)
async function sendMail({ to, subject, text, html }, config) {
  const cfg = config || (await getConfig());
  if (!cfg.host) {
    console.log(`
[mail not sent - email not configured]
To: ${to}
Subject: ${subject}
${text}
`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  await transporter.sendMail({ from: cfg.from, to, subject, text, html });
}

module.exports = sendMail;
module.exports.getConfig = getConfig;

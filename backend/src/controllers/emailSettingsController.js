const { EmailSetting } = require('../models');
const sendMail = require('../utils/mailer');
const { encrypt, decrypt } = require('../utils/secret');
const { isEmail } = require('../utils/contactFormat');

const getRow = async () => (await EmailSetting.findOrCreate({ where: { id: 1 } }))[0];

// the app password is never sent back to the browser, only whether one is saved
const toJSON = (row) => {
  const { smtpPass, ...rest } = row.toJSON();
  return { ...rest, hasPassword: !!decrypt(smtpPass) };
};

exports.get = async (req, res) => res.json(toJSON(await getRow()));

exports.update = async (req, res) => {
  const row = await getRow();
  const { enquiryEmail, smtpHost, smtpPort, smtpUser, smtpPass } = req.body;
  const clean = (v) => (typeof v === 'string' ? v.trim() : v);

  if (clean(enquiryEmail) && !isEmail(clean(enquiryEmail))) {
    return res.status(400).json({ message: 'Please enter a valid email address to receive enquiries' });
  }
  if (clean(smtpUser) && !isEmail(clean(smtpUser))) return res.status(400).json({ message: 'Please enter a valid Gmail address' });
  const port = Number(smtpPort);
  if (smtpPort !== undefined && smtpPort !== '' && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    return res.status(400).json({ message: 'Port must be a number, for example 587' });
  }

  const changes = {
    enquiryEmail: clean(enquiryEmail) || null,
    smtpHost: clean(smtpHost) || 'smtp.gmail.com',
    smtpPort: smtpPort === undefined || smtpPort === '' ? 587 : port,
    smtpUser: clean(smtpUser) || null,
  };
  // Google shows the app password in groups with spaces; a blank box keeps the saved one
  const pass = typeof smtpPass === 'string' ? smtpPass.replace(/\s+/g, '') : '';
  if (pass) changes.smtpPass = encrypt(pass);
  await row.update(changes);
  res.json(toJSON(row));
};

// sends a real mail so the admin can see at once whether the settings work
exports.test = async (req, res) => {
  const config = await sendMail.getConfig();
  const to = (req.body.to || '').trim() || config.enquiryEmail || config.user;
  if (!config.host) return res.status(400).json({ message: 'Save the Gmail address and app password first.' });
  if (!to || !isEmail(to)) return res.status(400).json({ message: 'Enter the email address to send the test to.' });
  try {
    await sendMail({
      to,
      subject: 'Test email from Pamban Swami Home Care',
      text: 'Your email settings are working. Enquiry alerts and password reset emails will now be delivered.',
    }, config);
    res.json({ message: `Test email sent to ${to}. Please check that inbox (and spam).` });
  } catch (err) {
    const wrong = err.code === 'EAUTH' || err.responseCode === 535;
    res.status(400).json({
      message: wrong
        ? 'Gmail did not accept the login. Check the Gmail address and use the 16-letter app password, not the normal Gmail password.'
        : `The test email could not be sent (${err.message}).`,
    });
  }
};

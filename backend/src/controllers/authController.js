const crypto = require('crypto');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const sendMail = require('../utils/mailer');

const MIN_PASSWORD = 8;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.scope('withSecrets').findOne({
    where: { [Op.or]: [{ username: username || '' }, { email: username || '' }] },
  });
  if (!admin || !admin.isActive || !(await bcrypt.compare(password || '', admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  res.json({ token, username: admin.username });
};

exports.me = async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id);
  if (!admin) return res.status(401).json({ message: 'Account no longer exists' });
  res.json(admin);
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < MIN_PASSWORD) {
    return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD} characters` });
  }
  const admin = await Admin.scope('withSecrets').findByPk(req.admin.id);
  if (!(await bcrypt.compare(currentPassword || '', admin.passwordHash))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  await admin.update({ passwordHash: await bcrypt.hash(newPassword, 10) });
  res.json({ message: 'Password changed successfully' });
};

exports.forgotPassword = async (req, res) => {
  const email = (req.body.email || '').trim();
  const admin = email && (await Admin.findOne({ where: { email, isActive: true } }));

  if (admin) {
    const token = crypto.randomBytes(32).toString('hex');
    await admin.update({
      resetTokenHash: sha256(token),
      resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000),
    });
    const link = `${process.env.ADMIN_URL || 'http://localhost:5173/admin'}/reset-password?token=${token}`;
    await sendMail({
      to: admin.email,
      subject: 'Reset your admin password',
      text: `Use this link to reset your password (valid for 30 minutes):\n${link}\n\nIf you did not request this, ignore this email.`,
    });
  }
  // same answer whether or not the email exists, so accounts cannot be probed
  res.json({ message: 'If that email is registered, a reset link has been sent.' });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token) return res.status(400).json({ message: 'Reset token is missing' });
  if (!password || password.length < MIN_PASSWORD) {
    return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD} characters` });
  }
  const admin = await Admin.findOne({
    where: { resetTokenHash: sha256(token), resetTokenExpires: { [Op.gt]: new Date() } },
  });
  if (!admin) return res.status(400).json({ message: 'This reset link is invalid or has expired' });

  await admin.update({
    passwordHash: await bcrypt.hash(password, 10),
    resetTokenHash: null,
    resetTokenExpires: null,
  });
  res.json({ message: 'Password reset. You can now sign in.' });
};

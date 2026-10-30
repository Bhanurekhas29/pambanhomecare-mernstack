const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

const { passwordProblem } = require('../utils/password');

const clean = (v) => (typeof v === 'string' && v.trim() === '' ? null : v);

exports.list = async (req, res) => {
  res.json(await Admin.findAll({ order: [['id', 'ASC']] }));
};

exports.get = async (req, res) => {
  const user = await Admin.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
};

exports.create = async (req, res) => {
  const { username, email, password, isActive } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required' });
  if (passwordProblem(password)) return res.status(400).json({ message: passwordProblem(password) });
  const user = await Admin.create({
    username,
    email: clean(email),
    isActive: isActive !== false,
    passwordHash: await bcrypt.hash(password, 10),
  });
  res.status(201).json(await Admin.findByPk(user.id));
};

exports.update = async (req, res) => {
  const user = await Admin.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const { username, email, password, isActive } = req.body;

  if (Number(req.params.id) === req.admin.id && isActive === false) {
    return res.status(400).json({ message: 'You cannot deactivate your own account' });
  }
  const changes = { username, email: clean(email), isActive };
  if (password) {
    if (passwordProblem(password)) return res.status(400).json({ message: passwordProblem(password) });
    changes.passwordHash = await bcrypt.hash(password, 10);
  }
  await user.update(changes);
  res.json(await Admin.findByPk(user.id));
};

exports.remove = async (req, res) => {
  if (Number(req.params.id) === req.admin.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  const user = await Admin.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  await user.destroy();
  res.json({ message: 'Deleted' });
};

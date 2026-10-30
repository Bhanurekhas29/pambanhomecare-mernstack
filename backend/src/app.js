require('dotenv').config();
require('express-async-errors');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { UploadedFile } = require('./models');

const app = express();
app.set('trust proxy', 1); // behind a host's proxy (Render, nginx) the visitor's real address is needed for the rate limit

app.use(cors());
app.use(express.json());
// photos saved before they moved to the database are still served from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/uploads/:filename', async (req, res) => {
  const file = await UploadedFile.findByPk(req.params.filename);
  if (!file) return res.status(404).end();
  res.set({ 'Content-Type': file.mimeType, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' });
  res.send(file.data);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));

// the built website (frontend/dist): the website at "/" and the admin at "/admin" are one app, so every page falls back to index.html
const dist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: '1y', setHeaders: (res, file) => file.endsWith('.html') && res.set('Cache-Control', 'no-cache') }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    if (req.path.startsWith('/assets/')) return res.status(404).end();
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.name?.startsWith('Sequelize') ? 400 : 500).json({ message: err.message });
});

module.exports = app;

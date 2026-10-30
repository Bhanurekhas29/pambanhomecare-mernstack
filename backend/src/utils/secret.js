const crypto = require('crypto');

// the Gmail app password is kept encrypted in the database; the key comes from JWT_SECRET
const key = () => crypto.createHash('sha256').update(String(process.env.JWT_SECRET || '')).digest();

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64')).join('.');
};

// returns '' when the value is empty or cannot be read (for example after JWT_SECRET was changed)
exports.decrypt = (value) => {
  if (!value) return '';
  try {
    const [iv, tag, data] = value.split('.').map((p) => Buffer.from(p, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
};

const { Enquiry, ContactSection } = require('../models');
const contact = require('./contactController');
const sendMail = require('../utils/mailer');
const buildEnquiryEmail = require('../utils/enquiryEmail');
const { normalizeMobile, isEmail } = require('../utils/contactFormat');

const GENDERS = ['Male', 'Female', 'Other'];
const TYPES = ['home_care', 'physiotherapy'];
const clean = (value) => (typeof value === 'string' ? value.trim() : value);

// POST /api/enquiries - the Contact Us form on the website
exports.submit = async (req, res) => {
  const name = clean(req.body.name);
  const phone = clean(req.body.phone);
  const gender = clean(req.body.gender);
  const age = Number(req.body.age);
  const enquiryType = clean(req.body.enquiryType) || 'home_care';
  const serviceName = clean(req.body.serviceName) || null;
  const message = clean(req.body.message) || null;

  if (!name) return res.status(400).json({ message: 'Full name is required' });
  const mobile = normalizeMobile(phone);
  if (!mobile) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number (starting with 6, 7, 8 or 9)' });
  }
  // email is optional, but must be well formed when given
  const email = (clean(req.body.email) || '').toLowerCase() || null;
  if (email && !isEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return res.status(400).json({ message: 'Please enter a valid age' });
  }
  if (!GENDERS.includes(gender)) return res.status(400).json({ message: 'Please select a gender' });
  if (!TYPES.includes(enquiryType)) return res.status(400).json({ message: 'Invalid enquiry type' });

  const enquiry = await Enquiry.create({
    name: name.slice(0, 100), phone: mobile, email, age, gender, enquiryType,
    serviceName: serviceName && serviceName.slice(0, 150),
    message: message && message.slice(0, 2000),
  });

  // alert the team by email when an address is configured; a mail problem must never fail the form
  const { enquiryEmail } = await sendMail.getConfig();
  if (enquiryEmail) {
    sendMail({
      to: enquiryEmail,
      subject: `New callback request from ${enquiry.name}`,
      ...buildEnquiryEmail(enquiry),
    }).catch((err) => console.error('Enquiry email failed:', err.message));
  }

  const section = (await ContactSection.findOrCreate({ where: { id: 1 }, defaults: contact.defaults }))[0];
  res.status(201).json({ message: section.successMessage || 'Thank you! We will contact you shortly.' });
};

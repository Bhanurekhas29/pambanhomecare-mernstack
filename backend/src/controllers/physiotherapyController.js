const { PhysiotherapySection } = require('../models');
const singleton = require('./singleton');
const validator = require('./validators');

const checkSection = validator({
  required: [['heading', 'Main heading']],
  pairs: [['bannerButtonLabel', 'bannerButtonLink', 'Banner button']],
});

// heading/banner of the Physiotherapy at Home section on the website
exports.section = singleton(PhysiotherapySection, {
  isVisible: true,
  eyebrow: 'PHYSIOTHERAPY AT HOME',
  heading: 'Expert Home Physiotherapy Services in the Comfort of Your Home.',
  highlightText: 'Your Home.',
  description: 'Our home physiotherapy services help improve mobility, manage pain and support recovery through convenient physiotherapy visits at home across Chennai.',
  bannerTitle: 'Ready to take the first step towards better movement?',
  bannerText: 'Book a consultation and our physiotherapist will visit you at home to understand your needs.',
  bannerButtonLabel: 'Book a Physiotherapy Consultation',
  bannerButtonLink: '#contact',
}, (values) =>
  checkSection(values) ||
  (values.highlightText && !String(values.heading).includes(values.highlightText)
    ? 'Highlighted words must appear exactly as written in the main heading'
    : undefined));

// one treatment card
exports.validateTreatment = validator({ required: [['title', 'Title']] });

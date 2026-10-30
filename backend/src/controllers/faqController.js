const { FaqSection } = require('../models');
const singleton = require('./singleton');
const validator = require('./validators');

const checkHeading = validator({ required: [['heading', 'Main heading']] });

const faq = (question, answer) => ({ question, answer });

module.exports = singleton(FaqSection, {
  isVisible: true,
  eyebrow: 'FREQUENTLY ASKED QUESTIONS',
  heading: 'Home Care Questions, Answered.',
  description: 'Find quick answers about our home care and physiotherapy services in Chennai, or call us to talk to our care team.',
  items: [
    faq(
      'Do you provide home care services in Chennai?',
      'Yes. Pamban Swami Home Care provides professional home care services in Neelankarai, Chennai and nearby areas. Our services include elderly care, nursing assistance, patient care, companion care and support for daily activities.',
    ),
    faq(
      'Do you offer 24-hour home care services?',
      "Yes. We offer flexible 12-hour and 24-hour home care options based on your family's requirements. Our caregivers provide assistance with daily routines, personal care, mobility and companionship.",
    ),
    faq(
      'Can I arrange nursing care at home for a patient?',
      "Yes. We can arrange nursing support at home for patients who need assistance with health monitoring, prescribed medication and other nursing requirements. The care provided will depend on the patient's needs and doctor's advice.",
    ),
    faq(
      'What services are included in elderly care at home?',
      'Our elderly care services include assistance with daily activities, personal hygiene, meals, mobility, medicine reminders and companionship. We aim to help seniors feel comfortable and supported in their own homes.',
    ),
    faq(
      'Do you provide physiotherapy at home in Chennai?',
      'Yes. We offer home physiotherapy services for individuals who need support with pain management, post-surgery rehabilitation, sports injury recovery, elderly mobility and neurological rehabilitation. Contact our team to arrange a consultation.',
    ),
  ],
}, (values) =>
  checkHeading(values)
  || (Array.isArray(values.items) && values.items.some((i) => !String(i.question || '').trim() || !String(i.answer || '').trim())
    ? 'Every question needs both a question and an answer'
    : undefined));

require('dotenv').config();
const {
  sequelize, SeoSetting, HeroSection, AboutSection, ServicesSection, Service, PhysiotherapySection,
  PhysiotherapyTreatment, WhyChooseSection, ProfessionalCareSection, ContactSection, GoogleSection, FaqSection,
} = require('./models');

// Writes the SEO copy from "PAMBAN SWAMI HOME CARE SEO Content" into the database.
// Safe to run again: it only sets the texts listed here and leaves photos, links and everything else alone.
// Run: npm run seed:seo   (against the database named in the .env file)

const serviceText = {
  'Elderly Care': 'We provide personalised elderly care at home, helping seniors with daily routines, mobility, meals and companionship. Our caregivers support older adults with attention, patience and respect.',
  'Nursing Care': "Get professional nursing care at home from trained nursing staff. Support includes health monitoring, prescribed medication assistance and everyday nursing needs, based on your doctor's advice.",
  'Patient Care': 'Our patient care services provide assistance with personal hygiene, feeding, mobility and daily activities, helping patients feel comfortable while recovering at home.',
  'Companion Care': 'Our companion care service offers seniors friendly support, conversation and assistance with everyday activities. It is ideal for older adults who need company and reassurance at home.',
  'Bedridden Care': 'We provide compassionate care for bedridden patients at home, including assistance with bathing, feeding, repositioning and personal hygiene while maintaining dignity and comfort.',
  'Palliative Care': "Our palliative care services focus on comfort, dignity and emotional support for individuals living with serious illnesses, working alongside their doctor's guidance.",
  'Injection & Dressing Care': "Receive injection and wound dressing assistance at home from trained staff, following your doctor's prescription and instructions.",
  'Post Hospital Care': 'Make recovery easier with post-hospital care at home. Our caregivers assist with daily activities, mobility and personal care following hospital discharge.',
  'Cooking Service': 'Enjoy freshly prepared home-cooked meals with cooking assistance for seniors and families. Meals can be prepared according to individual preferences and dietary guidance.',
  'Baby Care': 'Loving baby care support at home for newborns and young children, helping new parents with feeding, bathing and daily routines.',
};

const physioText = {
  'Pain Relief Therapy': 'Targeted exercises and therapeutic support to help reduce pain, ease stiffness and improve everyday movement.',
  'Post-Surgery Rehabilitation': 'Guided rehabilitation after surgery to help restore strength, flexibility and mobility through an appropriate recovery programme.',
  'Sports Injury Recovery': 'Personalised rehabilitation exercises to support recovery from sports injuries, sprains and muscle strains.',
  'Elderly Physiotherapy': 'Gentle physiotherapy exercises designed to support mobility, balance and independence among older adults.',
  'Stroke & Neurological Rehabilitation': 'Rehabilitation support to help improve movement, coordination and everyday functional abilities following a stroke or neurological condition.',
  'Strength, Mobility & Balance Training': 'Guided exercises that help improve muscle strength, balance, stability and confidence during everyday activities.',
};

(async () => {
  await sequelize.sync();

  await SeoSetting.upsert({
    id: 1,
    metaTitle: 'Home Care Services in Chennai | Pamban Swami Home Care',
    metaDescription: 'Pamban Swami Home Care provides elderly care, nursing support and physiotherapy at home in Neelankarai, Chennai and nearby areas.',
  });

  await HeroSection.update({
    heading: 'Professional Home Care Services.\nRight at Your Home.',
    description: 'From elderly care and nursing support to physiotherapy and rehabilitation, Pamban Swami Home Care provides compassionate, professional home care services in the comfort of your home.',
  }, { where: { id: 1 } });

  await AboutSection.update({
    description: 'Pamban Swami Home Care is a home health care agency in Chennai, offering professional care and support for seniors, patients and families right in the comfort of your home.\n\n'
      + "Whether your family needs an elderly caregiver, nursing assistance after a hospital stay or physiotherapy at home, our team helps you find suitable care based on your loved one's needs. We focus on personalised support, safety and comfort in familiar surroundings.",
  }, { where: { id: 1 } });

  await ServicesSection.update({
    description: 'Explore our home care services in Chennai, including elderly care, nursing and patient support, delivered with compassion and professionalism in the comfort of your home.',
  }, { where: { id: 1 } });
  for (const [title, description] of Object.entries(serviceText)) await Service.update({ description }, { where: { title } });

  await PhysiotherapySection.update({
    heading: 'Expert Home Physiotherapy Services in the Comfort of Your Home.',
    description: 'Our home physiotherapy services help improve mobility, manage pain and support recovery through convenient physiotherapy visits at home across Chennai.',
  }, { where: { id: 1 } });
  for (const [title, description] of Object.entries(physioText)) await PhysiotherapyTreatment.update({ description }, { where: { title } });

  const why = await WhyChooseSection.findByPk(1);
  if (why) {
    const items = (why.items || []).map((i) => (i.title === 'Safe & Reliable Service'
      ? { ...i, text: "Dependable home care support with flexible 12-hour and 24-hour care options to suit your family's needs." }
      : i));
    await why.update({ items });
  }

  await ProfessionalCareSection.update({
    description: 'From everyday assistance and senior care to skilled nursing and physiotherapy, our team brings dependable, compassionate care to your doorstep, so your loved ones can stay where they feel happiest.',
  }, { where: { id: 1 } });

  await ContactSection.update({
    description: 'Looking for reliable home care in Chennai? Request a callback and our team will help you find compassionate care and support for your family.',
  }, { where: { id: 1 } });

  await GoogleSection.update({
    description: 'Explore our Google Business Profile, reviews and home care services in Neelankarai, Chennai.',
  }, { where: { id: 1 } });

  await FaqSection.findOrCreate({ where: { id: 1 }, defaults: require('./controllers/faqController').defaults });

  console.log('SEO content updated');
  await sequelize.close();
})().catch((e) => { console.error(e.message); process.exit(1); });

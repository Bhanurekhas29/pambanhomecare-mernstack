const router = require('express').Router();
const hero = require('../controllers/heroController');
const about = require('../controllers/aboutController');
const services = require('../controllers/servicesController');
const physio = require('../controllers/physiotherapyController');
const whyChoose = require('../controllers/whyChooseController');
const professionalCare = require('../controllers/professionalCareController');
const promises = require('../controllers/promisesController');
const howItWorks = require('../controllers/howItWorksController');
const faq = require('../controllers/faqController');
const google = require('../controllers/googleController');
const contact = require('../controllers/contactController');
const footer = require('../controllers/footerController');
const seo = require('../controllers/seoController');
const enquiries = require('../controllers/enquiryController');
const rateLimit = require('../middleware/rateLimit');
const {
  SiteSetting, AboutSection, ServicesSection, PhysiotherapySection, PhysiotherapyTreatment,
  WhyChooseSection, ContactSection, FloatingIcon, MenuItem, Service, Testimonial,
} = require('../models');

// Sections that can be switched off in the admin. A menu link pointing at a hidden
// section is dropped too, so visitors never click a link to nothing.
// Add each new toggleable section here as it is built.
const toggleableSections = [
  { anchor: '#about', Model: AboutSection },
  { anchor: '#services', Model: ServicesSection },
  { anchor: '#physiotherapy', Model: PhysiotherapySection },
  { anchor: '#why-choose-us', Model: WhyChooseSection },
  { anchor: '#contact', Model: ContactSection },
];

router.get('/site-settings', async (req, res) => {
  res.json((await SiteSetting.findOrCreate({ where: { id: 1 } }))[0]);
});

router.get('/hero', hero.get);
router.get('/about', about.get);
router.get('/why-choose-us', whyChoose.get);
router.get('/professional-care', professionalCare.get);
router.get('/promises', promises.get);
router.get('/how-it-works', howItWorks.get);
router.get('/faq', faq.get);
router.get('/google-business', google.get);
router.get('/contact-us', contact.get);
router.get('/footer', footer.get);
router.get('/seo', seo.get);
router.get('/floating-icons', async (req, res) => {
  res.json(await FloatingIcon.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] }));
});

router.get('/menu', async (req, res) => {
  const hidden = [];
  for (const { anchor, Model } of toggleableSections) {
    const row = await Model.findByPk(1);
    if (row && !row.isVisible) hidden.push(anchor);
  }
  const items = await MenuItem.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
  res.json(items.filter((item) => !hidden.includes(item.link)));
});

router.get('/physiotherapy-section', physio.section.get);
router.get('/physiotherapy', async (req, res) => {
  res.json(await PhysiotherapyTreatment.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] }));
});

router.get('/services-section', services.section.get);

router.get('/services', async (req, res) => {
  res.json(await Service.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] }));
});

router.get('/testimonials', async (req, res) => {
  res.json(await Testimonial.findAll({ where: { isPublished: true }, order: [['id', 'DESC']] }));
});

router.post('/enquiries', rateLimit({ max: 5, windowMs: 10 * 60 * 1000 }), enquiries.submit);

module.exports = router;

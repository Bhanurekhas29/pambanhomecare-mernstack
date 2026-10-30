const path = require('path');
const crypto = require('crypto');
const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const crud = require('../controllers/crud');
const authCtrl = require('../controllers/authController');
const users = require('../controllers/userController');
const settings = require('../controllers/settingsController');
const emailSettings = require('../controllers/emailSettingsController');
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
const floatingIcon = require('../controllers/floatingIconController');
const { MenuItem, Service, PhysiotherapyTreatment, FloatingIcon, Testimonial, Enquiry, UploadedFile } = require('../models');

// public auth routes
router.post('/login', authCtrl.login);
// the "not registered" message tells which emails exist, so slow down guessing and inbox flooding
const forgotLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many reset requests. Please try again after 15 minutes.' },
});
router.post('/forgot-password', forgotLimit, authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);

router.use(auth);

router.get('/me', authCtrl.me);
router.post('/change-password', authCtrl.changePassword);

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(req.file.originalname).toLowerCase()}`;
  await UploadedFile.create({ filename, mimeType: req.file.mimetype, data: req.file.buffer });
  res.status(201).json({ url: `/uploads/${filename}` });
});

router.get('/stats', async (req, res) => {
  const [services, testimonials, enquiries, newEnquiries] = await Promise.all([
    Service.count(),
    Testimonial.count(),
    Enquiry.count(),
    Enquiry.count({ where: { status: 'new' } }),
  ]);
  res.json({ services, testimonials, enquiries, newEnquiries });
});

router.get('/hero', hero.get);
router.put('/hero', hero.update);

router.get('/services-section', services.section.get);
router.put('/services-section', services.section.update);

router.get('/physiotherapy-section', physio.section.get);
router.put('/physiotherapy-section', physio.section.update);

router.get('/professional-care', professionalCare.get);
router.put('/professional-care', professionalCare.update);

router.get('/promises', promises.get);
router.put('/promises', promises.update);

router.get('/how-it-works', howItWorks.get);
router.put('/how-it-works', howItWorks.update);
router.get('/faq', faq.get);
router.put('/faq', faq.update);

router.get('/google-business', google.get);
router.put('/google-business', google.update);

router.get('/contact-us', contact.get);
router.put('/contact-us', contact.update);

router.get('/footer', footer.get);
router.put('/footer', footer.update);

router.get('/seo', seo.get);
router.put('/seo', seo.update);

router.get('/why-choose-us', whyChoose.get);
router.put('/why-choose-us', whyChoose.update);

router.get('/about', about.get);
router.put('/about', about.update);

router.get('/site-settings', settings.get);
router.put('/site-settings', settings.update);
router.get('/email-settings', emailSettings.get);
router.put('/email-settings', emailSettings.update);
router.post('/email-settings/test', emailSettings.test);

// Django-admin style: one set of CRUD routes per model
const resources = {
  users,
  menu: crud(MenuItem, { order: [['sortOrder', 'ASC']], autoOrder: true }),
  services: crud(Service, { order: [['sortOrder', 'ASC']], autoOrder: true, validate: services.validateService }),
  physiotherapy: crud(PhysiotherapyTreatment, {
    order: [['sortOrder', 'ASC']], autoOrder: true, validate: physio.validateTreatment,
  }),
  'floating-icons': crud(FloatingIcon, {
    order: [['sortOrder', 'ASC']], autoOrder: true, validate: floatingIcon.validate,
  }),
  testimonials: crud(Testimonial),
  enquiries: crud(Enquiry, { include: [Service] }),
};

Object.entries(resources).forEach(([name, c]) => {
  if (c.reorder) router.put(`/${name}/reorder`, c.reorder); // must come before /:id
  router.get(`/${name}`, c.list);
  router.post(`/${name}`, c.create);
  router.get(`/${name}/:id`, c.get);
  router.put(`/${name}/:id`, c.update);
  router.delete(`/${name}/:id`, c.remove);
});

module.exports = router;

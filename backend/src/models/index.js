const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(120), unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  resetTokenHash: { type: DataTypes.STRING(64), field: 'reset_token_hash' },
  resetTokenExpires: { type: DataTypes.DATE, field: 'reset_token_expires' },
}, {
  tableName: 'admins',
  updatedAt: false,
  // secrets never leave the API unless a query asks for scope('withSecrets')
  defaultScope: { attributes: { exclude: ['passwordHash', 'resetTokenHash', 'resetTokenExpires'] } },
  scopes: { withSecrets: {} },
});

const SiteSetting = sequelize.define('SiteSetting', {
  siteName: { type: DataTypes.STRING(150), allowNull: false, defaultValue: 'Pamban Swami', field: 'site_name' },
  tagline: { type: DataTypes.STRING(100), defaultValue: 'HOME CARE' },
  headerLogoUrl: { type: DataTypes.STRING, field: 'header_logo_url' },
  footerLogoUrl: { type: DataTypes.STRING, field: 'footer_logo_url' },
  ctaLabel: { type: DataTypes.STRING(50), defaultValue: 'Contact Us', field: 'cta_label' },
  ctaLink: { type: DataTypes.STRING(255), defaultValue: '#contact', field: 'cta_link' },
  showCredit: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'show_credit' },
  creditText: {
    type: DataTypes.STRING(150),
    defaultValue: 'Designed & Developed by Vetri IT Systems',
    field: 'credit_text',
  },
  creditUrl: { type: DataTypes.STRING(255), field: 'credit_url' },
}, { tableName: 'site_settings' });

const HeroSection = sequelize.define('HeroSection', {
  eyebrow: DataTypes.STRING(150),
  heading: DataTypes.TEXT, // a new line becomes a line break on the website
  description: DataTypes.TEXT,
  backgroundImageUrl: { type: DataTypes.STRING, field: 'background_image_url' },
  primaryBtnLabel: { type: DataTypes.STRING(60), field: 'primary_btn_label' },
  primaryBtnLink: { type: DataTypes.STRING(255), field: 'primary_btn_link' },
  secondaryBtnLabel: { type: DataTypes.STRING(60), field: 'secondary_btn_label' },
  secondaryBtnLink: { type: DataTypes.STRING(255), field: 'secondary_btn_link' },
  features: DataTypes.JSON, // [{ icon, text }]
  cardIcon: { type: DataTypes.STRING(60), field: 'card_icon' },
  cardTagline: { type: DataTypes.STRING(100), field: 'card_tagline' },
  cardHeading: { type: DataTypes.STRING(100), field: 'card_heading' },
  cardHighlight: { type: DataTypes.STRING(100), field: 'card_highlight' },
  cardDescription: { type: DataTypes.TEXT, field: 'card_description' },
  options: DataTypes.JSON, // [{ icon, title, description, link }]
  cardFooter: { type: DataTypes.STRING(150), field: 'card_footer' },
}, { tableName: 'hero_sections' });

const AboutSection = sequelize.define('AboutSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT, // a new line becomes a line break on the website
  description: DataTypes.TEXT,
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  features: DataTypes.JSON, // [{ icon, text }]
  badgeIcon: { type: DataTypes.STRING(60), field: 'badge_icon' },
  badgeText: { type: DataTypes.STRING(100), field: 'badge_text' },
  buttonLabel: { type: DataTypes.STRING(60), field: 'button_label' },
  buttonLink: { type: DataTypes.STRING(255), field: 'button_link' },
}, { tableName: 'about_sections' });

const PhysiotherapySection = sequelize.define('PhysiotherapySection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  highlightText: { type: DataTypes.STRING(150), field: 'highlight_text' }, // part of the heading shown in pink
  description: DataTypes.TEXT, // short intro under the heading
  bannerTitle: { type: DataTypes.STRING(200), field: 'banner_title' },
  bannerText: { type: DataTypes.TEXT, field: 'banner_text' },
  bannerButtonLabel: { type: DataTypes.STRING(80), field: 'banner_button_label' },
  bannerButtonLink: { type: DataTypes.STRING(255), field: 'banner_button_link' },
  bannerImageUrl: { type: DataTypes.STRING, field: 'banner_image_url' },
  bannerDarken: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'banner_darken' }, // dark layer for ordinary photos
}, { tableName: 'physiotherapy_sections' });

const PhysiotherapyTreatment = sequelize.define('PhysiotherapyTreatment', {
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: DataTypes.TEXT,
  icon: DataTypes.STRING(100),
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, { tableName: 'physiotherapy_treatments' });

const WhyChooseSection = sequelize.define('WhyChooseSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT,
  items: DataTypes.JSON, // [{ icon, title, text }]
  backgroundImageUrl: { type: DataTypes.STRING, field: 'background_image_url' },
  backgroundOverlay: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'background_overlay' }, // dark layer for ordinary photos
}, { tableName: 'why_choose_sections' });

const ProfessionalCareSection = sequelize.define('ProfessionalCareSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT, // a new line becomes a line break on the website
  description: DataTypes.TEXT,
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  buttonLabel: { type: DataTypes.STRING(60), field: 'button_label' },
  buttonLink: { type: DataTypes.STRING(255), field: 'button_link' },
}, { tableName: 'professional_care_sections' });

const PromisesSection = sequelize.define('PromisesSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT,
  items: DataTypes.JSON, // [{ icon, title, text }]
  backgroundImageUrl: { type: DataTypes.STRING, field: 'background_image_url' },
  backgroundOverlay: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'background_overlay' }, // soft white layer for ordinary photos
}, { tableName: 'promises_sections' });

const HowItWorksSection = sequelize.define('HowItWorksSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT,
  items: DataTypes.JSON, // steps: [{ icon, title, text }], numbered by position
}, { tableName: 'how_it_works_sections' });

const FaqSection = sequelize.define('FaqSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT, // short text beside the questions
  items: DataTypes.JSON, // [{ question, answer }]
}, { tableName: 'faq_sections' });

const GoogleSection = sequelize.define('GoogleSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  heading: DataTypes.STRING(150),
  description: DataTypes.TEXT,
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  businessName: { type: DataTypes.STRING(150), field: 'business_name' },
  rating: DataTypes.FLOAT,
  reviewsLabel: { type: DataTypes.STRING(60), field: 'reviews_label' },
  address: DataTypes.TEXT,
  buttonLabel: { type: DataTypes.STRING(80), field: 'button_label' },
  buttonLink: { type: DataTypes.STRING(500), field: 'button_link' },
}, { tableName: 'google_sections' });

const ContactSection = sequelize.define('ContactSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT,
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  infoTitle: { type: DataTypes.STRING(100), field: 'info_title' },
  infoText: { type: DataTypes.TEXT, field: 'info_text' },
  items: DataTypes.JSON, // contact details: [{ icon, label, value }]
  tabHomeCareLabel: { type: DataTypes.STRING(60), field: 'tab_home_care_label' },
  tabPhysioLabel: { type: DataTypes.STRING(60), field: 'tab_physio_label' },
  submitLabel: { type: DataTypes.STRING(60), field: 'submit_label' },
  successMessage: { type: DataTypes.STRING(250), field: 'success_message' },
  backgroundImageUrl: { type: DataTypes.STRING, field: 'background_image_url' },
  backgroundOverlay: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'background_overlay' }, // soft white layer for ordinary photos
  infoBackgroundUrl: { type: DataTypes.STRING, field: 'info_background_url' }, // artwork behind the blue "Get in touch" card
}, { tableName: 'contact_sections' });

const FooterSection = sequelize.define('FooterSection', {
  aboutText: { type: DataTypes.TEXT, field: 'about_text' },
  socialLinks: { type: DataTypes.JSON, field: 'social_links' }, // [{ platform, url }]
  quickLinksHeading: { type: DataTypes.STRING(60), field: 'quick_links_heading' },
  quickLinks: { type: DataTypes.JSON, field: 'quick_links' }, // [{ label, link }]
  servicesHeading: { type: DataTypes.STRING(60), field: 'services_heading' },
  physioHeading: { type: DataTypes.STRING(60), field: 'physio_heading' },
  contactHeading: { type: DataTypes.STRING(60), field: 'contact_heading' },
  copyrightText: { type: DataTypes.STRING(200), field: 'copyright_text' },
}, { tableName: 'footer_sections' });

const FloatingIcon = sequelize.define('FloatingIcon', {
  platform: { type: DataTypes.STRING(30), allowNull: false }, // whatsapp | call | email | facebook | instagram | youtube | location
  label: DataTypes.STRING(60),
  value: { type: DataTypes.STRING(500), allowNull: false }, // phone number, email address or https:// link
  message: DataTypes.STRING(300), // WhatsApp opening message
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, { tableName: 'floating_icons' });

const EmailSetting = sequelize.define('EmailSetting', {
  enquiryEmail: { type: DataTypes.STRING(150), field: 'enquiry_email' }, // receives an alert for every new enquiry
  smtpHost: { type: DataTypes.STRING(150), defaultValue: 'smtp.gmail.com', field: 'smtp_host' },
  smtpPort: { type: DataTypes.INTEGER, defaultValue: 587, field: 'smtp_port' },
  smtpUser: { type: DataTypes.STRING(150), field: 'smtp_user' }, // the Gmail address the mails are sent from
  smtpPass: { type: DataTypes.TEXT, field: 'smtp_pass' }, // Gmail app password, stored encrypted
}, { tableName: 'email_settings' });

const SeoSetting = sequelize.define('SeoSetting', {
  metaTitle: { type: DataTypes.STRING(255), field: 'meta_title' },
  metaDescription: { type: DataTypes.TEXT, field: 'meta_description' },
}, { tableName: 'seo_settings' });

const MenuItem = sequelize.define('MenuItem', {
  label: { type: DataTypes.STRING(80), allowNull: false },
  link: { type: DataTypes.STRING(255), allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, { tableName: 'menu_items' });

const Service = sequelize.define('Service', {
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: DataTypes.TEXT,
  icon: DataTypes.STRING(100),
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  isWide: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_wide' }, // wide card that shows the description
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, { tableName: 'services' });

const ServicesSection = sequelize.define('ServicesSection', {
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_visible' },
  eyebrow: DataTypes.STRING(100),
  heading: DataTypes.TEXT,
  description: DataTypes.TEXT,
  ctaText: { type: DataTypes.STRING(200), field: 'cta_text' },
  ctaButtonLabel: { type: DataTypes.STRING(60), field: 'cta_button_label' },
  ctaButtonLink: { type: DataTypes.STRING(255), field: 'cta_button_link' },
}, { tableName: 'services_sections' });

const Testimonial = sequelize.define('Testimonial', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  location: DataTypes.STRING(100),
  message: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.TINYINT, defaultValue: 5 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_published' },
}, { tableName: 'testimonials' });

const Enquiry = sequelize.define('Enquiry', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  email: DataTypes.STRING(120),
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING(20),
  enquiryType: { type: DataTypes.STRING(30), defaultValue: 'home_care', field: 'enquiry_type' }, // home_care | physiotherapy
  serviceName: { type: DataTypes.STRING(150), field: 'service_name' },
  serviceId: { type: DataTypes.INTEGER, field: 'service_id' },
  message: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('new', 'contacted', 'closed'), defaultValue: 'new' },
}, { tableName: 'enquiries' });

// photos uploaded in the admin live in the database, so they survive restarts on hosts with a temporary disk
const UploadedFile = sequelize.define('UploadedFile', {
  filename: { type: DataTypes.STRING(80), primaryKey: true },
  mimeType: { type: DataTypes.STRING(60), allowNull: false, field: 'mime_type' },
  data: { type: DataTypes.BLOB('long'), allowNull: false },
}, { tableName: 'uploaded_files' });

Service.hasMany(Enquiry, { foreignKey: 'serviceId', onDelete: 'SET NULL' });
Enquiry.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = { sequelize, Admin, SiteSetting, HeroSection, AboutSection, ServicesSection,
  PhysiotherapySection, PhysiotherapyTreatment, WhyChooseSection, ProfessionalCareSection, PromisesSection,
  HowItWorksSection, FaqSection, GoogleSection, ContactSection, FooterSection, FloatingIcon, EmailSetting, SeoSetting, MenuItem, Service, Testimonial, Enquiry, UploadedFile };

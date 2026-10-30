import { useEffect, useState } from 'react';
import { loadSite } from './api/client';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import Physiotherapy from './components/Physiotherapy.jsx';
import WhyChooseUs from './components/WhyChooseUs.jsx';
import ProfessionalCare from './components/ProfessionalCare.jsx';
import Promises from './components/Promises.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Faq from './components/Faq.jsx';
import GoogleBusiness from './components/GoogleBusiness.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingIcons from './components/FloatingIcons.jsx';
import useScrollReveal from './hooks/useScrollReveal.js';
import './App.css';

function setMeta(attr, key, content) {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content || '');
}

export default function App() {
  const [site, setSite] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    loadSite().then(setSite).catch(() => setFailed(true));
  };
  useEffect(load, []);
  useScrollReveal(!!site);

  // SEO text from the admin: browser tab title plus the description and social-sharing tags
  useEffect(() => {
    if (!site) return;
    const { seo, settings } = site;
    const title = seo.metaTitle?.trim() || `${settings.siteName}${settings.tagline ? ` ${settings.tagline}` : ''}`;
    document.title = title;
    setMeta('name', 'description', seo.metaDescription);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', seo.metaDescription);
    setMeta('property', 'og:site_name', settings.siteName);
  }, [site]);

  if (failed) {
    return (
      <div className="page-state">
        <h1>We could not load the page</h1>
        <p>Please check your connection and try again.</p>
        <button className="btn btn-primary" onClick={load}>Try again</button>
      </div>
    );
  }
  if (!site) return <div className="page-state"><span className="spinner" aria-label="Loading" /></div>;

  return (
    <>
      <Header settings={site.settings} menu={site.menu} />
      <main>
        <Hero data={site.hero} />
        <About data={site.about} />
        <Services section={site.servicesSection} services={site.services} />
        <Physiotherapy section={site.physioSection} treatments={site.physio} />
        <WhyChooseUs data={site.whyChoose} />
        <ProfessionalCare data={site.professionalCare} />
        <Promises data={site.promises} />
        <HowItWorks data={site.howItWorks} />
        <Faq data={site.faq} />
        <GoogleBusiness data={site.google} />
        <Contact data={site.contact} services={site.services} treatments={site.physio} />
      </main>
      <Footer data={site.footer} settings={site.settings} services={site.services} treatments={site.physio} contact={site.contact} />
      <FloatingIcons icons={site.floatingIcons} />
    </>
  );
}

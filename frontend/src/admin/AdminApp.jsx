import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './api/client';
import AdminLayout from './components/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import HeroSection from './pages/HeroSection.jsx';
import AboutSection from './pages/AboutSection.jsx';
import ServicesSection from './pages/ServicesSection.jsx';
import PhysiotherapySection from './pages/PhysiotherapySection.jsx';
import CardsSection from './pages/CardsSection.jsx';
import ProfessionalCare from './pages/ProfessionalCare.jsx';
import GoogleBusiness from './pages/GoogleBusiness.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Footer from './pages/Footer.jsx';
import Seo from './pages/Seo.jsx';
import Credits from './pages/Credits.jsx';
import SiteSettings from './pages/SiteSettings.jsx';
import ResourceList from './components/ResourceList.jsx';
import ResourceForm from './components/ResourceForm.jsx';
import { resources } from './resources.js';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="site-settings" element={<SiteSettings />} />
        <Route path="hero" element={<HeroSection />} />
        <Route path="about" element={<AboutSection />} />
        <Route path="services-section" element={<ServicesSection />} />
        <Route path="physiotherapy-section" element={<PhysiotherapySection />} />
        <Route
          path="why-choose-us"
          element={<CardsSection endpoint="/admin/why-choose-us" title="Why Choose Us" menuLinkLabel="Why Choose Us" backgroundImage darkSection />}
        />
        <Route path="professional-care" element={<ProfessionalCare />} />
        <Route path="promises" element={<CardsSection endpoint="/admin/promises" title="Our Promises" backgroundImage />} />
        <Route
          path="how-it-works"
          element={
            <CardsSection
              endpoint="/admin/how-it-works" title="How It Works" itemName="Step"
              itemsHint="Steps are numbered 1, 2, 3... automatically, in this order."
            />
          }
        />
        <Route path="find-us-on-google" element={<GoogleBusiness />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="footer" element={<Footer />} />
        <Route path="seo" element={<Seo />} />
        <Route path="credits" element={<Credits />} />
        <Route path="change-password" element={<ChangePassword />} />
        {Object.entries(resources).map(([path, config]) => [
          <Route key={path} path={path} element={<ResourceList config={config} path={path} />} />,
          <Route key={`${path}-new`} path={`${path}/new`} element={<ResourceForm config={config} path={path} />} />,
          <Route key={`${path}-edit`} path={`${path}/:id`} element={<ResourceForm config={config} path={path} />} />,
        ])}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

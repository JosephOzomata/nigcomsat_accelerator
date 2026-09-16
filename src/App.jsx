import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';

import Home from './pages/Home';
import Spacefest from './pages/Spacefest';
import About from './pages/About';
import Apply from './pages/Apply';
import Gallery from './pages/Gallery';
import Hackathon from './pages/Hackathon';
import Events from './pages/Events';
import Accelerator from './pages/Accelerator';
import Portfolio from './pages/Portfolio';
import Mentors from './pages/Mentors';
import Partners from './pages/Partners';
import Facilitators from './pages/Facilitators';
import Testimonials from './pages/Testimonials';
import CohortPage from './pages/cohorts/CohortPage';
import CurriculumPage from './pages/cohorts/CurriculumPage';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import BackgroundBoxes from './components/BackgroundBoxes';
// import logo from './images/Logo/superlogo.png';

import { AuthProvider, useAuth } from './context/AuthContext';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import HeroSlidesEditor from './pages/admin/HeroSlidesEditor';
import LaunchpadEditor from './pages/admin/LaunchpadEditor';
import EventsEditor from './pages/admin/EventsEditor';
import HackathonsEditor from './pages/admin/HackathonsEditor';
import AlumniEditor from './pages/admin/AlumniEditor';
import MentorsEditor from './pages/admin/MentorsEditor';
import PortfolioEditor from './pages/admin/PortfolioEditor';
import CurriculumEditor from './pages/admin/CurriculumEditor';
import NewsletterEditor from './pages/admin/NewsletterEditor';
import ApplicationsEditor from './pages/admin/ApplicationsEditor';
import ApplicationSettingsEditor from './pages/admin/ApplicationSettingsEditor';
import GalleryEditor from './pages/admin/GalleryEditor';
import SiteInfoEditor from './pages/admin/SiteInfoEditor';
import CohortsEditor from './pages/admin/CohortsEditor';
import PartnersEditor from './pages/admin/PartnersEditor';
import FacilitatorsEditor from './pages/admin/FacilitatorsEditor';
import TestimonialsEditor from './pages/admin/TestimonialsEditor';

const PublicLayout = () => (
  <>
    <ScrollProgress />
    <BackgroundBoxes />
    <NavBar />
    <Outlet />
    <Footer />
  </>
);

const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col animate-pulse items-center gap-3">
            <h1>Loading...</h1>
          </div>
        </div>
      );
  }
  if (!user || !isAdmin) return <Navigate to="/admin-login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <SmoothScroll>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/spacefest" element={<Spacefest />} />
              <Route path="/about" element={<About />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/hackathon" element={<Hackathon />} />
              <Route path="/events" element={<Events />} />
              <Route path="/accelerator" element={<Accelerator />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/facilitators" element={<Facilitators />} />
              <Route path="/accelerator/cohort/:slug" element={<CohortPage />} />
              <Route path="/accelerator/curriculum" element={<CurriculumPage />} />
              <Route path="/accelerator/testimonials" element={<Testimonials />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="cohorts" element={<CohortsEditor />} />
                <Route path="partners" element={<PartnersEditor />} />
                <Route path="facilitators" element={<FacilitatorsEditor />} />
                <Route path="testimonials" element={<TestimonialsEditor />} />
                <Route path="hero-slides" element={<HeroSlidesEditor />} />
                <Route path="launchpad" element={<LaunchpadEditor />} />
                <Route path="events" element={<EventsEditor />} />
                <Route path="hackathons" element={<HackathonsEditor />} />
                <Route path="alumni" element={<AlumniEditor />} />
                <Route path="mentors" element={<MentorsEditor />} />
                <Route path="portfolio" element={<PortfolioEditor />} />
                <Route path="curriculum" element={<CurriculumEditor />} />
                <Route path="newsletter" element={<NewsletterEditor />} />
                <Route path="applications" element={<ApplicationsEditor />} />
                <Route path="application-settings" element={<ApplicationSettingsEditor />} />
                <Route path="gallery" element={<GalleryEditor />} />
                <Route path="site-info" element={<SiteInfoEditor />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SmoothScroll>
    </Router>
  );
}

export default App;
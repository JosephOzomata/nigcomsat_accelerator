// src/App.jsx
import './App.css';
import react from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';

import logo from './images/Logo/superlogo.png';
/* ---------- Public pages ---------- */
import Home from './pages/Home';
import Spacefest from './pages/Spacefest';
import About from './pages/About';
import Apply from './pages/Apply';
import Gallery from './pages/Gallery';
import Hackathon from './pages/Hackathon';
import Events from './pages/Events';
import Accelerator from './pages/Accelerator';
import Portfolio from './pages/Portfolio';

/* ---------- Cohort pages ---------- */
import Cohort1 from './pages/cohorts/Cohort1';
import Cohort2 from './pages/cohorts/Cohort2';
import Cohort3 from './pages/cohorts/Cohort3';
import LaunchPage from './pages/cohorts/LaunchPage';
import CurriculumPage from './pages/cohorts/CurriculumPage';

/* ---------- Layout ---------- */
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import BackgroundBoxes from './components/BackgroundBoxes';

/* ---------- Auth ---------- */
import { AuthProvider, useAuth } from './context/AuthContext';

/* ---------- Admin pages ---------- */
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
import GalleryEditor from './pages/admin/GalleryEditor';
import SiteInfoEditor from './pages/admin/SiteInfoEditor';
import ApplicationSettingsEditor from './pages/admin/ApplicationSettingsEditor';

/* ---------- Public layout ---------- */
const PublicLayout = () => (
  <>
    <ScrollProgress />
    <BackgroundBoxes />
    <NavBar />
    <Outlet />
    <Footer />
  </>
);

/* ---------- Protected route ---------- */
const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col animate-pulse items-center gap-3">
            <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
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
            {/* ---------- Public routes ---------- */}
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
              <Route path="/accelerator/cohort-1" element={<Cohort1 />} />
              <Route path="/accelerator/cohort-2" element={<Cohort2 />} />
              <Route path="/accelerator/cohort-3" element={<Cohort3 />} />
              <Route path="/accelerator/launch" element={<LaunchPage />} />
              <Route
                path="/accelerator/curriculum"
                element={<CurriculumPage />}
              />
            </Route>

            {/* ---------- Admin login (no NavBar/Footer) ---------- */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* ---------- Admin panel (protected) ---------- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
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
                <Route path="gallery" element={<GalleryEditor />} />
                <Route path="site-info" element={<SiteInfoEditor />} />
                <Route path="application-settings" element={<ApplicationSettingsEditor />} />
              </Route>
            </Route>

            {/* ---------- 404 fallback ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SmoothScroll>
    </Router>
  );
}

export default App;
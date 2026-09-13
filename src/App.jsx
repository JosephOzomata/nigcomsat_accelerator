// src/App.jsx
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'

import Home from './pages/Home'
import Spacefest from './pages/Spacefest'
import About from './pages/About'
import Apply from './pages/Apply'
import Upload from './pages/Upload'
import Gallery from './pages/Gallery'
import Hackathon from './pages/Hackathon'
import Events from './pages/Events'
import Accelerator from './pages/Accelerator'
import Portfolio from './pages/Portfolio'


import Cohort1 from './pages/cohorts/Cohort1';
import Cohort2 from './pages/cohorts/Cohort2';
import Cohort3 from './pages/cohorts/Cohort3';
import LaunchPage from './pages/cohorts/LaunchPage';
import CurriculumPage from './pages/cohorts/CurriculumPage';

import NavBar from './components/NavBar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// import { AuthProvider, useAuth } from './context/AuthContext'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import HeroEditor from './pages/admin/HeroSlidesEditor'
import EventsEditor from './pages/admin/EventsEditor'
import HackathonsEditor from './pages/admin/HackathonsEditor'
import ApplicationsEditor from './pages/admin/ApplicationsEditor';
// import MentorsEditor from './pages/admin/MentorsEditor'
// import PortfolioEditor from './pages/admin/PortfolioEditor'
import SiteInfoEditor from './pages/admin/SiteInfoEditor'
import GalleryEditor from './pages/admin/GalleryEditor';


// inside /admin routes:

import HeroSlidesEditor from './pages/admin/HeroSlidesEditor';
import LaunchpadEditor from './pages/admin/LaunchpadEditor';
import AlumniEditor from './pages/admin/AlumniEditor';
import MentorsEditor from './pages/admin/MentorsEditor';
import PortfolioEditor from './pages/admin/PortfolioEditor';
import CurriculumEditor from './pages/admin/CurriculumEditor';



/* Public layout — wraps every public page with NavBar + Footer */
const PublicLayout = () => (
  <>
    <NavBar />
    <Outlet />
    <Footer />
  </>
)

/* Protects admin routes — redirects to login if not authenticated as admin */
import { AuthProvider, useAuth } from './context/AuthContext';
// import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Checking access...
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin-login" replace />;

  return <Outlet />;
};



function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />

        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/spacefest" element={<Spacefest />} />
            <Route path="/about" element={<About />} />
            <Route path="/apply" element={<Apply />} />
            {/* <Route path="/upload" element={<Upload />} /> */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/hackathon" element={<Hackathon />} />
            <Route path="/events" element={<Events />} />
            <Route path="/accelerator" element={<Accelerator />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/accelerator/cohort-1" element={<Cohort1 />} />
            <Route path="/accelerator/cohort-2" element={<Cohort2 />} />
            <Route path="/accelerator/cohort-3" element={<Cohort3 />} />
            <Route path="/accelerator/launch" element={<LaunchPage />} />
            <Route path="/accelerator/curriculum" element={<CurriculumPage />} />
          </Route>

          {/* ---------- Admin Login (no NavBar/Footer) ---------- */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ---------- Admin Panel (protected, own layout) ---------- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="events" element={<EventsEditor />} />
              <Route path="hackathons" element={<HackathonsEditor />} />
              <Route path="mentors" element={<MentorsEditor />} />
              <Route path="portfolio" element={<PortfolioEditor />} />
              <Route path="site-info" element={<SiteInfoEditor />} />
              <Route path="applications" element={<ApplicationsEditor />} />
              <Route path="gallery" element={<GalleryEditor />} />
              <Route path="curriculum" element={<CurriculumEditor />} />
              {/* // inside <Route path="/admin" element={<AdminLayout />}> */}
              <Route path="hero-slides" element={<HeroSlidesEditor />} />
              <Route path="launchpad" element={<LaunchpadEditor />} />
              <Route path="alumni" element={<AlumniEditor />} />
              <Route path="mentors" element={<MentorsEditor />} />
              <Route path="portfolio" element={<PortfolioEditor />} />
            </Route>
          </Route>

          {/* ---------- 404 Fallback ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
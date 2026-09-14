// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Play,
  Mail,
  Settings,
  Rocket,
  Calendar,
  Code2,
  Users,
  Trophy,
  Briefcase,
  Inbox,
  Images,
  Info,
  LogOut,
  Menu,
  BookOpen,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeCollection } from '../../services/firestore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero-slides', label: 'Hero Slides', icon: Play },
  { to: '/admin/launchpad', label: 'Launchpad', icon: Rocket },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/hackathons', label: 'Hackathons', icon: Code2 },
  { to: '/admin/alumni', label: 'Alumni', icon: Trophy },
  { to: '/admin/mentors', label: 'Mentors', icon: Users },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/admin/applications', label: 'Applications', icon: Inbox },
  { to: '/admin/application-settings', label: 'Apply Settings', icon: Settings },
  // { to: '/admin/site-info', label: 'Site Info', icon: Info },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* Live data for badges */
  const [applications, setApplications] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const unsubApps = subscribeCollection('applications', setApplications);
    const unsubSubs = subscribeCollection('subscribers', setSubscribers);
    return () => {
      unsubApps();
      unsubSubs();
    };
  }, []);

  const unreadApplications = useMemo(
    () => applications.filter((a) => (a.status || 'new') === 'new').length,
    [applications]
  );

  const subscriberCount = subscribers.length;

  const getBadge = (path) => {
    if (path === '/admin/applications' && unreadApplications > 0) {
      return {
        count: unreadApplications,
        color: 'bg-red-500 text-white',
        dot: 'bg-red-500',
      };
    }
    if (path === '/admin/newsletter' && subscriberCount > 0) {
      return {
        count: subscriberCount,
        color: 'bg-gray-900 text-white',
        dot: 'bg-gray-900',
      };
    }
    return null;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ SIDEBAR ============ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        {/* Nav — scrolls internally if too tall */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const badge = getBadge(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative flex-shrink-0">
                      <Icon className="w-4 h-4" />
                      {badge && (
                        <span
                          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ${
                            isActive ? 'ring-black' : 'ring-white'
                          } ${badge.dot}`}
                        />
                      )}
                    </div>

                    <span className="flex-1">{item.label}</span>

                    {badge && (
                      <span
                        className={`text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-white text-black' : badge.color
                        }`}
                      >
                        {badge.count > 99 ? '99+' : badge.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Sign out — always at bottom, never scrolls */}
        
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ============ MAIN — offset by sidebar width on desktop ============ */}
      <main className="lg:pl-64">
        {/* Sticky header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle sidebar"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className=" text-gray-500 ml-auto flex items-center gap-1">
            Admin <User className="w-4 h-4" />
            <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-2 cursor-pointer py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <LogOut className="w-4 h-4" /> 
          </button>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
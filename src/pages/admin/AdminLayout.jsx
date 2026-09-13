// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Play,
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
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/curriculum', label: 'Curriculum', icon: BookOpen },
  { to: '/admin/applications', label: 'Applications', icon: Inbox },
  { to: '/admin/site-info', label: 'Site Info', icon: Info },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState([]);

  /* Subscribe to applications — one listener for the whole admin session */
  useEffect(() => {
    const unsub = subscribeCollection('applications', setApplications);
    return () => unsub();
  }, []);

  /* Count applications that haven't been opened yet */
  const unreadCount = useMemo(
    () => applications.filter((a) => (a.status || 'new') === 'new').length,
    [applications]
  );

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={` inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static fixed lg:inset-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isApplications = item.to === '/admin/applications';
            const showBadge = isApplications && unreadCount > 0;

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
                      {/* Notification dot on the icon itself (mobile-friendly) */}
                      {showBadge && (
                        <span
                          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ${
                            isActive
                              ? 'bg-red-500 ring-black'
                              : 'bg-red-500 ring-white'
                          }`}
                        />
                      )}
                    </div>

                    <span className="flex-1">{item.label}</span>

                    {/* Count badge on the right */}
                    {showBadge && (
                      <span
                        className={`text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-white text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-4 ">
          <div className="text-xs ml-3 text-gray-500 truncate mb-2">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-gray-500 ml-auto">
            Admin <User className="w-4 h-4 inline-block ml-1" />
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
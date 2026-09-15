import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Play, Mail, Rocket, Calendar, Code2, Users, Trophy,
  Briefcase, Inbox, Images, Info, LogOut, Menu, BookOpen, X, User,
  ChevronDown, Building2, Star, GraduationCap, MessageSquare, Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeCollection } from '../../services/firestore';
import BackgroundLogo from '../../components/admin/BackgroundLogo';
import logoImg from '../../images/logo/superlogo.png'; // your existing logo path

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Programme',
    items: [
      { to: '/admin/cohorts', label: 'Cohorts', icon: GraduationCap },
      { to: '/admin/partners', label: 'Partners', icon: Building2 },
      { to: '/admin/facilitators', label: 'Facilitators', icon: Users },
      { to: '/admin/mentors', label: 'Mentors', icon: Users },
      { to: '/admin/curriculum', label: 'Curriculum', icon: BookOpen },
      { to: '/admin/alumni', label: 'Alumni', icon: Trophy },
      { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/hero-slides', label: 'Hero Slides', icon: Play },
      { to: '/admin/launchpad', label: 'Launchpad', icon: Rocket },
      { to: '/admin/events', label: 'Events', icon: Calendar },
      { to: '/admin/hackathons', label: 'Hackathons', icon: Code2 },
      { to: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
      { to: '/admin/gallery', label: 'Gallery', icon: Images },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { to: '/admin/applications', label: 'Applications', icon: Inbox },
      { to: '/admin/application-settings', label: 'Apply Settings', icon: Settings },
      { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/site-info', label: 'Site Info', icon: Info },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    const unsubApps = subscribeCollection('applications', setApplications);
    const unsubSubs = subscribeCollection('subscribers', setSubscribers);
    return () => { unsubApps(); unsubSubs(); };
  }, []);

  const unreadApplications = useMemo(
    () => applications.filter((a) => (a.status || 'new') === 'new').length,
    [applications]
  );
  const subscriberCount = subscribers.length;

  const getBadge = (path) => {
    if (path === '/admin/applications' && unreadApplications > 0)
      return { count: unreadApplications, color: 'bg-red-500 text-white', dot: 'bg-red-500' };
    if (path === '/admin/newsletter' && subscriberCount > 0)
      return { count: subscriberCount, color: 'bg-gray-900 text-white', dot: 'bg-gray-900' };
    return null;
  };

  const toggleGroup = (label) =>
    setCollapsed((c) => ({ ...c, [label]: !c[label] }));

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
    <BackgroundLogo
  imageSrc={logoImg}
  size={6}             // world units — bigger = larger logo
  opacity={0.08}       // 0.05 barely visible · 0.15 quite present
  speed={0.5}         // radians/sec — 0.08 = very slow (78s/rev) · 0.3 = faster
  tilt={-0.15}         // X tilt — negative = leaning back
  position={{ x: 0, y: 0, z: -2 }}  // x/y offset, z pushes back
  blending="normal"    // 'multiply' if using white-bg image
/>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {navGroups.map((group) => {
            const isCollapsed = collapsed[group.label];
            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition"
                >
                  {group.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                  />
                </button>

                {!isCollapsed && (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map((item) => {
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
                              isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className="relative flex-shrink-0">
                                <Icon className="w-4 h-4" />
                                {badge && (
                                  <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ${isActive ? 'ring-black' : 'ring-white'} ${badge.dot}`} />
                                )}
                              </div>
                              <span className="flex-1">{item.label}</span>
                              {badge && (
                                <span className={`text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-black' : badge.color}`}>
                                  {badge.count > 99 ? '99+' : badge.count}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 shrink-0 bg-white">
          <div className="text-xs text-gray-500 truncate mb-2 ml-1">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-gray-500 ml-auto flex items-center gap-1">
            Admin <User className="w-4 h-4" />
          </div>
        </header>
        <div className="p-4 lg:p-8"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;
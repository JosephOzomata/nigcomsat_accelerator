// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Rocket,
  Calendar,
  Code2,
  Users,
  Briefcase,
  Info,
  Trophy,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { subscribeCollection } from '../../services/firestore';

const cards = [
  { to: '/admin/hero-slides', label: 'Hero Slides', desc: 'Homepage carousel videos & images', icon: Play },
  { to: '/admin/launchpad', label: 'Launchpad', desc: 'Build. Launch. Scale. section', icon: Rocket },
  { to: '/admin/events', label: 'Events', desc: 'Upcoming and past events', icon: Calendar },
  { to: '/admin/applications', label: 'Applications', desc: 'Review and contact applicants', icon: Inbox },
  { to: '/admin/hackathons', label: 'Hackathons', desc: 'Current and past hackathons', icon: Code2 },
  { to: '/admin/alumni', label: 'Alumni', desc: 'Accelerator alumni', icon: Trophy },
  { to: '/admin/mentors', label: 'Mentors', desc: 'Mentor profiles by cohort', icon: Users },
  { to: '/admin/portfolio', label: 'Portfolio', desc: 'Portfolio entries', icon: Briefcase },
  { to: '/admin/site-info', label: 'Site Info', desc: 'Footer, contact, and social links', icon: Info },
];

const AdminDashboard = () => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const unsub = subscribeCollection('applications', (data) => {
      setUnread(
        data.filter((a) => (a.status || 'new') === 'new').length
      );
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage every section of the NIGCOMSAT Accelerator website.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const showBadge = c.to === '/admin/applications' && unread > 0;

          return (
            <Link
              key={c.to}
              to={c.to}
              className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              {/* Notification badge */}
              {showBadge && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white flex items-center justify-center">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition" />
              </div>

              <div className="font-semibold text-gray-900">{c.label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{c.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
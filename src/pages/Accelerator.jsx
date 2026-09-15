import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket, Users, Award, Calendar, MapPin, ArrowRight, CheckCircle2,
  Globe, UserPlus, ChevronRight, Clock, BookOpen, Sparkles,
  FileText, Mic, Quote, Target,
} from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';

/* ---------- Programmes (kept from your old file) ---------- */
const programmes = [
  {
    id: 1,
    title: 'NigComSat Accelerator Program',
    tagline: 'Your launchpad for space-tech innovation',
    description: 'A strategic initiative designed to support dynamic early-stage startups and innovators developing space-based solutions to address critical challenges in Nigeria and beyond.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
    duration: '6 months',
    cohort: 'Cohort 3.0',
    deadline: 'November 6, 2026 [Demo Day]',
    benefits: ['Expert mentorship from industry leaders', 'Capacity-building and product refinement workshops', 'Visibility, media exposure, and pitch opportunities', 'Investment readiness training', 'Live pitch practice and Demo Day', 'Networking with investors and ecosystem players'],
    focus: ['Agriculture', 'Health', 'Telecommunications', 'AI', 'Climate Change', 'Satellite & Space', 'Security', 'Logistics', 'Robotics'],
  },
  {
    id: 2,
    title: 'NigComSat Space-Tech Hackathon',
    tagline: 'Build innovative solutions with satellite technology',
    description: 'A five-day intensive program where participants identify challenges, create ideas, build prototypes, and receive mentorship using satellite technologies. The winning team advances to the NigComSat Accelerator Programme.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    duration: '5 Days — begins August 6, 2026',
    cohort: 'Regional Series',
    deadline: 'August 13, 2026 [Closing Event]',
    benefits: ['Hands-on training in satellite technology', 'Mentorship from space-tech experts', 'Opportunity to build prototypes', 'Chance to join the NigComSat Accelerator Program', 'Networking with innovators and professionals'],
    focus: ['VSAT Technology', 'Satellite Communications', 'IoT', 'Community Solutions', 'Youth Empowerment'],
  },
];

const timeline = [
  { date: 'January 6, 2024', title: 'Programme announced', description: 'NIGCOMSAT officially kicked off its Accelerator Programme, inviting space-tech startups and innovators to apply.', icon: Rocket },
  { date: 'February 22, 2024', title: 'Public launch in Abuja', description: 'The programme was formally unveiled at the Communication & Digital Economy Complex in Abuja, under the theme "Fostering Innovation in Satellite Technology".', icon: Globe },
  { date: 'February – October 2024', title: 'Cohort 1.0 in session', description: '20 startups selected from 468 applications went through a 24-week journey of mentorship, product development, and business strategy.', icon: Users },
  { date: 'October 17, 2024', title: 'Demo Day', description: '14 startups pitched to investors and stakeholders. BetaLife Health Service took first place, Innovia Labs second, and Agroxchange third.', icon: Target },
];

const journeySteps = [
  { phase: 'Application', description: 'Submit your application and pitch deck', icon: FileText },
  { phase: 'Screening', description: 'Review and selection process', icon: Users },
  { phase: 'Interview', description: 'Pitch to the selection panel', icon: Mic },
  { phase: 'Onboarding', description: 'Welcome to the accelerator program', icon: Rocket },
  { phase: 'Program', description: '12-week intensive program', icon: BookOpen },
  { phase: 'Demo Day', description: 'Present to investors and partners', icon: Sparkles },
];

const faqs = [
  { q: 'Who can apply to the accelerator?', a: 'Early-stage startups with a focus on space technology, satellite applications, or related fields. We welcome founders from all backgrounds and nationalities.' },
  { q: 'What do you look for in startups?', a: 'We look for strong teams with innovative ideas, market potential, and a clear vision. Technical expertise and domain knowledge are important but not mandatory.' },
  { q: 'What support does the program provide?', a: 'We provide seed funding, mentorship, office space, technical resources, and access to our network of investors and industry partners.' },
  { q: 'Is there equity taken?', a: 'Yes, we take a small equity stake in exchange for the funding and support provided. The exact terms vary based on the program and startup.' },
];

const Accelerator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: cohorts } = useFirestoreCollection('cohorts');

  const orderedCohorts = [...cohorts].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop")' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1.1]">
              NigComSat<br /><span className="text-white/80">Accelerator</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed">
              Empowering the next generation of space technology entrepreneurs with funding, mentorship, and global opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/apply" className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-medium">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#story" className="px-8 py-3.5 border border-white/30 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-medium text-white">
                Our Story
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {['overview', 'story', 'programs', 'cohorts', 'faq'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 ${
                activeTab === tab ? 'border-black text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}>
              {tab === 'story' ? 'Our Story' : tab}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Program</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The NigComSat Accelerator is a flagship program designed to identify, support, and scale early-stage
                  startups that are leveraging space technology to solve Africa's most pressing challenges.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We provide a comprehensive 12-week program that includes seed funding, world-class mentorship,
                  access to satellite data, and connections to a global network of investors and industry partners.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Program Highlights</h3>
                <ul className="space-y-3">
                  {['Up to ₦15M in seed funding', '12-week intensive program', 'One-on-one mentorship from industry experts', 'Access to satellite data and resources', 'Demo Day with top investors'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Journey</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {journeySteps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={index}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.phase}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STORY — merged from LaunchPage */}
        {activeTab === 'story' && (
          <div id="story" className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">Our Story</span>
                  <span className="text-sm text-gray-500">February 2024 — present</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How the Accelerator Began</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  In February 2024, NIGCOMSAT took a bold step toward fostering innovation and entrepreneurship in Nigeria's space industry by launching the NIGCOMSAT Accelerator Programme for Space-Based Startups.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The Accelerator was created as a launchpad for Nigerian startups, engineers, data scientists, and innovators eager to build space-based solutions. It was designed to move NIGCOMSAT from an engineering institution into a powerful enabler of entrepreneurship.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, the programme runs in collaboration with NASRDA, private sector experts, investors, and innovation ecosystem leaders.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 h-fit">
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-lg text-gray-800 leading-relaxed italic">
                  "Placing space technology in the hands of Nigeria's brightest innovators is a bold step towards sustainable national development. This accelerator is not only a platform for nurturing viable tech solutions but also a catalyst for redefining Nigeria's role in the global space economy."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-semibold text-gray-900">Jane Nkechi Egerton-Idehen</div>
                  <div className="text-sm text-gray-500">Managing Director & CEO, NIGCOMSAT</div>
                </div>
              </motion.div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">The Journey</h2>
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2" />
                <div className="space-y-12">
                  {timeline.map((item, i) => {
                    const Icon = item.icon;
                    const isLeft = i % 2 === 0;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8`}>
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                          <Icon className="w-3.5 h-3.5 text-black" />
                        </div>
                        <div className="hidden md:block md:w-1/2" />
                        <div className="ml-14 md:ml-0 md:w-1/2">
                          <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Calendar className="w-3.5 h-3.5" /> {item.date}
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRAMS */}
        {activeTab === 'programs' && (
          <div className="space-y-8">
            {programmes.map((program, index) => (
              <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="h-64 md:h-auto">
                    <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-500 text-sm mb-1">{program.tagline}</p>
                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-medium text-gray-900 text-sm">{program.duration}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Cohort</div>
                        <div className="font-medium text-gray-900 text-sm">{program.cohort}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center col-span-2">
                        <div className="text-xs text-gray-500">Deadline</div>
                        <div className="font-medium text-gray-900 text-sm">{program.deadline}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.benefits.map((b) => (
                          <span key={b} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* COHORTS */}
        {activeTab === 'cohorts' && (
          <div>
            {orderedCohorts.length === 0 ? (
              <p className="text-gray-500 text-sm">No cohorts published yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderedCohorts.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/accelerator/cohort-${c.slug}`}
                      className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow h-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">{c.year}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
                      {c.tagline && <p className="text-sm text-gray-500 line-clamp-2">{c.tagline}</p>}
                      {(c.applications || c.startups) && (
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                          {c.applications && <span>{c.applications} applications</span>}
                          {c.startups && <span>· {c.startups} startups</span>}
                        </div>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Space Tech Startup?</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Join the NigComSat Accelerator and get the support you need to scale your space technology venture.
          </p>
          <Link to="/apply" className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accelerator;
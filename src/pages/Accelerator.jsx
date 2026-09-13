// src/pages/AcceleratorPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Rocket,
  Target,
  Users,
  Award,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Globe,
  UserPlus,
  Star,
  ChevronRight,
  Clock,
  Layers,
  BookOpen,
  Wifi,
  Mic,
  Video,
//   Link,
  Download,
  Sparkles,
  Flame,
  Medal,
  Crown,
  Briefcase,
  Lightbulb,
  TrendingUp,
  Zap,
  Shield,
  Coffee,
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp,
  Share2,
  ExternalLink,
  Play,
  FileText,
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin as MapPinIcon,
  CalendarDays
} from 'lucide-react';

const Accelerator = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const programs = [
  {
    id: 1,
    title: "NigComSat Accelerator Program",
    tagline: "Your launchpad for space-tech innovation",
    description: "A strategic initiative designed to support dynamic early-stage startups and innovators developing space-based solutions to address critical challenges in Nigeria and beyond. The program provides expert mentorship, capacity-building workshops, and visibility to investors [citation:1].",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop",
    duration: "6 months (launched March 31 2026)",
    cohort: "Cohort 3.0",
    // status: "Applications Closed (Cohort 3.0 Launched)",
    deadline: "November 6, 2026 [Demo Day]",
    benefits: [
      "Expert mentorship from industry leaders",
      "Capacity-building and product refinement workshops",
      "Visibility, media exposure, and pitch opportunities",
      "Investment readiness training",
      "Live pitch practice and Demo Day",
      "Networking with investors and ecosystem players [citation:1]"
    ],
    focus: ["Agriculture", "Health", "Telecommunications", "Artificial Intelligence (AI)", "Climate Change", "Satellite & Space-related", "Security", "Logistics", "Robotics"],
    mentors: [
      // Mentors are selected based on expertise for each cohort [citation:1]
    ]
  },
  {
    id: 2,
    title: "NigComSat Space-Tech Hackathon",
    tagline: "Build innovative solutions with satellite technology",
    description: "A five-day intensive program where participants identify challenges, create ideas, build prototypes, and receive mentorship using satellite technologies. The winning team advances to the NigComSat Accelerator Programme to further refine and implement their project [citation:2].",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
    duration: "5 Days Begins on August 6, 2026",
    cohort: "Regional Series (North-East, North-West)",
    // status: "Completed (North-East & North-West)",
    deadline: "August 13, 2026 [Closing Event]",
    benefits: [
      "Hands-on training in satellite technology",
      "Mentorship from space-tech experts",
      "Opportunity to build prototypes",
      "Chance to join the NigComSat Accelerator Program",
      "Networking with innovators and professionals [citation:2][citation:7]"
    ],
    focus: ["VSAT Technology", "Satellite Communications", "IoT", "Community Solutions", "Youth Empowerment"],
    mentors: [
      // Mentors and panelists from each regional event [citation:4]
    ]
  }
];

  const stats = [
    { icon: Rocket, value: "25+", label: "Startups Accelerated" },
    { icon: Users, value: "150+", label: "Founders Supported" },
    { icon: Award, value: "₦200M+", label: "Funding Raised" },
    { icon: Globe, value: "12", label: "Countries Reached" }
  ];

  const timeline = [
    { phase: "Application", description: "Submit your application and pitch deck", icon: FileText },
    { phase: "Screening", description: "Review and selection process", icon: Users },
    { phase: "Interview", description: "Pitch to the selection panel", icon: Mic },
    { phase: "Onboarding", description: "Welcome to the accelerator program", icon: Rocket },
    { phase: "Program", description: "12-week intensive program", icon: BookOpen },
    { phase: "Demo Day", description: "Present to investors and partners", icon: Sparkles }
  ];

  const faqs = [
    {
      q: "Who can apply to the accelerator?",
      a: "Early-stage startups with a focus on space technology, satellite applications, or related fields. We welcome founders from all backgrounds and nationalities."
    },
    {
      q: "What do you look for in startups?",
      a: "We look for strong teams with innovative ideas, market potential, and a clear vision. Technical expertise and domain knowledge are important but not mandatory."
    },
    {
      q: "What support does the program provide?",
      a: "We provide seed funding, mentorship, office space, technical resources, and access to our network of investors and industry partners."
    },
    {
      q: "Is there equity taken?",
      a: "Yes, we take a small equity stake in exchange for the funding and support provided. The exact terms vary based on the program and startup."
    }
  ];

  const TestimonialCard = ({ quote, name, role, company, image }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
          <div className="text-sm text-gray-400">{company}</div>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">"{quote}"</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div 
          className="absolute  h-screen inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop")'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            
            <h1 className="text-4xl md:text-6xl pt-12 lg:text-7xl font-bold tracking-tight mb-4 leading-[1.1]">
              NigComSat<br />
              <span className="text-white/80">Accelerator</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed">
              Empowering the next generation of space technology entrepreneurs with funding, mentorship, and global opportunities.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/apply" className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-medium">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 overflow-hidden"
        >
          {stats.map((stat, index) => (
            <div key={index} className="p-6 text-center">
              <stat.icon className="w-6 h-6 text-gray-700 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section> */}

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {['overview', 'programs', 'faq'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition border-b-2 ${
                activeTab === tab
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* About */}
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
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Up to ₦15M in seed funding</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">12-week intensive program</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">One-on-one mentorship from industry experts</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Access to satellite data and resources</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Demo Day with top investors</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Journey</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.phase}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Alumni Say</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <TestimonialCard
                  quote="The NigComSat Accelerator transformed our startup. The mentorship and funding we received were instrumental in taking our product to market."
                  name="Oluwaseun Adebayo"
                  role="CEO & Co-founder"
                  company="SpaceSolve"
                />
                <TestimonialCard
                  quote="Being part of this program opened doors we never knew existed. We connected with investors and partners who believed in our vision."
                  name="Amina Mohammed"
                  role="CTO & Co-founder"
                  company="SatView"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="space-y-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                <div className="grid md:grid-cols-2">
                  <div className="h-64 md:h-auto">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{program.title}</h3>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
                        {program.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{program.tagline}</p>
                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-medium text-gray-900">{program.duration}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Cohort</div>
                        <div className="font-medium text-gray-900">{program.cohort}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Deadline</div>
                        <div className="font-medium text-gray-900">{program.deadline}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">Focus</div>
                        <div className="font-medium text-gray-900 text-xs">
                          {program.focus.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.benefits.map(benefit => (
                          <span key={benefit} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply to the Accelerator</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your startup name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                    <option>Space Tech Accelerator</option>
                    <option>Satellite Data Innovation Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your startup</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Describe your startup, your product, and how it uses space technology"
                  />
                </div>
                <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )} */}

        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Space Tech Startup?</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Join the NigComSat Accelerator and get the support you need to scale your space technology venture.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accelerator;
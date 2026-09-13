// src/pages/cohorts/LaunchPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Target,
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  Quote,
} from 'lucide-react';

const timeline = [
  {
    date: 'January 6, 2024',
    title: 'Programme announced',
    description:
      'NIGCOMSAT officially kicked off its Accelerator Programme, inviting space-tech startups and innovators to apply.',
    icon: Rocket,
  },
  {
    date: 'February 22, 2024',
    title: 'Public launch in Abuja',
    description:
      'The programme was formally unveiled at the Communication & Digital Economy Complex in Abuja, under the theme "Fostering Innovation in Satellite Technology".',
    icon: Globe,
  },
  {
    date: 'February – October 2024',
    title: 'Cohort 1.0 in session',
    description:
      '20 startups selected from 468 applications went through a 24-week journey of mentorship, product development, and business strategy.',
    icon: Users,
  },
  {
    date: 'October 17, 2024',
    title: 'Demo Day',
    description:
      '14 startups pitched to investors and stakeholders. BetaLife Health Service took first place, Innovia Labs second, and Agroxchange third.',
    icon: Target,
  },
];

const LaunchPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Link
              to="/accelerator"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Accelerator
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">
                Our Story
              </span>
              <span className="text-sm text-gray-500">February 2024 — present</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              How the Accelerator Began
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              In February 2024, NIGCOMSAT took a bold step toward fostering
              innovation and entrepreneurship in Nigeria's space industry by
              launching the NIGCOMSAT Accelerator Programme for Space-Based Startups.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              A national mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Accelerator was created as a launchpad for Nigerian startups,
              engineers, data scientists, and innovators eager to build
              space-based solutions. It was designed to move NIGCOMSAT from an
              engineering institution into a powerful enabler of entrepreneurship.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Under the leadership of Managing Director Jane Nkechi Egerton-Idehen,
              the programme set out to place space technology in the hands of
              Nigeria's brightest innovators — a bold step toward sustainable
              national development and a redefined role for Nigeria in the global
              space economy.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, the programme runs in collaboration with the National Space
              Research and Development Agency (NASRDA), private sector experts,
              investors, and innovation ecosystem leaders.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-8"
          >
            <Quote className="w-8 h-8 text-gray-300 mb-4" />
            <p className="text-lg text-gray-800 leading-relaxed italic">
              "Placing space technology in the hands of Nigeria's brightest
              innovators is a bold step towards sustainable national development.
              This accelerator is not only a platform for nurturing viable tech
              solutions but also a catalyst for redefining Nigeria's role in the
              global space economy."
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="font-semibold text-gray-900">
                Jane Nkechi Egerton-Idehen
              </div>
              <div className="text-sm text-gray-500">
                Managing Director & CEO, NIGCOMSAT
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900">The Journey</h2>
            <p className="text-sm text-gray-500 mt-1">
              Milestones from the first cohort to today.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 -translate-x-1/2" />

            <div className="space-y-12">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    } items-start gap-8`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center z-10">
                      <Icon className="w-3.5 h-3.5 text-black" />
                    </div>

                    <div className="hidden md:block md:w-1/2" />

                    <div className="ml-14 md:ml-0 md:w-1/2">
                      <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What's next */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Where we're going
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          The programme has now entered its third cohort and continues to scale.
          Over 5,000 startups have been supported through NIGCOMSAT's broader
          digital empowerment initiatives, and the accelerator is a permanent
          feature of Nigeria's space-tech ecosystem.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/accelerator/cohort-1"
            className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            See Cohort 1
          </Link>
          <Link
            to="/accelerator/curriculum"
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Explore the Curriculum
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LaunchPage;
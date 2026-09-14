// src/components/ApplicationsClosed.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowLeft,
  Mail,
  Bell,
  Clock,
  Users,
} from 'lucide-react';
import logo from '../images/Logo/superlogo.png';

const ApplicationsClosed = ({ settings }) => {
  const {
    closedTitle = 'Applications Are Currently Closed',
    closedSubtitle = 'Thank you for your interest in the NIGCOMSAT Accelerator Programme.',
    closedMessage = 'Applications for the current cohort have closed. Sign up for our newsletter to be notified when the next cohort opens.',
    reopenDate = '',
    closedImage = '',
    showNewsletterCta = true,
    showBackHomeCta = true,
  } = settings || {};

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl h-screen mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            

            <h1 className="text-4xl mt-20 md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.1]">
              {closedTitle}
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {closedSubtitle}
            </p>

            <img src={logo} alt='nigcomsat-image' className='w-40 h-40 mx-auto mb-8' />

            {reopenDate && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                Applications reopen in {reopenDate}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {closedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-gray-200 mb-12 max-w-4xl mx-auto"
          >
            <img
              src={closedImage}
              alt=""
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10">
            {closedMessage}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {showNewsletterCta && (
              <Link
                to="/#newsletter"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                <Bell className="w-4 h-4" />
                Get Notified
              </Link>
            )}

            {showBackHomeCta && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Info cards */}
      <section className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Clock,
                title: 'Review in progress',
                desc: 'Our team is reviewing all submitted applications.',
              },
              {
                icon: Mail,
                title: 'Stay updated',
                desc: 'Subscribe to our newsletter for programme announcements.',
              },
              {
                icon: Users,
                title: 'Next cohort',
                desc: reopenDate
                  ? `Applications reopen in ${reopenDate}.`
                  : 'Follow us to be the first to know when we open again.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationsClosed;

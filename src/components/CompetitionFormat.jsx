// src/components/CompetitionFormat.jsx
import { motion } from 'framer-motion';

const items = [
  {
    id: 1,
    subHeader: 'Science & Engineering',
    text: 'Earth Observation and Remote Sensing, Satellite Communication and Connectivity, Climate Change and Environmental Monitoring, Engineering and Robotics.',
  },
  {
    id: 2,
    subHeader: 'Policy & Education',
    text: 'Space Policy and Governance, STEM Education, Space Entrepreneurship — evaluating innovation, policy impact, and practical solutions for Nigeria and Africa.',
  },
  {
    id: 3,
    subHeader: 'Public Voting',
    text: 'Top 3 finalists advanced to an open public vote via the MiniVote platform (Mar 20–21), contributing 40% of the final combined score.',
  },
  {
    id: 4,
    subHeader: 'Expert Panel',
    text: 'An independent judging panel assessed all submissions across five equally weighted criteria, contributing 60% of each club\u2019s final score.',
  },
];

const CompetitionFormat = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12"
        >
          {/* <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
              Format
            </span>
          </div> */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Competition Format
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Clubs submitted original research conducted between 2024 and 2025,
            competing across two major tracks with equal scoring standards
            applied to both.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
            >
              <div className="text-xs font-medium text-gray-400 mb-3">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {item.subHeader}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitionFormat;
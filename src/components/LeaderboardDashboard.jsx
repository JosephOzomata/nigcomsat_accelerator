// src/components/LeaderboardDashboard.jsx
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Research Rigour & Quality of Thinking', value: 20 },
  { name: 'Evidence of Original Work', value: 20 },
  { name: 'Relevance & Impact for Nigeria / Africa', value: 20 },
  { name: 'Originality & Innovation', value: 20 },
  { name: 'Communication & Presentation', value: 20 },
];

const COLORS = ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1'];

const winners = [
  { place: 1, name: 'Astrohub — UNICAL', votes: 876 },
  { place: 2, name: 'Space Club — Univ. of Jos', votes: 773 },
  { place: 3, name: 'Space Club — FUTMINNA II', votes: 79 },
];

const LeaderboardDashboard = () => {
  return (
    <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-24">
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
              Results
            </span>
          </div> */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            How Clubs Were Scored
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Each club's final position was determined by combining expert
            evaluation and public participation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Voting results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 rounded-xl p-6 md:p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Public Voting Results
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              1,728 total votes cast
            </p>

            <div className="space-y-3">
              {winners.map((w) => (
                <div
                  key={w.place}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      w.place === 1
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {w.place}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {w.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {w.votes.toLocaleString()} votes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scoring breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 md:p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Scoring Criteria
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Five equally weighted categories, each worth 20%
            </p>

            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0 mt-1"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-gray-700 leading-tight">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardDashboard;
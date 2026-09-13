import React from 'react';

export default function CompetitionFormat() {
  const items = [
    {
      id: 1,
      subHeader: "Science & Engineering",
      text: "Earth Observation and Remote Sensing, Satellite Communication and Connectivity, Climate Change and Environmental Monitoring, Engineering and Robotics."
    },
    {
      id: 2,
      subHeader: "Policy & Education",
      text: "Space Policy and Governance, STEM Education, Space Entrepreneurship — evaluating innovation, policy impact, and practical solutions for Nigeria and Africa."
    },
    {
      id: 3,
      subHeader: "Public Voting",
      text: "Top 3 finalists advanced to an open public vote via the MiniVote platform (Mar 20-21), contributing 40% of the final combined score."
    },
    {
      id: 4,
      subHeader: "Expert Panel",
      text: "An independent judging panel assessed all submissions across five equally weighted criteria, contributing 60% of each club's final score."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 box-border">
      
      <div className="text-center mb-16 max-w-2xl px-4">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
          Competition Format
        </h1>
        <p className="text-base font-medium text-slate-600 leading-relaxed">
          Clubs submitted original research conducted between 2024 and 2025, competing across two major tracks with equal scoring standards applied to both.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-black p-8 rounded-2xl shadow-md flex flex-col gap-3 min-h-[180px] transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
          >
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {item.subHeader}
            </h3>
            
            <p className="text-sm font-medium text-white leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
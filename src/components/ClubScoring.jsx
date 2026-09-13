import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function LeaderboardDashboard() {
  
  const chartData = [
    { name: 'Research Rigour & Quality of Thinking', value: 20 },
    { name: 'Evidence of Original Work', value: 20 },
    { name: 'Relevance & Impact for Nigeria / Africa', value: 20 },
    { name: 'Originality & Innovation', value: 20 },
    { name: 'Communication & Presentation', value: 20 },
  ];

  const winners = {
    first: { name: "Astrohub — UNICAL 876 votes" },
    second: { name: "Space Club — Univ. of Jos 773 votes" },
    third: { name: "Space Club — FUTMINNA II 79 votes" }
  };

  const COLORS = [
    '#696969',
    '#8D5B28',
    '#4A0404',
    '#5f6752',
    '#ec4899'  
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 box-border">
      
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">How Clubs were Scored</h1>
        <p className="text-lg font-medium text-slate-600">
          Each club's final position was determined by combining expert evaluation and public participation.
        </p>
      </header>
      
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-start justify-between gap-12">
        
        <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[300px]">
          
          <div className="mb-4 pl-4">
            <h3 className="text-xl font-bold text-slate-700 tracking-tight">
              Public Voting Results (1,728 total votes)
            </h3>
          </div>

          <div className="border-l-4 border-slate-800 w-full pl-4 py-2 flex flex-col gap-6">
            
            <div className="flex flex-col gap-1 w-full">
              <div className="w-[100%] h-12 bg-[#D3D3D3] rounded-r-lg flex items-center justify-between px-4 shadow-md transition-all duration-300 hover:scale-[1.02]">
                <span className="text-sm font-black text-slate-900 truncate pr-2">
                  {winners.first.name}
                </span>
                <span className="text-2xl font-black text-[#FFD700] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] select-none">1</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="w-[90%] h-12 bg-[#D3D3D3] rounded-r-lg flex items-center justify-between px-4 shadow-md transition-all duration-300 hover:scale-[1.02]">
                <span className="text-sm font-black text-slate-800 truncate pr-2">
                  {winners.second.name}
                </span>
                <span className="text-2xl font-black text-[#888888] drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] select-none">2</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="w-[80%] h-12 bg-[#D3D3D3] rounded-r-lg flex items-center justify-between px-4 shadow-md transition-all duration-300 hover:scale-[1.02]">
                <span className="text-sm font-black text-slate-800 truncate pr-2">
                  {winners.third.name}
                </span>
                <span className="text-2xl font-black text-[#CD7F32] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] select-none">3</span>
              </div>
            </div>

          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center min-h-[300px] md:mt-11">
          
          <div className="w-full grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
            <div className="w-full h-[260px] flex items-center justify-start">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={110}
                    dataKey="value"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-xs font-sans font-black pointer-events-none select-none"
                        >
                          {`${value}%`}
                        </text>
                      );
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full flex flex-col gap-3.5 justify-center pl-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div 
                    className="w-4 h-4 rounded-sm flex-shrink-0 mt-0.5 shadow-sm border border-black/10" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-xs font-bold text-slate-800 font-sans leading-tight">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

function ScrollSquare({ text, number, isEven }) {
  return (
    <div className={`flex w-1/2 z-10 ${isEven ? 'self-end justify-start pl-8' : 'self-start justify-end pr-8'}`}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-[600px] h-[200px] bg-white rounded-xl flex items-center overflow-hidden box-border shadow-2xl p-4 relative"
      >
        <div className="w-[40%] h-full flex items-end justify-end relative z-10 select-none overflow-hidden">
          <span className="text-[14rem] font-black text-sky-400/40 leading-none absolute right-[25px] bottom-[-15px]">
            {number}
          </span>
        </div>
        
        <div className="w-[60%] h-full flex items-center pl-3 py-2 z-20">
          <p className="text-md font-sans font-bold text-slate-800 leading-normal text-left break-words overflow-y-auto max-h-[160px] pr-1">
            {text}
          </p>
        </div>
      </motion.div>

    </div>
  );
}

export default function App() {
  const steps = [
    { id: 1, text: "Application: Submit your idea, team, and MVP details.", number: 1 },
    { id: 2, text: "Evaluation: Panel review by VCs, and industry experts.", number: 2 },
    { id: 3, text: "Deep Dive: Product refinement + business development", number: 3 },
    { id: 4, text: "Demo Day: Pitch to investors, media, and launch", number: 4 }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-200">
      <header className="text-center py-16 px-5">
        <h1 className="text-4xl font-black text-slate-800 mb-2">What the project looks like</h1>
      </header>

      <div className="relative max-w-4xl mx-auto flex flex-col gap-24 pb-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-slate-800 -translate-x-1/2 z-0"></div>
        
        {steps.map((step, index) => (
          <ScrollSquare 
            key={step.id} 
            text={step.text} 
            number={step.number}
            isEven={index % 2 !== 0} 
          />
        ))}
      </div>
    </div>
  );
}
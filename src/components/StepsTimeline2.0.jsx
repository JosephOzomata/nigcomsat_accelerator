import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

function TimelineItem({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <div 
      ref={ref}
      className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 ${
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      <div className="absolute left-3 md:left-1/2 top-1 w-4 h-4 rounded-full bg-slate-800 border-4 border-white shadow-md -translate-x-1/2 z-10 hidden md:block"></div>
      <div className="absolute left-3 md:left-1/2 top-1 w-4 h-4 rounded-full bg-slate-800 border-4 border-white shadow-md z-10 md:hidden"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`w-full md:w-[calc(50%-2rem)] ${
          index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
        } ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-10 md:pl-0`}
      >
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-md transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-mono text-gray-400">
              {String(step.number).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-300">—</span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {step.label}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {step.title}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.description}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
            <span className="text-xs text-gray-400">Expected time:</span>
            <span className="text-xs font-medium text-gray-600">{step.time}</span>
          </div>
        </div>
      </motion.div>

      <div className="hidden md:block w-[calc(50%-2rem)]"></div>
    </div>
  );
}

export default function App() {
  const steps = [
    {
      number: 1,
      label: "Application",
      title: "Submit your application",
      description: "Share your idea, team background, and what you've built so far. We're looking for founders who are serious about solving real problems.",
      time: "~15 minutes"
    },
    {
      number: 2,
      label: "Evaluation",
      title: "Expert panel evaluation",
      description: "A group of VCs and industry experts will review your submission. They'll look at your product, market fit, and team dynamics.",
      time: "5-7 days"
    },
    {
      number: 3,
      label: "Deep Dive",
      title: "Product refinement & Business development",
      description: "Selected teams get hands-on support. We'll help you refine your product, nail your messaging, and prepare for what comes next.",
      time: "4 weeks"
    },
    {
      number: 4,
      label: "Demo Day",
      title: "The Big Day",
      description: "Present to a room full of investors, journalists, and potential partners. This is where you show the world what you've built.",
      time: "Live event"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-gray-300"></span>
            <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
              The path forward
            </span>
            <span className="w-8 h-0.5 bg-gray-300"></span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-light text-gray-800 mb-3 tracking-tight">
            From idea to <span className="font-semibold">launch</span>
          </h1>
          
          {/* <p className="text-sm text-gray-400 max-w-sm mx-auto">
            A straightforward process designed to get you where you need to be
          </p> */}
        </div>

        <div className="relative">
          <div className="absolute left-3 md:left-1/2 top-6 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <TimelineItem 
                key={step.number} 
                step={step} 
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link to="/apply" className="text-xs text-gray-400">
            Apply now and take the first step towards turning your idea into reality.
          </Link>
        </div>
      </div>
    </div>
  );
}
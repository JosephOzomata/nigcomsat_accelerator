import React from 'react';
import { motion } from 'framer-motion';
import magnifying from '../images/magnifying.png';
import equip from '../images/equip.png';
import link from '../images/link.jpg';
import support from '../images/support.jpg';

export default function BuildingToward() {
  const cards = [
    {
      id: 1,
      title: "Identify and Support",
      desc: "Identify and support nascent actors in the Nigerian space ecosystem.",
      iconUrl: magnifying
    },
    {
      id: 2,
      title: "Equip Startups",
      desc: "Equip adjacent-industry startups with tools to build on space infrastructure.",
      iconUrl: equip
    },
    {
      id: 3,
      title: "Connect Founders",
      desc: "Connect founders to world-class mentorship and funding networks.",
      iconUrl: link
    },
    {
      id: 4,
      title: "Support FMC's target",
      desc: "Contribute to the FMC's target: 100% increase in tech-enabled startups.",
      iconUrl: support
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden">

      <div className="text-center mb-12 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          What we're building toward
        </h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="flex lg:grid lg:grid-cols-4 gap-4 w-full max-w-6xl overflow-x-auto lg:overflow-x-visible pb-6 lg:pb-0 snap-x snap-mandatory scrollbar-none"
      >
        {cards.map((card) => (
          <motion.div
  key={card.id}
  variants={cardVariants}
  className="relative min-w-[260px] flex-1 lg:min-w-0 snap-center rounded-2xl p-6 min-h-[240px] border border-slate-200/60 shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md"
>
  {/* Background Image */}
  <h
    src={card.iconUrl}
    alt=""
    className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-500 hover:scale-105"
  />

  {/* Optional white overlay for readability */}
  <div className="absolute inset-0 bg-white/65" />

  {/* Content */}
  <div className="relative z-10 flex flex-col justify-end h-full gap-3">
    <h3 className="text-lg font-bold text-slate-900 leading-snug">
      {card.title}
    </h3>

    <p className="text-sm text-slate-600 leading-relaxed">
      {card.desc}
    </p>
  </div>
</motion.div>
        ))}
      </motion.div>

    </div>
  );
}
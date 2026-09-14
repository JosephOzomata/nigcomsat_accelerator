import React from 'react'
import HeroSection from '../components/HeroSection';
import AboutSpaceFest from '../components/AboutSpaceFest';
import CompetitionFormat from '../components/CompetitionFormat';
import LeaderboardDashboard from '../components/LeaderboardDashboard';
import SpotLightPage from '../components/SpotLightPage';

const Spacefest = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <AboutSpaceFest />
      <CompetitionFormat />
      <LeaderboardDashboard />
      <SpotLightPage />
    </div>
  );
};

export default Spacefest;
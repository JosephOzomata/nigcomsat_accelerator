// src/pages/Home.jsx
import React from 'react';
import SwiperCarousel from '../components/SwiperCarousel';
import StepsTimeline2 from '../components/StepsTimeline2.0';
import Launchpad from '../components/Launchpad';
import Alumini from '../components/Alumini';
import Mentors from '../components/Mentors';

const Home = () => {
  return (
    <>
      <SwiperCarousel className="w-full h-screen" />
      <StepsTimeline2 />
      <Launchpad />
      <Alumini />
      <Mentors />
    </>
  );
};

export default Home;
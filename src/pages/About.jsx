import React from 'react'
import Card from '../components/Card'
import AboutHeroSection from '../components/AboutHeroSection'
import BuildingToward from '../components/BuildingToward'
import FAQ from '../components/FAQ'

const About = () => {
  return (
    <>
       <AboutHeroSection />
       <BuildingToward />
       <Card />
       <FAQ />
    </>
  )
}

export default About

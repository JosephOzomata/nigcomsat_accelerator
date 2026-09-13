// src/pages/cohorts/Cohort2.jsx
import CohortLayout from './CohortLayout';

const Cohort2 = () => {
  const cohort = {
    title: 'Cohort 2.0',
    theme: 'Innovation in Orbit — Empowering the Next Generation of Space-Tech Entrepreneurs',
    year: '2025',
    launchDate: 'June 18, 2025',
    duration: '6 months',
    applications: '281',
    startups: '35',
    tagline:
      'A nationwide expansion of the accelerator into agriculture, health, climate, and infrastructure.',
    description:
      'The second cohort widened the programme\u2019s scope with startups working across agriculture, healthcare, climate resilience, education, robotics, logistics, and digital infrastructure. Thirty-five startups advanced to the final stage, culminating in Demo Day in October 2025. The kickoff was attended by high-ranking government and defence officials, underscoring the strategic importance of space technology to national development.',
    highlights: [
      '35 startups selected from a pool of hundreds of applicants',
      'Sector focus: agriculture, health, climate resilience, education, robotics, logistics, digital infrastructure',
      'Onboarding began June 20, 2025',
      'Programme culminates in Demo Day in October 2025',
      'Kickoff attended by Nigeria\u2019s Chief of Defence Staff, General Christopher Musa',
    ],
    winners: [
      {
        place: 1,
        name: 'Anadata — Chota AVS',
        description:
          'Recognised as the Most Outstanding Startup of Cohort 2.0. Chota Address Verification System was later showcased at Nigerian Satellite Week 2026.',
        website: '',
      },
      {
        place: 2,
        name: 'FloodShield Jigawa',
        description:
          'State-level flood prevention initiative deploying amphibious excavators and community-based programmes to desilt rivers and reduce flood risk across Jigawa State.',
        website: '',
      },
      {
        place: 3,
        name: 'Idlefarmer',
        description:
          'Agri-tech startup integrating satellite imagery and data into the future of farming across Nigeria.',
        website: '',
      },
    ],
    startupsList: [
      'Anadata',
      'FloodShield Jigawa',
      'Idlefarmer',
      'Connected Development (CODE)',
      'LearNEXO',
      'Teachly',
      'CHOTA',
      'MELON (Egusi Agribusiness)',
      'FLOEWS',
      'GeoNet',
      'Agro Guard',
      'MyFerry',
    ],
  };

  return <CohortLayout cohort={cohort} />;
};

export default Cohort2;
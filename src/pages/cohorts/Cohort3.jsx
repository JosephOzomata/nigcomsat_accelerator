// src/pages/cohorts/Cohort3.jsx
import CohortLayout from './CohortLayout';

const Cohort3 = () => {
  const cohort = {
    title: 'Cohort 3.0',
    theme: 'Innovation in Orbit — 2025/2026 Cycle',
    year: '2026',
    launchDate: 'February 27, 2026',
    // duration: '6 months',
    applications: '500+',
    startups: '',
    tagline:
      'The largest cohort yet — now open for applications.',
    description:
      'The third cohort of the NIGCOMSAT Accelerator Programme opened for applications on November 4, 2025, with a deadline of January 10, 2026. Following a two-week evaluation and selection phase, the cohort officially launched on February 27, 2026. Cohort 3.0 runs alongside the NIGCOMSAT Accelerator 3.0 \u00d7 FreePass Cohort Hackathon, which focuses on satellite-enabled early warning and alert services for climate, agriculture, and health.',
    highlights: [
      'Applications opened November 4, 2025',
      'Application deadline: January 10, 2026',
      'Evaluation: January 12 – 23, 2026',
      'Selection: January 24 – 30, 2026',
      'Programme Launch: February 27, 2026',
      'Runs concurrently with the NIGCOMSAT 3.0 \u00d7 FreePass Cohort Hackathon',
    ],
    winners: [],
    startupsList: [],
  };

  return <CohortLayout cohort={cohort} />;
};

export default Cohort3;
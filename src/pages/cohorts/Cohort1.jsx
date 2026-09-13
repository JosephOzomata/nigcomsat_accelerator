// src/pages/cohorts/Cohort1.jsx
import CohortLayout from './CohortLayout';

const Cohort1 = () => {
  const cohort = {
    title: 'Cohort 1.0',
    theme: 'Fostering Innovation in Satellite Technology',
    year: '2024',
    launchDate: 'February 22, 2024',
    duration: '24 weeks',
    applications: '468',
    startups: '20',
    tagline:
      'The inaugural cohort of the NIGCOMSAT Accelerator Programme.',
    description:
      'Twenty startups were selected from 468 applications and went through an intensive 24-week journey of mentorship, product development, and investor readiness. The programme was formally unveiled in Abuja by MD/CEO Jane Nkechi Egerton-Idehen, marking NIGCOMSAT\u2019s transition from an engineering institution into a national enabler of space-tech entrepreneurship.',
    highlights: [
      '20 startups selected from 468 applications',
      '24-week programme structured into sandbox, product, and growth phases',
      '14 startups reached the final Demo Day',
      'Run in collaboration with NASRDA and private-sector partners',
      'Demo Day held October 17, 2024, in Abuja',
    ],
    winners: [
      {
        place: 1,
        name: 'BetaLife Health Service',
        description:
          'First-place winner of the 2024 Accelerator Demo Day. BetaLife is a health-tech platform improving access to diagnostics and care across Nigeria.',
        website: 'https://betalifehealth.com/',
      },
      {
        place: 2,
        name: 'Innovia Labs',
        description:
          'Second-place winner. R&D, prototyping, and deep technology. Innovia Labs now applies AI and satellite technology to national security challenges and was recognised internationally after the programme.',
        website: 'https://www.innovialabsafrica.com',
      },
      {
        place: 3,
        name: 'Agroxchange Technology Services',
        description:
          'Third-place winner. Agri-tech platform connecting farmers to markets, finance, and inputs.',
        website: 'https://agroextech.com/',
      },
    ],
    startupsList: [
      'Kitovu Technology Company',
      'Agrify Moon Innovations',
      'eHealth 360',
      'Plotogo Digital Ltd',
      'Vora Robotics Ltd',
      'Rural Farmers Hub',
      'Ndandan.ai Research',
      'CarbonEx',
      'FroNet Wireless',
      'Dynalimb Technologies',
      'Ty-Dami Energy Resources',
    ],
  };

  return <CohortLayout cohort={cohort} />;
};

export default Cohort1;
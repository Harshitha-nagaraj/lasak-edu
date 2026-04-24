
import React from 'react';
import { Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Placements = () => {
  <SEO
  title="Placements | LasakEdu Institute Coimbatore"
  description="LasakEdu Institute offers placement support with real student success stories, company tie-ups and career guidance."
  keywords="
  placement training institute,
  student placements,
  internship with placement,
  training institute placement support,
  LasakEdu placements
  "
  url="https://lasakedu.in/placements"
/>

  // Redirect to Home instead of Blog to ensure the website opens on the landing page by default.
  return <Navigate to="/" replace />;
};

export default Placements;

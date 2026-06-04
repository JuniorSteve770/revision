// src/projects/project8/components/project8Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project8Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project8">1.A_Sup + A_Non-Sup </Link>
      <Link to="/project8/page2">2. Bagg/Boost/Stacking</Link>
      <Link to="/project8/page3">3. MLClassicalEval</Link>
      <Link to="/project8/page4">4. PMLEnsembleRL</Link>
    </nav>
  );
};

export default Project8Navbar;


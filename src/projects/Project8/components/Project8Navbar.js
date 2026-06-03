// src/projects/project8/components/project8Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project8Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project8">1. MLClassicalEval</Link>
      <Link to="/project8/page2">2. MLEnsembleRL</Link>
      <Link to="/project8/page3">3. Page 3 free</Link>
      <Link to="/project8/page4">4. Page 4 free</Link>
    </nav>
  );
};

export default Project8Navbar;


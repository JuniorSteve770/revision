// src/projects/project12/components/project12Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project12Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project12">1. Core Stack</Link>
      <Link to="/project12/page2">2. Prcing-PrTrad</Link>
      <Link to="/project12/page3">3. Finance Intro</Link>
      <Link to="/project12/page4">4. Microservices</Link>
    </nav>
  );
};

export default Project12Navbar;



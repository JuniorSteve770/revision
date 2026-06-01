// src/projects/project6/components/project6Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project6Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project6">1. Core Stack</Link>
      <Link to="/project6/page2">2. Prcing-PrTrad</Link>
      <Link to="/project6/page3">3. Finance Intro</Link>
      <Link to="/project6/page4">4. Microservices</Link>
      <Link to="/project6/page5">5. async ≠ parallèl C#</Link>
    </nav>
  );
};

export default Project6Navbar;


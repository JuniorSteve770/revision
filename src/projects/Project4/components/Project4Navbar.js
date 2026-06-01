// src/projects/project4/components/project4Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project4Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project4">1. GC & Debug</Link>
      <Link to="/project4/page2">2. Solid/OOP</Link>
      <Link to="/project4/page3">3. Finance Intro</Link>
      <Link to="/project4/page4">4. POO/SOLID/ACID</Link>
      <Link to="/project4/page5">5. Arch & OMS</Link>
      <Link to="/project4/page5_1">5.1 OMS Low_Freq</Link>
      <Link to="/project4/page6">6. C# Concurrence</Link>
      <Link to="/project4/page7">7. C# Tests</Link>
    </nav>
  );
};

export default Project4Navbar;


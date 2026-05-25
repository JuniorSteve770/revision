// src/projects/Project3/components/Project3Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project3Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project3">1. GC & Debug</Link>
      <Link to="/project3/page2">2. Solid/OOP</Link>
      <Link to="/project3/page3">3. Finance Intro</Link>
      <Link to="/project3/page4">4. POO/SOLID/ACID</Link>
      <Link to="/project3/page5">5. Arch & OMS</Link>
      <Link to="/project3/page6">6. C# Concurrence</Link>
      <Link to="/project3/page7">7. C# Tests</Link>
    </nav>
  );
};

export default Project3Navbar;
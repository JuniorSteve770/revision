// src/projects/project11/components/project11Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project11Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project11">1. Page 1</Link>
      <Link to="/project11/page2">2. Page 2</Link>
      <Link to="/project11/page3">3.  choix archi</Link>
      <Link to="/project11/page4">4. FastAPITestx</Link>
      <Link to="/project11/page5">5. Page 5</Link>
      <Link to="/project11/page6">6. Page 6</Link>
      <Link to="/project11/page7">7. Page 7</Link>
      <Link to="/project11/page8">8. Page 8</Link>
    </nav>
  );
};

export default Project11Navbar;


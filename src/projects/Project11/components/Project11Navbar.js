// src/projects/project11/components/project11Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project11Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project11">1. Page 1</Link>
      <Link to="/project11/page2">2. Page 2</Link>
      <Link to="/project11/page3">3. Page 3</Link>
      <Link to="/project11/page4">4. Page 4</Link>
    </nav>
  );
};

export default Project11Navbar;


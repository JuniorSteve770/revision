// src/projects/project9/components/project9Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project9Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project9">1. Page 1</Link>
      <Link to="/project9/page2">2. Page 2</Link>
      <Link to="/project9/page3">3. Page 3</Link>
      <Link to="/project9/page4">4. Page 4</Link>
    </nav>
  );
};

export default Project9Navbar;


// src/projects/project7/components/project7Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project7Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project7">1. SQL</Link>
      <Link to="/project7/page1_1">1.1. SQL</Link>
      <Link to="/project7/page2">2. AWS</Link>
      <Link to="/project7/page2_2">2.2 AWS exo</Link>
      <Link to="/project7/page3">3. Aws + ai</Link>
      <Link to="/project7/page4">4. Aws ++ </Link>
    </nav>
  );
};

export default Project7Navbar;


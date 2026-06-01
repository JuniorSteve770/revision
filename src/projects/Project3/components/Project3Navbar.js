// src/projects/project3/components/project3Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project3Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project3" style={{ margin: '0 10px' }}>rep0</Link>
      <Link to="/project3/page2" style={{ margin: '0 10px' }}>Page 2</Link>
      <Link to="/project3/page3" style={{ margin: '0 10px' }}>Page 03</Link>
      <Link to="/project3/page4" style={{ margin: '0 10px' }}>Page 04</Link>
      
    </nav>
  );
};

export default Project3Navbar;


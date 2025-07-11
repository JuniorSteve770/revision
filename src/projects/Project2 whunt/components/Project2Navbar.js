// src/projects/Project2/components/Project2Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project2Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project2" style={{ margin: '0 10px' }}>rep0</Link>
      <Link to="/project2/page2" style={{ margin: '0 10px' }}>Page 2</Link>
      <Link to="/project2/page3" style={{ margin: '0 10px' }}>Page 03</Link>
      
    </nav>
  );
};

export default Project2Navbar;
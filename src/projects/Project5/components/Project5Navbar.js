// src/projects/project5/components/project5Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project5Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project5" style={{ margin: '0 10px' }}>Mousashi</Link>
      <Link to="/project5/page2" style={{ margin: '0 10px' }}>Charisma</Link>
      <Link to="/project5/page3" style={{ margin: '0 10px' }}>Page 3</Link>
      <Link to="/project5/page4" style={{ margin: '0 10px' }}>Page 4</Link>
      <Link to="/project5/page5" style={{ margin: '0 10px' }}>Page 5</Link>
      <Link to="/project5/page6" style={{ margin: '0 10px' }}>Page 6</Link>
      <Link to="/project5/page7" style={{ margin: '0 10px' }}>Page 7</Link>
      <Link to="/project5/page8" style={{ margin: '0 10px' }}>Page 8</Link>
    </nav>
  );
};

export default Project5Navbar;


// src/projects/Project4/components/Project4Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project4Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project4" style={{ margin: '0 10px' }}>Mousashi</Link>
      <Link to="/project4/page2" style={{ margin: '0 10px' }}>Charisma</Link>
      <Link to="/project4/page3" style={{ margin: '0 10px' }}>Page 3</Link>
      <Link to="/project4/page4" style={{ margin: '0 10px' }}>Page 4</Link>
      <Link to="/project4/page5" style={{ margin: '0 10px' }}>Page 5</Link>
      <Link to="/project4/page6" style={{ margin: '0 10px' }}>Page 6</Link>
      <Link to="/project4/page7" style={{ margin: '0 10px' }}>Page 7</Link>
      <Link to="/project4/page8" style={{ margin: '0 10px' }}>Page 8</Link>
    </nav>
  );
};

export default Project4Navbar;
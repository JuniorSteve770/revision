// src/projects/Project2/components/Project2Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project3Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project3" style={{ margin: '0 10px' }}>GC_Debug</Link>
      <Link to="/project3/page2" style={{ margin: '0 10px' }}>Solid/OOP</Link>
      <Link to="/project3/page3" style={{ margin: '0 10px' }}>Eqty,Swap,FxInc</Link>
    </nav>
  );
};

export default Project3Navbar;
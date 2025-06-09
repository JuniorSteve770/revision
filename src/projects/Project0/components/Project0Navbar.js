// src/projects/Project1/components/Project1Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./Project0Navbar.css";

const Project0Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project0" style={{ margin: '0 10px' }}>Options</Link>
      <Link to="/project0/page2" style={{ margin: '0 10px' }}>Swap</Link>
      <Link to="/project0/page3" style={{ margin: '0 10px' }}>Futur/Foward</Link>
      <Link to="/project0/page4" style={{ margin: '0 10px' }}>PS</Link>
      <Link to="/project0/page5" style={{ margin: '0 10px' }}>Oblig</Link>
      <Link to="/project0/page6" style={{ margin: '0 10px' }}>Eqty/Action</Link>
      <Link to="/project0/page7" style={{ margin: '0 10px' }}>Eqty-FxInc</Link>
      
    </nav>
  );
};

export default Project0Navbar;
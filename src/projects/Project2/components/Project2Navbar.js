// src/projects/project2/components/project2Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./Project2Navbar.css";

const Project2Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project2" style={{ margin: '0 10px' }}>BA-Eqty</Link>
      <Link to="/project2/page2" style={{ margin: '0 10px' }}>Dsin Patern</Link>
    </nav>
  );
};

export default Project2Navbar;


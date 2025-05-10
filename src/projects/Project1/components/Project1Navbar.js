// src/projects/Project1/components/Project1Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./Project1Navbar.css";

const Project1Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Main</Link>
      <Link to="/project1" style={{ margin: '0 10px' }}>BA-Eqty</Link>
      <Link to="/project1/page2" style={{ margin: '0 10px' }}>Dsin Patern</Link>
    </nav>
  );
};

export default Project1Navbar;
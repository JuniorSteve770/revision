// src/projects/project10/components/project10Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project10Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project10">1. Solid</Link>
      <Link to="/project10/page2">2. 2</Link>
      <Link to="/project10/page3">3. Refactor</Link>
      <Link to="/project10/page4">4. OOP</Link>
      <Link to="/project10/page5">5. DataClass</Link>
      <Link to="/project10/page6">6. attrs, Pydantic et dataclass</Link>
      <Link to="/project10/page7">7. SQLAlchemy</Link>



    </nav>
  );
};

export default Project10Navbar;


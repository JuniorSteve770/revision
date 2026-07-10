// src/projects/project9/components/project9Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Project9Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', fontWeight: 'bold' }}>🏡 Main</Link>
      <Link to="/project9">1.Fix Soap Rest Protcol </Link>
      <Link to="/project9/page2">2. Thrd Hash List</Link>
      <Link to="/project9/page3">3. Perf C#</Link>
      <Link to="/project9/page3_01">3.1 Perf2</Link>
      <Link to="/project9/page3_02">3.2 Perf</Link>
      <Link to="/project9/page3_03">3.Perf .NetCore</Link>
      <Link to="/project9/page4">4. Ent*y Frmwk 6</Link>
      <Link to="/project9/page5">5. MicroSvice</Link>
      <Link to="/project9/page6">6. C#Advanced</Link>
      <Link to="/project9/page7">7. SQLServer</Link>
    </nav>
  );
};

export default Project9Navbar;


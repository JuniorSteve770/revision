// src/projects/Project4/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project4Navbar from './components/Project4Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page5_1 from './pages/Page5_1';
import Page6 from './pages/Page6';
import Page7 from './pages/Page7';

const Project4 = () => {
  return (
    <div>
      <Project4Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
        <Route path="/page5_1" element={<Page5_1 />} />
        <Route path="/page6" element={<Page6 />} />
        <Route path="/page7" element={<Page7 />} />
      </Routes>
    </div>
  );
};

export default Project4;


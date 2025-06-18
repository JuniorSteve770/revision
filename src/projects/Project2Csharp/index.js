// src/projects/Project2/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project2Navbar from './components/Project2Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';

const Project1 = () => {
  return (
    <div>
      <Project2Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
      </Routes>
    </div>
  );
};

export default Project1;
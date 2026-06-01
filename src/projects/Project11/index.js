// src/projects/Project11/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project11Navbar from './components/Project11Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';


const Project11 = () => {
  return (
    <div>
      <Project11Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
       
      </Routes>
    </div>
  );
};

export default Project11;


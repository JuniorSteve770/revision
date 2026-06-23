// src/projects/Project12/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project12Navbar from './components/Project12Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';


const Project12 = () => {
  return (
    <div>
      <Project12Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
        <Route path="/page6" element={<Page6 />} />
       
      </Routes>
    </div>
  );
};

export default Project12;



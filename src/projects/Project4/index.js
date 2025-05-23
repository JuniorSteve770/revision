// src/projects/Project2/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project4Navbar from './components/Project4Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';


const Project1 = () => {
  return (
    <div>
      <Project4Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />

      </Routes>
    </div>
  );
};

export default Project1;
// src/projects/Project1/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project1Navbar from './components/Project1Navbar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';

const Project1 = () => {
  return (
    <div>
      <Project1Navbar />
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </div>
  );
};

export default Project1;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Project1 from './projects/Project1';
import Project2 from './projects/Project2';
import Project3 from './projects/Project3';

const AppRoutes = () => {
  return (
       <Router basename="/revision">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project1/*" element={<Project1 />} />
        <Route path="/project2/*" element={<Project2 />} />
         <Route path="/project3/*" element={<Project3 />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
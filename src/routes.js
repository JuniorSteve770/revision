import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Project1 from './projects/Project1';
import Project2 from './projects/Project2';
import Project3 from './projects/Project3';
import Project4 from './projects/Project4';
import Project5 from './projects/Project5';
import Project6 from './projects/Project6';
import Project7 from './projects/Project7';
import Project8 from './projects/Project8';
import Project9 from './projects/Project9';
import Project10 from './projects/Project10';
import Project11 from './projects/Project11';
import Project12 from './projects/Project12';
import Project13 from './projects/Project13';
import Project14 from './projects/Project14';

const AppRoutes = () => {
  return (
    <Router basename="/revision">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project1/*" element={<Project1 />} />
        <Route path="/project2/*" element={<Project2 />} />
        <Route path="/project3/*" element={<Project3 />} />
        <Route path="/project4/*" element={<Project4 />} />
        <Route path="/project5/*" element={<Project5 />} />
        <Route path="/project6/*" element={<Project6 />} />
        <Route path="/project7/*" element={<Project7 />} />
        <Route path="/project8/*" element={<Project8 />} />
        <Route path="/project9/*" element={<Project9 />} />
        <Route path="/project10/*" element={<Project10 />} />
        <Route path="/project11/*" element={<Project11 />} />
        <Route path="/project12/*" element={<Project12 />} />
        <Route path="/project13/*" element={<Project13 />} />
        <Route path="/project14/*" element={<Project14 />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
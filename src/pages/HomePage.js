// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Importation du fichier CSS externe

const HomePage = () => {
  return (
    <div className="home-page">
      <h1 className="home-page-title">Page de Révisions</h1>

      <div className="home-page-buttons">
          {/* Bouton Projet 0 */}
        <Link to="/project0">
          <button className="home-page-button" id="project0-button">
            Ecole
          </button>
        </Link>

        {/* Bouton Projet 1 */}
        <Link to="/project1">
          <button className="home-page-button" id="project1-button">
            P1:Ent1/BaC#
          </button>
        </Link>

        {/* Bouton Projet 2 */}
        <Link to="/project2">
          <button className="home-page-button" id="project2-button">
          P2:Stage
          </button>
        </Link>

        {/* Bouton Projet 3 */}
        <Link to="/project3">
          <button className="home-page-button" id="project3-button">
          Solid/Swp/Debug
          </button>
        </Link>

        {/* Bouton Projet 4 */}
        <Link to="/project4">
          <button className="home-page-button" id="project4-button">
            Projet 4
          </button>
        </Link>
        {/* Bouton Projet 4 */}
        <Link to="/project4">
          <button className="home-page-button" id="project4-button">
            Projet 5
          </button>
        </Link>
        
      </div>
    </div>
  );
};

export default HomePage;
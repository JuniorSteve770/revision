// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Importation du fichier CSS externe

const HomePage = () => {
  return (
    <div className="home-page">
      <h1 className="home-page-title">Page de Révisions</h1>

      <div className="home-page-buttons">
        {/* Bouton Projet 1 */}
        <Link to="/project1">
          <button className="home-page-button" id="project1-button">
            1. Ecole
          </button>
        </Link>

        {/* Bouton Projet 2 */}
        <Link to="/project2">
          <button className="home-page-button" id="project2-button">
            2. AMF
          </button>
        </Link>

        {/* Bouton Projet 3 */}
        <Link to="/project3">
          <button className="home-page-button" id="project3-button">
            3. Stage
          </button>
        </Link>

        {/* Bouton Projet 4 */}
        <Link to="/project4">
          <button className="home-page-button" id="project4-button">
            4. Swp/Debug/Design/solid
          </button>
        </Link>

        {/* Bouton Projet 5 */}
        <Link to="/project5">
          <button className="home-page-button" id="project5-button">
            5. fer Ami
          </button>
        </Link>

        {/* Bouton Projet 6 */}
        <Link to="/project6">
          <button className="home-page-button" id="project6-button">
            6.Backen C#/OOP
          </button>
        </Link>

        {/* Bouton Projet 7 */}
        <Link to="/project7">
          <button className="home-page-button" id="project7-button">
            7. SQL & Cloud & CICD
          </button>
        </Link>

        {/* Bouton Projet 8 */}
        <Link to="/project8">
          <button className="home-page-button" id="project8-button">
            8. ML/sup!/Ensble
          </button>
        </Link>

        {/* Bouton Projet 9 */}
        <Link to="/project9">
          <button className="home-page-button" id="project9-button">
            9. Projet 9
          </button>
        </Link>

        {/* Bouton Projet 10 */}
        <Link to="/project10">
          <button className="home-page-button" id="project10-button">
            10. Projet 10 ABC
          </button>
        </Link>

        {/* Bouton Projet 11 */}
        <Link to="/project11">
          <button className="home-page-button" id="project11-button">
            11. Projet 11
          </button>
        </Link>

        {/* Bouton Projet 12 */}
        <Link to="/project12">
          <button className="home-page-button" id="project12-button">
            12. Projet 12
          </button>
        </Link>

        {/* Bouton Projet 13 */}
        <Link to="/project13">
          <button className="home-page-button" id="project13-button">
            13. Projet 13
          </button>
        </Link>

        {/* Bouton Projet 14 */}
        <Link to="/project14">
          <button className="home-page-button" id="project14-button">
            14. Projet 14
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
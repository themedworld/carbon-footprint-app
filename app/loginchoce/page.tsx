'use client';
import { useState, useEffect } from 'react';
import Header from './../components/headerBeforogin';
import './loginchoce.css';

export default function LoginChoice() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`login-choice-page ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="login-choice-container">
        <div className="login-choice-content">
          {/* En-tête */}
          <div className="login-header">
            <h1 className="login-title">
              Bienvenue sur <span className="brand-highlight">CarbonTrack</span>
            </h1>
            <p className="login-subtitle">
              Choisissez votre profil pour accéder à votre espace
            </p>
          </div>

          {/* Cartes de choix */}
          <div className="choice-cards">
            {/* Carte Agriculteur */}
            <div 
              className={`choice-card agriculteur-card ${hoveredCard === 'agriculteur' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('agriculteur')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.location.href = '/loginAgri'}
            >
              <div className="card-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">Agriculteur</h3>
                <p className="card-description">
                  Accédez à votre espace dédié pour suivre votre empreinte carbone, 
                  gérer vos pratiques agricoles et optimiser votre impact environnemental.
                </p>
                <ul className="card-features">
                  <li>📊 Suivi des émissions CO₂</li>
                  <li>🌱 Analyse des pratiques culturales</li>
                  <li>📈 Tableaux de bord personnalisés</li>
                </ul>
              </div>

              <div className="card-action">
                <button className="choice-btn agriculteur-btn">
                  Se connecter
                  <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div className="card-decoration agriculteur-decoration"></div>
            </div>

            {/* Carte Entreprise */}
            <div 
              className={`choice-card company-card ${hoveredCard === 'company' ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard('company')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.location.href = '/login'}
            >
              <div className="card-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div className="card-content">
                <h3 className="card-title">Entreprise</h3>
                <p className="card-description">
                  Gérez votre chaîne d'approvisionnement durable, suivez l'impact carbone 
                  de vos fournisseurs et valorisez vos engagements RSE.
                </p>
                <ul className="card-features">
                  <li>🏭 Gestion de la supply chain</li>
                  <li>📊 Reporting RSE automatisé</li>
                  <li>🤝 Collaboration avec les agriculteurs</li>
                </ul>
              </div>

              <div className="card-action">
                <button className="choice-btn company-btn">
                  Se connecter
                  <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div className="card-decoration company-decoration"></div>
            </div>
          </div>

          {/* Section informative */}
          <div className="info-section">
            <div className="info-content">
              <h3 className="info-title">Une plateforme unifiée pour l'agriculture durable</h3>
              <p className="info-text">
                CarbonTrack connecte les agriculteurs et les entreprises dans une démarche 
                commune de réduction de l'empreinte carbone et de promotion des pratiques durables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
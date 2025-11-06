// app/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import './RegisterPage.css';
import Header from './../components/headerBeforogin';

export default function RegisterPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark-mode", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  if (!mounted) {
    return (
      <div className="loading-container">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="loading-content">
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  const userTypes = [
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      description: 'Entreprise souhaitant compenser son empreinte carbone',
      badge: 'Entreprise',
      features: [
        'Compensez votre empreinte carbone',
        'Soutenez l\'agriculture durable',
        'Valorisez votre engagement RSE',
        'Bénéficiez de certificats vérifiés'
      ],
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6, #6366F1)',
      link: '/registerentreprise'
    },
    {
      id: 'agriculteur',
      title: 'Agriculteur',
      description: 'Producteur agricole avec des pratiques durables',
      badge: 'Producteur',
      features: [
        'Valorisez vos crédits carbone',
        'Générez des revenus supplémentaires',
        'Certifiez vos pratiques écologiques',
        'Rejoignez un réseau d\'agriculteurs'
      ],
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      link: '/registeragriculteur'
    }
  ];

  return (
    <div className="register-page">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <div className="register-container">
        {/* Header Section */}
        <div className="register-header">
          <div className="header-content">
            <div className="title-wrapper">
              <div className="accent-bar"></div>
              <h1 className="page-title">
                Rejoignez <span className="brand-name">Fle7etna</span>
              </h1>
            </div>
            <p className="page-subtitle">
              Choisissez votre rôle dans notre écosystème durable et participez à la 
              <span className="highlight-text"> transition écologique</span>
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {userTypes.map((userType) => (
            <div
              key={userType.id}
              className={`card ${hoveredCard === userType.id ? 'card-hovered' : ''} ${
                hoveredCard && hoveredCard !== userType.id ? 'card-blurred' : ''
              }`}
              onMouseEnter={() => setHoveredCard(userType.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ '--accent-color': userType.color } as React.CSSProperties}
            >
              {/* Card Background */}
              <div className="card-bg" style={{ background: userType.gradient }}></div>
              
              <div className="card-content">
                {/* Card Header */}
                <div className="card-header">
                  <div className="badge-container">
                    <span className="profile-badge">{userType.badge}</span>
                  </div>
                  
                  <div className="title-section">
                    <h2 className="card-title">{userType.title}</h2>
                    <div className="title-underline"></div>
                  </div>
                  
                  <p className="card-description">{userType.description}</p>
                </div>

                {/* Features List */}
                <ul className="features-list">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <div className="feature-icon"></div>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="card-actions">
                  <a 
                    href={userType.link} 
                    className="card-button"
                    style={{ backgroundColor: userType.color }}
                  >
                    <span className="button-text">Commencer l'aventure</span>
                    <div className="button-arrow">→</div>
                  </a>
                </div>
              </div>

              {/* Hover Effects */}
              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="footer-cta">
          <div className="cta-container">
            <p className="cta-text">
              Déjà membre de notre communauté durable ?
            </p>
            <a href="/login" className="login-link">
              <span>Accédez à votre espace</span>
              <div className="link-arrow">→</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
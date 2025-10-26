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




  const userTypes = [
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      description: 'Entreprise souhaitant compenser son empreinte carbone',
      icon: '🏢',
      features: [
        'Compensez votre empreinte carbone',
        'Soutenez l\'agriculture durable',
        'Valorisez votre engagement RSE',
        'Bénéficiez de certificats vérifiés'
      ],
      color: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600',
      link: '/registerentreprise'
    },
    {
      id: 'agriculteur',
      title: 'Agriculteur',
      description: 'Producteur agricole avec des pratiques durables',
      icon: '👩‍🌾',
      features: [
        'Valorisez vos crédits carbone',
        'Générez des revenus supplémentaires',
        'Certifiez vos pratiques écologiques',
        'Rejoignez un réseau d\'agriculteurs'
      ],
      color: '#10B981',
      gradient: 'from-green-500 to-green-600',
      link: '/registeragriculteur'
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <br />
      <br /><br /><br />
      <div className="register-page">
        <div className="register-container">
          {/* Header */}
          <div className="register-header">
            <div className="header-content">
              <h1 className="page-title">Choisissez votre profil</h1>
              <p className="page-subtitle">
                Rejoignez notre plateforme et participez à la transition écologique
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            {userTypes.map((userType) => (
              <div
                key={userType.id}
                className={`card ${hoveredCard === userType.id ? 'card-hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(userType.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--accent-color': userType.color } as React.CSSProperties}
              >
                <div className="card-inner">
                  {/* Card Header */}
                  <div className="card-header">
                    <div className="icon-wrapper">
                      <span className="icon">{userType.icon}</span>
                    </div>
                    <h2 className="card-title">{userType.title}</h2>
                    <p className="card-description">{userType.description}</p>
                  </div>

                  {/* Features List */}
                  <ul className="features-list">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a href={userType.link} className="card-button">
                    <span>S inscrire en tant que {userType.title.toLowerCase()}</span>
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>

                  {/* Hover Effects */}
                  <div className="card-hover-effect"></div>
                  <div className="card-glow-effect"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
<br /><br /><br />

          <div className="footer-cta">
            <p className="cta-text">
              Déjà un compte ?{' '}
              <a href="/login" className="login-link">Connectez-vous</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
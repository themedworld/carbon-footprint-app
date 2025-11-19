'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './styles/headeragri.css';

interface AgriculteurHeaderProps {
  agriculteur: any;
  onLogout: () => void;
}

export default function AgriculteurHeader({ agriculteur, onLogout }: AgriculteurHeaderProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Vérifier le thème au chargement
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleNavigation = (path: string) => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    router.push(path);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    setShowMobileMenu(false);
    onLogout();
  };

  const menuItems = [
    { path: '/agri-profile', icon: '👤', label: 'Profil' },
    { path: '/CalculeCarbonneAagri', icon: '📊', label: 'Calcul carbone' },
    { path: '/agri-informations', icon: 'ℹ️', label: 'Informations' },
    { path: '/notifications', icon: '🔔', label: 'Notifications' },
    { path: '/messages', icon: '💬', label: 'Messages' },
  ];

  return (
    <header className={`agri-header ${darkMode ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Logo/Nom de l'application */}
        <div 
          className="logo-container"
          onClick={() => handleNavigation('/agri-dashboard')}
        >
          <div className="logo-circle">
            <span className="logo-emoji">🌾</span>
          </div>
          <h1 className="logo-text">
            AgroCarbon
          </h1>
        </div>

        <div className="header-actions">
          {/* Navigation PC */}
          <nav className="pc-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="nav-item"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bouton Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="dark-mode-btn"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Menu utilisateur pour PC */}
          <div className="user-menu-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="user-menu-btn"
            >
              <div className="user-avatar">
                <span className="user-initial">
                  {agriculteur?.firstName?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="user-name">
                {agriculteur?.firstName || 'Agriculteur'}
              </span>
              <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu pour PC */}
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">
                    {agriculteur?.firstName} {agriculteur?.lastName}
                  </p>
                  <p className="dropdown-user-email">
                    {agriculteur?.email}
                  </p>
                </div>

                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="dropdown-item"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="dropdown-divider"></div>

                <button
                  onClick={onLogout}
                  className="dropdown-item logout-item"
                >
                  <span>🚪</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>

          {/* Menu hamburger pour mobile */}
          <button
            className={`mobile-menu-btn ${showMobileMenu ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu mobile"
          >
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
            <span className="mobile-menu-line"></span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`mobile-menu ${showMobileMenu ? 'open' : ''}`}>
        <div className="mobile-user-info">
          <p className="mobile-user-name">
            {agriculteur?.firstName} {agriculteur?.lastName}
          </p>
          <p className="mobile-user-email">
            {agriculteur?.email}
          </p>
        </div>

        <nav className="mobile-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="mobile-nav-item"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="mobile-nav-item logout-item"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* Overlay pour fermer les menus en cliquant ailleurs */}
      {(showDropdown || showMobileMenu) && (
        <div 
          className="dropdown-overlay" 
          onClick={() => {
            setShowDropdown(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </header>
  );
}
// app/components/Header.tsx
'use client';
import { useState, useEffect, ReactNode } from 'react';
import './styles//headerBeforlogin.css';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  children?: ReactNode;
}

export default function Header({ darkMode, toggleDarkMode, children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''} ${darkMode ? 'dark' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          {/* Logo Fle7etna */}
          <div className="logo">
            <div className="logo-icon">
              <svg className="fleur-logo" viewBox="0 0 100 100" fill="none">
                {/* Cœur de la fleur */}
                <circle cx="50" cy="50" r="12" className="fleur-coeur" />
                
                {/* Pétales - Trèfle à 4 feuilles */}
                <ellipse cx="35" cy="35" rx="15" ry="20" className="fleur-petale" transform="rotate(-45 35 35)" />
                <ellipse cx="65" cy="35" rx="15" ry="20" className="fleur-petale" transform="rotate(45 65 35)" />
                <ellipse cx="35" cy="65" rx="15" ry="20" className="fleur-petale" transform="rotate(45 35 65)" />
                <ellipse cx="65" cy="65" rx="15" ry="20" className="fleur-petale" transform="rotate(-45 65 65)" />
                
                {/* Tige */}
                <rect x="48" y="70" width="4" height="20" className="fleur-tige" />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Fle7etna</span>
              <span className="logo-subtitle">Eco Carbonne</span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="desktop-nav">
            {children}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Dark Mode Toggle avec texte */}
            <button
              onClick={toggleDarkMode}
              className="theme-toggle-text"
              aria-label={darkMode ? "Mode clair" : "Mode sombre"}
            >
              <span className="theme-text">{darkMode ? '☀️' : '🌙'}</span>
              
            </button>

            {/* Auth Buttons Desktop */}
            <div className="auth-buttons">
              <a href="/loginchoce" className="login-btn">
                Connexion
              </a>
              <a href="/register" className="register-btn">
                S'inscrire
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <div className="hamburger">
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            {children}
            <div className="mobile-theme-toggle">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsMenuOpen(false);
                }}
                className="theme-toggle-mobile"
              >
                <span>{darkMode ? '☀️' : '🌙'}</span>
                <span>Mode {darkMode ? 'Clair' : 'Sombre'}</span>
              </button>
            </div>
            <div className="mobile-auth-buttons">
              <a href="/loginchoce" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
                Connexion
              </a>
              <a href="/register" className="mobile-register-btn" onClick={() => setIsMenuOpen(false)}>
                S'inscrire
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
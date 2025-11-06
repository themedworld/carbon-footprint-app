// app/components/Header.tsx
'use client';
import { useState, useEffect, ReactNode } from 'react';
import './Header.css';

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
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <span className="clover-icon">🍀</span>
            </div>
            <div className="logo-text">
              <span className="logo-title">Fle7etna</span>
              <span className="logo-subtitle">Eco Carbonne</span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="desktop-nav">
            <a href="#features" className="nav-link">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="nav-link">
              Comment ça marche
            </a>
            <a href="#testimonials" className="nav-link">
              Témoignages
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label={darkMode ? "Mode clair" : "Mode sombre"}
            >
              {darkMode ? (
                <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="theme-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth Buttons Desktop */}
            <div className="auth-buttons">
              <a href="/login" className="login-btn">
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

        {/* Children Content */}
        {children && (
          <div className="header-children">
            {children}
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="#features" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Comment ça marche
            </a>
            <a href="#testimonials" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Témoignages
            </a>
            <a href="#contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
            <div className="mobile-auth-buttons">
              <a href="/login" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
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
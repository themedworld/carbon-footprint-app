// app/login/page.tsx
'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './../components/headerBeforogin';
import './LoginPage.css';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async (data: LoginFormData) => {
    // Simulation d'authentification
    console.log('Données de connexion:', data);
    
    // Ici vous enverriez les données à votre API d'authentification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirection ou message de succès
    alert('Connexion réussie ! Redirection...');
    // router.push('/dashboard');
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
    <div className={`login-page ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <br /><br /><br /><br />
      <div className="login-container">
        <div className="login-wrapper">
          {/* Carte de connexion */}
          <div className="login-card">
            {/* En-tête */}
            <div className="login-header">
              <div className="logo">
                <div className="logo-icon">🌱</div>
                <div className="logo-text">
                  <h1>CarbonTrack</h1>
                  <span>CO₂ Agricole</span>
                </div>
              </div>
              <h2 className="login-title">Connexion à votre compte</h2>
              <p className="login-subtitle">
                Accédez à votre tableau de bord et gérez vos crédits carbone
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Adresse email <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="votre@email.com"
                    {...register("email", {
                      required: "L'email est requis",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse email invalide"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mot de passe <span className="required-star">*</span>
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 8,
                        message: "Le mot de passe doit contenir au moins 8 caractères"
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Se souvenir de moi
                </label>
                
                <Link href="/forgot-password" className="forgot-password">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`login-button ${isSubmitting ? 'loading' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Lien d'inscription */}
            <div className="login-footer">
              <p>
                Pas encore de compte ?{' '}
                <Link href="/register" className="register-link">
                  S'inscrire maintenant
                </Link>
              </p>
            </div>
          </div>

          {/* Section informations - Masquée sur mobile */}
          <div className="login-side">
            <div className="side-content">
              <div className="welcome-message">
                <h2>Bienvenue sur CarbonTrack</h2>
                <p>La plateforme qui connecte agriculteurs et entreprises pour un avenir plus durable</p>
              </div>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">🌾</div>
                  <div className="feature-text">
                    <h3>Pour les Agriculteurs</h3>
                    <p>Valorisez vos pratiques durables et générez des revenus supplémentaires grâce aux crédits carbone</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">🏢</div>
                  <div className="feature-text">
                    <h3>Pour les Entreprises</h3>
                    <p>Compensez votre empreinte carbone en soutenant directement l'agriculture durable française</p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">
                    <h3>Suivi en Temps Réel</h3>
                    <p>Accédez à votre tableau de bord complet pour suivre vos crédits, transactions et impact environnemental</p>
                  </div>
                </div>
              </div>
              
              <div className="stats-card">
                <h4>Notre Impact Collectif</h4>
                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-value">500+</div>
                    <div className="stat-label">Agriculteurs</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">10K+</div>
                    <div className="stat-label">Crédits vendus</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">5K+</div>
                    <div className="stat-label">Tonnes CO₂ compensées</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
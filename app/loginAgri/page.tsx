'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import Header from './../components/headerBeforogin';
import './loginAgri.css';

interface AgriculteurLoginData {
  email: string;
  password: string;
}

export default function AgriculteurLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgriculteurLoginData>();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: AgriculteurLoginData) => {
    setSubmitError(null);
    
    try {
      console.log('Tentative de connexion:', data);

      const response = await fetch('http://localhost:3001/api/v1/agriculteur/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur de connexion: ${response.status}`);
      }

      const result = await response.json();
      console.log('Connexion réussie:', result);
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('userType', 'agriculteur');
      localStorage.setItem('userData', JSON.stringify(result.agriculteur));
      
      alert(`Connexion réussie ! Bienvenue ${result.agriculteur.firstName}`);
      
      // Redirection vers le tableau de bord
      window.location.href = '/dashboardAgri';

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion');
    }
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
    <div className={`agriculteur-login-page ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="login-container">
        <div className="login-content">
          {/* Illustration côté gauche */}
          <div className="login-illustration">
            <div className="illustration-content">
              <div className="agriculture-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="illustration-title">
                Retrouvez votre <span className="text-gradient">espace agriculteur</span>
              </h2>
              <p className="illustration-text">
                Accédez à vos données carbone, suivez vos pratiques durables 
                et optimisez votre impact environnemental.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Tableaux de bord personnalisés</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌱</span>
                  <span>Suivi des pratiques culturales</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📈</span>
                  <span>Analyses détaillées CO₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire côté droit */}
          <div className="login-form-section">
            <div className="form-wrapper">
              <div className="form-header">
                <h1 className="form-title">
                  Connexion Agriculteur
                </h1>
                <p className="form-subtitle">
                  Accédez à votre compte CarbonTrack Agri
                </p>
              </div>

              {/* Message d'erreur global */}
              {submitError && (
                <div className="error-global">
                  <div className="error-content">
                    <span className="error-icon">⚠️</span>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                {/* Champ Email */}
                <div className="form-group">
                  <label className="form-label">
                    Adresse email <span className="required">*</span>
                  </label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      {...register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })} 
                      type="email" 
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                {/* Champ Mot de passe */}
                <div className="form-group">
                  <label className="form-label">
                    Mot de passe <span className="required">*</span>
                  </label>
                  <div className="input-container">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      {...register("password", { 
                        required: "Le mot de passe est requis",
                        minLength: {
                          value: 6,
                          message: "Le mot de passe doit contenir au moins 6 caractères"
                        }
                      })} 
                      type={showPassword ? "text" : "password"}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411M9.88 9.88l3.411-3.411" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password.message}</span>
                  )}
                </div>

                {/* Options supplémentaires */}
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Se souvenir de moi
                  </label>
                  <a href="/mot-de-passe-oublie" className="forgot-password">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Bouton de connexion */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`login-btn ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                {/* Lien d'inscription */}
                <div className="register-link">
                  <p>
                    Pas encore de compte ?{' '}
                    <a href="/registeragriculteur" className="link">
                      Créer un compte agriculteur
                    </a>
                  </p>
                </div>

                {/* Séparateur */}
                <div className="separator">
                  <span>Ou</span>
                </div>

                {/* Lien retour */}
                <div className="back-link">
                  <a href="/loginchoce" className="back-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour au choix de connexion
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
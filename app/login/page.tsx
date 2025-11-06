// app/login/page.tsx
'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from './../components/headerBeforogin';
import './LoginPage.css';

interface LoginFormData {
  companyEmail: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const router = useRouter();

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

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/company/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyEmail: data.companyEmail,
          password: data.password
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Connexion réussie:', result);
        
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }
        
        router.push('/dashboardcompany');
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError((error as Error).message || 'Erreur lors de la connexion');
    }
  };

  if (!mounted) {
    return (
      <div className="login-page-loading">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <br/><br/><br/>
      <div className="login-container">
        <div className="login-wrapper">
          {/* Carte de connexion */}
          <div className="login-card">
            {/* En-tête */}
            <div className="login-header">
              <div className="logo-section">
                <h1 className="logo-main">Fle7etna</h1>
                <p className="logo-subtitle">eCo Carbonne</p>
              </div>
              <div className="welcome-section">
                <h2 className="login-title">Connexion Entreprise</h2>
                <p className="login-subtitle">
                  Accédez à votre espace de gestion
                </p>
              </div>
            </div>

            {/* Message d'erreur */}
            {loginError && (
              <div className="error-banner">
                <span className="error-text">{loginError}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="companyEmail" className="form-label">
                  Email professionnel
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  className={`form-input ${errors.companyEmail ? 'error' : ''}`}
                  placeholder="votre@entreprise.com"
                  {...register("companyEmail", {
                    required: "L'email professionnel est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Adresse email invalide"
                    }
                  })}
                />
                {errors.companyEmail && (
                  <span className="error-message">{errors.companyEmail.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Votre mot de passe"
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 6,
                        message: "Le mot de passe doit contenir au moins 6 caractères"
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
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
                    <div className="button-spinner"></div>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Lien d'inscription */}
            <div className="register-section">
              <p className="register-text">
                Nouvelle entreprise ?{' '}
                <Link href="/register" className="register-link">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Section informations */}
          <div className="info-section">
            <div className="info-content">
              <div className="mission-card">
                <h3>Votre partenaire durable</h3>
                <p>Rejoignez des centaines d'entreprises engagées dans la compensation carbone</p>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <h4>Tableau de bord complet</h4>
                  <p>Suivez vos émissions et crédits carbone en temps réel</p>
                </div>
                
                <div className="feature-item">
                  <h4>Réseau d'agriculteurs</h4>
                  <p>Connectez-vous avec des partenaires durables vérifiés</p>
                </div>
                
                <div className="feature-item">
                  <h4>Impact mesurable</h4>
                  <p>Visualisez votre contribution environnementale</p>
                </div>
              </div>

              <div className="stats-card">
                <h4>Notre communauté</h4>
                <div className="stats-grid">
                  <div className="stat">
                    <div className="stat-number">250+</div>
                    <div className="stat-label">Entreprises</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Agriculteurs</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Tonnes CO₂</div>
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
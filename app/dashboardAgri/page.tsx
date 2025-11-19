'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AgriculteurHeader from './../components/headeragri';
import './dashboardAgri.css';
import { useAuthGuard } from '../hooks/useAuthGuardAgr';
export default function AgriDashboard() {
  
  const router = useRouter();
  const [agriculteur, setAgriculteur] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/loginagriculteur');
      return;
    }

    fetch('http://localhost:3001/api/v1/agriculteur/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Non autorisé ou session expirée');
        }
        const data = await res.json();
        setAgriculteur(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur de profil:', err);
        setError('Session expirée ou invalide');
        localStorage.removeItem('access_token');
        router.push('/loginAgri');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/loginAgri');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Erreur</h2>
          <p className="error-message">{error}</p>
          <button
            onClick={() => router.push('/loginAgri')}
            className="retry-button"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-dashboard">
      <AgriculteurHeader agriculteur={agriculteur} onLogout={handleLogout} />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-title">
            <h1 className="hero-main-title">
              👨‍🌾 Tableau de bord Agriculteur
            </h1>
            <div className="hero-divider"></div>
          </div>

          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-text">
                <h2 className="welcome-title">
                  Bienvenue, <span className="welcome-highlight">{agriculteur?.firstName || 'Agriculteur'} !</span>
                </h2>
                <p className="welcome-description">
                  Voici votre espace personnel dédié au suivi de vos activités agricoles, 
                  à l'analyse de vos indicateurs carbone et à la gestion de votre exploitation.
                </p>
              </div>
              <div className="welcome-avatar">
                <div className="avatar-circle">
                  <span className="avatar-emoji">🌱</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {/* Culture principale */}
            <div className="stat-card">
              <div className="stat-glow green"></div>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon">
                    <span className="stat-icon-emoji">🌾</span>
                  </div>
                  <div className="stat-info">
                    <div className="stat-category">Culture</div>
                    <div className="stat-subcategory">Principale</div>
                  </div>
                </div>
                <h3 className="stat-value">
                  {agriculteur?.mainCropType || 'Non défini'}
                </h3>
                <p className="stat-description">
                  Type de culture
                </p>
              </div>
            </div>

            {/* Taille de la ferme */}
            <div className="stat-card">
              <div className="stat-glow yellow"></div>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon">
                    <span className="stat-icon-emoji">📏</span>
                  </div>
                  <div className="stat-info">
                    <div className="stat-category">Superficie</div>
                    <div className="stat-subcategory">Totale</div>
                  </div>
                </div>
                <h3 className="stat-value">
                  {agriculteur?.framSize
                    ? `${parseInt(agriculteur.framSize.toString(), 10)} ha`
                    : 'Inconnu'}
                </h3>
                <p className="stat-description">
                  Surface exploitée
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="stat-card">
              <div className="stat-glow blue"></div>
              <div className="stat-content">
                <div className="stat-header">
                  <div className="stat-icon">
                    <span className="stat-icon-emoji">📞</span>
                  </div>
                  <div className="stat-info">
                    <div className="stat-category">Contact</div>
                    <div className="stat-subcategory">Email</div>
                  </div>
                </div>
                <h3 className="stat-value">
                  {agriculteur?.email || '—'}
                </h3>
                <p className="stat-description">
                  {agriculteur?.phone || 'Téléphone non renseigné'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="actions-title">
              Actions Rapides
            </h3>
            <div className="actions-grid">
              <button className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-label">Calcul Carbone</div>
              </button>
              <button className="action-card blue">
                <div className="action-icon">📝</div>
                <div className="action-label">Rapports</div>
              </button>
              <button className="action-card purple">
                <div className="action-icon">🌍</div>
                <div className="action-label">Impact</div>
              </button>
              <button className="action-card gray">
                <div className="action-icon">⚙️</div>
                <div className="action-label">Paramètres</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p className="footer-text">© 2024 AgroCarbon - Tous droits réservés</p>
          <p className="footer-subtext">Votre partenaire pour une agriculture durable</p>
        </div>
      </footer>
    </div>
  );
}
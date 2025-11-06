// app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboardcompany.css';

interface DashboardStats {
  totalCredits: number;
  carbonFootprint: number;
  compensationRate: number;
  activeProjects: number;
  monthlySavings: number;
}

interface RecentActivity {
  id: number;
  type: 'compensation' | 'purchase' | 'verification' | 'report';
  description: string;
  date: string;
  amount?: number;
  status: 'completed' | 'pending' | 'failed';
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 1250,
    carbonFootprint: 45.2,
    compensationRate: 78,
    activeProjects: 3,
    monthlySavings: 12500
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: 1,
      type: 'compensation',
      description: 'Compensation projet agricole Tunisie',
      date: '2024-01-15',
      amount: 250,
      status: 'completed'
    },
    {
      id: 2,
      type: 'purchase',
      description: 'Achat crédits carbone',
      date: '2024-01-12',
      amount: 500,
      status: 'completed'
    },
    {
      id: 3,
      type: 'verification',
      description: 'Vérification impact mensuel',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 4,
      type: 'report',
      description: 'Génération rapport RSE',
      date: '2024-01-08',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark-mode", isDark);

    // Vérifier l'authentification
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!mounted) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <div className="loading-text">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🌿</div>
            <div className="logo-text">
              <h2>Fle7etna</h2>
              <span>eCo Carbonne</span>
            </div>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>Général</h3>
            <ul>
              <li className={activeTab === 'overview' ? 'active' : ''}>
                <button onClick={() => setActiveTab('overview')}>
                  <span className="nav-icon">📊</span>
                  Vue d'ensemble
                </button>
              </li>
              <li className={activeTab === 'credits' ? 'active' : ''}>
                <button onClick={() => setActiveTab('credits')}>
                  <span className="nav-icon">🌱</span>
                  Mes crédits
                </button>
              </li>
              <li className={activeTab === 'projects' ? 'active' : ''}>
                <button onClick={() => setActiveTab('projects')}>
                  <span className="nav-icon">🚜</span>
                  Projets agricoles
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Analytics</h3>
            <ul>
              <li className={activeTab === 'reports' ? 'active' : ''}>
                <button onClick={() => setActiveTab('reports')}>
                  <span className="nav-icon">📈</span>
                  Rapports
                </button>
              </li>
              <li className={activeTab === 'impact' ? 'active' : ''}>
                <button onClick={() => setActiveTab('impact')}>
                  <span className="nav-icon">🌍</span>
                  Impact environnemental
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h3>Paramètres</h3>
            <ul>
              <li className={activeTab === 'profile' ? 'active' : ''}>
                <button onClick={() => setActiveTab('profile')}>
                  <span className="nav-icon">👤</span>
                  Profil entreprise
                </button>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('settings')}>
                  <span className="nav-icon">⚙️</span>
                  Paramètres
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1>Tableau de Bord</h1>
          </div>

          <div className="header-right">
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <div className="user-menu">
              <div className="user-avatar">
                <span>ES</span>
              </div>
              <div className="user-info">
                <span className="user-name">EcoSolutions SARL</span>
                <span className="user-role">Entreprise Partenaire</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <h3>Crédits Carbone</h3>
                <span className="stat-icon">🌱</span>
              </div>
              <div className="stat-value">{formatNumber(stats.totalCredits)}</div>
              <div className="stat-label">Crédits disponibles</div>
              <div className="stat-trend positive">
                +125 ce mois
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Empreinte Carbone</h3>
                <span className="stat-icon">📊</span>
              </div>
              <div className="stat-value">{stats.carbonFootprint}t</div>
              <div className="stat-label">CO₂ mensuel</div>
              <div className="stat-trend negative">
                -12% vs mois dernier
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Taux Compensation</h3>
                <span className="stat-icon">🎯</span>
              </div>
              <div className="stat-value">{stats.compensationRate}%</div>
              <div className="stat-label">Objectif atteint</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.compensationRate}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Économies Mensuelles</h3>
                <span className="stat-icon">💶</span>
              </div>
              <div className="stat-value">{formatCurrency(stats.monthlySavings)}</div>
              <div className="stat-label">Grâce aux crédits</div>
              <div className="stat-trend positive">
                +8% vs mois dernier
              </div>
            </div>
          </div>

          {/* Charts and Activities Row */}
          <div className="content-row">
            {/* Impact Chart */}
            <div className="chart-card">
              <div className="card-header">
                <h3>Impact Environnemental</h3>
                <select className="period-select">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>3 derniers mois</option>
                  <option>Cette année</option>
                </select>
              </div>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '45%' }}></div>
                  <div className="chart-bar" style={{ height: '75%' }}></div>
                  <div className="chart-bar" style={{ height: '55%' }}></div>
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '65%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                </div>
                <div className="chart-labels">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mer</span>
                  <span>Jeu</span>
                  <span>Ven</span>
                  <span>Sam</span>
                  <span>Dim</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color emissions"></div>
                  <span>Émissions</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color compensation"></div>
                  <span>Compensation</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="activities-card">
              <div className="card-header">
                <h3>Activités Récentes</h3>
                <button className="view-all-btn">Voir tout</button>
              </div>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'compensation' && '🌱'}
                      {activity.type === 'purchase' && '💰'}
                      {activity.type === 'verification' && '✅'}
                      {activity.type === 'report' && '📄'}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.description}</div>
                      <div className="activity-meta">
                        <span className="activity-date">
                          {new Date(activity.date).toLocaleDateString('fr-FR')}
                        </span>
                        {activity.amount && (
                          <span className="activity-amount">
                            {activity.amount} crédits
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`activity-status ${activity.status}`}>
                      {activity.status === 'completed' && 'Terminé'}
                      {activity.status === 'pending' && 'En attente'}
                      {activity.status === 'failed' && 'Échec'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects and Quick Actions */}
          <div className="content-row">
            {/* Active Projects */}
            <div className="projects-card">
              <div className="card-header">
                <h3>Projets Actifs</h3>
                <button className="primary-btn">Nouveau projet</button>
              </div>
              <div className="projects-list">
                <div className="project-item">
                  <div className="project-header">
                    <h4>Agriculture Durable Tunisie</h4>
                    <span className="project-badge active">Actif</span>
                  </div>
                  <p>Projet de compensation carbone via l'agriculture régénératrice</p>
                  <div className="project-stats">
                    <div className="project-stat">
                      <span className="stat-value">750</span>
                      <span className="stat-label">Crédits générés</span>
                    </div>
                    <div className="project-stat">
                      <span className="stat-value">85%</span>
                      <span className="stat-label">Progression</span>
                    </div>
                  </div>
                </div>

                <div className="project-item">
                  <div className="project-header">
                    <h4>Reforestation Maroc</h4>
                    <span className="project-badge pending">En attente</span>
                  </div>
                  <p>Plantation d'arbres pour la capture du carbone</p>
                  <div className="project-stats">
                    <div className="project-stat">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Crédits générés</span>
                    </div>
                    <div className="project-stat">
                      <span className="stat-value">15%</span>
                      <span className="stat-label">Progression</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-card">
              <div className="card-header">
                <h3>Actions Rapides</h3>
              </div>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">💰</span>
                  Acheter des crédits
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  Générer rapport
                </button>
                <button className="action-btn">
                  <span className="action-icon">🌱</span>
                  Compenser CO₂
                </button>
                <button className="action-btn">
                  <span className="action-icon">👥</span>
                  Inviter partenaire
                </button>
                <button className="action-btn">
                  <span className="action-icon">📧</span>
                  Contacter support
                </button>
                <button className="action-btn">
                  <span className="action-icon">⚙️</span>
                  Paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
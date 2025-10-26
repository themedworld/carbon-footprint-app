// app/components/Hero.tsx
import './styles/Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-heading">
              <h1 className="hero-title">
                Vendez votre
                <span className="hero-highlight"> CO2 Agricole</span>
              </h1>
              <p className="hero-description">
                Connectez les agriculteurs écologiques avec les entreprises engagées.
                Transformez vos pratiques durables en revenus supplémentaires.
              </p>
            </div>
            
            <div className="hero-actions">
              <a
                href="/register"
                className="hero-btn hero-btn-primary"
              >
                Commencer maintenant
              </a>
              <a
                href="#how-it-works"
                className="hero-btn hero-btn-secondary"
              >
                En savoir plus
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Agriculteurs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Entreprises</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Tonnes CO2</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="feature-grid">
              <div className="feature-card feature-card-green">
                <div className="feature-icon">🌱</div>
                <h3 className="feature-title">Agriculteurs</h3>
                <p className="feature-description">
                  Vendez vos crédits carbone et valorisez vos pratiques écologiques
                </p>
              </div>
              <div className="feature-card feature-card-blue">
                <div className="feature-icon">🏢</div>
                <h3 className="feature-title">Entreprises</h3>
                <p className="feature-description">
                  Compensez votre empreinte carbone en soutenant l agriculture durable
                </p>
              </div>
              <div className="feature-card feature-card-orange">
                <div className="feature-icon">💸</div>
                <h3 className="feature-title">Revenus</h3>
                <p className="feature-description">
                  Générez des revenus supplémentaires grâce à vos efforts écologiques
                </p>
              </div>
              <div className="feature-card feature-card-purple">
                <div className="feature-icon">🌍</div>
                <h3 className="feature-title">Impact</h3>
                <p className="feature-description">
                  Contribuez activement à la préservation de notre planète
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
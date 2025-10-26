// app/components/Features.tsx
import './styles/Features.css';

export default function Features() {
  const features = [
    {
      icon: "📊",
      title: "Suivi en Temps Réel",
      description: "Surveillez votre production de CO2 et vos crédits en temps réel avec des tableaux de bord intuitifs."
    },
    {
      icon: "🤝",
      title: "Marché Automatisé",
      description: "Notre plateforme connecte automatiquement agriculteurs et entreprises pour des transactions sécurisées."
    },
    {
      icon: "💰",
      title: "Paiements Instantanés",
      description: "Recevez vos paiements rapidement et sécurisés dès que vos crédits carbone sont vendus."
    },
    {
      icon: "📈",
      title: "Analyses Avancées",
      description: "Accédez à des analyses détaillées pour optimiser vos pratiques et maximiser vos revenus."
    },
    {
      icon: "🔒",
      title: "Sécurité Garantie",
      description: "Toutes les transactions sont sécurisées et vérifiées par blockchain pour une transparence totale."
    },
    {
      icon: "🌿",
      title: "Conseils Experts",
      description: "Bénéficiez de conseils d'experts pour améliorer vos pratiques agricoles durables."
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            Fonctionnalités Principales
          </h2>
          <p className="features-subtitle">
            Découvrez comment notre plateforme révolutionne l échange de crédits carbone entre agriculteurs et entreprises.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="feature-card-inner">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-background"></div>
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
                <div className="feature-hover-effect"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
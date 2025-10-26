// app/components/HowItWorks.tsx
import './styles/HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Inscription & Profil",
      description: "Créez votre profil en précisant votre statut (agriculteur ou entreprise) et vos objectifs.",
      icon: "📝",
      color: "#10b981"
    },
    {
      step: "2",
      title: "Validation & Certification",
      description: "Nos experts valident vos pratiques durables et certifient vos crédits carbone.",
      icon: "✅",
      color: "#059669"
    },
    {
      step: "3",
      title: "Mise sur le Marché",
      description: "Vos crédits sont automatiquement proposés sur notre marché sécurisé.",
      icon: "🔄",
      color: "#047857"
    },
    {
      step: "4",
      title: "Transaction & Paiement",
      description: "Les entreprises achètent vos crédits et vous recevez vos revenus instantanément.",
      icon: "💳",
      color: "#065f46"
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">
            Comment ça marche ?
          </h2>
          <p className="how-it-works-subtitle">
            Quatre étapes simples pour transformer vos pratiques écologiques en revenus durables.
          </p>
        </div>

        <div className="steps-container">
          <div className="steps-line"></div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card" data-step={step.step}>
                <div className="step-indicator">
                  <div 
                    className="step-number"
                    style={{ '--step-color': step.color } as React.CSSProperties}
                  >
                    {step.step}
                  </div>
                  <div className="step-connector"></div>
                </div>
                
                <div className="step-content">
                  <div className="step-icon-wrapper">
                    <span className="step-icon">{step.icon}</span>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
                
                <div className="step-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="how-it-works-cta">
          <a href="/register" className="cta-button">
            <span>Commencer maintenant</span>
            <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
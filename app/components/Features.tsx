// app/components/Features.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import './styles/Features.css';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      title: "Suivi Intelligent CO₂",
      description: "Surveillance en temps réel de votre production carbone avec analytics prédictifs et rapports automatisés.",
      gradient: "from-emerald-500 to-cyan-500",
      color: "#10b981"
    },
    {
      title: "Marché Connecté",
      description: "Mise en relation intelligente entre agriculteurs et entreprises avec système de matching algorithmique.",
      gradient: "from-blue-500 to-purple-500",
      color: "#3b82f6"
    },
    {
      title: "Paiements Sécurisés",
      description: "Transactions blockchain instantanées avec smart contracts et historique transparent vérifiable.",
      gradient: "from-green-500 to-emerald-500",
      color: "#22c55e"
    },
    {
      title: "Analytics Avancés",
      description: "Tableaux de bord personnalisés avec insights IA pour optimiser votre rendement carbone et financier.",
      gradient: "from-orange-500 to-red-500",
      color: "#f97316"
    },
    {
      title: "Sécurité Blockchain",
      description: "Protocole de sécurité enterprise avec audit trail complet et certification numérique des crédits.",
      gradient: "from-purple-500 to-pink-500",
      color: "#8b5cf6"
    },
    {
      title: "Accompagnement Expert",
      description: "Coaching personnalisé par nos agronomes et experts en compensation carbone certifiés.",
      gradient: "from-cyan-500 to-blue-500",
      color: "#06b6d4"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featuresRef.current.indexOf(entry.target as HTMLDivElement);
            setActiveFeature(index);
          }
        });
      },
      { threshold: 0.7 }
    );

    featuresRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features-section">
      {/* Background Elements */}
      <div className="features-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="features-container">
        {/* Header avec indicateur visuel */}
        <div className="features-header">
          <div className="header-indicator">
            <div className="indicator-line"></div>
            <div className="indicator-dot"></div>
          </div>
          <h2 className="features-title">
            Plateforme <span className="title-gradient">Intelligente</span>
          </h2>
          <p className="features-subtitle">
            Une suite d'outils avancés conçue pour <strong>maximiser votre impact écologique</strong> 
            et vos revenus grâce à la technologie blockchain.
          </p>
        </div>

        {/* Grille de fonctionnalités améliorée */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
  featuresRef.current[index] = el;
}}

              className={`feature-card ${index === activeFeature ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              {/* Carte avec effet glassmorphism */}
              <div className="card-glass">
                {/* Header de carte avec badge numérique */}
                <div className="card-header">
                  <div className="feature-badge">
                    <span className="badge-number">0{index + 1}</span>
                    <div className="badge-glow"></div>
                  </div>
                  <div className="feature-pulse">
                    <div className="pulse-ring"></div>
                    <div className="pulse-dot"></div>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="card-content">
                  <h3 className="feature-title">
                    {feature.title}
                  </h3>
                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>

                {/* Footer interactif */}
                <div className="card-footer">
                  <div className="progress-indicator">
                    <div 
                      className="progress-bar"
                      style={{ width: index === activeFeature ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <button className="explore-btn">
                    <span>Explorer</span>
                    <svg className="arrow-icon" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>

                {/* Effets visuels */}
                <div className="card-glow"></div>
                <div className="card-shine"></div>
              </div>

              {/* Élément décoratif flottant */}
              <div className="floating-shape"></div>
            </div>
          ))}
        </div>

        {/* Indicateur de progression globale */}
        <div className="features-progress">
          <div className="progress-track">
            {features.map((_, index) => (
              <button
                key={index}
                className={`progress-dot ${index === activeFeature ? 'active' : ''}`}
                onClick={() => {
                  featuresRef.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
              >
                <div className="dot-glow"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
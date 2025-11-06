// app/components/HowItWorks.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import './styles/HowItWorks.css';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      step: "01",
      title: "Inscription & Profil",
      description: "Créez votre profil personnalisé en précisant votre activité et vos objectifs environnementaux. Configuration simple et guidée.",
      color: "#10b981",
      gradient: "from-emerald-400 to-cyan-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      step: "02",
      title: "Validation & Certification",
      description: "Nos experts analysent vos pratiques durables et certifient vos crédits carbone selon les standards internationaux.",
      color: "#059669",
      gradient: "from-green-500 to-emerald-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      step: "03",
      title: "Mise sur le Marché",
      description: "Vos crédits certifiés sont automatiquement proposés sur notre plateforme de marché intelligent et sécurisé.",
      color: "#047857",
      gradient: "from-emerald-500 to-green-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      step: "04",
      title: "Transaction & Paiement",
      description: "Recevez vos revenus instantanément via notre système de paiement sécurisé après chaque transaction réussie.",
      color: "#065f46",
      gradient: "from-green-600 to-emerald-700",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        const elementOffset = containerRef.current.offsetTop;
        const elementHeight = containerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        if (scrollTop > elementOffset - windowHeight * 0.8) {
          const progress = Math.min(
            ((scrollTop - (elementOffset - windowHeight * 0.8)) / (elementHeight * 0.5)) * 100,
            100
          );
          setProgress(progress);
        }
      }
    };

    window.addEventListener('scroll', calculateProgress);
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <section id="how-it-works" className="how-it-works" ref={containerRef}>
      {/* Background Elements */}
      <div className="process-background">
        <div className="floating-process-orb orb-1"></div>
        <div className="floating-process-orb orb-2"></div>
        <div className="process-grid"></div>
      </div>

      <div className="how-it-works-container">
        {/* Header Section */}
        <div className="how-it-works-header">
          <div className="process-badge">
            <span>Processus</span>
          </div>
          <h2 className="how-it-works-title">
            Votre parcours vers des <span className="process-highlight">revenus durables</span>
          </h2>
          <p className="how-it-works-subtitle">
            Un processus simplifié et transparent pour valoriser votre engagement écologique 
            et générer des revenus supplémentaires.
          </p>
        </div>

        {/* Main Process Timeline */}
        <div className="process-timeline">
          {/* Progress Bar */}
          <div className="timeline-progress">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index <= activeStep ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="dot-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Container */}
          <div className="steps-horizontal">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`process-step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
                style={{ '--step-color': step.color } as React.CSSProperties}
              >
                {/* Step Card */}
                <div className="step-card-glass">
                  {/* Step Header */}
                  <div className="step-header">
                    <div className="step-indicator">
                      <div className="step-number-glow"></div>
                      <span className="step-number">{step.step}</span>
                      {index < steps.length - 1 && (
                        <div className="step-connector">
                          <div className="connector-line"></div>
                          <div className="connector-arrow"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="step-icon-container">
                      <div className="step-icon-wrapper">
                        {step.icon}
                      </div>
                      <div className="icon-orb"></div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>

                  {/* Step Footer */}
                  <div className="step-footer">
                    <div className="step-progress">
                      <div 
                        className="step-progress-bar"
                        style={{ width: index <= activeStep ? '100%' : '0%' }}
                      ></div>
                    </div>
                    <div className="step-status">
                      {index === activeStep && (
                        <span className="status-active">En cours</span>
                      )}
                      {index < activeStep && (
                        <span className="status-completed">✓ Terminé</span>
                      )}
                      {index > activeStep && (
                        <span className="status-pending">À venir</span>
                      )}
                    </div>
                  </div>

                  {/* Visual Effects */}
                  <div className="step-glow"></div>
                  <div className="step-shine"></div>
                </div>

                {/* Floating Elements */}
                <div className="step-floating-elements">
                  <div className="floating-dot dot-1"></div>
                  <div className="floating-dot dot-2"></div>
                  <div className="floating-dot dot-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
}
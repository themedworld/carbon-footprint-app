// app/components/Hero.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles/Hero.css';

export default function Hero() {


  

  return (
    <section className="hero">
      {/* Éléments flottants animés */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          {/* Partie texte */}
          <div className="hero-text">
            <div className="hero-heading">
              <h1 className="hero-title">
                Valorisez votre
                <span className="hero-highlight"> CO₂ Agricole</span>
              </h1>
              <p className="hero-description">
                <strong>Fle7etna Eco Carbonne</strong> - La première plateforme tunisienne 
                qui connecte les agriculteurs écologiques avec les entreprises engagées. 
                Transformez vos pratiques durables en revenus supplémentaires tout en 
                préservant notre terroir.
              </p>
            </div>
            
            {/* Actions */}
            <div className="hero-actions">
              <a
                href="/register"
                className="hero-btn hero-btn-primary"
              >
                <span className="btn-icon">🚀</span>
                Commencer maintenant
              </a>
              <a
                href="#how-it-works"
                className="hero-btn hero-btn-secondary"
              >
                <span className="btn-icon">📖</span>
                En savoir plus
              </a>
            </div>

            {/* Statistiques */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Agriculteurs Tunisiens</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Entreprises Locales</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Tonnes CO₂ Compensées</div>
              </div>
            </div>
          </div>

          {/* Partie visuelle */}
          <div className="hero-visual">
            <div className="visual-container">
              {/* Grille de fonctionnalités avec images */}
              <div className="feature-grid">
                <div className="feature-card feature-card-green">
                  <div className="feature-image-wrapper">
                    <Image
                     src="https://drive.google.com/uc?export=view&id=1BPAE7ROy1HzIh0WMmEVzhvRlATFOTuqE"
                      alt="Agriculture durable en Tunisie"
                      width={60}
                      height={60}
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Agriculteurs Engagés</h3>
                    <p className="feature-description">
                      Vendez vos crédits carbone et valorisez vos pratiques écologiques
                    </p>
                  </div>
                </div>

                <div className="feature-card feature-card-blue">
                  <div className="feature-image-wrapper">
                    <Image
                      src="https://drive.google.com/uc?export=view&id=1HOqI3ZZvepA0yv08ICNMx8WaF3QEKLi6"
                      alt="Entreprise éco-responsable"
                      width={60}
                      height={60}
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Entreprises Responsables</h3>
                    <p className="feature-description">
                      Compensez votre empreinte carbone en soutenant l'agriculture durable
                    </p>
                  </div>
                </div>

                <div className="feature-card feature-card-orange">
                  <div className="feature-image-wrapper">
                    <Image
                      src="https://drive.google.com/uc?export=view&id=1oOrh6hImp_Sofr-zbw4n2Zb6hktItuUG"
                      alt="Revenus supplémentaires pour agriculteurs"
                      width={60}
                      height={60}
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Revenus Additionnels</h3>
                    <p className="feature-description">
                      Générez des revenus supplémentaires grâce à vos efforts écologiques
                    </p>
                  </div>
                </div>

                <div className="feature-card feature-card-purple">
                  <div className="feature-image-wrapper">
                    <Image
                      src="https://drive.google.com/uc?export=view&id=1iZgP9hjiEGyfPIuuLNrZo3KeYcNU8gTU"
                      alt="Impact environnemental positif"
                      width={60}
                      height={60}
                      className="feature-image"
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Impact Environnemental</h3>
                    <p className="feature-description">
                      Contribuez activement à la préservation de notre planète
                    </p>
                  </div>
                </div>
              </div>

              {/* Carrousel d'images positionné absolument */}
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
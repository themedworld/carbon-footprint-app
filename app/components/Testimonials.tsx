// app/components/Testimonials.tsx
import './styles/Testimonials.css';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Marie Dubois",
      role: "Agricultrice",
      company: "Ferme Bio du Val",
      content: "Grâce à EcoCalc, j'ai pu valoriser mes pratiques durables et générer un revenu supplémentaire important. L'interface est simple et les paiements sont rapides.",
      avatar: "👩‍🌾",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Directeur RSE",
      company: "EcoTech Industries",
      content: "Cette plateforme nous permet de compenser notre empreinte carbone tout en soutenant l'agriculture locale et durable. Un partenariat gagnant-gagnant.",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      name: "Sophie Lambert",
      role: "Agricultrice",
      company: "Domaine des Coteaux Verts",
      content: "Je recommande vivement EcoCalc à tous les agriculteurs soucieux de l'environnement. C'est incroyable de pouvoir être récompensé pour nos efforts écologiques.",
      avatar: "👩‍🌾",
      rating: 5
    },
    {
      name: "Pierre Moreau",
      role: "CEO",
      company: "GreenEnergy Corp",
      content: "La transparence et la simplicité d'EcoCalc ont transformé notre approche RSE. Nous pouvons maintenant mesurer précisément notre impact positif.",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      name: "Élise Petit",
      role: "Viticultrice",
      company: "Château Vert",
      content: "En un an, j'ai généré plus de 15 000€ de revenus supplémentaires grâce à mes crédits carbone. Une vraie révolution pour notre métier !",
      avatar: "👩‍🌾",
      rating: 5
    },
    {
      name: "David Leroy",
      role: "Directeur Développement Durable",
      company: "BioMarket France",
      content: "EcoCalc nous aide à construire une chaîne d'approvisionnement véritablement durable. Les agriculteurs partenaires sont récompensés à leur juste valeur.",
      avatar: "👨‍💼",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">
            Ils nous font confiance
          </h2>
          <p className="testimonials-subtitle">
            Découvrez les retours d'expérience de nos agriculteurs et entreprises partenaires.
          </p>
          <div className="testimonials-stats">
            <div className="stat">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Note moyenne</div>
            </div>
            <div className="stat">
              <div className="stat-number">200+</div>
              <div className="stat-label">Avis vérifiés</div>
            </div>
            <div className="stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="testimonial-card-inner">
                <div className="testimonial-header">
                  <div className="avatar-wrapper">
                    <div className="avatar-background"></div>
                    <span className="avatar">{testimonial.avatar}</span>
                  </div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <p className="testimonial-company">{testimonial.company}</p>
                  </div>
                </div>

                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <blockquote className="testimonial-content">
                  "{testimonial.content}"
                </blockquote>

                <div className="testimonial-quote-mark">❝</div>
                <div className="testimonial-hover-effect"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta">
          <p className="cta-text">Rejoignez notre communauté d'acteurs engagés</p>
          <a href="/register" className="cta-button">
            Commencer maintenant
            <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
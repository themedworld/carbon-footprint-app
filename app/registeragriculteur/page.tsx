'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import Header from './../components/headerBeforogin';
import './AgriculteurForm.css';

interface AgriculteurFormData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Informations de l'exploitation
  farmName: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  farmSize: number;
  
  // Types de cultures
  cropTypes: string[];
  otherCrops?: string;
  
  // Pratiques agricoles
  tillageType: 'conventionnel' | 'simplifié' | 'semis_direct';
  coverCrops: boolean;
  cropRotation: boolean;
  organicFarming: boolean;
  precisionFarming: boolean;
  
  // Données de production
  cerealArea: number;
  livestockCount: number;
  fertilizerUsage: number;
  pesticideUsage: number;
  irrigationVolume: number;
  
  // Stockage carbone
  hedgerowLength: number;
  agroforestryArea: number;
  organicMatterInput: number;
}

export default function AgriculteurForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AgriculteurFormData>();
  const [currentSection, setCurrentSection] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [estimatedCredits, setEstimatedCredits] = useState(0);

  const watchedValues = watch();

  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    // Calcul estimatif des crédits carbone basé sur les données
    const calculateCredits = () => {
      let credits = 0;
      
      // Points de base pour la taille de l'exploitation
      const baseCredits = (watchedValues.farmSize || 0) * 0.1;
      
      // Bonus pour pratiques durables
      let practiceBonus = 0;
      if (watchedValues.tillageType === 'semis_direct') practiceBonus += 50;
      if (watchedValues.tillageType === 'simplifié') practiceBonus += 25;
      if (watchedValues.coverCrops) practiceBonus += 30;
      if (watchedValues.cropRotation) practiceBonus += 20;
      if (watchedValues.organicFarming) practiceBonus += 40;
      if (watchedValues.precisionFarming) practiceBonus += 15;
      
      // Bonus pour stockage carbone
      const hedgerowBonus = (watchedValues.hedgerowLength || 0) * 0.02;
      const agroforestryBonus = (watchedValues.agroforestryArea || 0) * 0.5;
      const organicMatterBonus = (watchedValues.organicMatterInput || 0) * 0.01;
      
      // Malus pour intrants
      const fertilizerMalus = (watchedValues.fertilizerUsage || 0) * 0.05;
      const pesticideMalus = (watchedValues.pesticideUsage || 0) * 0.1;
      
      credits = baseCredits + practiceBonus + hedgerowBonus + agroforestryBonus + organicMatterBonus - fertilizerMalus - pesticideMalus;
      
      setEstimatedCredits(Math.max(0, Math.round(credits)));
    };

    calculateCredits();
  }, [watchedValues]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const sections = [
    { id: 'personal', title: 'Informations personnelles', icon: '👤' },
    { id: 'farm', title: 'Exploitation agricole', icon: '🚜' },
    { id: 'practices', title: 'Pratiques culturales', icon: '🌾' },
    { id: 'production', title: 'Production', icon: '📊' },
    { id: 'carbon', title: 'Stockage carbone', icon: '🌳' },
    { id: 'login', title: 'Sécurité', icon: '🔐' }
  ];

  const scrollToSection = (index: number) => {
    setCurrentSection(index);
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = async (data: AgriculteurFormData) => {
    // Simulation d'envoi des données
    console.log('Données agriculteur:', data);
    
    // Ici vous enverriez les données à votre API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirection ou message de succès
    alert(`Formulaire soumis avec succès ! Estimation: ${estimatedCredits} crédits carbone`);
  };

  const cropTypes = [
    'Céréales',
    'Légumineuses',
    'Oléo-protéagineux',
    'Vigne',
    'Arboriculture',
    'Maraîchage',
    'Élevage',
    'Culture fourragère',
    'Autres'
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`agriculteur-page ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="agriculteur-container">
        {/* Navigation latérale */}
        <div className="form-sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">🌱</div>
              <span className="logo-text">CarbonTrack Agri</span>
            </div>
          </div>
          
          <div className="sidebar-content">
            <div className="progress-card">
              <div className="progress-header">
                <h3>Progression</h3>
                <span className="progress-percent">{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Estimation des crédits */}
            <div className="credits-card">
              <h3>Crédits estimés</h3>
              <div className="credits-value">
                {estimatedCredits} crédits
              </div>
              <div className="credits-help">
                Estimation basée sur vos pratiques
              </div>
            </div>

            <nav className="sidebar-nav">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  className={`nav-item ${currentSection === index ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
                  onClick={() => scrollToSection(index)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.title}</span>
                  {index < currentSection && (
                    <span className="nav-check">✓</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="form-main">
          <div className="form-wrapper">
            {/* En-tête avec dégradé */}
            <div className="form-header">
              <div className="header-content">
                <div className="header-badge">
                  <span>Agriculteur - Calcul de crédits carbone</span>
                </div>
                <h1 className="form-title">
                  Valorisez vos pratiques durables
                </h1>
                <p className="form-subtitle">
                  Calculez votre potentiel de crédits carbone et rejoignez notre plateforme de compensation
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {/* Informations personnelles */}
              <section id="personal" className="form-section personal-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">👤</div>
                  </div>
                  <div>
                    <h2 className="section-title">Informations personnelles</h2>
                    <p className="section-description">Vos coordonnées et identifiants</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Prénom <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("firstName", { required: "Le prénom est requis" })} 
                      type="text" 
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Nom <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("lastName", { required: "Le nom est requis" })} 
                      type="text" 
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Téléphone
                    </label>
                    <input 
                      {...register("phone")} 
                      type="tel" 
                      className="form-input"
                      placeholder="+33 1 23 45 67 89"
                    />
                    <div className="field-help">Facultatif - pour les contacts urgents</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })} 
                      type="email" 
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Informations de l'exploitation */}
              <section id="farm" className="form-section farm-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🚜</div>
                  </div>
                  <div>
                    <h2 className="section-title">Exploitation agricole</h2>
                    <p className="section-description">Caractéristiques de votre exploitation</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Nom de l exploitation <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("farmName", { required: "Le nom de l'exploitation est requis" })} 
                      type="text" 
                      className={`form-input ${errors.farmName ? 'error' : ''}`}
                      placeholder="Nom de votre exploitation"
                    />
                    {errors.farmName && (
                      <span className="error-message">{errors.farmName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Numéro SIRET
                    </label>
                    <input 
                      {...register("siret", { 
                        pattern: {
                          value: /^\d{14}$/,
                          message: "Le SIRET doit contenir 14 chiffres"
                        }
                      })} 
                      type="text" 
                      className={`form-input ${errors.siret ? 'error' : ''}`}
                      placeholder="14 chiffres"
                    />
                    {errors.siret && (
                      <span className="error-message">{errors.siret.message}</span>
                    )}
                    <div className="field-help">Facultatif - pour la vérification</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Superficie totale (hectares) <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("farmSize", { 
                        required: "La superficie est requise",
                        min: { value: 0, message: "La superficie ne peut pas être négative" }
                      })} 
                      type="number" 
                      className={`form-input ${errors.farmSize ? 'error' : ''}`}
                      placeholder="0"
                      step="0.1"
                    />
                    {errors.farmSize && (
                      <span className="error-message">{errors.farmSize.message}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Types de cultures principales</label>
                    <div className="checkbox-grid">
                      {cropTypes.map((crop) => (
                        <label key={crop} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={crop}
                            {...register("cropTypes")}
                            className="checkbox-input"
                          />
                          <span className="checkbox-custom"></span>
                          {crop}
                        </label>
                      ))}
                    </div>
                    <div className="field-help">Sélectionnez toutes les cultures pratiquées</div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      Adresse de l exploitation
                    </label>
                    <input 
                      {...register("address")} 
                      type="text" 
                      className="form-input"
                      placeholder="Adresse complète"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ville</label>
                    <input 
                      {...register("city")} 
                      type="text" 
                      className="form-input"
                      placeholder="Ville"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Code postal</label>
                    <input 
                      {...register("postalCode", { 
                        pattern: {
                          value: /^\d{5}$/,
                          message: "Code postal invalide"
                        }
                      })} 
                      type="text" 
                      className={`form-input ${errors.postalCode ? 'error' : ''}`}
                      placeholder="75000"
                    />
                    {errors.postalCode && (
                      <span className="error-message">{errors.postalCode.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Pratiques culturales */}
              <section id="practices" className="form-section practices-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🌾</div>
                  </div>
                  <div>
                    <h2 className="section-title">Pratiques culturales</h2>
                    <p className="section-description">Vos méthodes de travail influencent votre potentiel carbone</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Type de travail du sol <span className="required-star">*</span>
                    </label>
                    <select 
                      {...register("tillageType", { required: "Le type de travail du sol est requis" })} 
                      className={`form-select ${errors.tillageType ? 'error' : ''}`}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="conventionnel">Conventionnel (labour profond)</option>
                      <option value="simplifié">Simplifié (décompactage)</option>
                      <option value="semis_direct">Semis direct (sans travail du sol)</option>
                    </select>
                    {errors.tillageType && (
                      <span className="error-message">{errors.tillageType.message}</span>
                    )}
                    <div className="field-help">Influence majeure sur le stockage carbone</div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Pratiques durables supplémentaires</label>
                    <div className="practices-grid">
                      <label className="practice-checkbox">
                        <input
                          type="checkbox"
                          {...register("coverCrops")}
                          className="practice-input"
                        />
                        <div className="practice-card">
                          <div className="practice-icon">🌿</div>
                          <div className="practice-content">
                            <div className="practice-title">Cultures intermédiaires</div>
                            <div className="practice-description">Couverture végétale entre deux cultures principales</div>
                          </div>
                        </div>
                      </label>

                      <label className="practice-checkbox">
                        <input
                          type="checkbox"
                          {...register("cropRotation")}
                          className="practice-input"
                        />
                        <div className="practice-card">
                          <div className="practice-icon">🔄</div>
                          <div className="practice-content">
                            <div className="practice-title">Rotation des cultures</div>
                            <div className="practice-description">Alternance des cultures sur la même parcelle</div>
                          </div>
                        </div>
                      </label>

                      <label className="practice-checkbox">
                        <input
                          type="checkbox"
                          {...register("organicFarming")}
                          className="practice-input"
                        />
                        <div className="practice-card">
                          <div className="practice-icon">✅</div>
                          <div className="practice-content">
                            <div className="practice-title">Agriculture biologique</div>
                            <div className="practice-description">Certification ou pratiques biologiques</div>
                          </div>
                        </div>
                      </label>

                      <label className="practice-checkbox">
                        <input
                          type="checkbox"
                          {...register("precisionFarming")}
                          className="practice-input"
                        />
                        <div className="practice-card">
                          <div className="practice-icon">🎯</div>
                          <div className="practice-content">
                            <div className="practice-title">Agriculture de précision</div>
                            <div className="practice-description">Utilisation de technologies de précision</div>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="field-help">Chaque pratique durable augmente votre potentiel de crédits</div>
                  </div>
                </div>
              </section>

              {/* Données de production */}
              <section id="production" className="form-section production-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">📊</div>
                  </div>
                  <div>
                    <h2 className="section-title">Données de production</h2>
                    <p className="section-description">Vos consommations et productions annuelles</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Surface céréalière (ha)
                    </label>
                    <input 
                      {...register("cerealArea")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                      step="0.1"
                    />
                    <div className="field-help">Blé, orge, maïs, etc.</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Effectif animaux (UGB)
                    </label>
                    <input 
                      {...register("livestockCount")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                    />
                    <div className="field-help">Unité Gros Bétail - 1 UGB = 1 vache laitière</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Engrais minéral (kg N/ha)
                    </label>
                    <input 
                      {...register("fertilizerUsage")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                      step="0.1"
                    />
                    <div className="field-help">Azote minéral apporté par hectare</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Produits phytosanitaires (kg/ha)
                    </label>
                    <input 
                      {...register("pesticideUsage")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                      step="0.1"
                    />
                    <div className="field-help">Matière active totale par hectare</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Irrigation (m³/an)
                    </label>
                    <input 
                      {...register("irrigationVolume")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                    />
                    <div className="field-help">Volume total d eau d irrigation</div>
                  </div>
                </div>
              </section>

              {/* Stockage carbone */}
              <section id="carbon" className="form-section carbon-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🌳</div>
                  </div>
                  <div>
                    <h2 className="section-title">Stockage de carbone</h2>
                    <p className="section-description">Éléments qui augmentent le stockage carbone sur votre exploitation</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Haies (mètres linéaires)
                    </label>
                    <input 
                      {...register("hedgerowLength")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                    />
                    <div className="field-help">Longueur totale des haies sur l exploitation</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Agroforesterie (ha)
                    </label>
                    <input 
                      {...register("agroforestryArea")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                      step="0.1"
                    />
                    <div className="field-help">Surface avec arbres intégrés aux cultures</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Apports organiques (t/ha)
                    </label>
                    <input 
                      {...register("organicMatterInput")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                      step="0.1"
                    />
                    <div className="field-help">Fumier, compost, etc. par hectare</div>
                  </div>
                </div>
              </section>

              {/* Sécurité */}
              <section id="login" className="form-section login-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🔐</div>
                  </div>
                  <div>
                    <h2 className="section-title">Sécurité du compte</h2>
                    <p className="section-description">Créez vos identifiants de connexion</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Mot de passe <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("password", { 
                        required: "Le mot de passe est requis",
                        minLength: {
                          value: 8,
                          message: "Le mot de passe doit contenir au moins 8 caractères"
                        }
                      })} 
                      type="password" 
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <span className="error-message">{errors.password.message}</span>
                    )}
                    <div className="field-help">Minimum 8 caractères</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Confirmer le mot de passe <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("confirmPassword", { 
                        required: "Veuillez confirmer le mot de passe",
                        validate: value => value === watchedValues.password || "Les mots de passe ne correspondent pas"
                      })} 
                      type="password" 
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <span className="error-message">{errors.confirmPassword.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Récapitulatif */}
              <div className="form-summary">
                <div className="summary-card">
                  <h3>Récapitulatif de votre potentiel carbone</h3>
                  <div className="summary-content">
                    <div className="summary-item">
                      <span>Crédits carbone estimés :</span>
                      <strong>{estimatedCredits} crédits</strong>
                    </div>
                    <div className="summary-item">
                      <span>Superficie éligible :</span>
                      <strong>{watchedValues.farmSize || 0} ha</strong>
                    </div>
                    <div className="summary-item">
                      <span>Pratiques durables :</span>
                      <strong>
                        {[
                          watchedValues.tillageType === 'semis_direct' && 'Semis direct',
                          watchedValues.tillageType === 'simplifié' && 'Travail simplifié',
                          watchedValues.coverCrops && 'Cultures intermédiaires',
                          watchedValues.cropRotation && 'Rotation',
                          watchedValues.organicFarming && 'Agriculture biologique',
                          watchedValues.precisionFarming && 'Précision'
                        ].filter(Boolean).join(', ') || 'Aucune pratique spécifique'}
                      </strong>
                    </div>
                    <div className="summary-item">
                      <span>Éléments de stockage :</span>
                      <strong>
                        {[
                          watchedValues.hedgerowLength > 0 && 'Haies',
                          watchedValues.agroforestryArea > 0 && 'Agroforesterie',
                          watchedValues.organicMatterInput > 0 && 'Apports organiques'
                        ].filter(Boolean).join(', ') || 'Aucun'}
                      </strong>
                    </div>
                    <div className="summary-note">
                      * Estimation préliminaire basée sur vos données. Un audit terrain pourra ajuster ce calcul.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Finaliser mon inscription et calculer mes crédits
                    </>
                  )}
                </button>
                
                <div className="form-note">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tous les champs marqués d un <span className="required-star">*</span> sont obligatoires</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
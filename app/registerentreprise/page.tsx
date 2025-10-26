'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import './page.css';
import Header from './../components/headerBeforogin';
interface CompanyFormData {
  companyId: string;
  companyName: string;
  legalStructure: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  sector: string;
  subSector?: string;
  employees: number;
  turnover: number;
  foundationYear: number;
  
  // Informations de connexion
  email: string;
  password: string;
  confirmPassword: string;
  
  // Scope 1 – émissions directes
  gasConsumption: number;
  dieselConsumption: number;
  gasolineConsumption: number;
  internalVehicles: number;
  refrigerants: number;
  processEmissions: number;
  
  // Scope 2 – émissions liées à lénergie
  electricityKWh: number;
  energySource: string;
  heatingConsumption: number;
  
  // Scope 3 – autres émissions indirectes
  rawMaterialTransportKm: number;
  employeeTravelKm: number;
  businessTravelKm: number;
  purchasedGoods: number;
  capitalGoods: number;
  recycledWasteKg: number;
  nonRecycledWasteKg: number;
  waterConsumption: number;
  
  // Champs spécifiques par secteur
  specificField1?: number;
  specificField2?: number;
}

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
}

export default function CompanyForm({ onSubmit }: CompanyFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CompanyFormData>();
  const [currentSection, setCurrentSection] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  
  const selectedSector = watch("sector");
  const password = watch("password");
 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const sections = [
    { id: 'legal', title: 'Informations légales', icon: '📄' },
    { id: 'general', title: 'Profil entreprise', icon: '🏢' },
    { id: 'address', title: 'Adresse', icon: '📍' },
    { id: 'login', title: 'Connexion', icon: '🔐' },
    { id: 'scope1', title: 'Scope 1', icon: '🔥' },
    { id: 'scope2', title: 'Scope 2', icon: '⚡' },
    { id: 'scope3', title: 'Scope 3', icon: '🌐' },
    { id: 'sector', title: 'Spécifique', icon: '🎯' }
  ];

  const scrollToSection = (index: number) => {
    setCurrentSection(index);
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
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
  const getSectorSpecificFields = () => {
    switch (selectedSector) {
      case "industrie":
        return (
          <>
            <div className="form-group">
              <label className="form-label">
                Consommation de combustibles industriels (GJ/an)
              </label>
              <input 
                {...register("specificField1")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Déchets de production (kg/an)
              </label>
              <input 
                {...register("specificField2")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
          </>
        );
      
      case "transport":
        return (
          <>
            <div className="form-group">
              <label className="form-label">
                Distance totale parcourue (km/an)
              </label>
              <input 
                {...register("specificField1")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Nombre de véhicules dans la flotte
              </label>
              <input 
                {...register("specificField2")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
          </>
        );
      
      case "agriculture":
        return (
          <>
            <div className="form-group">
              <label className="form-label">
                Surface exploitée (hectares)
              </label>
              <input 
                {...register("specificField1")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Utilisation d engrais (kg/an)
              </label>
              <input 
                {...register("specificField2")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
          </>
        );
      
      case "energie":
        return (
          <>
            <div className="form-group">
              <label className="form-label">
                Capacité de production (MWh/an)
              </label>
              <input 
                {...register("specificField1")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Émissions de méthane (m³/an)
              </label>
              <input 
                {...register("specificField2")} 
                type="number" 
                className="form-input"
                placeholder="0"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (

    <div className={`form-page ${darkMode ? 'dark' : ''}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} ></Header>
      <br /><br /><br />
      <div className="form-container ">
        {/* Navigation latérale */}
        <div className="form-sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">🌱</div>
              <span className="logo-text">CarbonTrack</span>
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
                  <span>Formulaire d enregistrement</span>
                </div>
                <h1 className="form-title">
                  Calcul d Empreinte Carbone
                </h1>
                <p className="form-subtitle">
                  Remplissez ce formulaire pour calculer l impact environnemental de votre entreprise et rejoignez notre plateforme de compensation carbone.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {/* Identifiant et informations légales */}
              <section id="legal" className="form-section legal-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">📄</div>
                  </div>
                  <div>
                    <h2 className="section-title">Identifiant et informations légales</h2>
                    <p className="section-description">Informations officielles de votre entreprise</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      ID Société <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("companyId", { required: "L'identifiant de société est requis" })} 
                      type="text" 
                      className={`form-input ${errors.companyId ? 'error' : ''}`}
                      placeholder="ID unique de la société"
                    />
                    {errors.companyId && (
                      <span className="error-message">{errors.companyId.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Numéro SIRET <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("siret", { 
                        required: "Le SIRET est requis",
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Structure légale <span className="required-star">*</span>
                    </label>
                    <select 
                      {...register("legalStructure", { required: "La structure légale est requise" })} 
                      className={`form-select ${errors.legalStructure ? 'error' : ''}`}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="sas">SAS</option>
                      <option value="sarl">SARL</option>
                      <option value="sa">SA</option>
                      <option value="ei">Entreprise Individuelle</option>
                      <option value="autres">Autres</option>
                    </select>
                    {errors.legalStructure && (
                      <span className="error-message">{errors.legalStructure.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Année de création <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("foundationYear", { 
                        required: "L'année de création est requise",
                        min: { value: 1900, message: "Année invalide" },
                        max: { value: new Date().getFullYear(), message: "Année dans le futur" }
                      })} 
                      type="number" 
                      className={`form-input ${errors.foundationYear ? 'error' : ''}`}
                      placeholder="2020"
                    />
                    {errors.foundationYear && (
                      <span className="error-message">{errors.foundationYear.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Informations générales */}
              <section id="general" className="form-section general-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🏢</div>
                  </div>
                  <div>
                    <h2 className="section-title">Informations générales</h2>
                    <p className="section-description">Profil et activité de votre entreprise</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">
                      Nom de la société <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("companyName", { required: "Le nom de la société est requis" })} 
                      type="text" 
                      className={`form-input ${errors.companyName ? 'error' : ''}`}
                      placeholder="Entrez le nom de votre société"
                    />
                    {errors.companyName && (
                      <span className="error-message">{errors.companyName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Secteur d activité <span className="required-star">*</span>
                    </label>
                    <select 
                      {...register("sector", { required: "Le secteur d'activité est requis" })} 
                      className={`form-select ${errors.sector ? 'error' : ''}`}
                    >
                      <option value="">Sélectionnez un secteur</option>
                      <option value="industrie">Industrie</option>
                      <option value="transport">Transport & Logistique</option>
                      <option value="services">Services</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="energie">Énergie</option>
                      <option value="batiment">Bâtiment</option>
                      <option value="commerce">Commerce</option>
                    </select>
                    {errors.sector && (
                      <span className="error-message">{errors.sector.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Nombre d employés <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("employees", { 
                        required: "Le nombre d'employés est requis",
                        min: { value: 1, message: "Le nombre d'employés doit être supérieur à 0" }
                      })} 
                      type="number" 
                      className={`form-input ${errors.employees ? 'error' : ''}`}
                      placeholder="0"
                    />
                    {errors.employees && (
                      <span className="error-message">{errors.employees.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Chiffre d affaires (€) <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("turnover", { 
                        required: "Le chiffre d'affaires est requis",
                        min: { value: 0, message: "Le chiffre d'affaires ne peut pas être négatif" }
                      })} 
                      type="number" 
                      className={`form-input ${errors.turnover ? 'error' : ''}`}
                      placeholder="0"
                    />
                    {errors.turnover && (
                      <span className="error-message">{errors.turnover.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Adresse */}
              <section id="address" className="form-section address-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">📍</div>
                  </div>
                  <div>
                    <h2 className="section-title">Adresse de l entreprise</h2>
                    <p className="section-description">Localisation géographique</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
                  <div className="form-group full-width">
                    <label className="form-label">
                      Adresse <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("address", { required: "L'adresse est requise" })} 
                      type="text" 
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="Adresse complète"
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Ville <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("city", { required: "La ville est requise" })} 
                      type="text" 
                      className={`form-input ${errors.city ? 'error' : ''}`}
                      placeholder="Ville"
                    />
                    {errors.city && (
                      <span className="error-message">{errors.city.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Code postal <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("postalCode", { 
                        required: "Le code postal est requis",
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

              {/* Informations de connexion */}
              <section id="login" className="form-section login-section">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🔐</div>
                  </div>
                  <div>
                    <h2 className="section-title">Informations de connexion</h2>
                    <p className="section-description">Créez vos identifiants d accès</p>
                  </div>
                </div>
                
                <div className="grid-form-2">
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Confirmer le mot de passe <span className="required-star">*</span>
                    </label>
                    <input 
                      {...register("confirmPassword", { 
                        required: "Veuillez confirmer le mot de passe",
                        validate: value => value === password || "Les mots de passe ne correspondent pas"
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

              {/* Scope 1 – émissions directes */}
              <section id="scope1" className="form-section scope-section scope-1">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🔥</div>
                  </div>
                  <div>
                    <h2 className="section-title">Scope 1 – Émissions directes</h2>
                    <p className="section-description">Émissions provenant des sources détenues ou contrôlées par l entreprise</p>
                  </div>
                </div>
                
                <div className="grid-form-3">
                  {[
                    { label: "Consommation de gaz (m³/an)", name: "gasConsumption" },
                    { label: "Diesel utilisé (litres/an)", name: "dieselConsumption" },
                    { label: "Essence utilisée (litres/an)", name: "gasolineConsumption" },
                    { label: "Nombre de véhicules internes", name: "internalVehicles" },
                    { label: "Émissions de réfrigérants (kg/an)", name: "refrigerants" },
                    { label: "Émissions de procédés (tCO₂e/an)", name: "processEmissions" }
                  ].map((field) => (
                    <div key={field.name} className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input 
                        {...register(field.name as any)} 
                        type="number" 
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Scope 2 – émissions liées à l'énergie */}
              <section id="scope2" className="form-section scope-section scope-2">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">⚡</div>
                  </div>
                  <div>
                    <h2 className="section-title">Scope 2 – Émissions indirectes liées à l énergie</h2>
                    <p className="section-description">Émissions associées à la production d électricité, de chaleur ou de vapeur achetée</p>
                  </div>
                </div>
                
                <div className="grid-form-3">
                  <div className="form-group">
                    <label className="form-label">Électricité achetée (kWh/an)</label>
                    <input 
                      {...register("electricityKWh")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Source d énergie</label>
                    <select 
                      {...register("energySource")} 
                      className="form-select"
                    >
                      <option value="fossile">Fossile</option>
                      <option value="renouvelable">Renouvelable</option>
                      <option value="mixte">Mixte</option>
                      <option value="inconnu">Inconnu</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chauffage (kWh/an)</label>
                    <input 
                      {...register("heatingConsumption")} 
                      type="number" 
                      className="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>
              </section>

              {/* Scope 3 – autres émissions indirectes */}
              <section id="scope3" className="form-section scope-section scope-3">
                <div className="section-header">
                  <div className="section-icon">
                    <div className="icon-wrapper">🌐</div>
                  </div>
                  <div>
                    <h2 className="section-title">Scope 3 – Autres émissions indirectes</h2>
                    <p className="section-description">Émissions liées à la chaîne de valeur de l entreprise</p>
                  </div>
                </div>
                
                <div className="grid-form-3">
                  {[
                    { label: "Transport des matières premières (km/an)", name: "rawMaterialTransportKm" },
                    { label: "Déplacements domicile-travail (km/an)", name: "employeeTravelKm" },
                    { label: "Voyages d'affaires (km/an)", name: "businessTravelKm" },
                    { label: "Biens achetés (€/an)", name: "purchasedGoods" },
                    { label: "Biens d'équipement (€/an)", name: "capitalGoods" },
                    { label: "Consommation d'eau (m³/an)", name: "waterConsumption" },
                    { label: "Quantité de déchets recyclés (kg/an)", name: "recycledWasteKg" },
                    { label: "Quantité de déchets non recyclés (kg/an)", name: "nonRecycledWasteKg" }
                  ].map((field) => (
                    <div key={field.name} className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input 
                        {...register(field.name as any)} 
                        type="number" 
                        className="form-input"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Champs spécifiques au secteur */}
              {selectedSector && (
                <section id="sector" className="form-section sector-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <div className="icon-wrapper">🎯</div>
                    </div>
                    <div>
                      <h2 className="section-title">Métriques spécifiques au secteur {selectedSector}</h2>
                      <p className="section-description">Données spécifiques à votre activité</p>
                    </div>
                  </div>
                  
                  <div className="grid-form-2">
                    {getSectorSpecificFields()}
                  </div>
                </section>
              )}

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
                      Enregistrement en cours...
                    </>
                  ) : (
                    <>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Finaliser l enregistrement
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
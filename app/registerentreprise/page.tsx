// app/registerentreprise/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import Header from './../components/headerBeforogin';

interface CompanyFormData {
  companyName: string;
  companyEmail: string;
  password: string;
  confirmPassword: string;
  address: string;
  companyPhoneNumber: string;
  companyTaxIdentificationNumber: string;
  businessSector: string;
  website?: string;
  companySize: string;
}

export default function RegisterEntreprise() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    address: '',
    companyPhoneNumber: '',
    companyTaxIdentificationNumber: '',
    businessSector: '',
    website: '',
    companySize: ''
  });

  // Liste des secteurs d'activité
  const businessSectors = [
    'Technologie & Informatique',
    'Agriculture & Agroalimentaire',
    'Énergie & Utilities',
    'Construction & BTP',
    'Transport & Logistique',
    'Santé & Pharmacie',
    'Commerce & Distribution',
    'Finance & Assurance',
    'Tourisme & Hôtellerie',
    'Éducation & Formation',
    'Industrie Manufacturière',
    'Environnement & Développement Durable',
    'Services aux Entreprises',
    'Culture & Loisirs',
    'Immobilier',
    'Ressources Humaines',
    'Marketing & Communication',
    'Recherche & Développement',
    'Autre'
  ];

  useEffect(() => {
    setMounted(true);
    const storedDarkMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const isDark = storedDarkMode === "true" || (!storedDarkMode && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark-mode", isDark);
  }, []);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSectorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'L\'email de l\'entreprise est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    if (!formData.companyPhoneNumber.trim()) {
      newErrors.companyPhoneNumber = 'Le numéro de téléphone est requis';
    }

    if (!formData.companyTaxIdentificationNumber.trim()) {
      newErrors.companyTaxIdentificationNumber = 'Le numéro d\'identification fiscale est requis';
    }

    if (!formData.businessSector.trim()) {
      newErrors.businessSector = 'Le secteur d\'activité est requis';
    }

    if (!formData.companySize.trim()) {
      newErrors.companySize = 'La taille de l\'entreprise est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSectorSelect = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      businessSector: sector
    }));
    setShowSectorDropdown(false);
    
    if (errors.businessSector) {
      setErrors(prev => ({
        ...prev,
        businessSector: undefined
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const toggleSectorDropdown = () => {
    setShowSectorDropdown(!showSectorDropdown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/v1/company/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          password: formData.password,
          address: formData.address,
          companyPhoneNumber: formData.companyPhoneNumber,
          companyTaxIdentificationNumber: formData.companyTaxIdentificationNumber,
          businessSector: formData.businessSector,
          website: formData.website,
          companySize: formData.companySize
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Inscription réussie:', result);
        router.push('/login?message=Inscription réussie');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'inscription: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="register-page-loading">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="loading-content">
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-entreprise-page">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <br/><br/>
      <div className="register-entreprise-container">
        {/* Header */}
        <div className="register-entreprise-header">
          <div className="header-icon-container">
            <div className="icon-wrapper">
              <div className="icon">🏢</div>
            </div>
          </div>
          <h1 className="page-title">Inscription Entreprise</h1>
          <p className="page-subtitle">
            Rejoignez notre plateforme éco-responsable
          </p>
        </div>

        {/* Formulaire */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="entreprise-form">
            {/* Informations de base */}
            <div className="form-group">
              <label htmlFor="companyName" className="form-label">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onFocus={() => handleFocus('companyName')}
                onBlur={handleBlur}
                className={`form-input ${errors.companyName ? 'error' : ''} ${
                  focusedField === 'companyName' ? 'focused' : ''
                }`}
                placeholder="GreenTech Solutions"
              />
              {errors.companyName && (
                <p className="error-message">{errors.companyName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="companyEmail" className="form-label">
                Email professionnel *
              </label>
              <input
                type="email"
                id="companyEmail"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                onFocus={() => handleFocus('companyEmail')}
                onBlur={handleBlur}
                className={`form-input ${errors.companyEmail ? 'error' : ''} ${
                  focusedField === 'companyEmail' ? 'focused' : ''
                }`}
                placeholder="contact@entreprise.com"
              />
              {errors.companyEmail && (
                <p className="error-message">{errors.companyEmail}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="website" className="form-label">
                Site web (optionnel)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                onFocus={() => handleFocus('website')}
                onBlur={handleBlur}
                className={`form-input ${focusedField === 'website' ? 'focused' : ''}`}
                placeholder="https://www.entreprise.com"
              />
            </div>

            {/* Secteur d'activité avec dropdown */}
            <div className="form-group" ref={dropdownRef}>
              <label htmlFor="businessSector" className="form-label">
                Secteur d'activité *
              </label>
              <div className="dropdown-container">
                <div 
                  className={`dropdown-toggle ${errors.businessSector ? 'error' : ''} ${
                    focusedField === 'businessSector' ? 'focused' : ''
                  }`}
                  onClick={toggleSectorDropdown}
                  onFocus={() => handleFocus('businessSector')}
                  onBlur={handleBlur}
                  tabIndex={0}
                >
                  <span className={`dropdown-selected ${!formData.businessSector ? 'placeholder' : ''}`}>
                    {formData.businessSector || 'Sélectionnez un secteur'}
                  </span>
                  <span className={`dropdown-arrow ${showSectorDropdown ? 'open' : ''}`}>
                    ▼
                  </span>
                </div>
                
                {showSectorDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-search">
                      <input
                        type="text"
                        placeholder="Rechercher un secteur..."
                        className="search-input"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="dropdown-options">
                      {businessSectors.map((sector, index) => (
                        <div
                          key={index}
                          className={`dropdown-option ${
                            formData.businessSector === sector ? 'selected' : ''
                          }`}
                          onClick={() => handleSectorSelect(sector)}
                        >
                          {sector}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {errors.businessSector && (
                <p className="error-message">{errors.businessSector}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="companySize" className="form-label">
                Taille de l'entreprise *
              </label>
              <input
                type="text"
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                onFocus={() => handleFocus('companySize')}
                onBlur={handleBlur}
                className={`form-input ${errors.companySize ? 'error' : ''} ${
                  focusedField === 'companySize' ? 'focused' : ''
                }`}
                placeholder="ex: 50 employés"
              />
              {errors.companySize && (
                <p className="error-message">{errors.companySize}</p>
              )}
            </div>

            {/* Informations de contact */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Adresse complète *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                rows={3}
                className={`form-input form-textarea ${errors.address ? 'error' : ''} ${
                  focusedField === 'address' ? 'focused' : ''
                }`}
                placeholder="123 Avenue de l'Environnement, 75001 Paris, France"
              />
              {errors.address && (
                <p className="error-message">{errors.address}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="companyPhoneNumber" className="form-label">
                Téléphone *
              </label>
              <input
                type="tel"
                id="companyPhoneNumber"
                name="companyPhoneNumber"
                value={formData.companyPhoneNumber}
                onChange={handleChange}
                onFocus={() => handleFocus('companyPhoneNumber')}
                onBlur={handleBlur}
                className={`form-input ${errors.companyPhoneNumber ? 'error' : ''} ${
                  focusedField === 'companyPhoneNumber' ? 'focused' : ''
                }`}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.companyPhoneNumber && (
                <p className="error-message">{errors.companyPhoneNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="companyTaxIdentificationNumber" className="form-label">
                Numéro d'identification fiscale *
              </label>
              <input
                type="text"
                id="companyTaxIdentificationNumber"
                name="companyTaxIdentificationNumber"
                value={formData.companyTaxIdentificationNumber}
                onChange={handleChange}
                onFocus={() => handleFocus('companyTaxIdentificationNumber')}
                onBlur={handleBlur}
                className={`form-input ${errors.companyTaxIdentificationNumber ? 'error' : ''} ${
                  focusedField === 'companyTaxIdentificationNumber' ? 'focused' : ''
                }`}
                placeholder="12345678901234"
              />
              {errors.companyTaxIdentificationNumber && (
                <p className="error-message">{errors.companyTaxIdentificationNumber}</p>
              )}
            </div>

            {/* Sécurité */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                className={`form-input ${errors.password ? 'error' : ''} ${
                  focusedField === 'password' ? 'focused' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
              <div className="password-hint">Minimum 6 caractères</div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={handleBlur}
                className={`form-input ${errors.confirmPassword ? 'error' : ''} ${
                  focusedField === 'confirmPassword' ? 'focused' : ''
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte entreprise'
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="login-link-container">
            <p className="login-text">
              Déjà partenaire ?{' '}
              <a href="/login" className="login-link">
                Connectez-vous
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <p className="footer-text">
            En vous inscrivant, vous acceptez nos{' '}
            <a href="/terms" className="footer-link">conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="/privacy" className="footer-link">politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
}
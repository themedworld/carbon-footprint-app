'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import Header from './../components/headerBeforogin';
import './AgriculteurForm.css';

interface AgriculteurFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  frameName: string; // Changé de farmName à frameName
  framSize: number;  // Changé de farmSize à framSize
  mainCropType: string;
}

export default function AgriculteurForm() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AgriculteurFormData>();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const watchedValues = watch();

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

  const onSubmit = async (data: AgriculteurFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      console.log('Données agriculteur:', data);

      // Préparer les données pour l'API - correspond à l'entité TypeORM
      const apiData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        frameName: data.frameName, // Correspond à l'entité
        framSize: data.framSize,   // Correspond à l'entité
        mainCropType: data.mainCropType
      };

      const response = await fetch('http://localhost:3001/api/v1/agriculteur/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Réponse API:', result);
      
      setSubmitSuccess(true);
      alert(`Inscription réussie ! Bienvenue ${data.firstName}`);
      
      // Réinitialiser le formulaire ou rediriger l'utilisateur
      // window.location.href = '/connexion'; // Décommentez pour rediriger

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription');
    }
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
      <br/><br/>
      <div className="agriculteur-container">
        <div className="form-main">
          <div className="form-wrapper">
            <div className="form-header">
              <div className="header-content">
                <h1 className="form-title">
                  Inscription Agriculteur
                </h1>
                <p className="form-subtitle">
                  Créez votre compte CarbonTrack Agri
                </p>
              </div>
            </div>

            {/* Message d'erreur global */}
            {submitError && (
              <div className="error-global">
                <div className="error-content">
                  <span className="error-icon">⚠️</span>
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            {/* Message de succès */}
            {submitSuccess && (
              <div className="success-global">
                <div className="success-content">
                  <span className="success-icon">✅</span>
                  <span>Inscription réussie ! Redirection en cours...</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {/* Informations personnelles */}
              <section className="form-section">
                <h2 className="section-title">Informations personnelles</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Prénom <span className="required">*</span>
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
                      Nom <span className="required">*</span>
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
                      Email <span className="required">*</span>
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
                      Téléphone <span className="required">*</span>
                    </label>
                    <input 
                      {...register("phone", { required: "Le téléphone est requis" })} 
                      type="tel" 
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="+33 1 23 45 67 89"
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Informations de l'exploitation */}
              <section className="form-section">
                <h2 className="section-title">Exploitation agricole</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nom de l'exploitation <span className="required">*</span>
                    </label>
                    <input 
                      {...register("frameName", { required: "Le nom de l'exploitation est requis" })} 
                      type="text" 
                      className={`form-input ${errors.frameName ? 'error' : ''}`}
                      placeholder="Nom de votre exploitation"
                    />
                    {errors.frameName && (
                      <span className="error-message">{errors.frameName.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Superficie (hectares) <span className="required">*</span>
                    </label>
                    <input 
                      {...register("framSize", { 
                        required: "La superficie est requise",
                        min: { value: 0, message: "La superficie ne peut pas être négative" },
                        valueAsNumber: true
                      })} 
                      type="number" 
                      className={`form-input ${errors.framSize ? 'error' : ''}`}
                      placeholder="0"
                      step="0.1"
                    />
                    {errors.framSize && (
                      <span className="error-message">{errors.framSize.message}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      Type de culture principal <span className="required">*</span>
                    </label>
                    <select 
                      {...register("mainCropType", { required: "Le type de culture est requis" })} 
                      className={`form-select ${errors.mainCropType ? 'error' : ''}`}
                    >
                      <option value="">Sélectionnez votre culture principale</option>
                      {cropTypes.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                    {errors.mainCropType && (
                      <span className="error-message">{errors.mainCropType.message}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* Sécurité */}
              <section className="form-section">
                <h2 className="section-title">Sécurité du compte</h2>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Mot de passe <span className="required">*</span>
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
                      Confirmer le mot de passe <span className="required">*</span>
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
                      Inscription en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
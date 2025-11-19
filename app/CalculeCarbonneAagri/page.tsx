'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './calcule.css';
import { useAuthGuard } from '../hooks/useAuthGuardAgr';
import AgriGuard from '../hooks/guardAgrcomponent';

// Types
type CultureType = 'Blé' | 'Olives' | 'Tomates' | 'Avoine' | 'Luzerne' | 'Arbres fruitiers' | 'Pâturage naturel' | 'Dattes' | 'Agrumes' | 'Raisin';
type SolType = 'Argileux' | 'Sableux' | 'Calcaire' | 'Limoneux';

interface FormData {
  nomParcelle: string;
  surface: number;
  typeCulture: CultureType;
  typeSol: SolType;
  pratiquesBiologiques: boolean;
  dieselLitres: number;
  bouteillesGaz: number;
  electriciteKWh: number;
  engraisKg: number;
  compostTonne: number;
  irrigation: boolean;
  vaches: number;
  moutons: number;
  poules: number;
  distanceTransport: number;
  trajetsAn: number;
}

const CARBON_STORAGE: Record<CultureType, number> = {
  'Blé': 0.5,
  'Olives': 3.0,
  'Tomates': 0.3,
  'Avoine': 0.5,
  'Luzerne': 1.5,
  'Arbres fruitiers': 2.0,
  'Pâturage naturel': 1.0,
  'Dattes': 2.5,
  'Agrumes': 2.2,
  'Raisin': 1.8
};

const API_URL = 'http://localhost:3001/api/v1';

// Composant d'icône personnalisé pour le succès
const SuccessIcon = () => (
  <div className="success-icon">
    <div className="success-check"></div>
  </div>
);

// Composant d'icône personnalisé pour l'erreur
const ErrorIcon = () => (
  <div className="error-icon">
    <div className="error-cross"></div>
  </div>
);

// Composant d'icône personnalisé pour l'avertissement
const WarningIcon = () => (
  <div className="warning-icon">
    <div className="warning-triangle"></div>
  </div>
);

export default function CarbonCalculator() {
  useAuthGuard();
  const { isChecking } = useAuthGuard();

  const [formData, setFormData] = useState<FormData>({
    nomParcelle: '',
    surface: 0,
    typeCulture: 'Blé',
    typeSol: 'Argileux',
    pratiquesBiologiques: false,
    dieselLitres: 0,
    bouteillesGaz: 0,
    electriciteKWh: 0,
    engraisKg: 0,
    compostTonne: 0,
    irrigation: false,
    vaches: 0,
    moutons: 0,
    poules: 0,
    distanceTransport: 0,
    trajetsAn: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const router = useRouter();
  const [agriculteur, setAgriculteur] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil + données CO2 existantes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/loginAgri');
      return;
    }

    const fetchProfileAndData = async () => {
      try {
        setLoading(true);
        setIsLoadingData(true);

        const profileRes = await fetch(`${API_URL}/agriculteur/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) throw new Error('Non autorisé');
        const profileData = await profileRes.json();
        setAgriculteur(profileData);

        const co2Res = await fetch(`${API_URL}/agriculteur/co2`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (co2Res.ok) {
          const co2Data = await co2Res.json();
          setFormData({
            nomParcelle: co2Data.nomParcelle || '',
            surface: co2Data.surface || 0,
            typeCulture: (co2Data.typeCulture as CultureType) || 'Blé',
            typeSol: (co2Data.typeSol as SolType) || 'Argileux',
            pratiquesBiologiques: co2Data.pratiquesBiologiques || false,
            dieselLitres: co2Data.dieselLitres || 0,
            bouteillesGaz: co2Data.bouteillesGaz || 0,
            electriciteKWh: co2Data.electriciteKWh || 0,
            engraisKg: co2Data.engraisKg || 0,
            compostTonne: co2Data.compostTonne || 0,
            irrigation: co2Data.irrigation || false,
            vaches: co2Data.vaches || 0,
            moutons: co2Data.moutons || 0,
            poules: co2Data.poules || 0,
            distanceTransport: co2Data.distanceTransport || 0,
            trajetsAn: co2Data.trajetsAn || 0,
          });
          setHasExistingData(true);
        } else if (co2Res.status === 404) {
          setHasExistingData(false);
        } else {
          throw new Error('Erreur lors du chargement des données CO2');
        }
      } catch (err) {
        console.error(err);
        setError('Session expirée ou erreur de chargement');
        localStorage.removeItem('access_token');
        router.push('/loginAgri');
      } finally {
        setLoading(false);
        setIsLoadingData(false);
      }
    };

    fetchProfileAndData();
  }, [router]);

  // Calcul du carbone
  const calculateCarbon = (data: FormData) => {
    const fuelCO2 = data.dieselLitres * 2.68;
    const gasCO2 = data.bouteillesGaz * 12;
    const electricityCO2 = data.electriciteKWh * 0.5;
    const fertilizerCO2 = data.engraisKg * 4;

    let reduction = 0;
    if (data.pratiquesBiologiques) reduction += 0.2;
    if (data.compostTonne > 0) reduction += 0.2;

    const adjustedFertilizerCO2 = fertilizerCO2 * (1 - Math.min(reduction, 0.4));
    const irrigationCO2 = data.irrigation ? (fuelCO2 + electricityCO2) * 0.05 : 0;
    const livestockCO2 = (data.vaches * 2000) + (data.moutons * 300) + (data.poules * 20);
    const transportCO2 = (data.distanceTransport * data.trajetsAn * 0.25);

    const totalCO2 = fuelCO2 + gasCO2 + electricityCO2 + adjustedFertilizerCO2 +
                    irrigationCO2 + livestockCO2 + transportCO2;

    const carbonStored = CARBON_STORAGE[data.typeCulture] * data.surface;
    const carbonEmitted = (totalCO2 * 12) / (44 * 1000);
    const netCarbon = carbonStored - carbonEmitted;
    const valueDT = netCarbon * 32;

    return {
      nomParcelle: data.nomParcelle,
      surface: data.surface,
      typeCulture: data.typeCulture,
      typeSol: data.typeSol,
      pratiquesBiologiques: data.pratiquesBiologiques,
      dieselLitres: data.dieselLitres,
      bouteillesGaz: data.bouteillesGaz,
      electriciteKWh: data.electriciteKWh,
      engraisKg: data.engraisKg,
      compostTonne: data.compostTonne,
      irrigation: data.irrigation,
      vaches: data.vaches,
      moutons: data.moutons,
      poules: data.poules,
      distanceTransport: data.distanceTransport,
      trajetsAn: data.trajetsAn,
      emissionsTotalCO2: totalCO2,
      carbonStored,
      carbonEmitted,
      netCarbon,
      valueDT,
      dateCalcul: new Date().toISOString()
    };
  };

  // Enregistrer ou mettre à jour
  const saveToDatabase = async (calculation: any) => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    const method = hasExistingData ? 'PATCH' : 'POST';
    const url = `${API_URL}/agriculteur/co2`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(calculation)
      });

      if (response.ok) {
        setHasExistingData(true);
        return true;
      } else {
        const error = await response.json();
        console.error('Erreur API:', error);
        return false;
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const calculation = calculateCarbon(formData);
      const success = await saveToDatabase(calculation);

      if (success) {
        setSubmitStatus('success');
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? parseFloat(value) || 0
          : value
    }));
  };

  if (isChecking || loading || isLoadingData) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement de vos données agricoles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <WarningIcon />
          <h3>Session expirée</h3>
          <p>{error}</p>
          <button onClick={() => router.push('/loginAgri')} className="reconnect-btn">
            Se reconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <AgriGuard>
      <div className="carbon-calculator">
        {/* En-tête avec design tunisien */}
        <div className="calculator-header">
          <div className="header-background">
            <div className="header-overlay">
              <div className="header-content">
                <div className="title-container">
                  <div className="title-icon leaf-icon"></div>
                  <h1 className="calculator-title">
                    Calculateur Carbone Agricole Tunisien
                  </h1>
                </div>
                <p className="calculator-subtitle">
                  {hasExistingData
                    ? 'Modifiez vos données de durabilité et optimisez votre impact environnemental'
                    : 'Enregistrez vos premières données et rejoignez la révolution agricole durable'
                  }
                </p>
              </div>
              <div className="header-decoration">
                <div className="decoration-item olive-branch"></div>
                <div className="decoration-item wheat-spike"></div>
                <div className="decoration-item date-palm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages de statut */}
        {submitStatus === 'success' && (
          <div className="status-message success">
            <SuccessIcon />
            <div className="status-content">
              <h4>Données {hasExistingData ? 'modifiées' : 'enregistrées'} avec succès !</h4>
              <p>Votre bilan carbone a été calculé et sauvegardé.</p>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="status-message error">
            <ErrorIcon />
            <div className="status-content">
              <h4>Erreur lors de l'enregistrement</h4>
              <p>Veuillez vérifier votre connexion et réessayer.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="calculator-form">
          {/* Informations générales */}
          <section className="form-section section-info">
            <div className="section-header">
              <div className="section-icon parcel-icon"></div>
              <div className="section-title-container">
                <h2 className="section-title">Informations de la Parcelle</h2>
                <p className="section-description">Définissez les caractéristiques principales de votre exploitation</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Nom de la parcelle <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nomParcelle"
                  value={formData.nomParcelle}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ex: Béja_Nord_01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Surface (hectares) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Type de culture <span className="required">*</span>
                </label>
                <select
                  name="typeCulture"
                  value={formData.typeCulture}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  {Object.keys(CARBON_STORAGE).map(culture => (
                    <option key={culture} value={culture}>
                      {culture}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Type de sol <span className="required">*</span>
                </label>
                <select
                  name="typeSol"
                  value={formData.typeSol}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="Argileux">Argileux</option>
                  <option value="Sableux">Sableux</option>
                  <option value="Calcaire">Calcaire</option>
                  <option value="Limoneux">Limoneux</option>
                </select>
              </div>
              <div className="checkbox-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="pratiquesBiologiques"
                    checked={formData.pratiquesBiologiques}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    <span className="checkbox-title">Pratiques agricoles biologiques</span>
                    <span className="checkbox-description">Réduction de 20% des émissions d'engrais</span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Énergie & carburant */}
          <section className="form-section section-energy">
            <div className="section-header">
              <div className="section-icon energy-icon"></div>
              <div className="section-title-container">
                <h2 className="section-title">Énergie & Carburant</h2>
                <p className="section-description">Consommations énergétiques annuelles</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Diesel (litres/an)</label>
                <input 
                  type="number" 
                  name="dieselLitres" 
                  value={formData.dieselLitres} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon fuel-icon"></span>
                  <span className="info-text">2.68 kg CO₂e par litre</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bouteilles de gaz/an</label>
                <input 
                  type="number" 
                  name="bouteillesGaz" 
                  value={formData.bouteillesGaz} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon gas-icon"></span>
                  <span className="info-text">12 kg CO₂e par bouteille</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Électricité (kWh/an)</label>
                <input 
                  type="number" 
                  name="electriciteKWh" 
                  value={formData.electriciteKWh} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon electricity-icon"></span>
                  <span className="info-text">0.5 kg CO₂e par kWh</span>
                </div>
              </div>
            </div>
          </section>

          {/* Engrais & amendements */}
          <section className="form-section section-fertilizer">
            <div className="section-header">
              <div className="section-icon fertilizer-icon"></div>
              <div className="section-title-container">
                <h2 className="section-title">Engrais & Amendements</h2>
                <p className="section-description">Intrants et pratiques de fertilisation</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Engrais chimique (kg/an)</label>
                <input 
                  type="number" 
                  name="engraisKg" 
                  value={formData.engraisKg} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon chemical-icon"></span>
                  <span className="info-text">4 kg CO₂e par kg d'engrais</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Compost/fumier (tonnes/an)</label>
                <input 
                  type="number" 
                  name="compostTonne" 
                  value={formData.compostTonne} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  step="0.1" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon compost-icon"></span>
                  <span className="info-text">Réduction de 20% des émissions d'engrais</span>
                </div>
              </div>
              <div className="checkbox-group full-width">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="irrigation" 
                    checked={formData.irrigation} 
                    onChange={handleInputChange} 
                    className="checkbox" 
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    <span className="checkbox-title">Système d'irrigation utilisé</span>
                    <span className="checkbox-description">Impact supplémentaire sur la consommation d'énergie</span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Élevage */}
          <section className="form-section section-livestock">
            <div className="section-header">
              <div className="section-icon livestock-icon"></div>
              <div className="section-title-container">
                <h2 className="section-title">Élevage</h2>
                <p className="section-description">Effectifs des animaux d'élevage</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre de vaches</label>
                <input 
                  type="number" 
                  name="vaches" 
                  value={formData.vaches} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon cow-icon"></span>
                  <span className="info-text">2000 kg CO₂e par an</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de moutons</label>
                <input 
                  type="number" 
                  name="moutons" 
                  value={formData.moutons} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon sheep-icon"></span>
                  <span className="info-text">300 kg CO₂e par an</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de poules</label>
                <input 
                  type="number" 
                  name="poules" 
                  value={formData.poules} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon chicken-icon"></span>
                  <span className="info-text">20 kg CO₂e par an</span>
                </div>
              </div>
            </div>
          </section>

          {/* Transport */}
          <section className="form-section section-transport">
            <div className="section-header">
              <div className="section-icon transport-icon"></div>
              <div className="section-title-container">
                <h2 className="section-title">Transport</h2>
                <p className="section-description">Déplacements liés à l'activité agricole</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Distance transport (km/trajet)</label>
                <input 
                  type="number" 
                  name="distanceTransport" 
                  value={formData.distanceTransport} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de trajets/an</label>
                <input 
                  type="number" 
                  name="trajetsAn" 
                  value={formData.trajetsAn} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  min="0" 
                  placeholder="0"
                />
                <div className="input-info">
                  <span className="info-icon transport-icon-small"></span>
                  <span className="info-text">0.25 kg CO₂e par km</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bouton de soumission */}
          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Calcul en cours...</span>
                </>
              ) : hasExistingData ? (
                <>
                  <div className="button-icon update-icon"></div>
                  <span>Mettre à jour le bilan carbone</span>
                </>
              ) : (
                <>
                  <div className="button-icon calculate-icon"></div>
                  <span>Calculer mon premier bilan carbone</span>
                </>
              )}
            </button>
            
            <div className="form-note">
              <div className="note-icon"></div>
              <p>Votre bilan carbone sera calculé automatiquement et vous pourrez le visualiser dans votre tableau de bord.</p>
            </div>
          </div>
        </form>
      </div>
    </AgriGuard>
  );
}
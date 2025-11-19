'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './visualisation.css';

const API_URL = 'http://localhost:3001/api/v1';

interface Co2Data {
  nomParcelle: string;
  surface: number;
  typeCulture: string;
  typeSol: string;
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
  emissionsTotalCO2: number;
  carbonStored: number;
  carbonEmitted: number;
  netCarbon: number;
  valueDT: number;
  dateCalcul: string;
}

export default function CarbonDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Co2Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/loginAgri');
      return;
    }

    fetch(`${API_URL}/agriculteur/co2`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Aucune donnée carbone enregistrée. Veuillez d'abord remplir le calculateur.");
          }
          throw new Error('Erreur de chargement');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Chargement de votre bilan carbone...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p className="error-title">Oops !</p>
        <p>{error}</p>
        <button onClick={() => router.push('/calculateur')} className="btn-primary">
          Aller au calculateur
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Préparation des données pour les graphiques
  const emissionSources = [
    { name: 'Diesel', value: data.dieselLitres * 2.68, color: '#dc2626' },
    { name: 'Gaz', value: data.bouteillesGaz * 12, color: '#ea580c' },
    { name: 'Électricité', value: data.electriciteKWh * 0.5, color: '#d97706' },
    { name: 'Engrais', value: data.engraisKg * 4 * (1 - (data.pratiquesBiologiques ? 0.2 : 0) - (data.compostTonne > 0 ? 0.2 : 0)), color: '#65a30d' },
    { name: 'Élevage', value: (data.vaches * 2000) + (data.moutons * 300) + (data.poules * 20), color: '#0891b2' },
    { name: 'Transport', value: data.distanceTransport * data.trajetsAn * 0.25, color: '#7c3aed' },
  ].filter(item => item.value > 0);

  const storageVsEmission = [
    { name: 'Stocké', value: data.carbonStored, color: '#059669' },
    { name: 'Émis', value: data.carbonEmitted, color: '#dc2626' },
  ];

  const creditsData = [
    { label: 'Crédits carbone nets', value: data.netCarbon > 0 ? data.netCarbon : 0, unit: 'tCO₂e' },
    { label: 'Valeur estimée', value: data.valueDT > 0 ? data.valueDT : 0, unit: 'DT' },
  ];

  return (
    <div className="carbon-dashboard">
      {/* Header avec image agricole */}
      <header className="dashboard-header">
        <div className="header-background">
          <div className="header-overlay">
            <h1>Tableau de Bord Carbone</h1>
            <p className="parcelle-name">
              Parcelle : <strong>{data.nomParcelle}</strong> | {data.surface} ha | {data.typeCulture}
            </p>
            <p className="last-update">
              Dernière mise à jour : {new Date(data.dateCalcul).toLocaleDateString('fr-TN')}
            </p>
          </div>
        </div>
      </header>

      {/* Cartes de résumé avec design vert */}
      <div className="summary-cards">
        <div className="card card-storage">
          <div className="card-image soil-image"></div>
          <div className="card-content">
            <h3>{data.carbonStored.toFixed(2)} tCO₂e</h3>
            <p>Carbone stocké dans le sol</p>
            <div className="card-decoration leaf-decoration"></div>
          </div>
        </div>
        
        <div className="card card-emissions">
          <div className="card-image factory-image"></div>
          <div className="card-content">
            <h3>{data.carbonEmitted.toFixed(2)} tCO₂e</h3>
            <p>Émissions totales</p>
            <div className="card-decoration cloud-decoration"></div>
          </div>
        </div>
        
        <div className={`card ${data.netCarbon >= 0 ? 'card-positive' : 'card-negative'}`}>
          <div className="card-image balance-image"></div>
          <div className="card-content">
            <h3>{Math.abs(data.netCarbon).toFixed(2)} tCO₂e</h3>
            <p>Bilan net ({data.netCarbon >= 0 ? 'Crédit' : 'Débit'})</p>
            <div className="card-decoration scale-decoration"></div>
          </div>
        </div>
        
        <div className="card card-value">
          <div className="card-image money-image"></div>
          <div className="card-content">
            <h3>{data.valueDT.toFixed(0)} DT</h3>
            <p>Crédit carbone estimé</p>
            <div className="card-decoration coin-decoration"></div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Répartition des émissions */}
        <div className="chart-container">
          <h3>Répartition des émissions</h3>
          {emissionSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emissionSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emissionSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)} kg CO₂e`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">Aucune émission détectée</p>
          )}
        </div>

        {/* Stockage vs Émissions */}
        <div className="chart-container">
          <h3>Stockage vs Émissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storageVsEmission}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} tCO₂e`} />
              <Bar dataKey="value" fill="#8884d8">
                {storageVsEmission.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crédits carbone */}
        <div className="chart-container full-width">
          <h3>Valeur de vos crédits carbone</h3>
          <div className="credits-display">
            <div className="credit-item credit-net">
              <span className="label">Crédit net</span>
              <span className="value">{data.netCarbon > 0 ? data.netCarbon.toFixed(2) : 0} tCO₂e</span>
            </div>
            <div className="credit-item credit-value">
              <span className="label">Valeur marchande</span>
              <span className="value">{data.valueDT.toFixed(0)} DT</span>
            </div>
          </div>
          <p className="credit-note">
            * Estimation à 32 DT/tCO₂e (prix moyen marché volontaire 2025)
          </p>
        </div>
      </div>

      {/* Détails techniques */}
      <details className="details-section">
        <summary>Détails techniques & hypothèses</summary>
        <div className="details-content">
          <ul>
            <li>Diesel : 2.68 kg CO₂e/L</li>
            <li>Gaz (bouteille 13kg) : 12 kg CO₂e</li>
            <li>Électricité : 0.5 kg CO₂e/kWh (mix tunisien)</li>
            <li>Engrais N : 4 kg CO₂e/kg</li>
            <li>Pratiques bio & compost : -20% sur engrais</li>
            <li>Vache : 2000 kg CO₂e/an | Mouton : 300 kg | Poule : 20 kg</li>
            <li>Transport : 0.25 kg CO₂e/km</li>
          </ul>
        </div>
      </details>

      <div className="actions">
        <button onClick={() => router.push('/calculateur')} className="btn-update">
          Mettre à jour les données
        </button>
      </div>
    </div>
  );
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Risk, 
  Control, 
  RiskFactor, 
  Consequence, 
  BowTieRelationship 
} from '../types';
import { apiService } from '../services/api';
import { calculateRiskLevel } from '../utils/helpers';

interface GRCContextType {
  // Data
  risks: Risk[];
  controls: Control[];
  riskFactors: RiskFactor[];
  consequences: Consequence[];
  bowTieRelationships: BowTieRelationship[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Risk CRUD
  addRisk: (risk: Omit<Risk, 'id' | 'level'>) => Promise<void>;
  updateRisk: (id: string, risk: Partial<Risk>) => Promise<void>;
  deleteRisk: (id: string) => Promise<void>;
  
  // Control CRUD
  addControl: (control: Omit<Control, 'id'>) => Promise<void>;
  updateControl: (id: string, control: Partial<Control>) => Promise<void>;
  deleteControl: (id: string) => Promise<void>;
  
  // Risk Factor CRUD
  addRiskFactor: (factor: Omit<RiskFactor, 'id'>) => Promise<void>;
  updateRiskFactor: (id: string, factor: Partial<RiskFactor>) => Promise<void>;
  deleteRiskFactor: (id: string) => Promise<void>;
  
  // Consequence CRUD
  addConsequence: (consequence: Omit<Consequence, 'id'>) => Promise<void>;
  updateConsequence: (id: string, consequence: Partial<Consequence>) => Promise<void>;
  deleteConsequence: (id: string) => Promise<void>;
  
  // Bow-Tie CRUD
  addBowTieRelationship: (relation: Omit<BowTieRelationship, 'id'>) => Promise<void>;
  updateBowTieRelationship: (id: string, relation: Partial<BowTieRelationship>) => Promise<void>;
  deleteBowTieRelationship: (id: string) => Promise<void>;

  // Refresh data
  refreshData: () => Promise<void>;
}

const GRCContext = createContext<GRCContextType | null>(null);

export const useGRC = () => {
  const context = useContext(GRCContext);
  if (!context) {
    throw new Error('useGRC must be used within a GRCProvider');
  }
  return context;
};

interface GRCProviderProps {
  children: ReactNode;
}

export const GRCProvider: React.FC<GRCProviderProps> = ({ children }) => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [consequences, setConsequences] = useState<Consequence[]>([]);
  const [bowTieRelationships, setBowTieRelationships] = useState<BowTieRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from API
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        risksData,
        controlsData,
        factorsData,
        consequencesData,
        relationshipsData
      ] = await Promise.all([
        apiService.getRisks(),
        apiService.getControls(),
        apiService.getRiskFactors(),
        apiService.getConsequences(),
        apiService.getBowTieRelationships()
      ]);

      setRisks(risksData);
      setControls(controlsData);
      setRiskFactors(factorsData);
      setConsequences(consequencesData);
      setBowTieRelationships(relationshipsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Risk CRUD operations
  const addRisk = async (risk: Omit<Risk, 'id' | 'level'>) => {
    try {
      const newRisk = await apiService.createRisk(risk);
      setRisks(prev => [...prev, newRisk]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create risk');
      throw err;
    }
  };

  const updateRisk = async (id: string, risk: Partial<Risk>) => {
    try {
      const updatedRisk = await apiService.updateRisk(id, risk);
      setRisks(prev => prev.map(r => r.id === id ? updatedRisk : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update risk');
      throw err;
    }
  };

  const deleteRisk = async (id: string) => {
    try {
      await apiService.deleteRisk(id);
      setRisks(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete risk');
      throw err;
    }
  };

  // Control CRUD operations
  const addControl = async (control: Omit<Control, 'id'>) => {
    try {
      const newControl = await apiService.createControl(control);
      setControls(prev => [...prev, newControl]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create control');
      throw err;
    }
  };

  const updateControl = async (id: string, control: Partial<Control>) => {
    try {
      const updatedControl = await apiService.updateControl(id, control);
      setControls(prev => prev.map(c => c.id === id ? updatedControl : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update control');
      throw err;
    }
  };

  const deleteControl = async (id: string) => {
    try {
      await apiService.deleteControl(id);
      setControls(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete control');
      throw err;
    }
  };

  // Risk Factor CRUD operations
  const addRiskFactor = async (factor: Omit<RiskFactor, 'id'>) => {
    try {
      const newFactor = await apiService.createRiskFactor(factor);
      setRiskFactors(prev => [...prev, newFactor]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create risk factor');
      throw err;
    }
  };

  const updateRiskFactor = async (id: string, factor: Partial<RiskFactor>) => {
    try {
      // Note: Update API endpoint would need to be implemented
      setRiskFactors(prev => prev.map(f => f.id === id ? { ...f, ...factor } : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update risk factor');
      throw err;
    }
  };

  const deleteRiskFactor = async (id: string) => {
    try {
      // Note: Delete API endpoint would need to be implemented
      setRiskFactors(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete risk factor');
      throw err;
    }
  };

  // Consequence CRUD operations
  const addConsequence = async (consequence: Omit<Consequence, 'id'>) => {
    try {
      const newConsequence = await apiService.createConsequence(consequence);
      setConsequences(prev => [...prev, newConsequence]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create consequence');
      throw err;
    }
  };

  const updateConsequence = async (id: string, consequence: Partial<Consequence>) => {
    try {
      // Note: Update API endpoint would need to be implemented
      setConsequences(prev => prev.map(c => c.id === id ? { ...c, ...consequence } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update consequence');
      throw err;
    }
  };

  const deleteConsequence = async (id: string) => {
    try {
      // Note: Delete API endpoint would need to be implemented
      setConsequences(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete consequence');
      throw err;
    }
  };

  // Bow-Tie CRUD operations
  const addBowTieRelationship = async (relation: Omit<BowTieRelationship, 'id'>) => {
    try {
      const newRelation = await apiService.createBowTieRelationship(relation);
      setBowTieRelationships(prev => [...prev, newRelation]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bow-tie relationship');
      throw err;
    }
  };

  const updateBowTieRelationship = async (id: string, relation: Partial<BowTieRelationship>) => {
    try {
      // Note: Update API endpoint would need to be implemented
      setBowTieRelationships(prev => prev.map(b => b.id === id ? { ...b, ...relation } : b));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bow-tie relationship');
      throw err;
    }
  };

  const deleteBowTieRelationship = async (id: string) => {
    try {
      // Note: Delete API endpoint would need to be implemented
      setBowTieRelationships(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bow-tie relationship');
      throw err;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const value: GRCContextType = {
    risks,
    controls,
    riskFactors,
    consequences,
    bowTieRelationships,
    loading,
    error,
    addRisk,
    updateRisk,
    deleteRisk,
    addControl,
    updateControl,
    deleteControl,
    addRiskFactor,
    updateRiskFactor,
    deleteRiskFactor,
    addConsequence,
    updateConsequence,
    deleteConsequence,
    addBowTieRelationship,
    updateBowTieRelationship,
    deleteBowTieRelationship,
    refreshData
  };

  return (
    <GRCContext.Provider value={value}>
      {children}
    </GRCContext.Provider>
  );
};
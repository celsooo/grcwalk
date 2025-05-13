import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Risk, 
  Control, 
  RiskFactor, 
  Consequence, 
  BowTieRelationship 
} from '../types';
import { 
  initialRisks, 
  initialControls, 
  initialRiskFactors, 
  initialConsequences, 
  initialBowTieRelationships 
} from '../data/initialData';
import { calculateRiskLevel, generateId } from '../utils/helpers';

interface GRCContextType {
  // Data
  risks: Risk[];
  controls: Control[];
  riskFactors: RiskFactor[];
  consequences: Consequence[];
  bowTieRelationships: BowTieRelationship[];
  
  // Risk CRUD
  addRisk: (risk: Omit<Risk, 'id' | 'level'>) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;
  
  // Control CRUD
  addControl: (control: Omit<Control, 'id'>) => void;
  updateControl: (id: string, control: Partial<Control>) => void;
  deleteControl: (id: string) => void;
  
  // Risk Factor CRUD
  addRiskFactor: (factor: Omit<RiskFactor, 'id'>) => void;
  updateRiskFactor: (id: string, factor: Partial<RiskFactor>) => void;
  deleteRiskFactor: (id: string) => void;
  
  // Consequence CRUD
  addConsequence: (consequence: Omit<Consequence, 'id'>) => void;
  updateConsequence: (id: string, consequence: Partial<Consequence>) => void;
  deleteConsequence: (id: string) => void;
  
  // Bow-Tie CRUD
  addBowTieRelationship: (relation: Omit<BowTieRelationship, 'id'>) => void;
  updateBowTieRelationship: (id: string, relation: Partial<BowTieRelationship>) => void;
  deleteBowTieRelationship: (id: string) => void;
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
  const [risks, setRisks] = useState<Risk[]>(
    initialRisks.map(risk => ({
      ...risk,
      level: calculateRiskLevel(risk.likelihood, risk.impact)
    }))
  );
  const [controls, setControls] = useState<Control[]>(initialControls);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>(initialRiskFactors);
  const [consequences, setConsequences] = useState<Consequence[]>(initialConsequences);
  const [bowTieRelationships, setBowTieRelationships] = useState<BowTieRelationship[]>(initialBowTieRelationships);

  // Risk CRUD operations
  const addRisk = (risk: Omit<Risk, 'id' | 'level'>) => {
    const newRisk: Risk = {
      ...risk,
      id: generateId(),
      level: calculateRiskLevel(risk.likelihood, risk.impact)
    };
    setRisks(prev => [...prev, newRisk]);
  };

  const updateRisk = (id: string, risk: Partial<Risk>) => {
    setRisks(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...risk };
        
        // Recalculate level if likelihood or impact changed
        if (risk.likelihood !== undefined || risk.impact !== undefined) {
          const likelihood = risk.likelihood !== undefined ? risk.likelihood : r.likelihood;
          const impact = risk.impact !== undefined ? risk.impact : r.impact;
          updated.level = calculateRiskLevel(likelihood, impact);
        }
        
        return updated;
      }
      return r;
    }));
  };

  const deleteRisk = (id: string) => {
    // Remove the risk
    setRisks(prev => prev.filter(r => r.id !== id));
    
    // Update relations in controls
    setControls(prev => prev.map(c => ({
      ...c,
      riskIds: c.riskIds.filter(rId => rId !== id)
    })));
    
    // Update relations in risk factors
    setRiskFactors(prev => prev.map(f => ({
      ...f,
      riskIds: f.riskIds.filter(rId => rId !== id)
    })));
    
    // Update relations in consequences
    setConsequences(prev => prev.map(c => ({
      ...c,
      riskIds: c.riskIds.filter(rId => rId !== id)
    })));
    
    // Remove bow-tie relationships
    setBowTieRelationships(prev => prev.filter(b => b.riskId !== id));
  };

  // Control CRUD operations
  const addControl = (control: Omit<Control, 'id'>) => {
    const newControl: Control = {
      ...control,
      id: generateId()
    };
    setControls(prev => [...prev, newControl]);
    
    // Update risk control references
    control.riskIds.forEach(riskId => {
      setRisks(prev => prev.map(r => {
        if (r.id === riskId) {
          return {
            ...r,
            controlIds: [...r.controlIds, newControl.id]
          };
        }
        return r;
      }));
    });
  };

  const updateControl = (id: string, control: Partial<Control>) => {
    let oldRiskIds: string[] = [];
    let newRiskIds: string[] = [];
    
    // Get the control before update
    if (control.riskIds !== undefined) {
      const oldControl = controls.find(c => c.id === id);
      if (oldControl) {
        oldRiskIds = oldControl.riskIds;
        newRiskIds = control.riskIds;
      }
    }
    
    // Update the control
    setControls(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...control };
      }
      return c;
    }));
    
    // Update risk references if riskIds changed
    if (control.riskIds !== undefined) {
      // Remove control from risks no longer associated
      const removedRiskIds = oldRiskIds.filter(id => !newRiskIds.includes(id));
      if (removedRiskIds.length > 0) {
        setRisks(prev => prev.map(r => {
          if (removedRiskIds.includes(r.id)) {
            return {
              ...r,
              controlIds: r.controlIds.filter(cId => cId !== id)
            };
          }
          return r;
        }));
      }
      
      // Add control to newly associated risks
      const addedRiskIds = newRiskIds.filter(id => !oldRiskIds.includes(id));
      if (addedRiskIds.length > 0) {
        setRisks(prev => prev.map(r => {
          if (addedRiskIds.includes(r.id)) {
            return {
              ...r,
              controlIds: [...r.controlIds, id]
            };
          }
          return r;
        }));
      }
    }
  };

  const deleteControl = (id: string) => {
    // Get the control to be deleted
    const controlToDelete = controls.find(c => c.id === id);
    
    // Remove the control
    setControls(prev => prev.filter(c => c.id !== id));
    
    // Update risk control references
    if (controlToDelete) {
      controlToDelete.riskIds.forEach(riskId => {
        setRisks(prev => prev.map(r => {
          if (r.id === riskId) {
            return {
              ...r,
              controlIds: r.controlIds.filter(cId => cId !== id)
            };
          }
          return r;
        }));
      });
    }
  };

  // Risk Factor CRUD operations
  const addRiskFactor = (factor: Omit<RiskFactor, 'id'>) => {
    const newFactor: RiskFactor = {
      ...factor,
      id: generateId()
    };
    setRiskFactors(prev => [...prev, newFactor]);
  };

  const updateRiskFactor = (id: string, factor: Partial<RiskFactor>) => {
    setRiskFactors(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, ...factor };
      }
      return f;
    }));
  };

  const deleteRiskFactor = (id: string) => {
    // Remove the factor
    setRiskFactors(prev => prev.filter(f => f.id !== id));
    
    // Update bow-tie relationships
    setBowTieRelationships(prev => prev.map(b => ({
      ...b,
      factorIds: b.factorIds.filter(fId => fId !== id)
    })));
  };

  // Consequence CRUD operations
  const addConsequence = (consequence: Omit<Consequence, 'id'>) => {
    const newConsequence: Consequence = {
      ...consequence,
      id: generateId()
    };
    setConsequences(prev => [...prev, newConsequence]);
  };

  const updateConsequence = (id: string, consequence: Partial<Consequence>) => {
    setConsequences(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...consequence };
      }
      return c;
    }));
  };

  const deleteConsequence = (id: string) => {
    // Remove the consequence
    setConsequences(prev => prev.filter(c => c.id !== id));
    
    // Update bow-tie relationships
    setBowTieRelationships(prev => prev.map(b => ({
      ...b,
      consequenceIds: b.consequenceIds.filter(cId => cId !== id)
    })));
  };

  // Bow-Tie CRUD operations
  const addBowTieRelationship = (relation: Omit<BowTieRelationship, 'id'>) => {
    const newRelation: BowTieRelationship = {
      ...relation,
      id: generateId()
    };
    setBowTieRelationships(prev => [...prev, newRelation]);
  };

  const updateBowTieRelationship = (id: string, relation: Partial<BowTieRelationship>) => {
    setBowTieRelationships(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, ...relation };
      }
      return b;
    }));
  };

  const deleteBowTieRelationship = (id: string) => {
    setBowTieRelationships(prev => prev.filter(b => b.id !== id));
  };

  const value: GRCContextType = {
    risks,
    controls,
    riskFactors,
    consequences,
    bowTieRelationships,
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
    deleteBowTieRelationship
  };

  return (
    <GRCContext.Provider value={value}>
      {children}
    </GRCContext.Provider>
  );
};
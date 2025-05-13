import React, { useState } from 'react';
import { useGRC } from '../../context/GRCContext';
import { Risk, RiskFactor, Consequence } from '../../types';

const BowTieChart: React.FC<{ riskId: string }> = ({ riskId }) => {
  const { 
    risks, 
    riskFactors, 
    consequences, 
    bowTieRelationships 
  } = useGRC();
  
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  // Find the selected risk
  const selectedRisk = risks.find(r => r.id === riskId);
  if (!selectedRisk) {
    return (
      <div className="text-center p-8 text-gray-500">
        Please select a risk to view its bow-tie analysis.
      </div>
    );
  }
  
  // Find the bow-tie relationship for this risk
  const bowTieRelationship = bowTieRelationships.find(b => b.riskId === riskId);
  if (!bowTieRelationship) {
    return (
      <div className="text-center p-8 text-gray-500">
        No bow-tie analysis found for this risk.
      </div>
    );
  }
  
  // Get the risk factors and consequences for this risk
  const factorsForRisk = riskFactors.filter(factor => 
    bowTieRelationship.factorIds.includes(factor.id)
  );
  
  const consequencesForRisk = consequences.filter(consequence => 
    bowTieRelationship.consequenceIds.includes(consequence.id)
  );
  
  // Determine if a card is active and should be highlighted
  const isCardActive = (id: string, type: 'factor' | 'risk' | 'consequence') => {
    if (!activeCard) return false;
    
    if (activeCard === id) {
      return true;
    }
    
    if (type === 'factor' && activeCard === selectedRisk.id) {
      const factor = riskFactors.find(f => f.id === id);
      return factor?.riskIds.includes(selectedRisk.id) || false;
    }
    
    if (type === 'consequence' && activeCard === selectedRisk.id) {
      const consequence = consequences.find(c => c.id === id);
      return consequence?.riskIds.includes(selectedRisk.id) || false;
    }
    
    if (type === 'risk') {
      const factor = riskFactors.find(f => f.id === activeCard);
      if (factor) {
        return factor.riskIds.includes(id);
      }
      
      const consequence = consequences.find(c => c.id === activeCard);
      if (consequence) {
        return consequence.riskIds.includes(id);
      }
    }
    
    return false;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Bow-Tie Analysis: {selectedRisk.name}
      </h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-8 md:space-y-0">
        {/* Risk Factors */}
        <div className="w-full md:w-1/3 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 text-center">Risk Factors</h4>
          {factorsForRisk.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No factors defined</div>
          ) : (
            <div className="space-y-3">
              {factorsForRisk.map(factor => (
                <div 
                  key={factor.id}
                  className={`p-3 border rounded-md transition-all duration-200 cursor-pointer
                    ${isCardActive(factor.id, 'factor') 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                  onMouseEnter={() => setActiveCard(factor.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="font-medium text-sm">{factor.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{factor.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Risk Box (Center) */}
        <div className="w-full md:w-1/4">
          <div className="flex flex-col items-center">
            <div className="w-0 h-24 border-l-2 border-dashed border-gray-300"></div>
            <div 
              className={`p-4 border-2 rounded-md w-full text-center transition-all duration-200 cursor-pointer
                ${isCardActive(selectedRisk.id, 'risk') 
                  ? 'border-red-500 bg-red-50 shadow-md' 
                  : 'border-red-300 hover:border-red-500 hover:bg-red-50'}`}
              onMouseEnter={() => setActiveCard(selectedRisk.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="font-bold text-sm">{selectedRisk.name}</div>
              <div className="text-xs text-gray-600 mt-1">{selectedRisk.description}</div>
            </div>
            <div className="w-0 h-24 border-l-2 border-dashed border-gray-300"></div>
          </div>
        </div>
        
        {/* Consequences */}
        <div className="w-full md:w-1/3 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 text-center">Consequences</h4>
          {consequencesForRisk.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No consequences defined</div>
          ) : (
            <div className="space-y-3">
              {consequencesForRisk.map(consequence => (
                <div 
                  key={consequence.id}
                  className={`p-3 border rounded-md transition-all duration-200 cursor-pointer
                    ${isCardActive(consequence.id, 'consequence') 
                      ? 'border-amber-500 bg-amber-50 shadow-md' 
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'}`}
                  onMouseEnter={() => setActiveCard(consequence.id)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="font-medium text-sm">{consequence.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{consequence.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="h-4 w-4 border-blue-500 border bg-blue-50 mr-2"></div>
            <span className="text-xs">Risk Factors</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 border-red-500 border bg-red-50 mr-2"></div>
            <span className="text-xs">Risk Event</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 border-amber-500 border bg-amber-50 mr-2"></div>
            <span className="text-xs">Consequences</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowTieChart;
import React from 'react';
import { useGRC } from '../../context/GRCContext';
import { getRiskLevelColor } from '../../utils/helpers';

interface RiskSelectorProps {
  selectedRiskId: string;
  onSelectRisk: (id: string) => void;
}

const RiskSelector: React.FC<RiskSelectorProps> = ({ 
  selectedRiskId, 
  onSelectRisk 
}) => {
  const { risks, bowTieRelationships } = useGRC();
  
  // Filter risks to only those that have bow-tie relationships
  const risksWithBowTie = risks.filter(risk => 
    bowTieRelationships.some(rel => rel.riskId === risk.id)
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Select a Risk</h3>
      </div>
      
      {risksWithBowTie.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No risks with bow-tie analysis available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {risksWithBowTie.map(risk => (
            <div
              key={risk.id}
              className={`p-4 border rounded-md cursor-pointer transition-all duration-200 ${
                selectedRiskId === risk.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onSelectRisk(risk.id)}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium">{risk.name}</div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getRiskLevelColor(risk.level || 'Low')}`}>
                  {risk.level}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {risk.description.substring(0, 60)}{risk.description.length > 60 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiskSelector;
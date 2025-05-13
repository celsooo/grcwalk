import React, { useState } from 'react';
import { useGRC } from '../context/GRCContext';
import RiskSelector from '../components/bowtie/RiskSelector';
import BowTieChart from '../components/bowtie/BowTieChart';

const BowTieAnalysisPage: React.FC = () => {
  const { risks, bowTieRelationships } = useGRC();
  
  // Default to the first risk with a bow-tie relationship, if available
  const defaultRiskId = bowTieRelationships.length > 0 
    ? bowTieRelationships[0].riskId 
    : '';
  
  const [selectedRiskId, setSelectedRiskId] = useState<string>(defaultRiskId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bow-Tie Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize relationships between risk factors, risks, and consequences
        </p>
      </div>
      
      <RiskSelector
        selectedRiskId={selectedRiskId}
        onSelectRisk={setSelectedRiskId}
      />
      
      {selectedRiskId ? (
        <BowTieChart riskId={selectedRiskId} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
            No risk selected or no bow-tie relationships defined.
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            About Bow-Tie Analysis
          </h3>
          <div className="prose prose-sm text-gray-500">
            <p>Bow-Tie Analysis is a risk evaluation method that visualizes the relationship between:</p>
            <ul>
              <li><strong>Risk Factors (Causes):</strong> The events or conditions that may lead to a risk materializing</li>
              <li><strong>Risk Events:</strong> The central risks being analyzed</li>
              <li><strong>Consequences:</strong> The potential outcomes if the risk materializes</li>
            </ul>
            <p>The method gets its name from the bow-tie shape of the diagram, with risk factors on the left, the risk event in the center, and consequences on the right.</p>
            <p>This visualization helps organizations understand:</p>
            <ul>
              <li>What causes risks to materialize</li>
              <li>What happens if risks do materialize</li>
              <li>Where controls should be implemented (both preventive and mitigative)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowTieAnalysisPage;
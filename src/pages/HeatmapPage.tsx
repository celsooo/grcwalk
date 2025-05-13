import React from 'react';
import RiskHeatmap from '../components/heatmap/RiskHeatmap';

const HeatmapPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Heatmap</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visual representation of risks based on impact and likelihood
        </p>
      </div>
      
      <RiskHeatmap />
      
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Understanding the Heatmap
          </h3>
          <div className="prose prose-sm text-gray-500">
            <p>The risk heatmap provides a visual representation of your risk landscape based on two key dimensions:</p>
            <ul>
              <li><strong>Likelihood:</strong> The probability of a risk occurring (horizontal axis)</li>
              <li><strong>Impact:</strong> The potential severity if the risk does occur (vertical axis)</li>
            </ul>
            <p>Risks are categorized into four levels based on their combined likelihood and impact scores:</p>
            <ul>
              <li><strong>Critical (Red):</strong> High likelihood and high impact risks requiring immediate attention</li>
              <li><strong>High (Orange):</strong> Significant risks that should be prioritized</li>
              <li><strong>Medium (Amber):</strong> Moderate risks that need monitoring</li>
              <li><strong>Low (Green):</strong> Lower priority risks with limited potential impact</li>
            </ul>
            <p>The number displayed in each cell indicates how many risks fall into that specific combination of likelihood and impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
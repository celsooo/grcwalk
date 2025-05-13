import React, { useState } from 'react';
import { useGRC } from '../../context/GRCContext';
import { getHeatmapColor } from '../../utils/helpers';
import { Info } from 'lucide-react';

const RiskHeatmap: React.FC = () => {
  const { risks } = useGRC();
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  // Map to track risks in each cell
  const riskMap: Record<string, string[]> = {};
  
  // Populate risk map
  risks.forEach(risk => {
    const key = `${risk.likelihood},${risk.impact}`;
    if (!riskMap[key]) {
      riskMap[key] = [];
    }
    riskMap[key].push(risk.id);
  });

  // Generate grid cells
  const generateHeatmap = () => {
    const heatmapRows = [];
    
    // Generate rows (impact, y-axis, top to bottom is 5 to 1)
    for (let impact = 5; impact >= 1; impact--) {
      const cells = [];
      
      // Generate cells (likelihood, x-axis, left to right is 1 to 5)
      for (let likelihood = 1; likelihood <= 5; likelihood++) {
        const key = `${likelihood},${impact}`;
        const risksInCell = riskMap[key] || [];
        const numRisks = risksInCell.length;
        const color = getHeatmapColor(likelihood, impact);
        const isHovered = hoveredCell?.x === likelihood && hoveredCell?.y === impact;
        
        cells.push(
          <div
            key={key}
            className={`relative w-24 h-24 flex items-center justify-center border border-gray-200 transition-all duration-200 ${color} ${isHovered ? 'opacity-80' : 'opacity-60'} hover:opacity-100`}
            onMouseEnter={() => setHoveredCell({ x: likelihood, y: impact })}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {numRisks > 0 && (
              <div className="text-3xl font-bold text-white relative">
                {numRisks}
                {numRisks > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Info className="h-3 w-3 text-gray-600" />
                  </div>
                )}
              </div>
            )}
            
            {/* Tooltip with risk names */}
            {isHovered && numRisks > 0 && (
              <div className="absolute z-10 w-64 px-3 py-2 text-sm bg-white border rounded shadow-lg -translate-x-1/2 translate-y-1/2 left-1/2 bottom-0">
                <div className="font-bold border-b pb-1 mb-1">
                  Risks (Likelihood: {likelihood}, Impact: {impact})
                </div>
                <ul className="list-disc pl-5">
                  {risksInCell.map(riskId => {
                    const risk = risks.find(r => r.id === riskId);
                    return (
                      <li key={riskId} className="text-gray-700 truncate">
                        {risk?.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      }
      
      heatmapRows.push(
        <div key={impact} className="flex">
          {/* Label for Impact */}
          <div className="w-32 flex items-center justify-end pr-4 text-sm font-medium text-gray-700">
            {impact === 5 && 'Catastrophic'}
            {impact === 4 && 'Major'}
            {impact === 3 && 'Moderate'}
            {impact === 2 && 'Minor'}
            {impact === 1 && 'Insignificant'}
          </div>
          {cells}
        </div>
      );
    }
    
    return heatmapRows;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Risk Heatmap</h3>
      
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex flex-col">
            {generateHeatmap()}
            
            {/* X-axis labels */}
            <div className="flex mt-4 ml-32">
              <div className="w-24 text-center text-sm font-medium text-gray-700">Rare</div>
              <div className="w-24 text-center text-sm font-medium text-gray-700">Unlikely</div>
              <div className="w-24 text-center text-sm font-medium text-gray-700">Possible</div>
              <div className="w-24 text-center text-sm font-medium text-gray-700">Likely</div>
              <div className="w-24 text-center text-sm font-medium text-gray-700">Almost Certain</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-green-500 opacity-70 mr-1"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-amber-400 opacity-70 mr-1"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-orange-500 opacity-70 mr-1"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-red-500 opacity-70 mr-1"></div>
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
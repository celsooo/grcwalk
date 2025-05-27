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
            className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center border border-gray-200 transition-all duration-200 ${color} ${isHovered ? 'opacity-80' : 'opacity-60'} hover:opacity-100`}
            onMouseEnter={() => setHoveredCell({ x: likelihood, y: impact })}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {numRisks > 0 && (
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white relative">
                {numRisks}
                {numRisks > 0 && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <Info className="h-2 w-2 sm:h-3 sm:w-3 text-gray-600" />
                  </div>
                )}
              </div>
            )}
            
            {/* Tooltip with risk names */}
            {isHovered && numRisks > 0 && (
              <div className="absolute z-10 w-48 sm:w-64 px-3 py-2 text-xs sm:text-sm bg-white border rounded shadow-lg -translate-x-1/2 translate-y-1/2 left-1/2 bottom-0">
                <div className="font-bold border-b pb-1 mb-1">
                  Risks (Likelihood: {likelihood}, Impact: {impact})
                </div>
                <ul className="list-disc pl-4 sm:pl-5">
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
          <div className="w-20 sm:w-24 md:w-28 lg:w-32 flex items-center justify-end pr-2 sm:pr-4 text-xs sm:text-sm font-medium text-gray-700">
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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Risk Heatmap</h3>
      
      <div className="flex justify-center overflow-x-auto pb-4">
        <div className="relative">
          <div className="flex flex-col">
            {generateHeatmap()}
            
            {/* X-axis labels */}
            <div className="flex mt-2 sm:mt-4 ml-20 sm:ml-24 md:ml-28 lg:ml-32">
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-center text-xs sm:text-sm font-medium text-gray-700">Rare</div>
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-center text-xs sm:text-sm font-medium text-gray-700">Unlikely</div>
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-center text-xs sm:text-sm font-medium text-gray-700">Possible</div>
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-center text-xs sm:text-sm font-medium text-gray-700">Likely</div>
              <div className="w-12 sm:w-16 md:w-20 lg:w-24 text-center text-xs sm:text-sm font-medium text-gray-700">Almost Certain</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-green-500 opacity-70 mr-1"></div>
            <span className="text-xs sm:text-sm">Low</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-amber-400 opacity-70 mr-1"></div>
            <span className="text-xs sm:text-sm">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-orange-500 opacity-70 mr-1"></div>
            <span className="text-xs sm:text-sm">High</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-red-500 opacity-70 mr-1"></div>
            <span className="text-xs sm:text-sm">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
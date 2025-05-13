import React from 'react';
import { useGRC } from '../../context/GRCContext';
import { getRiskCounts, getRiskLevelColor } from '../../utils/helpers';

const RiskStatusChart: React.FC = () => {
  const { risks } = useGRC();
  const riskCounts = getRiskCounts(risks);
  const categories = ['Critical', 'High', 'Medium', 'Low'] as const;
  
  // Get total for percentage calculation
  const total = Object.values(riskCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Risk Status</h3>
        <div className="mt-5 h-64 flex flex-col justify-between">
          {/* Bars */}
          <div className="relative flex items-end h-52 space-x-2">
            {categories.map(category => {
              const count = riskCounts[category];
              const percentage = Math.round((count / total) * 100) || 0;
              const height = `${Math.max(percentage, 5)}%`;
              const baseClass = getRiskLevelColor(category);
              const chartBarClass = baseClass.replace('text-white', '');
              
              return (
                <div key={category} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full mb-2">
                    <div 
                      className={`w-full absolute bottom-0 ${chartBarClass} opacity-80 rounded-t-sm`}
                      style={{ height }}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Labels */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {categories.map(category => (
              <div key={category} className="text-center">
                <div 
                  className={`text-xs font-medium px-2 py-1 rounded ${getRiskLevelColor(category)}`}
                >
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskStatusChart;
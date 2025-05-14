import React from 'react';
import { useGRC } from '../../context/GRCContext';
import { getRiskCounts } from '../../utils/helpers';

const RiskStatusChart: React.FC = () => {
  const { risks } = useGRC();
  const riskCounts = getRiskCounts(risks);
  const categories = ['Critical', 'High', 'Medium', 'Low'] as const;
  
  // Get total for percentage calculation
  const total = Object.values(riskCounts).reduce((sum, count) => sum + count, 0);

  // Define color classes and heights for bars
  const getBarColor = (category: string) => {
    switch (category) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-amber-400';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getTextColor = (category: string) => {
    switch (category) {
      case 'Critical': return 'text-red-700';
      case 'High': return 'text-orange-700';
      case 'Medium': return 'text-amber-700';
      case 'Low': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Risk Status</h3>
        <div className="mt-5">
          {/* Bar Chart */}
          <div className="h-64 flex items-end justify-around space-x-8 mb-6">
            {categories.map(category => {
              const count = riskCounts[category];
              const percentage = (count / total) * 100;
              const height = `${Math.max(percentage, 2)}%`;
              
              return (
                <div key={category} className="flex flex-col items-center w-full">
                  {/* Bar */}
                  <div className="relative w-full h-48 flex items-end">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${getBarColor(category)}`}
                      style={{ height }}
                    >
                      {/* Count Label */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
                        {count}
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Label */}
                  <div className={`mt-2 text-sm font-medium px-2 py-1 rounded ${getBarColor(category)} bg-opacity-20 ${getTextColor(category)}`}>
                    {category}
                  </div>
                  
                  {/* Percentage */}
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round(percentage)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500">Total Risks</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{total}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm font-medium text-red-700">Critical + High</div>
              <div className="mt-1 text-2xl font-semibold text-red-900">
                {riskCounts.Critical + riskCounts.High}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskStatusChart;
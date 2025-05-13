import React from 'react';
import { useGRC } from '../../context/GRCContext';
import { ControlStatus } from '../../types';

const ControlStatusChart: React.FC = () => {
  const { controls } = useGRC();
  
  // Count controls by status
  const statusCounts: Record<ControlStatus, number> = {
    'Implemented': 0,
    'Partial': 0,
    'Planned': 0,
    'Not Implemented': 0
  };
  
  controls.forEach(control => {
    statusCounts[control.status]++;
  });
  
  // Calculate percentages
  const total = controls.length;
  const getPercentage = (count: number) => Math.round((count / total) * 100) || 0;
  
  // Define colors and data for each status
  const statusData = [
    { name: 'Implemented', count: statusCounts['Implemented'], color: 'bg-green-500', textColor: 'text-white' },
    { name: 'Partial', count: statusCounts['Partial'], color: 'bg-amber-400', textColor: 'text-black' },
    { name: 'Planned', count: statusCounts['Planned'], color: 'bg-blue-400', textColor: 'text-white' },
    { name: 'Not Implemented', count: statusCounts['Not Implemented'], color: 'bg-red-500', textColor: 'text-white' }
  ];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Control Status</h3>
        <div className="mt-5">
          {/* Donut chart simulation with CSS */}
          <div className="relative mx-auto h-40 w-40 mb-4">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              {statusData.map((status, i) => {
                // Skip if count is 0
                if (status.count === 0) return null;
                
                const percentage = getPercentage(status.count);
                let currentPercent = 0;
                
                // Calculate the start position
                for (let j = 0; j < i; j++) {
                  currentPercent += getPercentage(statusData[j].count);
                }
                
                // Calculate the stroke-dasharray and stroke-dashoffset
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = 25 - currentPercent;
                
                return (
                  <circle 
                    key={status.name}
                    cx="18" 
                    cy="18" 
                    r="15.91549430918954"
                    fill="transparent"
                    stroke={status.color.replace('bg-', '').replace('500', '600').replace('400', '500')}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={`${strokeDashoffset}`}
                    className="transition-all duration-500 ease-in-out"
                    transform="rotate(-90 18 18)"
                  />
                );
              })}
              <text x="18" y="18" fill="#374151" textAnchor="middle" dominantBaseline="middle" fontSize="5">
                {total}
              </text>
              <text x="18" y="23" fill="#6B7280" textAnchor="middle" dominantBaseline="middle" fontSize="2.5">
                Controls
              </text>
            </svg>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map(status => (
              <div key={status.name} className="flex items-center text-sm">
                <div className={`h-3 w-3 rounded-full ${status.color} mr-2`}></div>
                <span className="text-gray-600">{status.name}</span>
                <span className="ml-auto font-medium">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlStatusChart;
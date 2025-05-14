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
  
  // Calculate percentages and prepare data
  const total = controls.length;
  const statusData = [
    { 
      name: 'Implemented', 
      count: statusCounts['Implemented'],
      color: 'bg-green-500',
      textColor: 'text-green-700',
      percentage: (statusCounts['Implemented'] / total) * 100 || 0
    },
    { 
      name: 'Partial', 
      count: statusCounts['Partial'],
      color: 'bg-amber-400',
      textColor: 'text-amber-700',
      percentage: (statusCounts['Partial'] / total) * 100 || 0
    },
    { 
      name: 'Planned', 
      count: statusCounts['Planned'],
      color: 'bg-blue-400',
      textColor: 'text-blue-700',
      percentage: (statusCounts['Planned'] / total) * 100 || 0
    },
    { 
      name: 'Not Implemented', 
      count: statusCounts['Not Implemented'],
      color: 'bg-red-500',
      textColor: 'text-red-700',
      percentage: (statusCounts['Not Implemented'] / total) * 100 || 0
    }
  ];

  // Calculate stroke dasharray and offset for each segment
  let cumulativePercentage = 0;
  const segments = statusData.map(status => {
    const segment = {
      ...status,
      offset: cumulativePercentage,
      dashArray: `${status.percentage} ${100 - status.percentage}`
    };
    cumulativePercentage += status.percentage;
    return segment;
  });

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Control Status</h3>
        <div className="mt-5">
          {/* Donut chart */}
          <div className="relative mx-auto h-48 w-48">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {segments.map((segment, index) => (
                <circle
                  key={segment.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={segment.color.replace('bg-', 'rgb').replace('500', '500').replace('400', '400')}
                  strokeWidth="20"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={-segment.offset}
                  className="transition-all duration-500"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{total}</div>
                <div className="text-sm text-gray-500">Total Controls</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {statusData.map(status => (
              <div key={status.name} className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${status.color}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-600">{status.name}</div>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-lg font-semibold ${status.textColor}`}>
                      {status.count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(status.percentage)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlStatusChart;
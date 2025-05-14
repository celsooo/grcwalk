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

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Control Status</h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">{total}</div>
            <div className="text-sm text-gray-500">Total Controls</div>
          </div>
        </div>

        <div className="space-y-4">
          {statusData.map(status => (
            <div key={status.name} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${status.color} mr-2`} />
                  <span className="text-sm font-medium text-gray-600">{status.name}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-sm font-semibold ${status.textColor}`}>
                    {status.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({Math.round(status.percentage)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${status.color} transition-all duration-500`}
                  style={{ width: `${status.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlStatusChart;
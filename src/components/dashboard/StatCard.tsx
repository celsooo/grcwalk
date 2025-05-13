import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {trend && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span 
              className={`font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>{' '}
            <span className="text-gray-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
import React from 'react';
import { useGRC } from '../context/GRCContext';
import StatCard from '../components/dashboard/StatCard';
import RiskStatusChart from '../components/dashboard/RiskStatusChart';
import RecentRisks from '../components/dashboard/RecentRisks';
import ControlStatusChart from '../components/dashboard/ControlStatusChart';
import { Shield, AlertTriangle, Check, GitBranch } from 'lucide-react';
import { calculateRiskLevel } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { risks, controls, riskFactors, consequences } = useGRC();
  
  // Calculate critical and high risks
  const highImpactRisks = risks.filter(risk => {
    const level = calculateRiskLevel(risk.likelihood, risk.impact);
    return level === 'Critical' || level === 'High';
  });
  
  // Calculate implemented controls percentage
  const implementedControls = controls.filter(control => 
    control.status === 'Implemented'
  );
  
  const implementedPercentage = controls.length 
    ? Math.round((implementedControls.length / controls.length) * 100) 
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Management Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your organization's risk management program
        </p>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Total Risks" 
          value={risks.length} 
          icon={<AlertTriangle className="h-5 w-5 text-white" />}
          color="bg-blue-600"
        />
        <StatCard 
          title="Critical/High Risks" 
          value={highImpactRisks.length} 
          icon={<AlertTriangle className="h-5 w-5 text-white" />}
          color="bg-red-500"
          trend={{ 
            value: 5, 
            label: "from last month", 
            positive: false 
          }}
        />
        <StatCard 
          title="Controls" 
          value={controls.length} 
          icon={<Shield className="h-5 w-5 text-white" />}
          color="bg-teal-500"
        />
        <StatCard 
          title="Controls Implemented" 
          value={`${implementedPercentage}%`} 
          icon={<Check className="h-5 w-5 text-white" />}
          color="bg-green-500"
          trend={{ 
            value: 8, 
            label: "from last month", 
            positive: true 
          }}
        />
      </div>
      
      {/* Charts and tables */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-6">
        <RiskStatusChart />
        <ControlStatusChart />
      </div>
      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RecentRisks />
        
        {/* Bow-Tie Statistics */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <GitBranch className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Bow-Tie Analysis</h3>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs font-medium text-blue-800 uppercase tracking-wide">
                  Risk Factors
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-blue-900">{riskFactors.length}</div>
                  <div className="text-sm text-blue-700">
                    {Math.round(riskFactors.length / risks.length * 100)}% coverage
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-xs font-medium text-amber-800 uppercase tracking-wide">
                  Consequences
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-amber-900">{consequences.length}</div>
                  <div className="text-sm text-amber-700">
                    {Math.round(consequences.length / risks.length * 100)}% coverage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
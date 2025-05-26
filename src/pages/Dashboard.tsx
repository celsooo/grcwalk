import React from 'react';
import { useGRC } from '../context/GRCContext';
import StatCard from '../components/dashboard/StatCard';
import RiskStatusChart from '../components/dashboard/RiskStatusChart';
import RecentRisks from '../components/dashboard/RecentRisks';
import ControlStatusChart from '../components/dashboard/ControlStatusChart';
import { Shield, AlertTriangle, Check, GitBranch, ScrollText, ClipboardList } from 'lucide-react';
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Management Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mb-6">
        {/* Compliance Overview */}
        <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <ScrollText className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Compliance Status</h3>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-green-800 dark:text-green-300 uppercase tracking-wide">
                  Compliant
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-green-900 dark:text-green-200">85%</div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    +5% this month
                  </div>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-red-800 dark:text-red-300 uppercase tracking-wide">
                  Non-Compliant
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-red-900 dark:text-red-200">15%</div>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    3 items
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Updates</div>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 dark:text-gray-400">ISO 27001 certification renewed</li>
                <li className="text-sm text-gray-600 dark:text-gray-400">GDPR assessment completed</li>
                <li className="text-sm text-gray-600 dark:text-gray-400">PCI DSS compliance review due in 15 days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Plans Overview */}
        <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Action Plans</h3>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                  In Progress
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-blue-900 dark:text-blue-200">8</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Active plans
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  Due Soon
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-amber-900 dark:text-amber-200">3</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
                    Next 7 days
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Actions</div>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">MFA Implementation</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Critical</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Security Policy Review</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">High</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Vendor Assessment</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">Medium</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RecentRisks />
        
        {/* Bow-Tie Statistics */}
        <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <GitBranch className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Bow-Tie Analysis</h3>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                  Risk Factors
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-blue-900 dark:text-blue-200">{riskFactors.length}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {Math.round(riskFactors.length / risks.length * 100)}% coverage
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="text-xs font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  Consequences
                </div>
                <div className="mt-2 flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-amber-900 dark:text-amber-200">{consequences.length}</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">
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
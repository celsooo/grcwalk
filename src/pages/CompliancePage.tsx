import React, { useState } from 'react';
import { ComplianceRequirement, ComplianceStatus } from '../types';
import { Calendar, CheckCircle, AlertCircle, XCircle, MinusCircle, Search, Filter } from 'lucide-react';

const CompliancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | ''>('');

  // Example compliance requirements (in a real app, this would come from context/API)
  const requirements: ComplianceRequirement[] = [
    {
      id: '1',
      name: 'Access Control Policy',
      description: 'Establish and maintain access control policies',
      framework: 'ISO 27001',
      status: 'Compliant',
      dueDate: '2024-06-30',
      assignee: 'John Doe',
      evidence: 'Policy document v2.1',
      controlIds: ['1', '2']
    },
    {
      id: '2',
      name: 'Risk Assessment',
      description: 'Conduct annual risk assessments',
      framework: 'NIST CSF',
      status: 'Partially Compliant',
      dueDate: '2024-05-15',
      assignee: 'Jane Smith',
      evidence: 'Risk assessment report Q1 2024',
      controlIds: ['3']
    },
    // Add more sample requirements as needed
  ];

  const frameworks = [...new Set(requirements.map(req => req.framework))];

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'Compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Partially Compliant':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'Non-Compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Not Applicable':
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case 'Compliant':
        return 'bg-green-100 text-green-800';
      case 'Partially Compliant':
        return 'bg-amber-100 text-amber-800';
      case 'Non-Compliant':
        return 'bg-red-100 text-red-800';
      case 'Not Applicable':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFramework = frameworkFilter ? req.framework === frameworkFilter : true;
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    
    return matchesSearch && matchesFramework && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage compliance requirements across different frameworks
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {(['Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable'] as ComplianceStatus[]).map(status => {
          const count = requirements.filter(req => req.status === status).length;
          return (
            <div key={status} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{status}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{count}</div>
                        <div className="ml-2 text-sm text-gray-500">requirements</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                placeholder="Search requirements..."
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={frameworkFilter}
                onChange={(e) => setFrameworkFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Frameworks</option>
                {frameworks.map(framework => (
                  <option key={framework} value={framework}>{framework}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ComplianceStatus)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Compliant">Compliant</option>
                <option value="Partially Compliant">Partially Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Framework
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequirements.map((requirement) => (
                <tr key={requirement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{requirement.name}</div>
                    <div className="text-sm text-gray-500">{requirement.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{requirement.framework}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(requirement.status)}`}>
                      {requirement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(requirement.dueDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{requirement.assignee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{requirement.evidence}</div>
                  </td>
                </tr>
              ))}
              {filteredRequirements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No compliance requirements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
import React, { useState } from 'react';
import { AuditPlan, AuditStatus, RiskLevel, ActionStatus } from '../types';
import { Plus, Search, Calendar, Clock, CheckCircle2, AlertCircle, XCircle, MoreVertical, FileSpreadsheet } from 'lucide-react';

const AuditPlanningPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | ''>('');
  const [showForm, setShowForm] = useState(false);

  // Sample data - in a real app this would come from context/API
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>([
    {
      id: '1',
      title: 'Annual Information Security Audit',
      description: 'Comprehensive review of information security controls and practices',
      scope: 'All information security controls and processes',
      objectives: [
        'Evaluate effectiveness of security controls',
        'Assess compliance with security policies',
        'Identify potential vulnerabilities'
      ],
      status: 'In Progress',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      auditor: 'Sarah Johnson',
      auditType: 'Internal',
      relatedControlIds: ['1', '2'],
      relatedRiskIds: ['1'],
      checklistItems: [
        { id: '1', description: 'Review access control policies', completed: true },
        { id: '2', description: 'Evaluate incident response procedures', completed: false },
        { id: '3', description: 'Check security awareness training records', completed: false }
      ],
      findings: [
        {
          id: '1',
          title: 'Outdated Password Policy',
          description: 'Current password policy does not meet industry standards',
          severity: 'High',
          recommendation: 'Update password policy to require minimum 12 characters',
          responsibleParty: 'IT Security Team',
          dueDate: '2024-05-15',
          status: 'In Progress',
          createdAt: '2024-04-05T10:00:00Z',
          updatedAt: '2024-04-05T10:00:00Z'
        }
      ],
      createdAt: '2024-03-15T09:00:00Z',
      updatedAt: '2024-04-05T10:00:00Z'
    }
  ]);

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Delayed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planned':
        return 'bg-gray-100 text-gray-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: RiskLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-amber-100 text-amber-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
    }
  };

  const filteredAudits = auditPlans.filter(audit => {
    const matchesSearch = 
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? audit.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Audit Planning</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Audit Plan
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Plan and track internal and external audits
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {(['Planned', 'In Progress', 'Completed', 'Delayed'] as AuditStatus[]).map(status => {
          const count = auditPlans.filter(plan => plan.status === status).length;
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
                        <div className="ml-2 text-sm text-gray-500">audits</div>
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
                placeholder="Search audit plans..."
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AuditStatus)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Plans List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredAudits.map(audit => (
            <li key={audit.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">{audit.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                        {audit.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{audit.description}</p>
                  
                  {/* Audit Details */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(audit.startDate).toLocaleDateString()} - {new Date(audit.endDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {audit.checklistItems.filter(item => item.completed).length} of {audit.checklistItems.length} items completed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Auditor: {audit.auditor}</p>
                      <p className="text-sm text-gray-500">Type: {audit.auditType}</p>
                    </div>
                  </div>

                  {/* Findings */}
                  {audit.findings.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Findings</h4>
                      <div className="mt-2 space-y-2">
                        {audit.findings.map(finding => (
                          <div key={finding.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{finding.title}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                                  {finding.severity}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(finding.status as AuditStatus)}`}>
                                {finding.status}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{finding.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
          {filteredAudits.length === 0 && (
            <li className="p-6 text-center text-gray-500">
              No audit plans found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AuditPlanningPage;
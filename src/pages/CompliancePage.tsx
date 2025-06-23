import React, { useState, useRef } from 'react';
import { ComplianceRequirement, ComplianceStatus } from '../types';
import { Calendar, CheckCircle, AlertCircle, XCircle, MinusCircle, Search, Filter, Plus, X, Download, Upload } from 'lucide-react';
import { exportCompliance, importCompliance } from '../utils/helpers';

const CompliancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([
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
    }
  ]);

  const [formData, setFormData] = useState<Omit<ComplianceRequirement, 'id'>>({
    name: '',
    description: '',
    framework: '',
    status: 'Planned',
    dueDate: '',
    assignee: '',
    evidence: '',
    controlIds: []
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequirement: ComplianceRequirement = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9)
    };
    setRequirements(prev => [...prev, newRequirement]);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      framework: '',
      status: 'Planned',
      dueDate: '',
      assignee: '',
      evidence: '',
      controlIds: []
    });
  };

  const handleExport = () => {
    exportCompliance(requirements);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const importedRequirements = await importCompliance(file);
      setRequirements(prev => [...prev, ...importedRequirements]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Error importing requirements');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Monitoring</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage compliance requirements across different frameworks
        </p>
        {importError && (
          <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {importError}
          </div>
        )}
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

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-3">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Requirement
        </button>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="-ml-1 mr-2 h-5 w-5" />
          Export
        </button>
        <button
          onClick={handleImportClick}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Upload className="-ml-1 mr-2 h-5 w-5" />
          Import
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>

      {/* Add Requirement Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Compliance Requirement</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="framework" className="block text-sm font-medium text-gray-700">
                      Framework <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="framework"
                      id="framework"
                      required
                      value={formData.framework}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      id="status"
                      required
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Partially Compliant">Partially Compliant</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      required
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                      Assignee <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="assignee"
                      id="assignee"
                      required
                      value={formData.assignee}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
                      Evidence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="evidence"
                      id="evidence"
                      required
                      value={formData.evidence}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Requirement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
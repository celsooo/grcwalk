import React, { useState } from 'react';
import { Vendor, VendorStatus, VendorCriticality } from '../types';
import { Search, Plus, Building2, FileCheck, AlertTriangle, Calendar, Download, Upload } from 'lucide-react';
import VendorForm from '../components/vendors/VendorForm';

const VendorManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VendorStatus | ''>('');
  const [criticalityFilter, setCriticalityFilter] = useState<VendorCriticality | ''>('');
  const [showForm, setShowForm] = useState(false);

  // Sample data - in a real app this would come from context/API
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Cloud Services Provider',
      description: 'Primary cloud infrastructure provider',
      category: 'Infrastructure',
      status: 'Active',
      criticality: 'Critical',
      onboardingDate: '2023-01-15',
      lastAssessmentDate: '2024-01-15',
      nextAssessmentDate: '2024-07-15',
      contactName: 'John Smith',
      contactEmail: 'john.smith@vendor.com',
      contactPhone: '+1 (555) 123-4567',
      services: ['Cloud Storage', 'Computing Resources', 'Database Services'],
      riskScore: 85,
      riskLevel: 'High',
      documents: [
        {
          id: 'd1',
          name: 'SOC 2 Report',
          type: 'Compliance',
          uploadDate: '2024-01-15',
          expiryDate: '2025-01-15',
          status: 'Valid',
          url: '#'
        }
      ],
      assessments: [
        {
          id: 'a1',
          date: '2024-01-15',
          type: 'Security Assessment',
          score: 85,
          findings: ['Minor security configurations needed'],
          status: 'Completed',
          assessor: 'Security Team',
          dueDate: '2024-01-20',
          completionDate: '2024-01-15'
        }
      ],
      relatedRiskIds: ['1', '2'],
      relatedControlIds: ['1', '2']
    }
  ]);

  const handleSaveVendor = (vendorData: Omit<Vendor, 'id' | 'documents' | 'assessments'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: Math.random().toString(36).substring(2, 9),
      documents: [],
      assessments: []
    };
    setVendors(prev => [...prev, newVendor]);
    setShowForm(false);
  };

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
    }
  };

  const getCriticalityColor = (criticality: VendorCriticality) => {
    switch (criticality) {
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

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? vendor.status === statusFilter : true;
    const matchesCriticality = criticalityFilter ? vendor.criticality === criticalityFilter : true;
    
    return matchesSearch && matchesStatus && matchesCriticality;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Third Party Risk Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Vendor
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage and assess third-party vendor risks
        </p>
      </div>

      {showForm && (
        <VendorForm
          onSave={handleSaveVendor}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{vendors.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical Vendors</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {vendors.filter(v => v.criticality === 'Critical').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <FileCheck className="h-5 w-5 text-green-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Assessments Complete</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">85%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-amber-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">3</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
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
                placeholder="Search vendors..."
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as VendorStatus)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Review">Under Review</option>
                <option value="Terminated">Terminated</option>
              </select>
              <select
                value={criticalityFilter}
                onChange={(e) => setCriticalityFilter(e.target.value as VendorCriticality)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Criticality Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criticality
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Assessment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Review
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-500">{vendor.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vendor.status)}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCriticalityColor(vendor.criticality)}`}>
                      {vendor.criticality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{vendor.riskScore}</div>
                      <div className="ml-2 flex-1 w-24">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              vendor.riskScore >= 80 ? 'bg-red-500' :
                              vendor.riskScore >= 60 ? 'bg-orange-500' :
                              vendor.riskScore >= 40 ? 'bg-amber-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${vendor.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(vendor.lastAssessmentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(vendor.nextAssessmentDate).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No vendors found
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

export default VendorManagementPage;
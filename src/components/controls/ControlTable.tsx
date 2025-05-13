import React, { useState, useMemo } from 'react';
import { useGRC } from '../../context/GRCContext';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';

interface ControlTableProps {
  onViewControl: (id: string) => void;
  onEditControl: (id: string) => void;
  onDeleteControl: (id: string) => void;
}

const ControlTable: React.FC<ControlTableProps> = ({ 
  onViewControl, 
  onEditControl, 
  onDeleteControl 
}) => {
  const { controls } = useGRC();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Filter controls based on search term and filters
  const filteredControls = useMemo(() => {
    return controls.filter(control => {
      const matchesSearch = 
        control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter ? control.type === typeFilter : true;
      const matchesStatus = statusFilter ? control.status === statusFilter : true;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [controls, searchTerm, typeFilter, statusFilter]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'Partial':
        return 'bg-amber-100 text-amber-800';
      case 'Planned':
        return 'bg-blue-100 text-blue-800';
      case 'Not Implemented':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Preventive':
        return 'bg-blue-100 text-blue-800';
      case 'Detective':
        return 'bg-purple-100 text-purple-800';
      case 'Corrective':
        return 'bg-amber-100 text-amber-800';
      case 'Directive':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search controls..."
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                className="focus:ring-blue-500 focus:border-blue-500 h-full py-2 pl-3 pr-7 border-gray-300 bg-white rounded-md text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Preventive">Preventive</option>
                <option value="Detective">Detective</option>
                <option value="Corrective">Corrective</option>
                <option value="Directive">Directive</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                className="focus:ring-blue-500 focus:border-blue-500 h-full py-2 pl-3 pr-7 border-gray-300 bg-white rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Implemented">Implemented</option>
                <option value="Partial">Partial</option>
                <option value="Planned">Planned</option>
                <option value="Not Implemented">Not Implemented</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effectiveness
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Risks
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredControls.map((control) => (
                <tr key={control.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{control.name}</div>
                    <div className="text-sm text-gray-500">{control.description.substring(0, 40)}{control.description.length > 40 ? '...' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(control.type)}`}>
                      {control.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(control.status)}`}>
                      {control.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{control.effectiveness}/5</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(control.effectiveness / 5) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{control.riskIds.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onViewControl(control.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEditControl(control.id)}
                        className="text-amber-600 hover:text-amber-900 p-1"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteControl(control.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredControls.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No controls found
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

export default ControlTable;
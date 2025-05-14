import React, { useState, useMemo } from 'react';
import { useGRC } from '../../context/GRCContext';
import { getRiskLevelColor } from '../../utils/helpers';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';

interface RiskTableProps {
  onViewRisk: (id: string) => void;
  onEditRisk: (id: string) => void;
  onDeleteRisk: (id: string) => void;
}

const RiskTable: React.FC<RiskTableProps> = ({ 
  onViewRisk, 
  onEditRisk, 
  onDeleteRisk 
}) => {
  const { risks } = useGRC();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  
  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    
    risks.forEach(risk => {
      uniqueCategories.add(risk.category);
    });
    
    return Array.from(uniqueCategories).sort();
  }, [risks]);
  
  // Filter risks based on search term and filters
  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      const matchesSearch = 
        risk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter ? risk.category === categoryFilter : true;
      const matchesLevel = levelFilter ? risk.level === levelFilter : true;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [risks, searchTerm, categoryFilter, levelFilter]);

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
              placeholder="Search risks..."
            />
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <select
                className="focus:ring-blue-500 focus:border-blue-500 h-full py-2 pl-3 pr-7 border-gray-300 bg-white rounded-md text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <select
                className="focus:ring-blue-500 focus:border-blue-500 h-full py-2 pl-3 pr-7 border-gray-300 bg-white rounded-md text-sm"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likelihood
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Controls
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{risk.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{risk.name}</div>
                    <div className="text-sm text-gray-500">{risk.description.substring(0, 40)}{risk.description.length > 40 ? '...' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{risk.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(risk.level || 'Low')}`}>
                      {risk.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{risk.likelihood}/5</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{risk.impact}/5</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{risk.controlIds.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onViewRisk(risk.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEditRisk(risk.id)}
                        className="text-amber-600 hover:text-amber-900 p-1"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteRisk(risk.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRisks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No risks found
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

export default RiskTable;
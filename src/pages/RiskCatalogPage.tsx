import React, { useState } from 'react';
import { useGRC } from '../context/GRCContext';
import RiskTable from '../components/risks/RiskTable';
import RiskForm from '../components/risks/RiskForm';
import { Plus } from 'lucide-react';

const RiskCatalogPage: React.FC = () => {
  const { risks, deleteRisk } = useGRC();
  const [showForm, setShowForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  
  const handleAddRisk = () => {
    setSelectedRisk(null);
    setShowForm(true);
  };
  
  const handleEditRisk = (id: string) => {
    setSelectedRisk(id);
    setShowForm(true);
  };
  
  const handleViewRisk = (id: string) => {
    // In a real app, this might open a detailed view
    handleEditRisk(id);
  };
  
  const handleDeleteRisk = (id: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      deleteRisk(id);
    }
  };
  
  const handleFormSave = () => {
    setShowForm(false);
    setSelectedRisk(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedRisk(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Risk Catalog</h1>
          <button
            type="button"
            onClick={handleAddRisk}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Risk
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive list of all identified risks
        </p>
      </div>
      
      {showForm ? (
        <RiskForm
          risk={selectedRisk ? risks.find(r => r.id === selectedRisk) : undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      ) : (
        <RiskTable
          onViewRisk={handleViewRisk}
          onEditRisk={handleEditRisk}
          onDeleteRisk={handleDeleteRisk}
        />
      )}
    </div>
  );
};

export default RiskCatalogPage;
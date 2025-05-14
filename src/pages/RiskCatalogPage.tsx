import React, { useState, useRef } from 'react';
import { useGRC } from '../context/GRCContext';
import RiskTable from '../components/risks/RiskTable';
import RiskForm from '../components/risks/RiskForm';
import { Plus, Download, Upload } from 'lucide-react';
import { exportRisks, importRisks } from '../utils/helpers';

const RiskCatalogPage: React.FC = () => {
  const { risks, deleteRisk, addRisk } = useGRC();
  const [showForm, setShowForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddRisk = () => {
    setSelectedRisk(null);
    setShowForm(true);
  };
  
  const handleEditRisk = (id: string) => {
    setSelectedRisk(id);
    setShowForm(true);
  };
  
  const handleViewRisk = (id: string) => {
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

  const handleExport = () => {
    exportRisks(risks);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const importedRisks = await importRisks(file);
      
      // Add each imported risk
      importedRisks.forEach(risk => {
        addRisk({
          name: risk.name,
          description: risk.description,
          category: risk.category,
          likelihood: risk.likelihood,
          impact: risk.impact,
          controlIds: risk.controlIds || []
        });
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Error importing risks');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Risk Catalog</h1>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="-ml-1 mr-2 h-4 w-4" />
              Export
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="-ml-1 mr-2 h-4 w-4" />
              Import
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={handleAddRisk}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Risk
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive list of all identified risks
        </p>
        {importError && (
          <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {importError}
          </div>
        )}
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
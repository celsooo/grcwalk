import React, { useState } from 'react';
import { useGRC } from '../context/GRCContext';
import ControlTable from '../components/controls/ControlTable';
import ControlForm from '../components/controls/ControlForm';
import { Plus } from 'lucide-react';

const ControlsPage: React.FC = () => {
  const { controls, deleteControl } = useGRC();
  const [showForm, setShowForm] = useState(false);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  
  const handleAddControl = () => {
    setSelectedControl(null);
    setShowForm(true);
  };
  
  const handleEditControl = (id: string) => {
    setSelectedControl(id);
    setShowForm(true);
  };
  
  const handleViewControl = (id: string) => {
    // In a real app, this might open a detailed view
    handleEditControl(id);
  };
  
  const handleDeleteControl = (id: string) => {
    if (window.confirm('Are you sure you want to delete this control?')) {
      deleteControl(id);
    }
  };
  
  const handleFormSave = () => {
    setShowForm(false);
    setSelectedControl(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedControl(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Controls</h1>
          <button
            type="button"
            onClick={handleAddControl}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Control
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Measures implemented to mitigate identified risks
        </p>
      </div>
      
      {showForm ? (
        <ControlForm
          control={selectedControl ? controls.find(c => c.id === selectedControl) : undefined}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      ) : (
        <ControlTable
          onViewControl={handleViewControl}
          onEditControl={handleEditControl}
          onDeleteControl={handleDeleteControl}
        />
      )}
    </div>
  );
};

export default ControlsPage;
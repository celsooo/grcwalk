import React, { useState, useEffect } from 'react';
import { useGRC } from '../../context/GRCContext';
import { Control, ControlType, ControlStatus } from '../../types';
import { X } from 'lucide-react';

interface ControlFormProps {
  control?: Control;
  onSave: () => void;
  onCancel: () => void;
}

const ControlForm: React.FC<ControlFormProps> = ({ control, onSave, onCancel }) => {
  const { addControl, updateControl, risks } = useGRC();
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: ControlType;
    status: ControlStatus;
    effectiveness: number;
    riskIds: string[];
  }>({
    name: '',
    description: '',
    type: 'Preventive',
    status: 'Planned',
    effectiveness: 3,
    riskIds: []
  });
  
  // Load existing control data if editing
  useEffect(() => {
    if (control) {
      setFormData({
        name: control.name,
        description: control.description,
        type: control.type,
        status: control.status,
        effectiveness: control.effectiveness,
        riskIds: [...control.riskIds]
      });
    }
  }, [control]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'effectiveness' ? Number(value) : value
    });
  };
  
  const handleRiskToggle = (riskId: string) => {
    setFormData(prev => {
      const newRiskIds = prev.riskIds.includes(riskId)
        ? prev.riskIds.filter(id => id !== riskId)
        : [...prev.riskIds, riskId];
      
      return {
        ...prev,
        riskIds: newRiskIds
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (control) {
      // Update existing control
      updateControl(control.id, formData);
    } else {
      // Add new control
      addControl(formData);
    }
    
    onSave();
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {control ? 'Edit Control' : 'Add New Control'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Name field */}
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {/* Description field */}
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            {/* Type field */}
            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Preventive">Preventive</option>
                  <option value="Detective">Detective</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Directive">Directive</option>
                </select>
              </div>
            </div>
            
            {/* Status field */}
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Implemented">Implemented</option>
                  <option value="Partial">Partial</option>
                  <option value="Planned">Planned</option>
                  <option value="Not Implemented">Not Implemented</option>
                </select>
              </div>
            </div>
            
            {/* Effectiveness field */}
            <div className="sm:col-span-6">
              <label htmlFor="effectiveness" className="block text-sm font-medium text-gray-700">
                Effectiveness (1-5) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="range"
                  id="effectiveness"
                  name="effectiveness"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.effectiveness}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 px-2">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium">
                  Current: {formData.effectiveness}
                </div>
              </div>
            </div>
            
            {/* Risks selection */}
            <div className="sm:col-span-6">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700">
                  Link to Risks
                </legend>
                <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                  {risks.length === 0 ? (
                    <div className="text-sm text-gray-500 p-2">
                      No risks available. Add risks first.
                    </div>
                  ) : (
                    risks.map(risk => (
                      <div key={risk.id} className="relative flex items-start p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center h-5">
                          <input
                            id={`risk-${risk.id}`}
                            name="risks"
                            type="checkbox"
                            checked={formData.riskIds.includes(risk.id)}
                            onChange={() => handleRiskToggle(risk.id)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`risk-${risk.id}`} className="font-medium text-gray-700">
                            {risk.name}
                          </label>
                          <p className="text-gray-500">{risk.category}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </fieldset>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {control ? 'Update Control' : 'Add Control'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ControlForm;
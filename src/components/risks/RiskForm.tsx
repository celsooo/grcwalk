import React, { useState, useEffect } from 'react';
import { useGRC } from '../../context/GRCContext';
import { Risk } from '../../types';
import { calculateRiskLevel } from '../../utils/helpers';
import { X } from 'lucide-react';

interface RiskFormProps {
  risk?: Risk;
  onSave: () => void;
  onCancel: () => void;
}

const RiskForm: React.FC<RiskFormProps> = ({ risk, onSave, onCancel }) => {
  const { addRisk, updateRisk, controls } = useGRC();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    likelihood: 1,
    impact: 1,
    controlIds: [] as string[]
  });
  
  // Computed risk level
  const [riskLevel, setRiskLevel] = useState<string>('');
  
  // Load existing risk data if editing
  useEffect(() => {
    if (risk) {
      setFormData({
        name: risk.name,
        description: risk.description,
        category: risk.category,
        likelihood: risk.likelihood,
        impact: risk.impact,
        controlIds: [...risk.controlIds]
      });
      
      setRiskLevel(calculateRiskLevel(risk.likelihood, risk.impact));
    } else {
      // Default values for new risk
      setRiskLevel(calculateRiskLevel(1, 1));
    }
  }, [risk]);
  
  // Update risk level when likelihood or impact changes
  useEffect(() => {
    setRiskLevel(calculateRiskLevel(formData.likelihood, formData.impact));
  }, [formData.likelihood, formData.impact]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'likelihood' || name === 'impact' ? Number(value) : value
    });
  };
  
  const handleControlToggle = (controlId: string) => {
    setFormData(prev => {
      const newControlIds = prev.controlIds.includes(controlId)
        ? prev.controlIds.filter(id => id !== controlId)
        : [...prev.controlIds, controlId];
      
      return {
        ...prev,
        controlIds: newControlIds
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (risk) {
      // Update existing risk
      updateRisk(risk.id, formData);
    } else {
      // Add new risk
      addRisk(formData);
    }
    
    onSave();
  };
  
  // Get unique categories from existing risks for the dropdown
  const { risks } = useGRC();
  const categories = [...new Set(risks.map(r => r.category))];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {risk ? 'Edit Risk' : 'Add New Risk'}
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
                Name
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
                Description
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
            
            {/* Category field with datalist for suggestions */}
            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="category"
                  id="category"
                  list="category-options"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <datalist id="category-options">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Likelihood field */}
            <div className="sm:col-span-1">
              <label htmlFor="likelihood" className="block text-sm font-medium text-gray-700">
                Likelihood
              </label>
              <div className="mt-1">
                <select
                  id="likelihood"
                  name="likelihood"
                  value={formData.likelihood}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value={1}>1 - Very Low</option>
                  <option value={2}>2 - Low</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Very High</option>
                </select>
              </div>
            </div>
            
            {/* Impact field */}
            <div className="sm:col-span-1">
              <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
                Impact
              </label>
              <div className="mt-1">
                <select
                  id="impact"
                  name="impact"
                  value={formData.impact}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value={1}>1 - Very Low</option>
                  <option value={2}>2 - Low</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Very High</option>
                </select>
              </div>
            </div>
            
            {/* Risk level (calculated) */}
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                Risk Level
              </label>
              <div className="mt-1 py-2 px-3 bg-gray-100 rounded-md text-sm font-medium">
                {riskLevel}
              </div>
            </div>
            
            {/* Controls selection */}
            <div className="sm:col-span-6">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700">
                  Controls
                </legend>
                <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                  {controls.length === 0 ? (
                    <div className="text-sm text-gray-500 p-2">
                      No controls available. Add controls first.
                    </div>
                  ) : (
                    controls.map(control => (
                      <div key={control.id} className="relative flex items-start p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center h-5">
                          <input
                            id={`control-${control.id}`}
                            name="controls"
                            type="checkbox"
                            checked={formData.controlIds.includes(control.id)}
                            onChange={() => handleControlToggle(control.id)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`control-${control.id}`} className="font-medium text-gray-700">
                            {control.name}
                          </label>
                          <p className="text-gray-500">{control.type}</p>
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
              {risk ? 'Update Risk' : 'Add Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskForm;
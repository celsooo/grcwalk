import React, { useState } from 'react';
import { AuditPlan, AuditStatus } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface AuditPlanFormProps {
  onSave: (auditPlan: Omit<AuditPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AuditPlanForm: React.FC<AuditPlanFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: '',
    objectives: [''],
    status: 'Planned' as AuditStatus,
    startDate: '',
    endDate: '',
    auditor: '',
    auditType: '',
    relatedControlIds: [] as string[],
    relatedRiskIds: [] as string[],
    checklistItems: [] as { id: string; description: string; completed: boolean }[],
    findings: [] as any[]
  });

  const [newObjective, setNewObjective] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData(prev => ({
        ...prev,
        checklistItems: [
          ...prev.checklistItems,
          {
            id: Math.random().toString(36).substring(2),
            description: newChecklistItem.trim(),
            completed: false
          }
        ]
      }));
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      checklistItems: prev.checklistItems.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Audit Plan</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700">
                  Scope <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="scope"
                  id="scope"
                  rows={2}
                  required
                  value={formData.scope}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectives
                </label>
                <div className="space-y-2">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 text-sm">{objective}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add a new objective"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="auditor" className="block text-sm font-medium text-gray-700">
                  Auditor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="auditor"
                  id="auditor"
                  required
                  value={formData.auditor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="auditType" className="block text-sm font-medium text-gray-700">
                  Audit Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="auditType"
                  name="auditType"
                  required
                  value={formData.auditType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select type</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist Items
                </label>
                <div className="space-y-2">
                  {formData.checklistItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <span className="flex-1 text-sm">{item.description}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add a checklist item"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Audit Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuditPlanForm;
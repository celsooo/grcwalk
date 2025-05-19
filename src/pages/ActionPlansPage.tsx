import React, { useState } from 'react';
import { ActionPlan, ActionStatus, ActionPriority } from '../types';
import { Plus, Search, Filter, Calendar, Clock, CheckCircle2, AlertCircle, XCircle, MoreVertical } from 'lucide-react';
import ActionPlanForm from '../components/actions/ActionPlanForm';

const ActionPlansPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActionStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<ActionPriority | ''>('');
  const [showForm, setShowForm] = useState(false);

  // Sample data - in a real app this would come from context/API
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([
    {
      id: '1',
      title: 'Implement Multi-Factor Authentication',
      description: 'Roll out MFA across all critical systems to enhance security',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-06-30',
      assignee: 'John Smith',
      progress: 60,
      relatedRiskIds: ['1'],
      relatedControlIds: ['1', '2'],
      tasks: [
        { id: '1', title: 'Select MFA provider', completed: true },
        { id: '2', title: 'Configure MFA settings', completed: true },
        { id: '3', title: 'User training', completed: false },
        { id: '4', title: 'Full deployment', completed: false }
      ],
      comments: [
        {
          id: '1',
          content: 'Provider selection completed',
          author: 'John Smith',
          timestamp: '2024-03-15T10:30:00Z'
        }
      ],
      createdAt: '2024-03-01T09:00:00Z',
      updatedAt: '2024-03-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Security Policy Review',
      description: 'Annual review and update of security policies',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '2024-07-15',
      assignee: 'Jane Doe',
      progress: 0,
      relatedRiskIds: ['2'],
      relatedControlIds: ['3'],
      tasks: [
        { id: '1', title: 'Review current policies', completed: false },
        { id: '2', title: 'Update policies', completed: false },
        { id: '3', title: 'Get approval', completed: false }
      ],
      comments: [],
      createdAt: '2024-03-10T14:00:00Z',
      updatedAt: '2024-03-10T14:00:00Z'
    }
  ]);

  const handleSaveActionPlan = (actionPlan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newActionPlan: ActionPlan = {
      ...actionPlan,
      id: Math.random().toString(36).substring(2),
      createdAt: now,
      updatedAt: now
    };
    setActionPlans(prev => [...prev, newActionPlan]);
    setShowForm(false);
  };

  const getStatusIcon = (status: ActionStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ActionPriority) => {
    switch (priority) {
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

  const filteredActions = actionPlans.filter(action => {
    const matchesSearch = 
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? action.status === statusFilter : true;
    const matchesPriority = priorityFilter ? action.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Action Plans</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            New Action Plan
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage action plans to address risks and implement controls
        </p>
      </div>

      {showForm && (
        <ActionPlanForm
          onSave={handleSaveActionPlan}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {(['Not Started', 'In Progress', 'Completed', 'Overdue'] as ActionStatus[]).map(status => {
          const count = actionPlans.filter(plan => plan.status === status).length;
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
                        <div className="ml-2 text-sm text-gray-500">actions</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
                placeholder="Search action plans..."
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ActionStatus)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as ActionPriority)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plans List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredActions.map(action => (
            <li key={action.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                        {action.status}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Due {new Date(action.dueDate).toLocaleDateString()}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {action.tasks.filter(t => t.completed).length} of {action.tasks.length} tasks completed
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>Assigned to {action.assignee}</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${action.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{action.progress}% complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {filteredActions.length === 0 && (
            <li className="p-6 text-center text-gray-500">
              No action plans found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActionPlansPage;
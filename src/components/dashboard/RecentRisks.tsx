import React from 'react';
import { useGRC } from '../../context/GRCContext';
import { getRiskLevelColor } from '../../utils/helpers';

const RecentRisks: React.FC = () => {
  const { risks } = useGRC();
  
  // Get the 5 most recent risks (in this demo we'll just take the last 5)
  const recentRisks = [...risks].slice(-5).reverse();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Risks</h3>
        <div className="mt-5 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {risk.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {risk.category}
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(risk.level || 'Low')}`}>
                          {risk.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentRisks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No risks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentRisks;
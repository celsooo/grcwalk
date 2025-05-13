import React from 'react';
import { Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">GRCWalk</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
            Help
          </a>
          <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
            Settings
          </a>
          <a 
            href="#" 
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
          >
            Export Report
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
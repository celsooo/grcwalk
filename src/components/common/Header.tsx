import React from 'react';
import { Shield, Moon, Sun, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">GRCWalk</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="#" className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
            Help
          </a>
          <button 
            onClick={() => navigate('/settings')}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium flex items-center"
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </button>
          <a 
            href="#" 
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
          >
            Export Report
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
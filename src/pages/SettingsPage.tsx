import React from 'react';
import { Settings, Bell, Lock, Shield, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('en');

  return (
    <div className="dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your application preferences and configurations
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white shadow rounded-lg dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Appearance
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  )}
                  <label htmlFor="darkMode" className="text-sm text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`${
                    darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow rounded-lg dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Notifications
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotifications" className="text-sm text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`${
                    emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white shadow rounded-lg dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Language
            </h2>
            <div className="mt-6">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white shadow rounded-lg dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Security
            </h2>
            <div className="mt-6 space-y-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Change Password
              </button>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div className="bg-white shadow rounded-lg dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              API Access
            </h2>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use this key to access the GRCWalk API</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Generate New Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
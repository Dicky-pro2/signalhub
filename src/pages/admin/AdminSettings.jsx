// src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminSettings() {
  const { darkMode } = useTheme();

  const [settings, setSettings] = useState({
    platformFee: 20,
    minWithdrawal: 50,
    maxWithdrawal: 10000,
    referralBonus: 10,
    maintenanceMode: false,
    emailNotifications: true,
    autoApproveProviders: false,
  });

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Platform configuration and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fee Settings */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Fee Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={settings.platformFee}
                onChange={(e) => handleChange('platformFee', parseInt(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Applied to all signal purchases
              </p>
            </div>
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Minimum Withdrawal ($)
              </label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Maximum Withdrawal ($)
              </label>
              <input
                type="number"
                value={settings.maxWithdrawal}
                onChange={(e) => handleChange('maxWithdrawal', parseInt(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className={`border rounded-md p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Referral Bonus (%)
              </label>
              <input
                type="number"
                value={settings.referralBonus}
                onChange={(e) => handleChange('referralBonus', parseInt(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Maintenance Mode</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Block all user access</p>
              </div>
              <button
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                className={`w-10 h-5 rounded-full transition ${
                  settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Send system emails</p>
              </div>
              <button
                onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                className={`w-10 h-5 rounded-full transition ${
                  settings.emailNotifications ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.emailNotifications ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto-approve Providers</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Skip manual review</p>
              </div>
              <button
                onClick={() => handleChange('autoApproveProviders', !settings.autoApproveProviders)}
                className={`w-10 h-5 rounded-full transition ${
                  settings.autoApproveProviders ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.autoApproveProviders ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={saveSettings}
          className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
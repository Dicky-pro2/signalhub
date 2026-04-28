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
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Platform configuration and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fee Settings Card */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={Icons.Dollar} size={20} className="text-orange-500" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Fee Configuration
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={settings.platformFee}
                onChange={(e) => handleChange('platformFee', parseInt(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Applied to all signal purchases
              </p>
            </div>
            <div>
              <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Minimum Withdrawal ($)
              </label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Maximum Withdrawal ($)
              </label>
              <input
                type="number"
                value={settings.maxWithdrawal}
                onChange={(e) => handleChange('maxWithdrawal', parseInt(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* General Settings Card */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={Icons.Settings} size={20} className="text-orange-500" />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              General Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Referral Bonus (%)
              </label>
              <input
                type="number"
                value={settings.referralBonus}
                onChange={(e) => handleChange('referralBonus', parseInt(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Maintenance Mode</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Block all user access</p>
              </div>
              <button
                onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                className={`w-11 h-6 rounded-full transition ${
                  settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Send system emails</p>
              </div>
              <button
                onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                className={`w-11 h-6 rounded-full transition ${
                  settings.emailNotifications ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto-approve Providers</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Skip manual review</p>
              </div>
              <button
                onClick={() => handleChange('autoApproveProviders', !settings.autoApproveProviders)}
                className={`w-11 h-6 rounded-full transition ${
                  settings.autoApproveProviders ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition ${
                  settings.autoApproveProviders ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
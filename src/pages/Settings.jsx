import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || '',
    twitter: user?.twitter || '',
    telegram: user?.telegram || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_purchases: true,
    email_reviews: true,
    email_payouts: true,
    push_new_signals: false,
    push_price_alerts: true,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    // Simulate API call
    setTimeout(() => {
      updateUser(profileForm);
      setSuccess('Profile updated successfully!');
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setSuccess('Password updated successfully!');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess('Notification preferences saved!');
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Icon icon={Icons.Settings} size={24} />
          Settings
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Manage your account preferences
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon={Icons.Success} size={16} />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
        {[
          { id: 'profile', label: 'Profile', icon: Icons.User },
          { id: 'security', label: 'Security', icon: Icons.Lock },
          { id: 'notifications', label: 'Notifications', icon: Icons.Notifications },
          { id: 'api', label: 'API Keys', icon: Icons.Key },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Icon icon={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.User} size={20} />
            Profile Information
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.User} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  </div>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.Email} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  </div>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.User} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  placeholder="Choose a unique username"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows="3"
                placeholder={user?.role === 'provider' 
                  ? "Tell traders about your trading experience and strategy..." 
                  : "Tell us about your trading goals..."}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>

            {/* Social Links (for providers) */}
            {user?.role === 'provider' && (
              <>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Twitter/X Handle
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon={Icons.Twitter} size={16} color="#1DA1F2" />
                      </div>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        placeholder="@username"
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Telegram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon icon={Icons.Telegram} size={16} color="#26A5E4" />
                      </div>
                      <input
                        type="text"
                        value={profileForm.telegram}
                        onChange={(e) => setProfileForm({ ...profileForm, telegram: e.target.value })}
                        placeholder="@username"
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon={Icons.Settings} size={16} spin={true} />
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon={Icons.Success} size={16} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.Lock} size={20} />
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.Lock} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.Key} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.Success} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon={Icons.Settings} size={16} spin={true} />
                  Updating...
                </>
              ) : (
                <>
                  <Icon icon={Icons.Key} size={16} />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* 2FA Section */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Icon icon={Icons.Security} size={18} />
              Two-Factor Authentication (2FA)
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Add an extra layer of security to your account
            </p>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              <Icon icon={Icons.ShieldAlt} size={16} />
              Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.Notifications} size={20} />
            Notification Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Icon icon={Icons.Email} size={20} color="#f97316" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Email - Signal Purchases
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Receive email when someone buys your signal
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email_purchases}
                  onChange={(e) => setNotifications({ ...notifications, email_purchases: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Icon icon={Icons.Star} size={20} color="#eab308" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Email - New Reviews
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get notified when someone leaves a review
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email_reviews}
                  onChange={(e) => setNotifications({ ...notifications, email_reviews: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {user?.role === 'provider' && (
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <Icon icon={Icons.Money} size={20} color="#22c55e" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Email - Payout Updates
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Receive confirmation when withdrawals are processed
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email_payouts}
                    onChange={(e) => setNotifications({ ...notifications, email_payouts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            )}

            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Icon icon={Icons.Flash} size={20} color="#f97316" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Push - New Signals
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get notified when top providers post new signals
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push_new_signals}
                  onChange={(e) => setNotifications({ ...notifications, push_new_signals: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex justify-between items-center py-3">
              <div className="flex items-center gap-3">
                <Icon icon={Icons.TrendingUp} size={20} color="#22c55e" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Push - Price Alerts
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Get alerts when price approaches your entry levels
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push_price_alerts}
                  onChange={(e) => setNotifications({ ...notifications, push_price_alerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <button
              onClick={handleNotificationUpdate}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Icon icon={Icons.Settings} size={16} spin={true} />
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon={Icons.Success} size={16} />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* API Keys (for providers) */}
      {activeTab === 'api' && user?.role === 'provider' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Icon icon={Icons.Key} size={20} />
            API Keys
          </h2>
          <p className={`text-sm mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Icon icon={Icons.Info} size={14} />
            Use API keys to automate signal publishing from your trading platform
          </p>
          
          <div className={`p-4 rounded-lg mb-4 flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <Icon icon={Icons.Info} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
            <p className={`font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              • No API keys generated yet
            </p>
          </div>
          
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
            <Icon icon={Icons.Add} size={16} />
            Generate New API Key
          </button>
          
          <div className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
            <Icon icon={Icons.Warning} size={14} />
            ⚠️ Keep your API keys secret. Never share them publicly.
          </div>
        </div>
      )}
    </div>
  );
}
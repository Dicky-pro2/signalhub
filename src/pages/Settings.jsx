import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';
import Icon from '../components/Icon';
import { Icons } from '../components/Icons';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const role = user?.user_metadata?.role;

  const [profileForm, setProfileForm] = useState({
    full_name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: '',
    twitter: '',
    telegram: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    new_password: '',
    confirm_password: '',
  });

  const [notifications, setNotifications] = useState({
    email_purchases: true,
    email_reviews: true,
    email_payouts: true,
    push_new_signals: false,
    push_price_alerts: true,
  });

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfileForm({
        full_name: data.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        bio: data.bio || '',
        twitter: data.twitter || '',
        telegram: data.telegram || '',
      });
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setSuccess('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update Supabase auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileForm.full_name }
      });
      if (authError) throw authError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          bio: profileForm.bio,
          twitter: profileForm.twitter,
          telegram: profileForm.telegram,
        })
        .eq('id', user.id);
      if (profileError) throw profileError;

      updateUser({ full_name: profileForm.full_name });
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showError('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password,
      });
      if (error) throw error;

      setPasswordForm({ new_password: '', confirm_password: '' });
      showSuccess('Password updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      // Store notification prefs in profile metadata
      await supabase
        .from('profiles')
        .update({ notification_prefs: notifications })
        .eq('id', user.id);
      showSuccess('Notification preferences saved!');
    } catch (err) {
      showError(err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const text = darkMode ? 'text-white' : 'text-gray-800';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-500';
  const input = `w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;
  const inputNoIcon = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${text}`}>
          <Icon icon={Icons.Settings} size={24} />
          Settings
        </h1>
        <p className={subtext}>Manage your account preferences</p>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-2 rounded-lg flex items-center gap-2">
          <Icon icon={Icons.Success} size={16} />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className={`flex flex-wrap gap-2 border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
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
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${text}`}>
            <Icon icon={Icons.User} size={20} />
            Profile Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.User} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  </div>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className={input}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon={Icons.Email} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                  </div>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className={`${input} opacity-50 cursor-not-allowed`}
                  />
                </div>
                <p className={`text-xs mt-1 ${subtext}`}>Email cannot be changed here</p>
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows="3"
                placeholder={role === 'provider'
                  ? "Tell traders about your trading experience and strategy..."
                  : "Tell us about your trading goals..."}
                className={inputNoIcon}
              />
            </div>

            {/* Social Links for providers */}
            {role === 'provider' && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Twitter/X Handle</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon icon={Icons.Twitter} size={16} color="#1DA1F2" />
                    </div>
                    <input
                      type="text"
                      value={profileForm.twitter}
                      onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                      placeholder="@username"
                      className={input}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Telegram</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon icon={Icons.Telegram} size={16} color="#26A5E4" />
                    </div>
                    <input
                      type="text"
                      value={profileForm.telegram}
                      onChange={(e) => setProfileForm({ ...profileForm, telegram: e.target.value })}
                      placeholder="@username"
                      className={input}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <><Icon icon={Icons.Settings} size={16} spin={true} />Saving...</>
              ) : (
                <><Icon icon={Icons.Success} size={16} />Save Changes</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${text}`}>
            <Icon icon={Icons.Lock} size={20} />
            Change Password
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.Key} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  autoComplete="new-password"
                  className={input}
                  required
                />
              </div>
              <p className={`text-xs mt-1 ${subtext}`}>Must be at least 6 characters</p>
            </div>

            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon={Icons.Success} size={16} color={darkMode ? '#9ca3af' : '#6b7280'} />
                </div>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  autoComplete="new-password"
                  className={input}
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
                <><Icon icon={Icons.Settings} size={16} spin={true} />Updating...</>
              ) : (
                <><Icon icon={Icons.Key} size={16} />Update Password</>
              )}
            </button>
          </form>

          {/* 2FA Section */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${text}`}>
              <Icon icon={Icons.Security} size={18} />
              Two-Factor Authentication (2FA)
            </h3>
            <p className={`text-sm mb-4 ${subtext}`}>Add an extra layer of security to your account</p>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              <Icon icon={Icons.ShieldAlt} size={16} />
              Enable 2FA
            </button>
          </div>

          {/* Danger Zone */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-3 text-red-500">Danger Zone</h3>
            <p className={`text-sm mb-4 ${subtext}`}>
              Once you delete your account, there is no going back.
            </p>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg transition text-sm">
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${text}`}>
            <Icon icon={Icons.Notifications} size={20} />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {[
              { key: 'email_purchases', icon: Icons.Email, color: '#f97316', label: 'Email - Signal Purchases', desc: 'Receive email when someone buys your signal' },
              { key: 'email_reviews', icon: Icons.Star, color: '#eab308', label: 'Email - New Reviews', desc: 'Get notified when someone leaves a review' },
              { key: 'push_new_signals', icon: Icons.Flash, color: '#f97316', label: 'Push - New Signals', desc: 'Get notified when top providers post new signals' },
              { key: 'push_price_alerts', icon: Icons.TrendingUp, color: '#22c55e', label: 'Push - Price Alerts', desc: 'Get alerts when price approaches your entry levels' },
              ...(role === 'provider' ? [{ key: 'email_payouts', icon: Icons.Money, color: '#22c55e', label: 'Email - Payout Updates', desc: 'Receive confirmation when withdrawals are processed' }] : []),
            ].map((item) => (
              <div key={item.key} className={`flex justify-between items-center py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Icon icon={item.icon} size={20} color={item.color} />
                  <div>
                    <p className={`font-medium ${text}`}>{item.label}</p>
                    <p className={`text-sm ${subtext}`}>{item.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            ))}

            <button
              onClick={handleNotificationUpdate}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 mt-4"
            >
              {loading ? (
                <><Icon icon={Icons.Settings} size={16} spin={true} />Saving...</>
              ) : (
                <><Icon icon={Icons.Success} size={16} />Save Preferences</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'api' && role === 'provider' && (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${text}`}>
            <Icon icon={Icons.Key} size={20} />
            API Keys
          </h2>
          <p className={`text-sm mb-4 flex items-center gap-2 ${subtext}`}>
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

      {activeTab === 'api' && role !== 'provider' && (
        <div className={`rounded-xl p-6 text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <p className="text-4xl mb-3">🔑</p>
          <p className={subtext}>API Keys are only available for providers.</p>
        </div>
      )}
    </div>
  );
}
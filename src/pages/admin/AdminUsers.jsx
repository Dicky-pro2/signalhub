// src/pages/admin/AdminUsers.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icons';

export default function AdminUsers() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2024-01-15', spent: 47.50, purchases: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'provider', status: 'active', joined: '2024-01-14', earned: 1247.89, signals: 28 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', status: 'suspended', joined: '2024-01-13', spent: 12.99, purchases: 3 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'provider', status: 'pending', joined: '2024-01-12', earned: 0, signals: 0 },
    { id: 5, name: 'Marcus T.', email: 'marcus@example.com', role: 'customer', status: 'active', joined: '2024-01-11', spent: 89.50, purchases: 24 },
    { id: 6, name: 'CryptoKing', email: 'crypto@example.com', role: 'provider', status: 'active', joined: '2024-01-10', earned: 3420.00, signals: 156 },
  ]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    pending: users.filter(u => u.status === 'pending').length,
    customers: users.filter(u => u.role === 'customer').length,
    providers: users.filter(u => u.role === 'provider').length,
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Users
        </h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage all platform users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</span>
            <Icon icon={Icons.Users} size={18} className="text-orange-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>+149 this month</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active</span>
            <Icon icon={Icons.UserCheck} size={18} className="text-green-500" />
          </div>
          <p className={`text-2xl font-bold text-green-500`}>{stats.active}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suspended</span>
            <Icon icon={Icons.UserX} size={18} className="text-red-500" />
          </div>
          <p className={`text-2xl font-bold text-red-500`}>{stats.suspended}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</span>
            <Icon icon={Icons.Clock} size={18} className="text-yellow-500" />
          </div>
          <p className={`text-2xl font-bold text-yellow-500`}>{stats.pending}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customers</span>
            <Icon icon={Icons.User} size={18} className="text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.customers}</p>
        </div>
        <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Providers</span>
            <Icon icon={Icons.Verified} size={18} className="text-orange-500" />
          </div>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.providers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Icon icon={Icons.Search} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 ${
            darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="provider">Providers</option>
        </select>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left px-6 py-4 font-medium">User</th>
                <th className="text-left px-6 py-4 font-medium">Role</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Joined</th>
                <th className="text-left px-6 py-4 font-medium">Activity</th>
                <th className="text-left px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'provider' 
                        ? 'bg-orange-500/10 text-orange-500' 
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {user.role === 'provider' ? <Icon icon={Icons.Verified} size={12} /> : <Icon icon={Icons.User} size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                      user.status === 'suspended' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {user.status === 'active' && <Icon icon={Icons.CheckCircle} size={12} />}
                      {user.status === 'suspended' && <Icon icon={Icons.XCircle} size={12} />}
                      {user.status === 'pending' && <Icon icon={Icons.Clock} size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.joined}</td>
                  <td className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.role === 'provider' ? `${user.signals} signals` : `${user.purchases} purchases`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-sm ${user.status === 'active' ? 'text-red-500' : 'text-green-500'} hover:underline`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <Link to={`/admin/users/${user.id}`} className="text-blue-500 text-sm hover:underline">
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
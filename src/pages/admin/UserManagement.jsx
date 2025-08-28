import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { logout } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        throw new Error('Invalid data format received');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        setTimeout(() => {
          logout();
        }, 1000);
        return;
      }
      
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(`${API_URL}/admin/users/${userId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/admin/users`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        setTimeout(() => {
          logout();
        }, 1000);
        return;
      }
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || user.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.lastActive) - new Date(a.lastActive);
      }
      return new Date(a.lastActive) - new Date(b.lastActive);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto bg-gray-50">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-500">Manage and monitor user accounts</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                placeholder-gray-400 transition-all duration-200"
            />
            <svg
              className="absolute right-4 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {/* Open create user modal */}}
              className="inline-flex items-center px-5 py-3 bg-blue-500 text-white 
                rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 
                focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New User
            </button>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                text-gray-600 cursor-pointer hover:border-gray-300 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 rounded-xl border border-gray-200 bg-white
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                text-gray-600 cursor-pointer hover:border-gray-300 transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                          flex items-center justify-center text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      bg-blue-50 text-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer
                        ${user.status === 'active' ? 'bg-green-50 text-green-700' :
                          user.status === 'suspended' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'}`}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{user.messagesScanned}</span> scanned
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{user.spamDetected}</span> spam
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 
                        transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
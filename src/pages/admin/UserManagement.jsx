import { useState, useEffect } from 'react'
import DataTable from '../../components/admin/DataTable'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  })
  const navigate = useNavigate()
  const { logout } = useAuth()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Make sure we have valid data
      if (Array.isArray(response.data)) {
        setUsers(response.data)
      } else if (response.data && typeof response.data === 'object') {
        // If the response is an object but not an array, check if it has a data property
        if (response.data.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data)
        } else {
          console.error('Invalid data format received', response.data)
          setError('Invalid data format received from server')
          setUsers([]) // Set empty array to prevent rendering errors
        }
      } else {
        console.error('Invalid data format received', response.data)
        setError('Invalid data format received from server')
        setUsers([]) // Set empty array to prevent rendering errors
      }
    } catch (error) {
      console.error('Error details:', error)
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        toast.error('Your session has expired. Please login again.')
        // Force logout and redirect to login
        setTimeout(() => {
          logout()
        }, 1000)
        return
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load users'
      setError(errorMessage)
      toast.error(errorMessage)
      setUsers([]) // Set empty array to prevent rendering errors
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: ''
    })
    setUserToEdit(null)
  }

  const openUserModal = (user = null) => {
    if (user) {
      setUserToEdit(user)
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '' // Don't populate password for edit
      })
    } else {
      resetForm()
    }
    setShowUserModal(true)
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Validate form
      if (!formData.name || !formData.email || (!userToEdit && !formData.password)) {
        toast.error('Please fill all required fields')
        return
      }
      
      // Create payload (exclude password if empty on edit)
      const payload = { ...formData }
      if (userToEdit && !payload.password) {
        delete payload.password
      }

      let response
      
      if (userToEdit) {
        // Update existing user
        response = await axios.put(`${API_URL}/admin/users/${userToEdit.id}`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Update users list
        setUsers(users.map(user => 
          user.id === userToEdit.id ? { ...user, ...response.data } : user
        ))
        
        toast.success(`User ${formData.name} updated successfully`)
      } else {
        // Create new user
        response = await axios.post(`${API_URL}/admin/users`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Add new user to list
        setUsers([...users, response.data])
        
        toast.success(`User ${formData.name} created successfully`)
      }
      
      setShowUserModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving user', error)
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        toast.error('Your session has expired. Please login again.')
        setTimeout(() => {
          logout()
        }, 1000)
        return
      }
      
      toast.error(error.response?.data?.message || 'Error saving user')
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      await axios.delete(`${API_URL}/admin/users/${userToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setUsers(users.filter(user => user.id !== userToDelete.id))
      toast.success(`User ${userToDelete.name} deleted successfully`)
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Error deleting user', error)
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        toast.error('Your session has expired. Please login again.')
        setTimeout(() => {
          logout()
        }, 1000)
        return
      }
      
      toast.error(error.response?.data?.message || 'Error deleting user')
    }
  }
  
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'admin' ? 'bg-accent-100 text-accent-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      Header: 'Joined',
      accessor: 'createdAt',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      Header: 'Actions',
      accessor: 'id',
      sortable: false,
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openUserModal(row.original)}
            className="text-primary-600 hover:text-primary-800"
            aria-label="Edit user"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => {
              setUserToDelete(row.original)
              setShowDeleteModal(true)
            }}
            className="text-danger-600 hover:text-danger-800"
            disabled={row.original.role === 'admin'}
            aria-label="Delete user"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ]

  // Create button for table actions
  const tableActions = (
    <button
      onClick={() => openUserModal()}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add User
    </button>
  )
  
  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <DataTable 
        data={users || []} 
        columns={columns} 
        title="Users" 
        pagination={true} 
        initialItemsPerPage={10}
        loading={loading}
        refreshData={fetchUsers}
        actions={tableActions}
        emptyMessage={error ? `Error: ${error}` : "No users found"}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100">
                <svg className="h-6 w-6 text-danger-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-5">Delete User</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-semibold">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Create/Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border max-w-md w-full shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {userToEdit ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="mt-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!userToEdit && '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required={!userToEdit}
                  placeholder={userToEdit ? "Leave blank to keep current password" : ""}
                />
              </div>
              <div className="flex justify-end gap-3 mt-5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-primary-600 rounded hover:bg-primary-700 focus:outline-none transition-colors"
                >
                  {userToEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
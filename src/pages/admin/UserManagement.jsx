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
  const [userToDelete, setUserToDelete] = useState(null)
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

      console.log('Fetching users from:', `${API_URL}/admin/users`)
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Users data received:', response.data)
      console.log('Users data type:', typeof response.data, Array.isArray(response.data))
      
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
            onClick={() => {
              setUserToDelete(row.original)
              setShowDeleteModal(true)
            }}
            className="text-danger-600 hover:text-danger-800"
            disabled={row.original.role === 'admin'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ]
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p className="mb-4 text-lg font-medium">Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
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
    </div>
  )
}

export default UserManagement
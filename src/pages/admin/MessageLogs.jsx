import { useState, useEffect } from 'react'
import DataTable from '../../components/admin/DataTable'
import axios from 'axios'
import { API_URL } from '../../config/api'
import { toast } from 'react-toastify'

const MessageLogs = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    isSpam: 'all',
    type: 'all',
  })
  
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/messages`, {
        params: {
          isSpam: filters.isSpam !== 'all' ? filters.isSpam : undefined,
          type: filters.type !== 'all' ? filters.type : undefined,
        }
      })
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages', error)
      toast.error('Error loading message logs')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchMessages()
  }, [filters])
  
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    })
  }
  
  const FilterActions = () => (
    <div className="flex flex-wrap gap-2">
      <select
        className="border border-gray-300 rounded-md text-sm px-3 py-2"
        value={filters.isSpam}
        onChange={(e) => handleFilterChange('isSpam', e.target.value)}
      >
        <option value="all">All Messages</option>
        <option value="true">Spam Only</option>
        <option value="false">Not Spam Only</option>
      </select>
      
      <select
        className="border border-gray-300 rounded-md text-sm px-3 py-2"
        value={filters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="social">Social Media</option>
      </select>
    </div>
  )
  
  const columns = [
    {
      Header: 'User',
      accessor: 'user.name',
    },
    {
      Header: 'Message',
      accessor: 'content',
      Cell: ({ value }) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      Header: 'Result',
      accessor: 'isSpam',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-danger-100 text-danger-800' : 'bg-success-100 text-success-800'
        }`}>
          {value ? 'Spam' : 'Not Spam'}
        </span>
      )
    },
    {
      Header: 'Confidence',
      accessor: 'confidence',
      Cell: ({ value }) => `${Math.round(value * 100)}%`
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: ({ value }) => new Date(value).toLocaleString()
    }
  ]
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Message Logs</h1>
        <p className="text-gray-500">View history of all scanned messages</p>
      </div>
      
      <DataTable
        data={messages}
        columns={columns}
        title="Message History"
        pagination={true}
        initialItemsPerPage={10}
        actions={<FilterActions />}
      />
    </div>
  )
}

export default MessageLogs
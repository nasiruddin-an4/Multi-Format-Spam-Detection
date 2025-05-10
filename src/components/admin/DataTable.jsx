import { useState, useEffect, useMemo } from 'react'

const DataTable = ({ 
  data, 
  columns, 
  title, 
  description = null,
  searchable = true,
  pagination = true,
  selectable = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  initialItemsPerPage = 10,
  actions = null,
  refreshData = null,
  loading = false,
  emptyMessage = "No data available"
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedRows, setSelectedRows] = useState([])
  const [allSelected, setAllSelected] = useState(false)
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [data.length])
  
  // Handle search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (!searchTerm.trim()) return true
      
      return columns.some(column => {
        const value = item[column.accessor]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, columns, searchTerm])
  
  // Handle sorting
  const sortedData = useMemo(() => {
    if (sortConfig.key === null) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [filteredData, sortConfig])
  
  // Handle pagination
  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return sortedData.slice(indexOfFirstItem, indexOfLastItem)
  }, [sortedData, currentPage, itemsPerPage])
  
  // Calculate displayed item range
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  
  // Handle row selection
  const toggleRowSelection = (rowIndex) => {
    setSelectedRows(prev => {
      const isSelected = prev.includes(rowIndex)
      if (isSelected) {
        return prev.filter(idx => idx !== rowIndex)
      } else {
        return [...prev, rowIndex]
      }
    })
  }
  
  // Handle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentItems.map((_, idx) => idx))
    }
    setAllSelected(!allSelected)
  }
  
  // Reset selection when page changes
  useEffect(() => {
    setSelectedRows([])
    setAllSelected(false)
  }, [currentPage, itemsPerPage])
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-3">
            {searchable && (
              <div className="relative rounded-md w-full sm:w-64 transition-all duration-300 ease-in-out focus-within:sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                    hover:border-primary-400 transition-colors
                    bg-white placeholder-gray-400"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      title="Clear search"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {refreshData && (
              <button 
                onClick={refreshData}
                className="inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            
            {actions}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="pl-6 py-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div 
                    className={`flex items-center space-x-1 ${column.sortable !== false ? 'cursor-pointer group' : ''}`}
                    onClick={() => column.sortable !== false && requestSort(column.accessor)}
                  >
                    <span>{column.Header}</span>
                    {column.sortable !== false && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-all
                          ${sortConfig.key === column.accessor 
                            ? 'text-primary-500' 
                            : 'opacity-0 group-hover:opacity-100'} 
                          ${sortConfig.key === column.accessor && sortConfig.direction === 'desc' ? 'transform rotate-180' : ''}`}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 ${loading ? 'opacity-50' : ''}`}>
            {loading && (
              <tr>
                <td colSpan={selectable ? columns.length + 1 : columns.length} className="px-6 py-20">
                  <div className="flex justify-center">
                    <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            )}
            {!loading && currentItems.length > 0 ? (
              currentItems.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`${selectedRows.includes(rowIndex) ? 'bg-primary-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                >
                  {selectable && (
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.Cell ? column.Cell({ value: row[column.accessor], row }) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td 
                  colSpan={selectable ? columns.length + 1 : columns.length} 
                  className="px-6 py-10 text-center text-gray-500 bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm font-medium">
                      {searchTerm ? 'No results found' : emptyMessage}
                    </p>
                    {searchTerm && (
                      <button 
                        className="mt-2 text-primary-600 hover:text-primary-500 text-sm font-medium"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalItems > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span className="hidden sm:inline-block">Showing</span>
              <span className="font-medium mx-1">{startItem}</span>
              <span className="hidden sm:inline-block">to</span>
              <span className="font-medium mx-1">{endItem}</span>
              <span>of</span>
              <span className="font-medium mx-1">{totalItems}</span>
              <span className="hidden sm:inline-block">results</span>
            </div>
            
            <div className="flex items-center mt-4 sm:mt-0">
              <div className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 mr-4">
                <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">
                  Rows per page
                </span>
                <div className="relative">
                  <select
                    className="appearance-none pl-2 pr-8 py-1 rounded-md text-sm bg-white border border-gray-300 text-gray-700
                      hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1) // Reset to first page when changing items per page
                    }}
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = idx + 1
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx
                    } else {
                      pageNum = currentPage - 2 + idx
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                          ${currentPage === pageNum 
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' 
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
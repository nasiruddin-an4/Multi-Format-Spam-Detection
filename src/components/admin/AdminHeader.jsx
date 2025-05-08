import { useAuth } from '../../contexts/AuthContext'

const AdminHeader = () => {
  const { user } = useAuth()
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                  <span className="text-primary-800 font-medium">{user?.name?.charAt(0) || 'A'}</span>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
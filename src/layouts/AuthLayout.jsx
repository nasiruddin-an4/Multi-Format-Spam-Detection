import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
        </div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="min-h-screen flex flex-col pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="flex flex-col items-center">
          {/* Description */}
          <p className="mt-2 text-gray-600 text-center max-w-4xl text-lg">
            Protect your digital communications with advanced{' '}
            <span className="text-blue-600 font-medium">AI-powered</span> spam detection
          </p>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="relative bg-white/70 backdrop-blur-lg 
          shadow-xl rounded-2xl border-2 border-white/20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 
            to-purple-50/30 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[size:20px_20px]"></div>
          </div>
          
          {/* Content */}
          <div className="relative">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 text-center text-sm text-gray-500">
        Protected by advanced machine learning algorithms
      </div>
    </div>
  )
}

export default AuthLayout
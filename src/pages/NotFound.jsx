import { Link } from 'react-router-dom'
import { HiOutlineHome, HiOutlineArrowLeft } from 'react-icons/hi'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-gray-50 to-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-100/50 to-accent-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[200px] font-extrabold text-gray-900/10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto">
          Oops! It seems like you've ventured into uncharted territory. 
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 
              text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-accent-500 
              rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-accent-500/25 
              transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <HiOutlineHome className="w-5 h-5" />
            <span>Back to Home</span>
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 
              text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 
              rounded-lg hover:border-primary-200 hover:text-primary-600 
              transition-all duration-300"
          >
            <HiOutlineArrowLeft className="w-5 h-5 transition-transform duration-300 
              group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Fun Decoration */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 
                  animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
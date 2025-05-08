import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Logo from './Logo'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  const isActiveRoute = (path) => location.pathname === path

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center group transition-all duration-300"
            >
              <div className="transform transition-transform group-hover:scale-110">
                <Logo />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                SpamShield
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                ${isActiveRoute('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-600 hover:text-primary-600'
                }
                after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full 
                after:bg-primary-600 after:transform after:scale-x-0 after:origin-left
                after:transition-transform hover:after:scale-x-100
                ${isActiveRoute('/') ? 'after:scale-x-100' : ''}
              `}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/detect"
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${isActiveRoute('/detect') 
                    ? 'text-primary-600' 
                    : 'text-gray-600 hover:text-primary-600'
                  }
                  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full 
                  after:bg-primary-600 after:transform after:scale-x-0 after:origin-left
                  after:transition-transform hover:after:scale-x-100
                  ${isActiveRoute('/detect') ? 'after:scale-x-100' : ''}
                `}
              >
                Detect Spam
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600
                    transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r 
                    from-primary-600 to-primary-500 rounded-lg shadow-md hover:shadow-lg
                    transform transition-all duration-200 hover:-translate-y-0.5
                    hover:from-primary-500 hover:to-primary-400"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 group"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 
                    flex items-center justify-center text-white shadow-md
                    transform transition-all duration-200 group-hover:scale-105"
                  >
                    <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl 
                    shadow-lg ring-1 ring-black/5 animate-slide-down"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 
                          hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 
                transition-colors duration-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200
                ${isActiveRoute('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}
              `}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/detect"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200
                  ${isActiveRoute('/detect') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Detect Spam
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
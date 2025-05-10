import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { FiChevronDown } from 'react-icons/fi'
import { BiLogOut } from 'react-icons/bi'
import { HiOutlineUserCircle, HiOutlineLogin, HiOutlineShieldCheck } from 'react-icons/hi'
import { BsShieldCheck } from 'react-icons/bs'
import { IoBusinessOutline, IoPeopleOutline, IoInformationCircleOutline } from 'react-icons/io5'
import Logo from './Logo'

// Define nav items with icons
const navItems = [
  { path: '/', label: 'Home', icon: <BsShieldCheck className="w-5 h-5" /> },
  { path: '/business', label: 'Business', icon: <IoBusinessOutline className="w-5 h-5" /> },
  { path: '/partners', label: 'Partners', icon: <IoPeopleOutline className="w-5 h-5" /> },
  { path: '/about', label: 'About Us', icon: <IoInformationCircleOutline className="w-5 h-5" /> },
]

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

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
  
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  // Clean up body overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const isActiveRoute = (path) => location.pathname === path

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white py-3 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="transform transition-transform group-hover:scale-110">
                  <Logo className="h-8 w-auto" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  GuardNex
                </span>
              </Link>
            </div>

            {/* Middle - Navigation Menu */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200
                      group hover:text-primary-600
                      ${isActiveRoute(item.path) 
                        ? 'text-primary-600' 
                        : 'text-gray-600'
                      }
                    `}
                  >
                    <span className="relative">
                      {item.label}
                      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r 
                        from-primary-600 to-accent-500 transform origin-left scale-x-0 
                        transition-transform duration-300 group-hover:scale-x-100
                        ${isActiveRoute(item.path) ? 'scale-x-100' : ''}`}>
                      </span>
                    </span>
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <Link 
                    to="/detect"
                    className="relative px-5 py-2 text-sm font-medium text-white
                      bg-gradient-to-r from-primary-600 to-accent-500
                      rounded-full shadow-md hover:shadow-lg transition-all duration-300
                      hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
                  >
                    <span>Detect Spam</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Right - Auth Buttons/Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="group px-5 py-2 text-sm font-medium text-gray-600 
                      transition-all duration-300 rounded-full hover:bg-gray-50 
                      border-2 border-gray-200 hover:border-primary-200
                      flex items-center gap-2 hover:text-primary-600"
                  >
                    <HiOutlineLogin className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="group relative px-5 py-2 text-sm font-medium
                      rounded-full flex items-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 
                      transition-opacity duration-300 group-hover:opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 
                      opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                    <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100
                      transition-transform duration-500 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)]"></div>
                    <HiOutlineUserCircle className="w-4 h-4 relative text-white" />
                    <span className="relative text-white">Sign up</span>
                  </Link>
                </div>
              ) : (
                <div className="relative profile-menu-container">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 group focus:outline-none"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 
                      flex items-center justify-center text-white shadow-md group-hover:shadow-lg
                      transform transition-all duration-200 group-hover:scale-105"
                    >
                      <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                    </div>
                    <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                      ${isProfileOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl 
                      ring-1 ring-black/5 transform transition-all duration-200 origin-top-right"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 
                            hover:bg-red-50 rounded-md transition-colors duration-200"
                        >
                          <BiLogOut className="w-5 h-5 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-600 hover:text-primary-600 
                  transition-colors duration-200 focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <HiOutlineX className="h-6 w-6" />
                ) : (
                  <HiOutlineMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div className={`fixed inset-0 bg-gray-800/60 backdrop-blur-md z-40 md:hidden
        transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          setIsMenuOpen(false);
          document.body.style.overflow = 'auto';
        }}
      >
        <div 
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl
            transition-transform duration-300 ease-in-out transform
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between px-4 py-4">
              <Link to="/" className="flex items-center" onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}>
                <Logo className="h-7 w-auto" />
                <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  GuardNex
                </span>
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = 'auto';
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 
                  hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close menu"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex flex-col h-[calc(100%-64px)]">
            <div className="flex-1 overflow-y-auto py-4 px-4">
              <div className="space-y-1.5">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium 
                      transition-all duration-200 ${isActiveRoute(item.path) 
                        ? 'text-white bg-gradient-to-r from-primary-600 to-accent-500 shadow-md' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAuthenticated && (
                  <Link
                    to="/detect"
                    className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg text-base font-medium
                      text-white bg-gradient-to-r from-primary-600 to-accent-500 
                      shadow-md transition-all duration-200 hover:shadow-lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    <span>Detect Spam</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sticky Auth Footer */}
            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4 shadow-lg">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm
                      font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 
                      rounded-lg transition-colors duration-200 border border-gray-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    <HiOutlineLogin className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm
                      font-medium text-white bg-gradient-to-r from-primary-600 to-accent-500 
                      rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                  >
                    <HiOutlineUserCircle className="w-4 h-4" />
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 
                      to-accent-500 flex items-center justify-center text-white shadow-md"
                    >
                      <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      document.body.style.overflow = 'auto';
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 
                      hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <BiLogOut className="w-5 h-5 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
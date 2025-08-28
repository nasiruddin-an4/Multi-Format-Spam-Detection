import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineArrowRight, 
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await login(email, password, rememberMe)
      
      if (result.success) {
        toast.success('Login successful')
        // Redirect to admin dashboard if user is admin, otherwise to home
        if (result.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left side - Decorative section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-accent-500 p-8 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.6\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
        </div>
        <div className="z-10 max-w-md text-white">
          <div className="flex items-center mb-8">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <HiOutlineShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold ml-3">GuardNex</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Welcome back!</h2>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            Log in to access your personalized dashboard and continue protecting your data from spam threats.
          </p>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-medium italic">
              "GuardNex has been an essential tool for our organization, helping us filter out 99.8% of unwanted messages."
            </p>
            <div className="mt-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-sm font-bold">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Jane Doe</p>
                <p className="text-xs opacity-80">Security Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen md:min-h-0">
        <div className="w-full max-w-md transition-all duration-300 transform">
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex items-center p-2 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg shadow-lg">
              <HiOutlineShieldCheck className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white ml-2">GuardNex</h1>
            </div>
          </div>
          
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Sign in
            </h2>
            <p className="text-sm text-gray-600">
              Access your GuardNex account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 text-gray-700 bg-white border border-gray-300 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-primary-500/30 focus:border-primary-500 hover:border-gray-400
                      transition-all duration-200"
                    placeholder="your@email.com"
                    aria-label="Email address"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-xs font-medium text-primary-600 hover:text-primary-500 transition-colors hover:underline"
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 text-gray-700 bg-white border border-gray-300 
                      rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-primary-500/30 focus:border-primary-500 hover:border-gray-400
                      transition-all duration-200"
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                aria-label="Remember me"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="group relative w-full flex items-center justify-center py-3 px-4 
                text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-accent-500 
                hover:from-primary-700 hover:to-accent-600 shadow-md hover:shadow-lg
                transform transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              disabled={loading}
              aria-label={loading ? "Signing in..." : "Sign in"}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <HiOutlineArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors"
                  aria-label="Sign up for free"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-3 border border-gray-300 
                rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                transition-all duration-200"
                aria-label="Sign in with Google"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-3 border border-gray-300 
                rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                transition-all duration-200"
                aria-label="Sign in with GitHub"
              >
                <FaGithub className="w-5 h-5" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>By signing in, you agree to our <a href="#" className="underline hover:text-primary-600 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary-600 transition-colors">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
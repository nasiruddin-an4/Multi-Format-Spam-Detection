import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await register(name, email, password)
      
      if (result.success) {
        toast.success('Registration successful! Please log in.')
        navigate('/login')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Card Container */}
        <div className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20
          before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-white/30 before:rounded-3xl">
          {/* Header */}
          <div className="relative text-center space-y-3 mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
              animate-gradient">
              Create Account
            </h2>
            <p className="text-base text-gray-600/90 max-w-md mx-auto">
              Join SpamShield and protect your communications with advanced AI technology
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-8 max-w-4xl mx-auto">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Password Input */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-6 py-4 rounded-xl
                  text-white font-medium text-lg bg-gradient-to-r from-blue-500 to-purple-500
                  hover:from-blue-600 hover:to-purple-600 transform transition-all
                  duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50
                  disabled:cursor-not-allowed disabled:hover:translate-y-0
                  shadow-xl shadow-blue-500/10"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                      />
                    </svg>
                    <span>Creating your account...</span>
                  </div>
                ) : 'Create your account'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-8 bg-white/70 text-gray-500 backdrop-blur-sm rounded-full">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="block w-full text-center px-6 py-4 rounded-xl
                text-gray-700 font-medium border border-gray-200/80 bg-white/40
                hover:bg-white transition-all duration-300 hover:-translate-y-0.5
                hover:shadow-lg hover:border-blue-400/30 backdrop-blur-sm"
            >
              Sign in to your account
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
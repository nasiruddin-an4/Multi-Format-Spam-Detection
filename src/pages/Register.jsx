import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validations, setValidations] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
    minLength: false
  })
  
  const { register } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Check password strength
    const checkPasswordStrength = () => {
      if (!password) {
        setPasswordStrength(0)
        setValidations({
          lowercase: false,
          uppercase: false,
          number: false,
          specialChar: false,
          minLength: false
        })
        return
      }
      
      const hasLowercase = /[a-z]/.test(password)
      const hasUppercase = /[A-Z]/.test(password)
      const hasNumber = /[0-9]/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
      const hasMinLength = password.length >= 6
      
      const newValidations = {
        lowercase: hasLowercase,
        uppercase: hasUppercase,
        number: hasNumber,
        specialChar: hasSpecialChar,
        minLength: hasMinLength
      }
      
      setValidations(newValidations)
      
      // Calculate strength (0-4)
      const strength = Object.values(newValidations).filter(Boolean).length
      setPasswordStrength(strength)
    }
    
    checkPasswordStrength()
  }, [password])
  
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return 'Very Weak'
    if (passwordStrength === 1) return 'Weak'
    if (passwordStrength === 2) return 'Fair'
    if (passwordStrength === 3) return 'Good'
    if (passwordStrength === 4) return 'Strong'
    return 'Very Strong'
  }
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200'
    if (passwordStrength === 1) return 'bg-red-500'
    if (passwordStrength === 2) return 'bg-orange-500'
    if (passwordStrength === 3) return 'bg-yellow-500'
    if (passwordStrength === 4) return 'bg-green-500'
    return 'bg-green-600'
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Form validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
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
    
    if (passwordStrength < 3) {
      toast.error('Please create a stronger password')
      return
    }
    
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions')
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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
              animate-gradient">
              Create Account
            </h1>
            <p className="text-base text-gray-600/90 max-w-md mx-auto">
              Join GuardNex and protect your communications with advanced AI technology
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-8 max-w-4xl mx-auto">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
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
                    aria-required="true"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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
                    aria-required="true"
                    required
                  />
                </div>
                {email && !validateEmail(email) && (
                  <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
                )}
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Password Input */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="••••••••"
                    aria-required="true"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength < 2 ? 'text-red-500' : 
                        passwordStrength < 4 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>{getPasswordStrengthLabel()}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        {validations.minLength ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">At least 6 characters</span>
                      </div>
                      <div className="flex items-center">
                        {validations.lowercase ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">Lowercase letter</span>
                      </div>
                      <div className="flex items-center">
                        {validations.uppercase ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">Uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        {validations.number ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">Number</span>
                      </div>
                      <div className="flex items-center">
                        {validations.specialChar ? (
                          <FiCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <FiX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2 text-xs text-gray-600">Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200/80 
                      focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400
                      transition-all duration-200 outline-none text-gray-600
                      placeholder-gray-400/80 bg-white/50 backdrop-blur-sm
                      hover:border-blue-400/30 shadow-sm"
                    placeholder="••••••••"
                    aria-required="true"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I accept the <Link to="/terms" className="text-blue-500 hover:text-blue-600">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:text-blue-600">Privacy Policy</Link>
                  </label>
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
                aria-label={loading ? "Creating account..." : "Create account"}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
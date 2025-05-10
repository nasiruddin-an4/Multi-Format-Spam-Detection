import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { API_URL } from '../config/api'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp < currentTime) {
          // Token expired
          logout()
        } else {
          // Valid token
          setUser(decoded)
          setIsAuthenticated(true)
          // Set auth header for all future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Invalid token', error)
        logout()
      }
    }
    setLoading(false)
  }, [])
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true, user }
    } catch (error) {
      console.error('Login failed', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }
  
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      console.error('Registration failed', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  }
  
  const updateProfile = async (userData, photo) => {
    try {
      let updatedUser = { ...user };
      
      // If there's profile data to update
      if (userData) {
        try {
          const response = await axios.put(`${API_URL}/users/profile`, userData);
          if (response.data && response.data.user) {
            updatedUser = { ...updatedUser, ...response.data.user };
          } else if (response.data) {
            // If server doesn't return a user object, just update with userData
            updatedUser = { ...updatedUser, ...userData };
          }
        } catch (error) {
          console.error('Profile data update failed:', error);
          // Continue with photo upload even if profile update fails
        }
      }
      
      // If there's a photo to upload
      if (photo) {
        try {
          const formData = new FormData();
          formData.append('profilePhoto', photo);
          
          // Use a temporary URL to display the image immediately
          const photoObjectURL = URL.createObjectURL(photo);
          updatedUser = { ...updatedUser, photoURL: photoObjectURL };
          
          // Set user state immediately with local photo URL
          setUser(updatedUser);
          
          // Then upload to server async
          const photoResponse = await axios.post(`${API_URL}/users/profile/photo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // If server returns a URL, update with server URL
          if (photoResponse.data && photoResponse.data.photoURL) {
            updatedUser = { 
              ...updatedUser, 
              photoURL: photoResponse.data.photoURL 
            };
          }
        } catch (error) {
          console.error('Photo upload failed:', error);
          // Keep the local Object URL even if server upload fails
        }
      }
      
      // Update user state
      setUser(updatedUser);
      
      // For testing/development without backend
      if (!userData && !photo) {
        return { 
          success: false,
          error: 'No changes were made to update.'
        };
      }
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed. Please try again.'
      };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
    navigate('/login')
  }
  
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
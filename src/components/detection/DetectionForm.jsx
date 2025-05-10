import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_URL } from '../../config/api'

const messageTypes = [
  { id: 'email', name: 'Email' },
  { id: 'sms', name: 'SMS' },
  { id: 'social', name: 'Social Media' }
]

const DetectionForm = ({ onDetectionResult }) => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('email')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error('Please enter a message to check')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/predict`, {
        message,
        type: messageType
      })
      
      onDetectionResult({
        message,
        type: messageType,
        isSpam: response.data.isSpam,
        confidence: response.data.confidence,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Error detecting spam', error)
      toast.error('Error detecting spam. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold gradient-text">Message Detection</h3>
            <div className="flex gap-2">
              {messageTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setMessageType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${messageType === type.id 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="messageType" className="label">
              Message Type
            </label>
            <select
              id="messageType"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="input"
            >
              {messageTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="label">
              Message Content
            </label>
            <textarea
              id="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter your ${messageType} message to check for spam...`}
              className="input"
            />
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Detect Spam</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DetectionForm
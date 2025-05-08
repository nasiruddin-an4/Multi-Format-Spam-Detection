import { useState, useEffect } from 'react'

const ResultCard = ({ result }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Add animation delay for a more pleasant visual experience
    setIsVisible(false)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [result])
  
  if (!result) return null
  
  const { isSpam, confidence, message, type, timestamp } = result
  const formattedDate = new Date(timestamp).toLocaleString()
  
  // Format confidence as percentage
  const confidencePercent = Math.round(confidence * 100)
  
  // Determine icon, title and theme based on spam detection result
  const resultData = {
    icon: isSpam ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: isSpam ? 'Spam Detected' : 'Not Spam',
    bgColor: isSpam ? 'bg-danger-50' : 'bg-success-50',
    borderColor: isSpam ? 'border-danger-200' : 'border-success-200',
    textColor: isSpam ? 'text-danger-800' : 'text-success-800'
  }
  
  return (
    <div className={`rounded-lg border ${resultData.bgColor} ${resultData.borderColor} overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-shrink-0 mr-4">
            {resultData.icon}
          </div>
          <div>
            <h3 className={`text-lg font-bold ${resultData.textColor} mb-1`}>
              {resultData.title}
            </h3>
            <p className="text-gray-500 text-sm">
              Confidence: <span className="font-semibold">{confidencePercent}%</span>
            </p>
            <p className="text-gray-500 text-sm">
              Type: <span className="font-semibold capitalize">{type}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Time: <span className="font-semibold">{formattedDate}</span>
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Message Content:</h4>
          <p className="text-gray-600 whitespace-pre-wrap text-sm">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
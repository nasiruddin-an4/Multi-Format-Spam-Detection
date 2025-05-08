import { useState } from 'react'
import DetectionForm from '../components/detection/DetectionForm'
import ResultCard from '../components/detection/ResultCard'

const DetectionPage = () => {
  const [result, setResult] = useState(null)
  const [detectionHistory, setDetectionHistory] = useState([])
  
  const handleDetectionResult = (newResult) => {
    setResult(newResult)
    setDetectionHistory(prev => [newResult, ...prev].slice(0, 10)) // Keep last 10 detections
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Spam Detection Tool</h1>
        <p className="mt-2 text-gray-600">
          Analyze your messages to detect potential spam across various platforms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DetectionForm onDetectionResult={handleDetectionResult} />
          
          {result && (
            <div className="mt-6">
              <ResultCard result={result} />
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Detections</h2>
            
            {detectionHistory.length > 0 ? (
              <div className="space-y-4">
                {detectionHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md text-sm ${
                      item.isSpam 
                        ? 'bg-danger-50 border border-danger-200' 
                        : 'bg-success-50 border border-success-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${item.isSpam ? 'text-danger-700' : 'text-success-700'}`}>
                        {item.isSpam ? 'Spam' : 'Not Spam'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 truncate">
                      {item.message}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      Type: <span className="font-medium capitalize">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent detections</p>
                <p className="text-sm mt-1">Your recent detection history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetectionPage
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
  
  // Determine gauge level based on confidence percentage
  const getGaugeWidth = () => {
    return `${confidencePercent}%`;
  }
  
  // Determine classification message based on confidence
  const getClassificationMessage = () => {
    if (isSpam) {
      if (confidencePercent >= 90) return "High confidence spam detection";
      if (confidencePercent >= 70) return "Medium confidence spam detection";
      return "Low confidence spam detection";
    } else {
      if (confidencePercent >= 90) return "Very likely legitimate";
      if (confidencePercent >= 70) return "Probably legitimate";
      return "Possibly legitimate, but verify";
    }
  }
  
  // Determine UI elements based on spam detection result
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
    textColor: isSpam ? 'text-danger-800' : 'text-success-800',
    gaugeColor: isSpam ? 'bg-danger-500' : 'bg-success-500',
    badgeColor: isSpam ? 'bg-danger-100 text-danger-800' : 'bg-success-100 text-success-800'
  }
  
  // Find spam indicators in the message content
  const highlightSpamIndicators = (text) => {
    if (!isSpam) return <p className="text-gray-600 whitespace-pre-wrap text-sm">{text}</p>;
    
    // Common spam indicators
    const indicators = [
      { regex: /free/gi, label: "Free offers" },
      { regex: /urgent|immediately/gi, label: "Urgency tactics" },
      { regex: /\$\d+/g, label: "Money mentions" },
      { regex: /congratulations|selected|winner/gi, label: "Prize claims" },
      { regex: /click here|link|http:\/\/|https:\/\//gi, label: "Suspicious links" },
      { regex: /password|account|verify|security/gi, label: "Account security" },
      { regex: /\d{3}[-.]?\d{3}[-.]?\d{4}/g, label: "Phone numbers" },
      { regex: /limited time|act now|don't miss|hurry/gi, label: "Time pressure" }
    ];
    
    let foundIndicators = [];
    let textWithHighlights = text;
    
    indicators.forEach(({ regex, label }) => {
      const matches = text.match(regex);
      if (matches) {
        foundIndicators.push({ label, count: matches.length });
        textWithHighlights = textWithHighlights.replace(regex, (match) => 
          `<mark class="bg-yellow-100 text-yellow-800 px-1 rounded-sm">${match}</mark>`
        );
      }
    });
    
    return (
      <div>
        <p className="text-gray-600 whitespace-pre-wrap text-sm" 
           dangerouslySetInnerHTML={{ __html: textWithHighlights }} />
        
        {foundIndicators.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Potential spam indicators:</p>
            <div className="flex flex-wrap gap-2">
              {foundIndicators.map((indicator, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {indicator.label} {indicator.count > 1 && `(${indicator.count})`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`rounded-lg border ${resultData.bgColor} ${resultData.borderColor} overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-shrink-0 mr-4">
            {resultData.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-xl font-bold ${resultData.textColor}`}>
                {resultData.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${resultData.badgeColor}`}>
                {getClassificationMessage()}
              </span>
            </div>
            
            {/* Confidence gauge */}
            <div className="mt-2 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Confidence</span>
                <span className={`text-sm font-semibold ${resultData.textColor}`}>{confidencePercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${resultData.gaugeColor} transition-all duration-1000 ease-out`} 
                  style={{ width: getGaugeWidth() }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <p>
                Type: <span className="font-semibold capitalize">{type}</span>
              </p>
              <p>
                Time: <span className="font-semibold">{formattedDate}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Message Content:</h4>
          {highlightSpamIndicators(message)}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>* Our detection system uses machine learning to analyze messages for potential spam content</p>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
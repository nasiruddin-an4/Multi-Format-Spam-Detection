import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [accuracyCount, setAccuracyCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [hoursCount, setHoursCount] = useState(0)
  const [usersCount, setUsersCount] = useState(0)
  const statsRef = useRef(null)
  
  // Stats values
  const targetAccuracy = 99.2
  const targetMessages = 15
  const targetHours = 24
  const targetUsers = 10

  useEffect(() => {
    setIsVisible(true)
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        // Start counting animations when stats section is visible
        startCounting()
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [])
  
  const startCounting = () => {
    // Accuracy counter
    const accuracyDuration = 2000 // 2 seconds
    const accuracyFrames = 60
    const accuracyIncrement = targetAccuracy / accuracyFrames
    let accuracyFrame = 0
    
    const accuracyInterval = setInterval(() => {
      setAccuracyCount((prev) => {
        const next = accuracyFrame * accuracyIncrement
        return next >= targetAccuracy ? targetAccuracy : next
      })
      
      accuracyFrame++
      if (accuracyFrame > accuracyFrames) clearInterval(accuracyInterval)
    }, accuracyDuration / accuracyFrames)
    
    // Messages counter (millions)
    const messagesDuration = 2500
    const messagesFrames = 60
    const messagesIncrement = targetMessages / messagesFrames
    let messagesFrame = 0
    
    const messagesInterval = setInterval(() => {
      setMessagesCount((prev) => {
        const next = messagesFrame * messagesIncrement
        return next >= targetMessages ? targetMessages : next
      })
      
      messagesFrame++
      if (messagesFrame > messagesFrames) clearInterval(messagesInterval)
    }, messagesDuration / messagesFrames)
    
    // Hours counter
    const hoursDuration = 1500
    const hoursFrames = 24
    const hoursIncrement = targetHours / hoursFrames
    let hoursFrame = 0
    
    const hoursInterval = setInterval(() => {
      setHoursCount((prev) => {
        const next = Math.floor(hoursFrame * hoursIncrement)
        return next >= targetHours ? targetHours : next
      })
      
      hoursFrame++
      if (hoursFrame > hoursFrames) clearInterval(hoursInterval)
    }, hoursDuration / hoursFrames)
    
    // Users counter (thousands)
    const usersDuration = 2000
    const usersFrames = 60
    const usersIncrement = targetUsers / usersFrames
    let usersFrame = 0
    
    const usersInterval = setInterval(() => {
      setUsersCount((prev) => {
        const next = usersFrame * usersIncrement
        return next >= targetUsers ? targetUsers : next
      })
      
      usersFrame++
      if (usersFrame > usersFrames) clearInterval(usersInterval)
    }, usersDuration / usersFrames)
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className={`relative min-h-screen flex flex-col justify-center py-32 md:py-40 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
          <div className="absolute right-0 top-0 h-96 w-96 bg-gradient-to-bl from-primary-300/40 via-accent-300/30 to-transparent blur-3xl"></div>
          <div className="absolute left-0 bottom-0 h-96 w-96 bg-gradient-to-tr from-primary-300/40 via-accent-300/30 to-transparent blur-3xl"></div>
        </div>
      
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-6 animate-fade-in">Advanced AI Technology</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block mb-2 text-gray-900">Protect Yourself from</span>
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">Unwanted Spam</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI-powered spam detection system helps you identify and filter unwanted messages with industry-leading accuracy.
            </p>
            <div className="mt-10">
              {isAuthenticated ? (
                <Link 
                  to="/detect" 
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary-600 to-accent-500 p-0.5 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative flex items-center space-x-2 rounded-full bg-white px-8 py-3.5 transition-all duration-300 ease-out group-hover:bg-opacity-0">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 group-hover:text-white transition-colors duration-300">Start Detecting</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    to="/register" 
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-primary-600 to-accent-500 p-0.5 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative flex items-center space-x-2 px-8 py-3.5 bg-white rounded-full transition-all duration-300 ease-out group-hover:bg-opacity-0">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 group-hover:text-white transition-colors duration-300">Get Started</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-8 py-3.5 text-lg font-medium text-gray-800 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-primary-200 transition-all duration-300 hover:shadow"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={statsRef} className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Impact By Numbers</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-50 text-primary-600 mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                  {accuracyCount.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-gray-500">Detection Accuracy</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent-50 text-accent-600 mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19" />
                  </svg>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-accent-600 mb-2">
                  {messagesCount.toFixed(1)}M+
                </div>
                <div className="text-sm font-medium text-gray-500">Messages Analyzed</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-50 text-primary-600 mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                  {hoursCount}/7
                </div>
                <div className="text-sm font-medium text-gray-500">Protection</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent-50 text-accent-600 mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-accent-600 mb-2">
                  {usersCount.toFixed(1)}K+
                </div>
                <div className="text-sm font-medium text-gray-500">Users Protected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
              Multi-Channel Spam Protection
            </h2>
            <p className="text-xl text-gray-600 mb-16">
              Our platform offers protection across multiple communication channels
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-primary-50 text-primary-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Email Protection</h3>
                <p className="text-base text-gray-600 flex-grow">
                  Identify phishing attempts, fraud, and unwanted promotional emails in your inbox with 99.2% accuracy.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-accent-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-accent-50 text-accent-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SMS Filtering</h3>
                <p className="text-base text-gray-600 flex-grow">
                  Filter out scam messages and unwanted promotional SMS from your phone with real-time protection.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 text-accent-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Social Protection</h3>
                <p className="text-base text-gray-600 flex-grow">
                  Detect spam content, fake accounts, and malicious links in your social media messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-accent-50 text-accent-600 font-medium text-sm mb-4">Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
              How It Works
            </h2>
          </div>
          
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center text-white text-lg font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Input Your Message</h3>
                <p className="text-gray-600">
                  Copy and paste any message you want to check into our system. We support emails, SMS, and social media messages.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-lg font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">AI Analysis</h3>
                <p className="text-gray-600">
                  Our advanced algorithm analyzes the content using machine learning trained on millions of spam samples.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 flex items-center justify-center text-white text-lg font-bold">3</div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Get Results</h3>
                <p className="text-gray-600">
                  Receive immediate feedback on whether the message is spam or legitimate, with a detailed analysis breakdown.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600"></div>
            <div className="absolute inset-0 mix-blend-multiply opacity-10 bg-[url('/images/noise-pattern.svg')]"></div>
            
            <div className="relative py-16 px-8 sm:py-20 sm:px-16 md:py-24 md:px-20 lg:p-24">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                    <span className="block">Ready to stop spam?</span>
                    <span className="block text-white/90">Start using our platform today.</span>
                  </h2>
                  <p className="text-lg text-white/80 mb-8 max-w-xl">
                    Join thousands of users who have already protected themselves from unwanted messages. Our platform is continuously learning and improving.
                  </p>
                  
                  {isAuthenticated ? (
                    <Link 
                      to="/detect" 
                      className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-600 hover:text-primary-700 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
                    >
                      <span>Start detecting spam now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ) : (
                    <Link 
                      to="/register" 
                      className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-600 hover:text-primary-700 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
                    >
                      <span>Sign up for free</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
                
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 bg-white/10 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1">Advanced Protection</h3>
                            <p className="text-white/70 text-sm">State-of-the-art machine learning algorithms</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-white/10 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1">Real-time Results</h3>
                            <p className="text-white/70 text-sm">Get instant spam detection within seconds</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-white/10 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-bold mb-1">Growing Community</h3>
                            <p className="text-white/70 text-sm">Join thousands of users already protected</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
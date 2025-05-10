import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className={`relative pt-20 pb-16 md:pt-32 md:pb-24 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-full h-full md:w-1/2 lg:w-1/3 bg-gradient-to-bl from-primary-50 via-accent-50 to-transparent opacity-60 rounded-bl-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full md:w-1/2 lg:w-1/3 bg-gradient-to-tr from-primary-50 via-accent-50 to-transparent opacity-60 rounded-tr-[100px]"></div>
        </div>
      
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="block mb-2 text-gray-900">Protect Yourself from</span>
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">Unwanted Spam</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our advanced AI-powered spam detection system helps you identify and filter unwanted messages across email, SMS, and social media platforms with industry-leading accuracy.
            </p>
            <div className="mt-10">
              {isAuthenticated ? (
                <Link 
                  to="/detect" 
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 p-0.5 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative flex items-center space-x-2 rounded-md bg-white px-8 py-3.5 transition-all duration-300 ease-out group-hover:bg-opacity-0">
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
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 p-0.5 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative flex items-center space-x-2 px-8 py-3.5 bg-white rounded-md transition-all duration-300 ease-out group-hover:bg-opacity-0">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500 group-hover:text-white transition-colors duration-300">Get Started</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-8 py-3.5 text-lg font-medium text-gray-800 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-200 transition-all duration-300 hover:shadow"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 backdrop-blur-sm"></div>
              <img 
                src="/images/dashboard-preview.png" 
                alt="SpamShield Dashboard" 
                className="w-full h-auto rounded-xl mix-blend-overlay opacity-90"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/1200x600/f5f7fc/a78bfa?text=SpamShield+Dashboard&font=montserrat';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
              Comprehensive Spam Protection
            </h2>
            <p className="text-xl text-gray-600 mb-16">
              Our platform offers protection across multiple channels with advanced machine learning algorithms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 text-white mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Spam Detection</h3>
              <p className="text-base text-gray-600">
                Identify unwanted promotional emails, phishing attempts, and fraudulent messages in your inbox with 99.2% accuracy.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-accent-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-accent-500 to-accent-400 text-white mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SMS Spam Filtering</h3>
              <p className="text-base text-gray-600">
                Filter out annoying spam texts, scam messages, and unwanted promotional SMS from your phone with real-time protection.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card p-8 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-primary-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media Protection</h3>
              <p className="text-base text-gray-600">
                Detect spam content, fake accounts, and malicious links in your social media messages to maintain a safe online presence.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-accent-50 text-accent-600 font-medium text-sm mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
              Simple, Fast, and Effective
            </h2>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute top-0 left-1/2 h-full w-1 bg-gradient-to-b from-primary-500 to-accent-500 hidden md:block transform -translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 gap-12 md:gap-16">
              {/* Step 1 */}
              <div className="relative md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:col-start-1 md:text-right">
                  <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 text-white text-2xl font-bold mb-4 relative z-10 shadow-lg md:shadow-xl">
                      <span>1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Input Your Message</h3>
                    <p className="text-base text-gray-600 max-w-sm">
                      Copy and paste the message you want to check into our system. We support emails, SMS, and social media messages.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:col-start-2 pt-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                      <div className="h-24 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:col-start-2">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary-400 to-accent-500 text-white text-2xl font-bold mb-4 relative z-10 shadow-lg md:shadow-xl">
                      <span>2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                    <p className="text-base text-gray-600 max-w-sm">
                      Our advanced algorithm analyzes the content using machine learning techniques trained on millions of spam samples.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:col-start-1 pt-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:col-start-1 md:text-right">
                  <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 text-white text-2xl font-bold mb-4 relative z-10 shadow-lg md:shadow-xl">
                      <span>3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Get Results</h3>
                    <p className="text-base text-gray-600 max-w-sm">
                      Receive immediate feedback on whether the message is spam or legitimate, with a detailed analysis breakdown.
                    </p>
                  </div>
                </div>
                <div className="hidden md:block md:col-start-2 pt-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="h-24 flex items-center justify-center space-x-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Safe</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Spam</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 sm:py-24">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600"></div>
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path fill="white" d="M0 0h100v100H0z" />
                <path fill="white" d="M0 0h10v10H0z" />
                <path fill="white" d="M10 10h10v10H10z" />
                <path fill="white" d="M20 20h10v10H20z" />
                <path fill="white" d="M30 30h10v10H30z" />
                <path fill="white" d="M40 40h10v10H40z" />
                <path fill="white" d="M50 50h10v10H50z" />
                <path fill="white" d="M60 60h10v10H60z" />
                <path fill="white" d="M70 70h10v10H70z" />
                <path fill="white" d="M80 80h10v10H80z" />
                <path fill="white" d="M90 90h10v10H90z" />
              </svg>
            </div>
            
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
                      className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-600 hover:text-primary-700 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
                    >
                      <span>Start detecting spam now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ) : (
                    <Link 
                      to="/register" 
                      className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-600 hover:text-primary-700 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/10 rounded-xl flex flex-col items-center text-center">
                        <div className="text-4xl font-bold text-white mb-1">99.2%</div>
                        <div className="text-sm font-medium text-white/80">Detection Accuracy</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl flex flex-col items-center text-center">
                        <div className="text-4xl font-bold text-white mb-1">15M+</div>
                        <div className="text-sm font-medium text-white/80">Messages Processed</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl flex flex-col items-center text-center">
                        <div className="text-4xl font-bold text-white mb-1">24/7</div>
                        <div className="text-sm font-medium text-white/80">Protection</div>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl flex flex-col items-center text-center">
                        <div className="text-4xl font-bold text-white mb-1">10K+</div>
                        <div className="text-sm font-medium text-white/80">Users Protected</div>
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
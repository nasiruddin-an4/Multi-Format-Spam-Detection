import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          <span className="block">Protect Yourself from</span>
          <span className="block text-primary-600">Unwanted Spam</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
          Our advanced AI-powered spam detection system helps you identify and filter unwanted messages across email, SMS, and social media.
        </p>
        <div className="mt-10">
          {isAuthenticated ? (
            <Link to="/detect" className="btn-primary px-8 py-3 text-lg">
              Start Detecting
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn-primary px-8 py-3 text-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn-outline px-8 py-3 text-lg">
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Spam Protection
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform offers protection across multiple channels with advanced machine learning algorithms.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="card p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Email Spam Detection</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Identify unwanted promotional emails, phishing attempts, and fraudulent messages in your inbox.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="card p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">SMS Spam Filtering</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Filter out annoying spam texts, scam messages, and unwanted promotional SMS from your phone.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="card p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Social Media Protection</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Detect spam content, fake accounts, and malicious links in your social media messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Fast, and Effective
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Input Your Message</h3>
                <p className="text-base text-gray-500">
                  Copy and paste the message you want to check into our system.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-base text-gray-500">
                  Our advanced algorithm analyzes the content using machine learning techniques.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Get Results</h3>
                <p className="text-base text-gray-500">
                  Receive immediate feedback on whether the message is spam or legitimate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center lg:max-w-3xl">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to stop spam?</span>
                  <span className="block">Start using our platform today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-primary-200">
                  Join thousands of users who have already protected themselves from unwanted messages.
                </p>
                <div className="mt-10">
                  {isAuthenticated ? (
                    <Link to="/detect" className="bg-white px-6 py-3 border border-transparent rounded-md shadow text-base font-medium text-primary-600 hover:bg-primary-50">
                      Start detecting spam now
                    </Link>
                  ) : (
                    <Link to="/register" className="bg-white px-6 py-3 border border-transparent rounded-md shadow text-base font-medium text-primary-600 hover:bg-primary-50">
                      Sign up for free
                    </Link>
                  )}
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
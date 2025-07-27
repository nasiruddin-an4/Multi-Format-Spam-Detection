import React from "react";
import { Link } from "react-router-dom";

const Business = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-6">
            Enterprise Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8">
            <span className="block text-gray-900">
              Protect Your Business from
            </span>
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Spam Threats
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Comprehensive spam protection solutions designed for businesses of
            all sizes. Secure your communication channels and protect your
            employees.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-full text-white font-medium transition-all duration-300 shadow-lg shadow-primary-600/20"
            >
              Contact Sales
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 bg-white hover:bg-gray-50 rounded-full text-gray-700 font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Enterprise Security
            </h3>
            <p className="text-gray-600">
              Advanced protection features specifically designed for business
              environments and enterprise-scale operations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Team Management
            </h3>
            <p className="text-gray-600">
              Easily manage access and protection levels for your entire team
              from a centralized dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Analytics & Reporting
            </h3>
            <p className="text-gray-600">
              Comprehensive analytics and reporting tools to track and analyze
              spam patterns affecting your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;

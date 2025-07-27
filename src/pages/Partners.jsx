import React from "react";
import { Link } from "react-router-dom";

const Partners = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-accent-50 text-accent-600 font-medium text-sm mb-6">
            Partnership Program
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-8">
            <span className="block text-gray-900">Grow Your Business</span>
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              With GuardNex
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Join our partner ecosystem and help businesses protect themselves
            from spam threats while growing your revenue.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/partner-application"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-full text-white font-medium transition-all duration-300 shadow-lg shadow-primary-600/20"
            >
              Become a Partner
            </Link>
            <Link
              to="/partner-program"
              className="px-8 py-4 bg-white hover:bg-gray-50 rounded-full text-gray-700 font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Partner Types */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Type 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Solution Partners
            </h3>
            <p className="text-gray-600">
              Integrate our spam detection capabilities into your existing
              solutions and provide added value to your customers.
            </p>
          </div>

          {/* Type 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Referral Partners
            </h3>
            <p className="text-gray-600">
              Earn competitive commissions by referring businesses to our
              enterprise spam protection solutions.
            </p>
          </div>

          {/* Type 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-accent-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Technology Partners
            </h3>
            <p className="text-gray-600">
              Build innovative solutions using our API and help shape the future
              of spam detection technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;

import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-20 pt-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Hero Section */}
        <div className="relative z-10 mb-32">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
          
          <div className="text-center relative z-10">
            <div className="inline-block mb-6 px-6 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <span className="text-gray-700 font-medium">Protecting Digital Communications</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-8">
              <span className=" text-gray-900">About </span>
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">GuardNex</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Leveraging cutting-edge AI technology and machine learning solutions to create a safer digital world.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#mission" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-full text-white font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40">Our Mission</a>
              <a href="#team" className="px-8 py-3 bg-white hover:bg-gray-50 rounded-full text-gray-700 font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg">Meet Our Team</a>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div id="mission" className="relative mb-32">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="h-px bg-gray-200 flex-grow"></div>
              <h2 className="px-6 text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Our Mission</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>
            
            <div className="backdrop-blur-sm bg-white/90 rounded-3xl p-10 border border-gray-100 shadow-xl">
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-primary-600/5 blur-3xl rounded-full"></div>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                At GuardNex, we're committed to creating a safer digital communication environment by leveraging 
                advanced artificial intelligence and machine learning technologies to combat unwanted spam messages 
                across multiple platforms.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our goal is to provide individuals and businesses with powerful, easy-to-use tools that protect 
                their time and resources from the growing threat of spam communications. We believe everyone deserves 
                a clean inbox and safe digital interactions.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="flex items-center mb-16">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <h2 className="px-6 text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Our Values</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="h-full backdrop-blur-sm bg-white/90 hover:bg-white rounded-3xl p-8 border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-primary-600/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Security First</h3>
                  <p className="text-gray-600">
                    We prioritize the protection of our users' communications and personal data with state-of-the-art security measures and continuous monitoring.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="h-full backdrop-blur-sm bg-white/90 hover:bg-white rounded-3xl p-8 border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-accent-600/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mb-6 group-hover:bg-accent-200 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
                  <p className="text-gray-600">
                    We continuously evolve our technology to stay ahead of emerging spam threats and provide cutting-edge solutions that set new industry standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="h-full backdrop-blur-sm bg-white/90 hover:bg-white rounded-3xl p-8 border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-primary-600/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">User Focused</h3>
                  <p className="text-gray-600">
                    We design our solutions with our users in mind, ensuring intuitive, accessible, and effective protection against all forms of spam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-32">
          <div className="backdrop-blur-sm bg-white/90 rounded-3xl p-12 border border-gray-100 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-100 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="text-6xl font-extrabold text-gray-900">99.8</div>
                    <div className="text-3xl font-bold ml-1 text-primary-600">%</div>
                  </div>
                  <p className="text-xl text-gray-600 font-medium">Spam Detection Accuracy</p>
                </div>
              </div>
              <div className="text-center relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-100 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl font-extrabold text-gray-900 mb-4">50M<span className="text-accent-600">+</span></div>
                  <p className="text-xl text-gray-600 font-medium">Messages Protected Daily</p>
                </div>
              </div>
              <div className="text-center relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-100 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl font-extrabold text-gray-900 mb-4">500<span className="text-primary-600">+</span></div>
                  <p className="text-xl text-gray-600 font-medium">Business Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="mb-20">
          <div className="flex items-center mb-16">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <h2 className="px-6 text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Our Team</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group">
              <div className="backdrop-blur-sm bg-white/90 hover:bg-white rounded-3xl p-10 border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-primary-600/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-6 shadow-lg shadow-primary-600/20">
                      <span className="text-4xl font-bold text-white">N</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">Nasir Uddin</h3>
                      <p className="text-xl text-primary-600 font-medium">Co-founder & Lead Developer</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Leads the development of our AI algorithms and spam detection systems. With expertise in machine learning and cybersecurity, Nasir ensures our technology.
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-primary-600 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-blue-600 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-blue-700 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="backdrop-blur-sm bg-white/90 hover:bg-white rounded-3xl p-10 border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-accent-600/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mr-6 shadow-lg shadow-accent-600/20">
                      <span className="text-4xl font-bold text-white">R</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">Wazid Ahmed Razi</h3>
                      <p className="text-xl text-accent-600 font-medium">Co-founder & UX Architect</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Oversees the platform architecture and user experience design. Razi's passion for creating intuitive, accessible interfaces ensures our powerful technology is easy for everyone to use.
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-accent-600 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-blue-600 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-blue-700 transition-all duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

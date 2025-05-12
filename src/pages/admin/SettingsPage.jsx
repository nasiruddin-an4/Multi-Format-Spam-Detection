import { useState } from 'react';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    general: {
      systemName: 'GuardNex Spam Detection',
      emailNotifications: true,
      autoUpdate: true,
      dataRetentionDays: 30
    },
    detection: {
      emailThreshold: 0.85,
      smsThreshold: 0.80,
      socialThreshold: 0.75,
      enableMLModel: true,
      enableKeywordFiltering: true,
      enablePatternMatching: true
    },
    api: {
      apiKey: 'your-api-key-here',
      maxRequestsPerMinute: 100,
      timeout: 30
    }
  });

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (section, e) => {
    e.preventDefault();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section} settings updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${section} settings`);
    }
  };

  const renderInput = (section, field, label, type = 'text', options = {}) => (
    <div className="relative z-0 w-full mb-6 group">
      <input
        type={type}
        value={settings[section][field]}
        onChange={(e) => handleChange(section, field, 
          type === 'checkbox' ? e.target.checked : 
          type === 'number' ? parseInt(e.target.value) : 
          type === 'range' ? parseFloat(e.target.value) : e.target.value
        )}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer ${type === 'checkbox' ? 'hidden' : ''}`}
        placeholder=" "
        {...options}
      />
      <label className={`${type === 'checkbox' ? 'ml-2 text-sm text-gray-700' : 'absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'}`}>
        {label}
      </label>
      {type === 'range' && (
        <span className="absolute right-0 top-0 text-sm text-gray-500">
          {settings[section][field]}
        </span>
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>

      <div className="space-y-8">
        {/* General Settings */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={(e) => handleSubmit('general', e)}>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              General Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('general', 'systemName', 'System Name')}
              {renderInput('general', 'dataRetentionDays', 'Data Retention (days)', 'number', { min: 1, max: 365 })}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.emailNotifications}
                  onChange={(e) => handleChange('general', 'emailNotifications', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enable Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.autoUpdate}
                  onChange={(e) => handleChange('general', 'autoUpdate', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enable Auto Updates</label>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Detection Settings */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={(e) => handleSubmit('detection', e)}>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Detection Settings
            </h2>
            <div className="space-y-6">
              {renderInput('detection', 'emailThreshold', 'Email Detection Threshold', 'range', { min: 0, max: 1, step: 0.05 })}
              {renderInput('detection', 'smsThreshold', 'SMS Detection Threshold', 'range', { min: 0, max: 1, step: 0.05 })}
              {renderInput('detection', 'socialThreshold', 'Social Media Detection Threshold', 'range', { min: 0, max: 1, step: 0.05 })}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.detection.enableMLModel}
                    onChange={(e) => handleChange('detection', 'enableMLModel', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable Machine Learning Model</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.detection.enableKeywordFiltering}
                    onChange={(e) => handleChange('detection', 'enableKeywordFiltering', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable Keyword Filtering</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.detection.enablePatternMatching}
                    onChange={(e) => handleChange('detection', 'enablePatternMatching', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable Pattern Matching</label>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* API Settings */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={(e) => handleSubmit('api', e)}>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              API Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('api', 'apiKey', 'API Key', 'password')}
              {renderInput('api', 'maxRequestsPerMinute', 'Max Requests per Minute', 'number', { min: 1 })}
              {renderInput('api', 'timeout', 'Timeout (seconds)', 'number', { min: 1, max: 120 })}
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
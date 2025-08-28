import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    spamDetected: 0,
    cleanMessages: 0,
    detectionRate: 0,
    messagesByPeriod: [],
    accuracyByChannel: {}
  });

  // Prepare chart data from API response
  const lineChartData = {
    labels: stats.messagesByPeriod.map(item => item.period),
    datasets: [
      {
        label: 'Spam Messages',
        data: stats.messagesByPeriod.map(item => item.spamCount),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Clean Messages',
        data: stats.messagesByPeriod.map(item => item.cleanCount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(stats.accuracyByChannel),
    datasets: [
      {
        label: 'Detection Accuracy by Channel',
        data: Object.values(stats.accuracyByChannel),
        backgroundColor: [
          'rgba(53, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
      },
    ],
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${API_URL}/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Transform API data for the state
        const { data } = response;
        setStats({
          totalMessages: data.totalMessages,
          spamDetected: data.spamCount,
          cleanMessages: data.cleanCount,
          detectionRate: data.detectionRate,
          messagesByPeriod: data.messagesByPeriod,
          accuracyByChannel: data.accuracyByChannel
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Remove the toast notification
        // toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-2">Real-time spam detection analytics and insights</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Messages</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalMessages.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Spam Detected</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{stats.spamDetected.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Clean Messages</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.cleanMessages.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Detection Rate</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{stats.detectionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Message Trends</h3>
          <div className="h-[400px]">
            <Line 
              data={lineChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: 'index'
                }
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Detection Accuracy by Channel</h3>
          <div className="h-[400px]">
            <Bar 
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
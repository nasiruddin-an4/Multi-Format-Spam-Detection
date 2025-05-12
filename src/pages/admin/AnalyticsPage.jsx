import { useState, useEffect } from 'react';
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
  });

  // Sample data for charts
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Spam Messages',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Clean Messages',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ['Email', 'SMS', 'Social Media', 'Web Content'],
    datasets: [
      {
        label: 'Detection Accuracy by Channel',
        data: [95, 88, 92, 90],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      // Replace with actual API call
      setTimeout(() => {
        setStats({
          totalMessages: 1250,
          spamDetected: 320,
          cleanMessages: 930,
          detectionRate: 94.5,
        });
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Total Messages</h3>
          <p className="text-2xl font-bold">{stats.totalMessages}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Spam Detected</h3>
          <p className="text-2xl font-bold text-red-600">{stats.spamDetected}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Clean Messages</h3>
          <p className="text-2xl font-bold text-green-600">{stats.cleanMessages}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm">Detection Rate</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.detectionRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Message Trends</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Detection Accuracy by Channel</h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
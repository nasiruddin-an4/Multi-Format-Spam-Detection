import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import StatsCard from "../../components/admin/StatsCard";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    spamCount: 0,
    hamCount: 0,
    messagesByType: {
      email: 0,
      sms: 0,
      social: 0,
    },
    recentActivity: [],
    messagesByPeriod: [],
    accuracyByChannel: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await axios.get(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setStats(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        if (isMounted) {
          toast.error("Error loading dashboard data");
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchStats();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate spam percentage
  const spamPercentage =
    stats.totalMessages > 0
      ? Math.round((stats.spamCount / stats.totalMessages) * 100)
      : 0;

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor your system's performance and metrics
        </p>
      </div>

      {/* Stats Cards with hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="hover-lift">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            colorClass="bg-primary-500"
            change={{ isIncrease: true, value: 12 }}
          />
        </div>

        <div className="hover-lift">
          <StatsCard
            title="Messages Scanned"
            value={stats.totalMessages}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
            colorClass="bg-accent-500"
            change={{ isIncrease: true, value: 8 }}
          />
        </div>

        <div className="hover-lift">
          <StatsCard
            title="Spam Detected"
            value={stats.spamCount}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            colorClass="bg-danger-500"
            change={{ isIncrease: false, value: 3 }}
          />
        </div>

        <div className="hover-lift">
          <StatsCard
            title="Spam Percentage"
            value={`${spamPercentage}%`}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            }
            colorClass="bg-warning-500"
          />
        </div>
      </div>

      {/* Message Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Message Type Distribution
          </h2>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="text-sm font-medium text-gray-700">
                  {stats.messagesByType.email} messages
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      stats.totalMessages > 0
                        ? (stats.messagesByType.email / stats.totalMessages) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* SMS */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">SMS</span>
                <span className="text-sm font-medium text-gray-700">
                  {stats.messagesByType.sms} messages
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-accent-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      stats.totalMessages > 0
                        ? (stats.messagesByType.sms / stats.totalMessages) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Social Media
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {stats.messagesByType.social} messages
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-warning-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      stats.totalMessages > 0
                        ? (stats.messagesByType.social / stats.totalMessages) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Recent Activity
          </h2>

          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start pb-4 border-b border-gray-100"
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.isSpam
                        ? "bg-danger-100 text-danger-600"
                        : "bg-success-100 text-success-600"
                    }`}
                  >
                    {activity.isSpam ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.isSpam ? "Detected spam" : "Scanned message"} (
                      {activity.type})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

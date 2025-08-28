import { useState, useEffect } from "react";
import DataTable from "../../components/admin/DataTable";
import axios from "axios";
import { API_URL } from "../../config/api";
import { toast } from "react-toastify";

const MessageLogs = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    isSpam: "all",
    type: "all",
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.get(`${API_URL}/admin/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          isSpam: filters.isSpam !== "all" ? filters.isSpam : undefined,
          type: filters.type !== "all" ? filters.type : undefined,
        },
      });

      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Error loading message logs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const FilterActions = () => (
    <div className="flex flex-wrap gap-2">
      <select
        className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white hover:border-primary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
        value={filters.isSpam}
        onChange={(e) => handleFilterChange("isSpam", e.target.value)}
      >
        <option value="all">All Messages</option>
        <option value="true">Spam Only</option>
        <option value="false">Not Spam Only</option>
      </select>

      <select
        className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white hover:border-primary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
        value={filters.type}
        onChange={(e) => handleFilterChange("type", e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="email">Email</option>
        <option value="sms">SMS</option>
        <option value="social">Social Media</option>
      </select>
    </div>
  );

  const columns = [
    {
      Header: "User",
      accessor: "user.name",
    },
    {
      Header: "Message",
      accessor: "content",
      Cell: ({ value }) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => (
        <span className="capitalize px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800">
          {value}
        </span>
      ),
    },
    {
      Header: "Status",
      accessor: "is_spam",
      Cell: ({ value }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {value ? "Spam" : "Not Spam"}
          <span className="ml-1">{value ? "⚠️" : "✅"}</span>
        </span>
      ),
    },
    {
      Header: "Confidence",
      accessor: "confidence",
      Cell: ({ value }) => {
        const percent = Math.round(value * 100);
        return (
          <div className="flex items-center">
            <span className="mr-2">{percent}%</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percent > 75
                    ? "bg-red-500"
                    : percent > 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Language",
      accessor: "language",
      Cell: ({ value }) => (
        <span className="capitalize px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "created_at",
      Cell: ({ value }) => new Date(value).toLocaleString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading message logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12"
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
        </div>
        <p className="text-gray-600">
          Error loading messages. Please try again.
        </p>
        <button
          onClick={fetchMessages}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Message Logs</h1>
        <p className="text-gray-500">View history of all scanned messages</p>
      </div>

      <DataTable
        data={messages}
        columns={columns}
        title="Message History"
        pagination={true}
        initialItemsPerPage={10}
        actions={<FilterActions />}
      />
    </div>
  );
};

export default MessageLogs;

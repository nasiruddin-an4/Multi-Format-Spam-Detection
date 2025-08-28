import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../common/Logo";
import axios from "axios";
import { API_URL } from "../../config/api";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({
    users: 0,
    messages: 0,
  });
  const { logout } = useAuth();
  const location = useLocation();

  // Add function to fetch badge counts
  const fetchBadgeCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/badge-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBadgeCounts(response.data);
    } catch (error) {
      console.error("Error fetching badge counts:", error);
    }
  };

  // Add useEffect to fetch badge counts
  useEffect(() => {
    fetchBadgeCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      badge: null,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      badge: badgeCounts.users > 0 ? badgeCounts.users : null,
    },
    {
      name: "Message Logs",
      path: "/admin/messages",
      icon: (
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
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      badge: badgeCounts.messages > 0 ? badgeCounts.messages : null,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      badge: null,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      badge: null,
    },
  ];

  // Show/hide sidebar for mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile menu button */}
      <button
        className={`md:hidden fixed bottom-4 right-4 z-30 p-3 rounded-full shadow-lg 
          bg-primary-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isOpen && !isMobile ? "w-64" : "w-20"} 
          fixed h-screen bg-white shadow-xl transition-all duration-300 ease-in-out top-0 left-0 z-30
          md:relative md:translate-x-0 border-r border-gray-200`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div
            className={`${
              (isOpen && !isMobile) || isMobile ? "block" : "hidden"
            } flex items-center`}
          >
            <Logo className="w-8 h-8" />
            <span className="ml-2 text-lg font-semibold gradient-text">
              GuardNex
            </span>
          </div>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="mt-6 px-4">
          <div
            className={`${
              (isOpen && !isMobile) || isMobile ? "block" : "hidden"
            } mb-6 px-4`}
          >
            <h2 className="text-xs tracking-wider uppercase text-gray-400 font-semibold">
              Main Menu
            </h2>
          </div>
        </div>

        <nav className="mt-2 px-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-${
                  (isOpen && !isMobile) || isMobile ? "start" : "center"
                } px-4 py-3 rounded-lg mb-2 transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                </div>
                {((isOpen && !isMobile) || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
                {((isOpen && !isMobile) || isMobile) && item.badge && (
                  <span
                    className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full
    bg-primary-100 text-primary-800"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-2">
          <div
            className={`px-2 py-2 rounded-lg hover:bg-gray-100 ${
              isOpen ? "block" : "hidden"
            } md:hidden`}
          >
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </h3>
            <div className="mt-2 flex items-center text-sm">
              <div className="flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-green-400 inline-block"></span>
              </div>
              <span className="ml-1.5 text-gray-700">Online</span>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg`}
            title="Logout"
          >
            <div className="flex-shrink-0 text-gray-500">
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            {((isOpen && !isMobile) || isMobile) && (
              <span className="ml-3 text-sm">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

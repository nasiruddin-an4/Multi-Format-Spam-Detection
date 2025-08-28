import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminHeader = () => {
  const { user, logout, updateProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isRetraining, setIsRetraining] = useState(false);
  const fileInputRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Update name state when user changes
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // Handle click outside for notifications and profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notifications dropdown when clicking outside
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      // Close profile dropdown when clicking outside
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      // Check if any changes were made
      const nameChanged = name !== user?.name;
      const photoChanged = fileInputRef.current.files.length > 0;

      if (!nameChanged && !photoChanged) {
        setError("No changes were made to save.");
        setUploading(false);
        return;
      }

      // Update user data (name) only if changed
      const userData = nameChanged ? { name } : null;

      // Get file if a new one was selected
      const photoFile = photoChanged ? fileInputRef.current.files[0] : null;

      const result = await updateProfile(userData, photoFile);

      if (result.success) {
        setProfileModalOpen(false);
        // Clear preview
        setPhotoPreview(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Update handleRetrainWithCSV to include the check
  const handleRetrainWithCSV = async () => {
    try {
      setIsRetraining(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/admin/retrain-with-csv`, // Remove /api since it's already in API_URL
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 300000, // 5 minute timeout for long operations
        }
      );

      if (response.data && response.data.message) {
        toast.success(response.data.message);
        if (response.data.dataset_size) {
          toast.info(`Dataset size: ${response.data.dataset_size} messages`);
        }
      }
    } catch (error) {
      console.error("Retraining error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.data?.error) {
        toast.error(`Retraining failed: ${error.response.data.error}`);
      } else if (error.code === "ECONNABORTED") {
        toast.error("Retraining timed out. Please try again.");
      } else {
        toast.error(
          "Failed to retrain model. Please check if CSV files exist."
        );
      }
    } finally {
      setIsRetraining(false);
    }
  };

  const checkCSVFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/admin/check-csv-files`, // Remove /api since it's already in API_URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking CSV files:", error);
      return null;
    }
  };

  return (
    <header className="bg-white shadow-md z-20 sticky top-0">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              <span className="text-primary-600">Admin</span> Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Retrain Button */}
            {/* <button
              onClick={handleRetrainWithCSV}
              disabled={isRetraining}
              className={`px-4 py-2 rounded-md text-white ${
                isRetraining
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              } flex items-center space-x-2`}
            >
              {isRetraining ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Retraining...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Retrain Data</span>
                </>
              )}
            </button> */}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="p-1 rounded-full text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform -translate-y-1/2 translate-x-1/2"></span>
              </button>

              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div
                    className="py-2 divide-y divide-gray-100"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="px-4 py-2">
                      <p className="text-sm text-gray-700">
                        No new notifications
                      </p>
                    </div>
                    <div className="px-4 py-2">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-md">
                    <span className="font-medium">
                      {user?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || "Admin"}
                </span>
                <svg
                  className="ml-1 h-5 w-5 text-gray-400 hidden md:block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm text-gray-700">
                        {user?.email || "admin@example.com"}
                      </p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setDropdownOpen(false);
                        setName(user?.name || "");
                        setPhotoPreview(null);
                        setError("");
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Your Profile
                    </button>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
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
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Profile
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-3">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl shadow-md">
                      <span className="font-medium">
                        {user?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                  )}

                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-1 rounded-full shadow-md cursor-pointer hover:bg-primary-700"
                  >
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="profile-photo"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Click the camera icon to upload a new photo
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;

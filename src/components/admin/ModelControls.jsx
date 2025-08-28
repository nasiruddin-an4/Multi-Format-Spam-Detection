import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ModelControls = () => {
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrainWithCSV = async () => {
    try {
      setIsRetraining(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/retrain-with-csv`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Model retrained successfully with CSV data!");
      }
    } catch (error) {
      console.error("Retraining error:", error);
      toast.error("Failed to retrain model");
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Model Management</h2>
      <div className="space-y-4">
        <button
          onClick={handleRetrainWithCSV}
          disabled={isRetraining}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg
            ${
              isRetraining
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            } text-white font-medium transition-colors duration-200`}
        >
          {isRetraining ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              Retraining...
            </>
          ) : (
            "Retrain with CSV Data"
          )}
        </button>
      </div>
    </div>
  );
};

export default ModelControls;

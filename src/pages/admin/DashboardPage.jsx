import Dashboard from "./Dashboard";
import ModelControls from "../../components/admin/ModelControls";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Model Controls */}
        <div className="lg:col-span-1">
          <ModelControls />
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

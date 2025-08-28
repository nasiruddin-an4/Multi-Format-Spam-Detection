import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DetectionPage from "./pages/DetectionPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/UserManagement";
import AdminMessages from "./pages/admin/MessageLogs";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UserManagement from "./pages/admin/UserManagement";
import Business from "./pages/Business";
import Partners from "./pages/Partners";
import DetectPage from "./pages/DetectPage";

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        {/* Admin routes - outside MainLayout to avoid showing Navbar and Footer */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>

        {/* Main layout with Navbar and Footer */}
        <Route element={<MainLayout />}>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DetectionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/business" element={<Business />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/detect" element={<DetectPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

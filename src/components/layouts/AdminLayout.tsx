
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Layout, 
  Users, 
  Ambulance, 
  LogOut, 
  Home, 
  Database
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center">
            <Ambulance className="h-8 w-8 text-medical" />
            <h2 className="ml-2 text-xl font-bold text-gray-900">SwiftAid</h2>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-500">Admin Panel</p>
          </div>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100"
          >
            <Home className="mr-3 h-5 w-5 text-gray-500" />
            Dashboard
          </Link>
          <Link
            to="/admin/drivers"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100"
          >
            <Users className="mr-3 h-5 w-5 text-gray-500" />
            Manage Drivers
          </Link>
          <Link
            to="/admin/requests"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100"
          >
            <Ambulance className="mr-3 h-5 w-5 text-gray-500" />
            Emergency Requests
          </Link>
          <Link
            to="/admin/migrate-data"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100"
          >
            <Database className="mr-3 h-5 w-5 text-gray-500" />
            Migrate Data
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="py-6 px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ambulance, Users, Calendar, BarChart3, Settings, LogOut, Database } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block border-r bg-gray-50/40 dark:bg-gray-800/40 w-[250px] h-screen">
        <div className="flex flex-col h-full">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Ambulance className="h-6 w-6 text-medical" />
              <span>SwiftAid Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/admin/requests"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <Ambulance className="h-5 w-5" />
                <span>Requests</span>
              </Link>
              <Link
                to="/admin/drivers"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <Users className="h-5 w-5" />
                <span>Drivers</span>
              </Link>
              <Link
                to="/admin/migrate"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <Database className="h-5 w-5" />
                <span>Migrate Data</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2 rounded-md px-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-xs">
                <div className="font-medium">{user?.name}</div>
                <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-2 w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

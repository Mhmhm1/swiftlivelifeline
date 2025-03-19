
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Ambulance, User, Users, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Redirect based on authentication status and role
  useEffect(() => {
    if (!isAuthenticated) {
      if (
        !location.pathname.includes("/login") &&
        !location.pathname.includes("/register") &&
        !location.pathname.includes("/")
      ) {
        navigate("/login");
      }
      return;
    }

    // Redirect to appropriate dashboard
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "driver") {
        navigate("/driver/dashboard");
      } else if (user?.role === "user") {
        navigate("/user/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  // Handle menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Return different layouts based on authentication status
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm py-4 px-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Ambulance className="h-6 w-6 text-medical" />
            <span className="font-semibold text-xl tracking-tight text-medical-dark">
              SwiftAid Lifeline
            </span>
          </Link>

          {/* Desktop navigation */}
          {isAuthenticated && !isMobile && (
            <nav className="hidden md:flex space-x-4">
              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/admin/dashboard")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/admin/requests")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Requests
                  </Link>
                  <Link
                    to="/admin/drivers"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/admin/drivers")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Drivers
                  </Link>
                </>
              )}

              {user?.role === "driver" && (
                <>
                  <Link
                    to="/driver/dashboard"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/driver/dashboard")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/driver/profile"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/driver/profile")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Profile
                  </Link>
                </>
              )}

              {user?.role === "user" && (
                <>
                  <Link
                    to="/user/dashboard"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/user/dashboard")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/user/request"
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname.includes("/user/request")
                        ? "bg-medical text-white"
                        : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                    )}
                  >
                    Request Ambulance
                  </Link>
                </>
              )}
            </nav>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </div>
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="md:hidden"
                >
                  {menuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {!location.pathname.includes("/login") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
              {!location.pathname.includes("/register") && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="bg-medical hover:bg-medical-dark"
                >
                  Register
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && menuOpen && isAuthenticated && (
        <div className="bg-white shadow-md py-2 px-4 md:hidden animate-fade-in">
          <nav className="flex flex-col space-y-2">
            {user?.role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/admin/dashboard")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/requests"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/admin/requests")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Requests
                </Link>
                <Link
                  to="/admin/drivers"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/admin/drivers")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Drivers
                </Link>
              </>
            )}

            {user?.role === "driver" && (
              <>
                <Link
                  to="/driver/dashboard"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/driver/dashboard")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/driver/profile"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/driver/profile")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            {user?.role === "user" && (
              <>
                <Link
                  to="/user/dashboard"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/user/dashboard")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/request"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.includes("/user/request")
                      ? "bg-medical text-white"
                      : "text-gray-600 hover:bg-medical/10 hover:text-medical-dark"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  Request Ambulance
                </Link>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center justify-center mt-2"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span>Logout</span>
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1 container mx-auto p-4 md:p-6">{children}</main>

      <footer className="bg-white border-t py-4 px-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SwiftAid Lifeline. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

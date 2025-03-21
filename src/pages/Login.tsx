
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ambulance, Mail, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Direct redirection after login
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User authenticated, redirecting based on role:", user.role);
      toast({
        title: "Success",
        description: "Login successful!",
        variant: "default",
      });
      
      // Force a small delay to ensure toast is visible
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "driver") {
          navigate("/driver/dashboard");
        } else if (user.role === "user") {
          navigate("/user/dashboard");
        }
      }, 500);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    console.log("Attempting login with:", email);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        toast({
          title: "Error",
          description: "Invalid login credentials. Please check your email and password.",
          variant: "destructive",
        });
        setLoading(false);
      }
      // If successful, loading state will be reset by the redirect in useEffect
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Login failed. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
        <div className="text-center">
          <div className="flex justify-center">
            <Ambulance className="h-12 w-12 text-medical" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            SwiftAid Lifeline
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-medical hover:bg-medical-dark"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-medical-dark hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500 text-center">
              <p>Admin: admin@swiftaid.com / admin123</p>
              <p>Driver: wambui.kamau@swiftaid.com / driver001</p>
              <p>Driver: jabari.ochieng@swiftaid.com / driver002</p>
              <p className="mt-1">
                <Link to="/" className="text-medical hover:underline">
                  Return to home page
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

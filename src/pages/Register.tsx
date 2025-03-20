
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ambulance, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Phone number validation (Kenya format)
    const phoneRegex = /^\+254\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Phone number should be in format: +254XXXXXXXXX");
      setLoading(false);
      return;
    }

    try {
      // Always register new users as regular users
      const validRole = "user";
      
      const success = await register(
        {
          name: formData.name,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          role: validRole,
        },
        formData.password
      );

      if (success) {
        toast.success("Registration successful! Redirecting to login page...");
        // Use a timeout to show the success message before redirecting
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
        <div className="text-center">
          <div className="flex justify-center">
            <Ambulance className="h-12 w-12 text-medical" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            User Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your SwiftAid account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="pl-10"
                  placeholder="+254XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: +254XXXXXXXXX (Kenya)
              </p>
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-dark hover:underline">
                Sign in
              </Link>
            </p>
            <p className="mt-1">
              <Link to="/" className="text-medical hover:underline">
                Return to home page
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

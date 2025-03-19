
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Car, MapPin, Phone, Save, ArrowLeft } from "lucide-react";

const DriverProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateDriverProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    vehicleNumber: user?.vehicleNumber || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  
  if (!user) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Phone number validation (Kenya format)
    const phoneRegex = /^\+254\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number should be in format: +254XXXXXXXXX");
      return;
    }
    
    updateDriverProfile(user.id, {
      vehicleNumber: formData.vehicleNumber,
      phone: formData.phone,
      location: formData.location,
    });
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Driver Profile</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/driver/dashboard")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="mx-auto md:mx-0">
                  <ProfileImageUpload 
                    userId={user.id} 
                    currentImage={user.profileImage}
                  />
                </div>
                
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={user.name} disabled />
                    <p className="text-xs text-gray-500">Your name cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} disabled />
                    <p className="text-xs text-gray-500">Your email cannot be changed</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber" className="flex items-center">
                    <Car className="mr-2 h-4 w-4" />
                    Vehicle Number
                  </Label>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g., KXA 123B"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254XXXXXXXXX"
                  />
                  <p className="text-xs text-gray-500">
                    Format: +254XXXXXXXXX (Kenya)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Default Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Your usual station/location"
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DriverProfile;

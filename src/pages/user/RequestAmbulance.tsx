
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { toast } from "sonner";
import { Ambulance, AlertTriangle } from "lucide-react";

const EMERGENCY_TYPES = [
  "Medical Emergency",
  "Traffic Accident",
  "Cardiac Arrest",
  "Breathing Difficulty",
  "Severe Bleeding",
  "Fall/Injury",
  "Stroke",
  "Childbirth",
  "Burns",
  "Poisoning",
  "Other",
];

const RequestAmbulance: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useRequest();
  
  const [formData, setFormData] = useState({
    patientName: user?.name || "",
    patientAge: "",
    location: "",
    emergencyType: "",
    additionalInfo: "",
  });
  
  const [loading, setLoading] = useState(false);
  
  if (!user) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patientName || !formData.patientAge || !formData.location || !formData.emergencyType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the request
      const requestId = createRequest({
        userId: user.id,
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        location: formData.location,
        emergencyType: formData.emergencyType,
        additionalInfo: formData.additionalInfo,
      });
      
      // Navigate to the request details page
      navigate(`/user/request/${requestId}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Request Ambulance</h1>
          <p className="text-gray-600">Fill out the form below to request emergency assistance</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="mr-2 h-5 w-5 text-emergency" />
              Emergency Request Form
            </CardTitle>
            <CardDescription>
              Please provide accurate information to help us respond quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Patient Age *</Label>
                    <Input
                      id="patientAge"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Current Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Detailed address or location description"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Please provide a detailed address or description of your location
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyType">Nature of Emergency *</Label>
                  <Select
                    value={formData.emergencyType}
                    onValueChange={(value) => handleSelectChange("emergencyType", value)}
                  >
                    <SelectTrigger id="emergencyType">
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMERGENCY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Provide any additional details that might help the response team"
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/user/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emergency hover:bg-emergency-dark"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Emergency Request"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex justify-center py-4">
            <div className="flex items-center text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              In case of life-threatening emergencies, please also call 999 or your local emergency number.
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestAmbulance;

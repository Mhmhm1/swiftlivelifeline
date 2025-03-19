
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Clock, CheckCircle2, MapPin, Car, Calendar, UserCog } from "lucide-react";

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateDriverAvailability, updateDriverSchedule, updateDriverLocation } = useAuth();
  const { getDriverRequests } = useRequest();
  
  const [location, setLocation] = useState<string>(user?.location || "");
  
  if (!user) return null;
  
  const driverRequests = getDriverRequests(user.id);
  const activeRequests = driverRequests.filter(req => req.status === "assigned" || req.status === "in-progress");
  const completedRequests = driverRequests.filter(req => req.status === "completed");
  
  const handleAvailabilityChange = (checked: boolean) => {
    updateDriverAvailability(user.id, checked);
  };
  
  const handleScheduleChange = (checked: boolean) => {
    updateDriverSchedule(user.id, checked);
  };
  
  const handleLocationChange = () => {
    if (location.trim()) {
      updateDriverLocation(user.id, location);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Driver Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button 
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => navigate("/driver/profile")}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Manage Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="availability">Available for new requests</Label>
                </div>
                <Switch
                  id="availability"
                  checked={user.available}
                  onCheckedChange={handleAvailabilityChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule">On scheduled job</Label>
                </div>
                <Switch
                  id="schedule"
                  checked={user.onSchedule || false}
                  onCheckedChange={handleScheduleChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Location</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Update your current location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button onClick={handleLocationChange} size="sm">Update</Button>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              Current: {user.location || "Not set"}
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Active Assignments
          </h2>
          
          {activeRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeRequests.map(request => (
                <RequestCard key={request.id} request={request} role="driver" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No active assignments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any active assignments at the moment. Stay on standby for new requests.
                  </p>
                  <div className="mt-6">
                    <div className="flex justify-center items-center space-x-2">
                      <p className="text-sm">Make yourself available:</p>
                      <Switch
                        checked={user.available}
                        onCheckedChange={handleAvailabilityChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            Completed Assignments
          </h2>
          
          {completedRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedRequests.slice(0, 4).map(request => (
                <RequestCard key={request.id} request={request} role="driver" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    You haven't completed any assignments yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {completedRequests.length > 4 && (
            <div className="text-center">
              <Button variant="link" onClick={() => navigate("/driver/history")}>
                View All History
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;

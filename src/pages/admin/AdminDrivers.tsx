
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Check, Search, Users, UserX, UserCheck, Star, Car, Phone, MapPin } from "lucide-react";

const AdminDrivers: React.FC = () => {
  const navigate = useNavigate();
  const { getDrivers } = useAuth();
  const { requests } = useRequest();
  const [searchQuery, setSearchQuery] = useState("");
  
  const allDrivers = getDrivers();
  
  // Filter drivers based on search query
  const filteredDrivers = allDrivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (driver.vehicleNumber && driver.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (driver.location && driver.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Categorize filtered drivers by availability
  const availableDrivers = filteredDrivers.filter(driver => driver.available && !driver.onSchedule);
  const busyDrivers = filteredDrivers.filter(driver => !driver.available || driver.onSchedule);
  
  // Calculate driver statistics
  const getDriverStats = (driverId: string) => {
    const driverRequests = requests.filter(req => req.driverId === driverId);
    const completedRequests = driverRequests.filter(req => req.status === "completed");
    const ratedRequests = completedRequests.filter(req => req.rating !== undefined);
    
    const averageRating = ratedRequests.length > 0
      ? ratedRequests.reduce((sum, req) => sum + (req.rating || 0), 0) / ratedRequests.length
      : 0;
    
    return {
      totalJobs: driverRequests.length,
      completedJobs: completedRequests.length,
      averageRating: averageRating
    };
  };
  
  // Driver card component
  const DriverCard = ({ driver }: { driver: any }) => {
    const stats = getDriverStats(driver.id);
    
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3 flex items-center justify-center">
                  {driver.profileImage ? (
                    <img 
                      src={driver.profileImage} 
                      alt={driver.name} 
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <span className="font-medium text-gray-600">{driver.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{driver.name}</h3>
                  <p className="text-sm text-gray-500">{driver.email}</p>
                </div>
              </div>
              <Badge 
                variant={driver.available && !driver.onSchedule ? "default" : "secondary"}
                className={driver.available && !driver.onSchedule ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
              >
                {driver.available && !driver.onSchedule ? "Available" : "Unavailable"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {driver.vehicleNumber && (
                <div className="flex items-center text-sm text-gray-700">
                  <Car className="h-4 w-4 mr-1 text-gray-500" />
                  {driver.vehicleNumber}
                </div>
              )}
              
              {driver.phone && (
                <div className="flex items-center text-sm text-gray-700">
                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                  {driver.phone}
                </div>
              )}
              
              {driver.location && (
                <div className="flex items-center text-sm text-gray-700 col-span-2">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {driver.location}
                </div>
              )}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Jobs</p>
                  <p className="text-lg font-semibold">{stats.totalJobs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-lg font-semibold">{stats.completedJobs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <div className="flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <p className="text-lg font-semibold">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Drivers</h1>
            <p className="text-muted-foreground">
              View and manage all system drivers
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4 md:mt-0"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search drivers by name, vehicle number, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="all" className="flex items-center">
              <Users className="mr-1 h-4 w-4" /> All
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center">
              <UserCheck className="mr-1 h-4 w-4" /> Available
            </TabsTrigger>
            <TabsTrigger value="busy" className="flex items-center">
              <UserX className="mr-1 h-4 w-4" /> Busy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredDrivers.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No drivers found</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No drivers match your search for "${searchQuery}"`
                    : "There are no drivers in the system yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDrivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available">
            {availableDrivers.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No available drivers</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No available drivers match your search for "${searchQuery}"`
                    : "There are no available drivers at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDrivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="busy">
            {busyDrivers.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <UserX className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No busy drivers</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No busy drivers match your search for "${searchQuery}"`
                    : "There are no busy drivers at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {busyDrivers.map(driver => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDrivers;

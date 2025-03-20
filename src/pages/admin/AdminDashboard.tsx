import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Ambulance, Users, AlertCircle, Activity, Clock, CheckCircle, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'];

const AdminDashboard: React.FC = () => {
  const { user, getDrivers } = useAuth();
  const { getAllRequests } = useRequest();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    availableDrivers: 0,
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    cancelledRequests: 0,
  });

  useEffect(() => {
    // Redirect if not admin
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      toast.error("You don't have permission to access the admin dashboard");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch drivers
        const driversData = await getDrivers();
        setDrivers(driversData || []);
        
        // Fetch requests
        const requestsData = getAllRequests();
        
        // Update stats
        setStats({
          totalDrivers: driversData?.length || 0,
          availableDrivers: driversData?.filter(d => d.available).length || 0,
          totalRequests: requestsData?.length || 0,
          completedRequests: requestsData?.filter(r => r.status === 'completed').length || 0,
          pendingRequests: requestsData?.filter(r => r.status === 'pending').length || 0,
          inProgressRequests: requestsData?.filter(r => r.status === 'in-progress').length || 0,
          cancelledRequests: requestsData?.filter(r => r.status === 'cancelled').length || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, getDrivers, getAllRequests]);

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pending', value: stats.pendingRequests, color: '#fbbf24' },
    { name: 'In Progress', value: stats.inProgressRequests, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedRequests, color: '#10b981' },
    { name: 'Cancelled', value: stats.cancelledRequests, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate("/admin/requests")}>
            View All Requests
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Drivers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDrivers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.availableDrivers} currently available
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <Ambulance className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <p className="text-xs text-muted-foreground">
                  All emergency requests
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalRequests > 0 
                    ? Math.round((stats.completedRequests / stats.totalRequests) * 100) 
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed requests
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Requests
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests + stats.inProgressRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingRequests} pending, {stats.inProgressRequests} in progress
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Request Status</CardTitle>
                <CardDescription>Distribution of emergency requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No request data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Available Drivers</CardTitle>
                <CardDescription>
                  Currently active drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.filter(d => d.available).slice(0, 5).map((driver) => (
                    <div key={driver.id} className="flex items-center">
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarFallback>{driver.name?.substring(0, 2).toUpperCase() || "DR"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{driver.name}</p>
                        <p className="text-xs text-gray-500 truncate">{driver.vehicleNumber}</p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{driver.location}</span>
                      </div>
                    </div>
                  ))}
                  
                  {drivers.filter(d => d.available).length === 0 && (
                    <div className="text-center text-gray-500 py-6">
                      No available drivers at the moment
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate("/admin/drivers")}
                  >
                    View All Drivers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Analytics</CardTitle>
              <CardDescription>
                Detailed emergency request statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="font-medium">Pending</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.pendingRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">Awaiting driver assignment</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium">In Progress</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.inProgressRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">Currently being handled</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium">Completed</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">{stats.completedRequests}</p>
                  <p className="text-xs text-gray-500 mt-1">Successfully resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Driver Status</CardTitle>
              <CardDescription>
                Overview of all registered drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drivers.slice(0, 5).map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{driver.name?.substring(0, 2).toUpperCase() || "DR"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">{driver.vehicleNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{driver.location}</span>
                      <Badge variant={driver.available ? "default" : "secondary"}>
                        {driver.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {drivers.length === 0 && (
                  <div className="text-center text-gray-500 py-6">
                    No drivers registered yet
                  </div>
                )}
                
                {drivers.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/admin/drivers")}
                  >
                    View All Drivers
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

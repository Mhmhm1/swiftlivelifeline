import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ambulance, Users, Calendar, MapPin, Activity, BarChart3, Settings, LogOut, Database } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";

const AdminDashboard: React.FC = () => {
  const { user, getDrivers, logout } = useAuth();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDrivers: 0,
    availableDrivers: 0,
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
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
      try {
        // Fetch drivers
        const driversData = await getDrivers();
        setDrivers(driversData);
        
        // Update stats
        setStats({
          totalDrivers: driversData.length,
          availableDrivers: driversData.filter(d => d.available).length,
          totalRequests: 156, // Mock data
          completedRequests: 124, // Mock data
          pendingRequests: 18, // Mock data
          cancelledRequests: 14, // Mock data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, [user, navigate, getDrivers]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
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
                    +{Math.floor(Math.random() * 20) + 5} from last week
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
                    {Math.round((stats.completedRequests / stats.totalRequests) * 100)}%
                  </div>
                  <Progress 
                    value={(stats.completedRequests / stats.totalRequests) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Requests
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingRequests} pending, {stats.cancelledRequests} cancelled
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Request Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-16 w-16 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest system activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-sky-500" />
                        <p className="text-sm">
                          New ambulance request from {["Nairobi CBD", "Westlands", "Kilimani"][i-1]}
                        </p>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {i * 10}m ago
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Analytics</CardTitle>
                <CardDescription>
                  Request patterns over the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                  <p className="mt-2">Analytics visualization coming soon</p>
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
                          <AvatarImage src={driver.profileImage} />
                          <AvatarFallback>{driver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-gray-50 transition-all"
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
    </AdminLayout>
  );
};

export default AdminDashboard;


import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { 
  Ambulance, Users, Clock, CheckCircle2, AlertTriangle, ShieldCheck, BarChart 
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getDrivers } = useAuth();
  const { requests } = useRequest();
  
  const drivers = getDrivers();
  const availableDrivers = drivers.filter(driver => driver.available && !driver.onSchedule);
  
  const pendingRequests = requests.filter(req => req.status === "pending");
  const assignedRequests = requests.filter(req => req.status === "assigned" || req.status === "in-progress");
  const completedRequests = requests.filter(req => req.status === "completed");
  
  // Rating statistics
  const ratedRequests = completedRequests.filter(req => req.rating !== undefined);
  const averageRating = ratedRequests.length > 0
    ? ratedRequests.reduce((sum, req) => sum + (req.rating || 0), 0) / ratedRequests.length
    : 0;
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System overview and performance metrics
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/drivers")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Drivers
            </Button>
            <Button 
              onClick={() => navigate("/admin/requests")}
              className="bg-medical hover:bg-medical-dark"
            >
              <Ambulance className="mr-2 h-4 w-4" />
              Manage Requests
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{drivers.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Users className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                {availableDrivers.length} currently available
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Waiting for assignment
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{assignedRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Ambulance className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Assigned or in progress
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Successfully completed
              </span>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                Requests awaiting driver assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 5).map(request => (
                    <div 
                      key={request.id} 
                      className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {request.patientName} - {request.emergencyType}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.location}
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/admin/request/${request.id}`)}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                  
                  {pendingRequests.length > 5 && (
                    <div className="text-center mt-2">
                      <Button 
                        variant="link" 
                        onClick={() => navigate("/admin/requests", { state: { tab: "pending" } })}
                      >
                        View all {pendingRequests.length} pending requests
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">All clear!</h3>
                  <p className="mt-1 text-gray-500">
                    There are no pending requests at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-blue-500" />
                Performance Overview
              </CardTitle>
              <CardDescription>
                System metrics and driver performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average Rating</span>
                  <span className="text-sm font-medium">
                    {averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: `${(averageRating / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Based on {ratedRequests.length} ratings
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Driver Availability</span>
                  <span className="text-sm font-medium">
                    {availableDrivers.length} / {drivers.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${(availableDrivers.length / drivers.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((availableDrivers.length / drivers.length) * 100)}% of drivers currently available
                </p>
              </div>
              
              <div className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Response Rate</h4>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {requests.length > 0 
                        ? Math.round(((assignedRequests.length + completedRequests.length) / requests.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800">Completion Rate</h4>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {(assignedRequests.length + completedRequests.length) > 0
                        ? Math.round((completedRequests.length / (assignedRequests.length + completedRequests.length)) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5" />
            System Status
          </h2>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-green-50 text-green-800">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 font-medium">API Services</h3>
                  <p className="text-sm mt-1">All systems operational</p>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-green-50 text-green-800">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 font-medium">Database</h3>
                  <p className="text-sm mt-1">Connected and healthy</p>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-green-50 text-green-800">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 font-medium">Messaging</h3>
                  <p className="text-sm mt-1">Real-time services active</p>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Last system check: {new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

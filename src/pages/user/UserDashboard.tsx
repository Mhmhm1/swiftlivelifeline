
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Ambulance, ClipboardList, Clock, Check } from "lucide-react";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserRequests } = useRequest();
  
  if (!user) return null;
  
  const userRequests = getUserRequests(user.id);
  const pendingRequests = userRequests.filter(req => req.status === "pending" || req.status === "assigned" || req.status === "in-progress");
  const completedRequests = userRequests.filter(req => req.status === "completed");
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-emergency hover:bg-emergency-dark"
            onClick={() => navigate("/user/request")}
          >
            <Ambulance className="mr-2 h-4 w-4" />
            Request Ambulance
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <ClipboardList className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                All time requests
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Pending or in progress
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedRequests.length}</div>
            </CardContent>
            <CardFooter className="pt-0">
              <Check className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Successfully completed
              </span>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Requests</h2>
          
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map(request => (
                <RequestCard key={request.id} request={request} role="user" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Ambulance className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No active requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any active ambulance requests.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => navigate("/user/request")}
                      className="bg-medical hover:bg-medical-dark"
                    >
                      Request Ambulance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {completedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Completed Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedRequests.slice(0, 4).map(request => (
                <RequestCard key={request.id} request={request} role="user" />
              ))}
            </div>
            {completedRequests.length > 4 && (
              <div className="text-center">
                <Button variant="link" onClick={() => navigate("/user/history")}>
                  View All History
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;

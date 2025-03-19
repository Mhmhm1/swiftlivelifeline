
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestCard from "@/components/RequestCard";
import { useRequest } from "@/context/RequestContext";
import { Search, Clock, Ambulance, CheckCircle2 } from "lucide-react";

const AdminRequests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requests } = useRequest();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get the tab from location state or default to "all"
  const initialTab = location.state?.tab || "all";
  
  // Filter requests based on search query
  const filteredRequests = requests.filter(
    (request) =>
      request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.emergencyType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Categorize filtered requests by status
  const pendingRequests = filteredRequests.filter(req => req.status === "pending");
  const activeRequests = filteredRequests.filter(req => req.status === "assigned" || req.status === "in-progress");
  const completedRequests = filteredRequests.filter(req => req.status === "completed");
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manage Requests</h1>
            <p className="text-muted-foreground">
              View and manage all ambulance requests
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
              placeholder="Search requests by name, location, or emergency type..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue={initialTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 sm:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="mr-1 h-4 w-4" /> Pending
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center">
              <Ambulance className="mr-1 h-4 w-4" /> Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle2 className="mr-1 h-4 w-4" /> Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No requests found</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No requests match your search for "${searchQuery}"`
                    : "There are no requests in the system yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.map(request => (
                  <RequestCard key={request.id} request={request} role="admin" />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No pending requests</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No pending requests match your search for "${searchQuery}"`
                    : "There are no pending requests at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map(request => (
                  <RequestCard key={request.id} request={request} role="admin" />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {activeRequests.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <Ambulance className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No active requests</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No active requests match your search for "${searchQuery}"`
                    : "There are no active requests at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRequests.map(request => (
                  <RequestCard key={request.id} request={request} role="admin" />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedRequests.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border">
                <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No completed requests</h3>
                <p className="mt-1 text-gray-500">
                  {searchQuery 
                    ? `No completed requests match your search for "${searchQuery}"`
                    : "There are no completed requests yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedRequests.map(request => (
                  <RequestCard key={request.id} request={request} role="admin" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminRequests;

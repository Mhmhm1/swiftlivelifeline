
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import ChatInterface from "@/components/ChatInterface";
import RatingForm from "@/components/RatingForm";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { toast } from "sonner";
import { AlertCircle, Ambulance, CheckCircle2, Clock, PhoneCall, MapPin, Info, MessageSquare } from "lucide-react";

const RequestDetails: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestById, completeJob, getUserById } = useRequest();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    // Refresh data every 10 seconds to check for changes
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!user || !requestId) {
    return <Layout>Invalid request</Layout>;
  }
  
  const request = getRequestById(requestId);
  
  if (!request) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Request not found. It might have been deleted or you don't have access to it.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate("/user/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const driverData = request.driverId ? getUserById(request.driverId) : null;
  
  const handleCompleteJob = () => {
    completeJob(requestId);
    toast.success("Job marked as completed");
  };
  
  // Format timestamp for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Request Details</h1>
            <p className="text-muted-foreground">
              Request #{requestId.split('-')[1]}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-2 sm:mt-0"
            onClick={() => navigate("/user/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="mr-2 h-5 w-5 text-emergency" />
              Emergency Request Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status display */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                {request.status === "pending" && (
                  <>
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-yellow-700">Pending - Waiting for assignment</span>
                  </>
                )}
                {request.status === "assigned" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium text-blue-700">Assigned - Driver on the way</span>
                  </>
                )}
                {request.status === "in-progress" && (
                  <>
                    <Ambulance className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-indigo-700">In Progress - Help is on the way</span>
                  </>
                )}
                {request.status === "completed" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-700">Completed - Service finished</span>
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mt-1">
                Requested on {formatDate(request.timestamp)}
              </div>
            </div>
            
            {/* Request details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                <div className="mt-1">
                  <p className="text-gray-900">{request.patientName} ({request.patientAge})</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Location
                </h3>
                <div className="mt-1">
                  <p className="text-gray-900">{request.location}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Emergency Type
                </h3>
                <div className="mt-1">
                  <p className="text-gray-900">{request.emergencyType}</p>
                </div>
              </div>
              
              {request.additionalInfo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 flex items-center">
                    <Info className="h-4 w-4 mr-1" /> Additional Information
                  </h3>
                  <div className="mt-1">
                    <p className="text-gray-900">{request.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Driver details if assigned */}
            {driverData && (request.status === "assigned" || request.status === "in-progress" || request.status === "completed") && (
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-900">Assigned Driver</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-blue-800">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      {driverData.profileImage ? (
                        <img 
                          src={driverData.profileImage} 
                          alt={driverData.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-medium">{driverData.name.charAt(0)}</span>
                      )}
                    </div>
                    <span>{driverData.name}</span>
                  </div>
                  
                  <div className="flex items-center text-blue-800">
                    <Ambulance className="h-4 w-4 mr-2" />
                    <span>Vehicle: {driverData.vehicleNumber}</span>
                  </div>
                  
                  <div className="flex items-center text-blue-800">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    <span>{driverData.phone}</span>
                  </div>
                  
                  {driverData.location && (
                    <div className="flex items-center text-blue-800">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Location: {driverData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action buttons based on status */}
            {request.status === "in-progress" && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleCompleteJob}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Chat interface for assigned or in-progress requests */}
        {(request.status === "assigned" || request.status === "in-progress") && driverData && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Communication
            </h2>
            <ChatInterface requestId={requestId} />
          </div>
        )}
        
        {/* Rating form for completed requests */}
        {request.status === "completed" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Service Feedback
            </h2>
            <RatingForm requestId={requestId} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequestDetails;

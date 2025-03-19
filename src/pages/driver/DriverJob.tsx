
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import ChatInterface from "@/components/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { toast } from "sonner";
import { AlertCircle, Ambulance, CheckCircle2, Clock, Phone, MapPin, Info, MessageSquare, User } from "lucide-react";
import { UserData } from "@/context/AuthContext";

const DriverJob: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRequestById, startJob, completeJob, getUserById } = useRequest();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get the request and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!requestId || !user) return;
      
      try {
        const request = getRequestById(requestId);
        if (request && request.userId) {
          const userDataResult = await getUserById(request.userId);
          setUserData(userDataResult || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [requestId, user, getUserById]);
  
  if (!user || !requestId) {
    return <Layout>Invalid request</Layout>;
  }
  
  const request = getRequestById(requestId);
  
  if (!request || request.driverId !== user.id) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Job not found or not assigned to you. It might have been reassigned to another driver.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate("/driver/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleStartJob = () => {
    startJob(requestId);
    toast.success("Job started");
  };
  
  const handleCompleteJob = () => {
    completeJob(requestId);
    toast.success("Job completed");
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Job Details</h1>
            <p className="text-muted-foreground">
              Job #{requestId.split('-')[1]}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/driver/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ambulance className="mr-2 h-5 w-5 text-medical" />
              Emergency Response Job
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status display */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                {request.status === "assigned" && (
                  <>
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium text-blue-700">Assigned - Waiting for pick-up</span>
                  </>
                )}
                {request.status === "in-progress" && (
                  <>
                    <Ambulance className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium text-indigo-700">In Progress - On the way</span>
                  </>
                )}
                {request.status === "completed" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-700">Completed - Job finished</span>
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
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" /> Patient Information
                </h3>
                <div className="mt-1">
                  <p className="text-gray-900">{request.patientName} ({request.patientAge})</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> Pickup Location
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
            
            {/* Requester details */}
            {userData && (
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-900">Requester Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-blue-800">
                    <User className="h-4 w-4 mr-2" />
                    <span>{userData.name}</span>
                  </div>
                  
                  {userData.phone && (
                    <div className="flex items-center text-blue-800">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action buttons based on status */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              {request.status === "assigned" && (
                <Button 
                  onClick={handleStartJob}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Start Job
                </Button>
              )}
              
              {request.status === "in-progress" && (
                <Button 
                  onClick={handleCompleteJob}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Chat interface for assigned or in-progress jobs */}
        {(request.status === "assigned" || request.status === "in-progress") && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Communication with Requester
            </h2>
            <ChatInterface requestId={requestId} />
          </div>
        )}
        
        {/* Rating display for completed jobs */}
        {request.status === "completed" && request.rating && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                Service Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < request.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium">
                  {request.rating} out of 5
                </span>
              </div>
              
              {request.feedback && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                  <p className="mt-1 text-sm text-gray-600 italic">"{request.feedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DriverJob;

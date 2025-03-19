
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import DriverSelector from "@/components/DriverSelector";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { AlertCircle, Ambulance, CheckCircle2, Clock, User, MapPin, AlertTriangle, Info, Star } from "lucide-react";

const AdminRequestDetails: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user, getUserById } = useAuth();
  const { getRequestById } = useRequest();
  
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
              Request not found. It might have been deleted.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate("/admin/requests")}>
              Return to Requests
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get requester data
  const requesterData = getUserById(request.userId);
  
  // Get driver data if assigned
  const driverData = request.driverId ? getUserById(request.driverId) : null;
  
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
            onClick={() => navigate("/admin/requests")}
          >
            Back to Requests
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
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
                
                {/* Patient Information */}
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
                      <MapPin className="h-4 w-4 mr-1" /> Location
                    </h3>
                    <div className="mt-1">
                      <p className="text-gray-900">{request.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Emergency Type
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
                
                {/* Requester Information */}
                {requesterData && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Requester Information</h3>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p><span className="font-medium">Name:</span> {requesterData.name}</p>
                      <p><span className="font-medium">Email:</span> {requesterData.email}</p>
                      {requesterData.phone && (
                        <p><span className="font-medium">Phone:</span> {requesterData.phone}</p>
                      )}
                      {requesterData.gender && (
                        <p><span className="font-medium">Gender:</span> {requesterData.gender}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Driver Information (if assigned) */}
                {driverData && (request.status === "assigned" || request.status === "in-progress" || request.status === "completed") && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned Driver</h3>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center mb-2">
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
                        <span className="font-medium">{driverData.name}</span>
                      </div>
                      <p><span className="font-medium">Email:</span> {driverData.email}</p>
                      <p><span className="font-medium">Vehicle:</span> {driverData.vehicleNumber}</p>
                      <p><span className="font-medium">Phone:</span> {driverData.phone}</p>
                      {driverData.location && (
                        <p><span className="font-medium">Location:</span> {driverData.location}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Rating information (if completed) */}
                {request.status === "completed" && request.rating && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" /> Service Rating
                    </h3>
                    <div className="p-3 bg-yellow-50 rounded-md">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < request.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-medium">{request.rating} out of 5</span>
                      </div>
                      {request.feedback && (
                        <div>
                          <p className="font-medium">Feedback:</p>
                          <p className="italic text-gray-700">"{request.feedback}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            {/* Driver selector for pending requests */}
            {request.status === "pending" && (
              <DriverSelector requestId={requestId} />
            )}
            
            {/* Status card for non-pending requests */}
            {request.status !== "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    {request.status === "assigned" && (
                      <>
                        <CheckCircle2 className="mx-auto h-12 w-12 text-blue-500" />
                        <h3 className="mt-2 font-medium">Driver Assigned</h3>
                        <p className="text-sm text-gray-600">
                          This request has been assigned to a driver.
                        </p>
                      </>
                    )}
                    
                    {request.status === "in-progress" && (
                      <>
                        <Ambulance className="mx-auto h-12 w-12 text-indigo-500" />
                        <h3 className="mt-2 font-medium">In Progress</h3>
                        <p className="text-sm text-gray-600">
                          Driver is currently handling this emergency.
                        </p>
                      </>
                    )}
                    
                    {request.status === "completed" && (
                      <>
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-2 font-medium">Completed</h3>
                        <p className="text-sm text-gray-600">
                          This request has been completed successfully.
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRequestDetails;

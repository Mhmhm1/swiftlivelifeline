import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, PhoneCall, Truck, Clock, MessageSquare } from "lucide-react";
import RatingForm from "@/components/RatingForm";
import ChatInterface from "@/components/ChatInterface";
import { formatDistanceToNow } from "date-fns";
import { UserData } from "@/context/AuthContext";

const RequestDetails: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const { getRequestById, getUserById } = useRequest();
  const [request, setRequest] = useState<any>(null);
  const [driver, setDriver] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!requestId) return;

      const requestData = getRequestById(requestId);
      if (!requestData) {
        navigate("/user/dashboard");
        return;
      }

      setRequest(requestData);

      if (requestData.driverId) {
        try {
          const driverData = await getUserById(requestData.driverId);
          setDriver(driverData || null);
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [requestId, getUserById, getRequestById, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <div className="animate-pulse">Loading request details...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-800">Request not found</h2>
          <p className="mt-2 text-gray-600">The request you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => navigate("/user/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "assigned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Driver Assigned</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Request Details</h1>
        <Button variant="outline" onClick={() => navigate("/user/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Request #{request.id.split('-')[1]}</CardTitle>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Patient Information</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {request.patientName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Age:</span> {request.patientAge}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Emergency Type:</span> {request.emergencyType}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Additional Info:</span> {request.additionalInfo || "None provided"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Request Details</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Requested {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>

          {driver && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Assigned Driver</h3>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={driver.profileImage} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{driver.name}</p>
                  {driver.vehicleNumber && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Truck className="h-4 w-4 mr-1" />
                      <span>{driver.vehicleNumber}</span>
                    </div>
                  )}
                  {driver.phone && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <PhoneCall className="h-4 w-4 mr-1" />
                      <span>{driver.phone}</span>
                    </div>
                  )}
                  {driver.location && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{driver.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {request.status === "completed" && !request.rating && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Rate Your Experience</h3>
              <RatingForm requestId={request.id} />
            </div>
          )}

          {request.rating && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Your Rating</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < request.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{request.rating}/5</span>
                </div>
                {request.feedback && (
                  <p className="mt-2 text-sm text-gray-600">{request.feedback}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {(request.status === "assigned" || request.status === "in-progress") && (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              <CardTitle>Communication</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ChatInterface requestId={request.id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Phone, Calendar, User } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import { toast } from "sonner";
import { UserData } from "@/context/AuthContext";

const DriverJob: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const { getRequestById, startJob, completeJob, getUserById } = useRequest();
  const [request, setRequest] = useState<any>(null);
  const [requester, setRequester] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load request data and requester info
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!requestId) return;

      const requestData = getRequestById(requestId);
      if (!requestData) {
        toast.error("Request not found");
        navigate("/driver/dashboard");
        return;
      }

      setRequest(requestData);

      // Fetch requester user data
      if (requestData.userId) {
        try {
          const userData = await getUserById(requestData.userId);
          setRequester(userData || null);
        } catch (error) {
          console.error("Error fetching requester data:", error);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [requestId, navigate, getUserById, getRequestById]);

  const handleStartJob = () => {
    if (!requestId) return;
    startJob(requestId);
    toast.success("You've started this job");
  };

  const handleCompleteJob = () => {
    if (!requestId) return;
    completeJob(requestId);
    toast.success("Job marked as completed");
    navigate("/driver/dashboard");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="animate-pulse">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Request not found</h2>
          <p className="mt-2 text-gray-600">
            The emergency request you're looking for doesn't exist or has been
            removed.
          </p>
          <Button
            onClick={() => navigate("/driver/dashboard")}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Request</h1>
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/driver/dashboard")}
            className="mr-2"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {request.emergencyType} Emergency
            </h2>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === "assigned"
                    ? "bg-yellow-100 text-yellow-800"
                    : request.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : request.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {request.status === "assigned"
                  ? "Assigned"
                  : request.status === "in-progress"
                  ? "In Progress"
                  : request.status === "completed"
                  ? "Completed"
                  : "Unknown"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient</p>
                  <p className="text-base">{request.patientName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base">{request.patientAge} years</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-base">{request.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {requester && (
                <>
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Requester
                      </p>
                      <p className="text-base">{requester.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Contact
                      </p>
                      <p className="text-base">{requester.phone}</p>
                    </div>
                  </div>
                </>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Additional Information
                </p>
                <p className="text-base bg-gray-50 p-3 rounded-md">
                  {request.additionalInfo || "No additional information provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            {request.status === "assigned" && (
              <Button onClick={handleStartJob} className="w-full">
                Start Job
              </Button>
            )}

            {request.status === "in-progress" && (
              <Button onClick={handleCompleteJob} className="w-full">
                Complete Job
              </Button>
            )}

            {request.status === "completed" && (
              <div className="bg-green-50 p-4 rounded-md text-center">
                <p className="text-green-800">
                  This job has been marked as completed.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Communication</h2>
        </CardHeader>
        <CardContent>
          {user && requestId && (
            <ChatInterface
              requestId={requestId}
              currentUserId={user.id}
              disabled={request.status === "completed"}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverJob;

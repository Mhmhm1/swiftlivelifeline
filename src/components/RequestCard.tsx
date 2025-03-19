
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RequestData } from "@/context/RequestContext";
import { useAuth } from "@/context/AuthContext";
import { Clock, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: RequestData;
  role: "user" | "driver" | "admin";
}

const RequestCard: React.FC<RequestCardProps> = ({ request, role }) => {
  const navigate = useNavigate();
  const { getUserById } = useAuth();
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch driver data if assigned
  useEffect(() => {
    const fetchDriverData = async () => {
      if (request.driverId) {
        setLoading(true);
        try {
          const data = await getUserById(request.driverId);
          setDriverData(data);
        } catch (error) {
          console.error("Error fetching driver data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDriverData();
  }, [request.driverId, getUserById]);
  
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
  
  // Generate status badge
  const getStatusBadge = () => {
    switch(request.status) {
      case "pending":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </div>
        );
      case "assigned":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Assigned
          </div>
        );
      case "in-progress":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Completed
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render different card layouts based on user role
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md",
      request.status === "pending" && "border-l-4 border-l-yellow-500",
      request.status === "assigned" && "border-l-4 border-l-blue-500",
      request.status === "in-progress" && "border-l-4 border-l-indigo-500",
      request.status === "completed" && "border-l-4 border-l-green-500"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium text-gray-900">
            {request.patientName} ({request.patientAge})
          </div>
          <div className="text-sm text-gray-500 mb-1">
            {request.location}
          </div>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700">Emergency type:</div>
        <div className="text-sm text-gray-800">{request.emergencyType}</div>
      </div>
      
      {request.additionalInfo && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700">Additional info:</div>
          <div className="text-sm text-gray-800">{request.additionalInfo}</div>
        </div>
      )}
      
      {driverData && (request.status === "assigned" || request.status === "in-progress" || request.status === "completed") && (
        <div className="mb-3 p-2 bg-blue-50 rounded">
          <div className="text-sm font-medium text-gray-700">Assigned Driver:</div>
          <div className="text-sm text-gray-800">{driverData.name} - {driverData.vehicleNumber}</div>
          <div className="text-sm text-gray-600">{driverData.phone}</div>
        </div>
      )}
      
      {request.status === "completed" && request.rating && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700">Rating:</div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < request.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {request.feedback || "No feedback provided"}
            </span>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mb-3">
        Requested on {formatDate(request.timestamp)}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (role === "user") {
              navigate(`/user/request/${request.id}`);
            } else if (role === "driver") {
              navigate(`/driver/job/${request.id}`);
            } else if (role === "admin") {
              navigate(`/admin/request/${request.id}`);
            }
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;

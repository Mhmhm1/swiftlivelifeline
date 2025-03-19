
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { UserData, useAuth } from "./AuthContext";

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface RequestData {
  id: string;
  userId: string;
  patientName: string;
  patientAge: string;
  location: string;
  emergencyType: string;
  additionalInfo: string;
  status: "pending" | "assigned" | "in-progress" | "completed";
  driverId?: string;
  timestamp: Date;
  rating?: number;
  feedback?: string;
  chatHistory: ChatMessage[];
}

interface RequestContextType {
  requests: RequestData[];
  createRequest: (requestData: Omit<RequestData, "id" | "status" | "timestamp" | "chatHistory">) => string;
  assignDriver: (requestId: string, driverId: string) => void;
  startJob: (requestId: string) => void;
  completeJob: (requestId: string) => void;
  rateService: (requestId: string, rating: number, feedback: string) => void;
  getUserRequests: (userId: string) => RequestData[];
  getDriverRequests: (driverId: string) => RequestData[];
  getRequestById: (requestId: string) => RequestData | undefined;
  sendMessage: (requestId: string, senderId: string, text: string) => void;
  getUserById: (userId: string) => Promise<UserData | undefined>;
}

const RequestContext = createContext<RequestContextType>({
  requests: [],
  createRequest: () => "",
  assignDriver: () => {},
  startJob: () => {},
  completeJob: () => {},
  rateService: () => {},
  getUserRequests: () => [],
  getDriverRequests: () => [],
  getRequestById: () => undefined,
  sendMessage: () => {},
  getUserById: async () => undefined,
});

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const { getUserById } = useAuth();

  // Load existing requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem("requests");
    if (savedRequests) {
      // Parse the JSON, but convert string dates back to Date objects
      const parsedRequests = JSON.parse(savedRequests, (key, value) => {
        if (key === "timestamp") return new Date(value);
        if (key === "chatHistory") {
          if (Array.isArray(value)) {
            return value.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
          }
          return [];
        }
        return value;
      });
      setRequests(parsedRequests);
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  const createRequest = (requestData: Omit<RequestData, "id" | "status" | "timestamp" | "chatHistory">) => {
    const id = `request-${Date.now()}`;
    const newRequest: RequestData = {
      ...requestData,
      id,
      status: "pending",
      timestamp: new Date(),
      chatHistory: [],
    };

    setRequests(prev => [...prev, newRequest]);
    toast.success("Emergency request submitted successfully");
    return id;
  };

  const assignDriver = async (requestId: string, driverId: string) => {
    try {
      const driverData = await getUserById(driverId);
      if (!driverData) {
        toast.error("Driver not found");
        return;
      }

      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, driverId, status: "assigned" } 
            : req
        )
      );
      
      toast.success(`Request assigned to ${driverData.name}`);
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Failed to assign driver");
    }
  };

  const startJob = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "in-progress" } 
          : req
      )
    );
    
    toast.info("Job started");
  };

  const completeJob = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "completed" } 
          : req
      )
    );
    
    toast.success("Job completed");
  };

  const rateService = (requestId: string, rating: number, feedback: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, rating, feedback } 
          : req
      )
    );
    
    toast.success("Thank you for your feedback");
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(req => req.userId === userId);
  };

  const getDriverRequests = (driverId: string) => {
    return requests.filter(req => req.driverId === driverId);
  };

  const getRequestById = (requestId: string) => {
    return requests.find(req => req.id === requestId);
  };

  const sendMessage = (requestId: string, senderId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      text,
      timestamp: new Date(),
    };

    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              chatHistory: [...req.chatHistory, newMessage]
            } 
          : req
      )
    );
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        createRequest,
        assignDriver,
        startJob,
        completeJob,
        rateService,
        getUserRequests,
        getDriverRequests,
        getRequestById,
        sendMessage,
        getUserById,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => useContext(RequestContext);

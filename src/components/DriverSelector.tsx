
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface DriverSelectorProps {
  requestId: string;
}

const DriverSelector: React.FC<DriverSelectorProps> = ({ requestId }) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const { getAvailableDrivers } = useAuth();
  const { assignDriver, getRequestById } = useRequest();
  
  const request = getRequestById(requestId);
  const availableDrivers = getAvailableDrivers();
  
  const handleAssignDriver = () => {
    if (!selectedDriverId) {
      toast.error("Please select a driver");
      return;
    }
    
    assignDriver(requestId, selectedDriverId);
    setSelectedDriverId("");
  };
  
  if (!request) {
    return <div>Request not found</div>;
  }
  
  if (request.status !== "pending") {
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          This request has already been assigned to a driver.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-medium">Assign a Driver</h3>
      
      <div className="space-y-2">
        <Label htmlFor="driver-select">Select Available Driver</Label>
        <Select
          value={selectedDriverId}
          onValueChange={setSelectedDriverId}
        >
          <SelectTrigger id="driver-select" className="w-full">
            <SelectValue placeholder="Select a driver" />
          </SelectTrigger>
          <SelectContent>
            {availableDrivers.length > 0 ? (
              availableDrivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} - {driver.vehicleNumber} ({driver.location})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No available drivers
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleAssignDriver}
        disabled={!selectedDriverId || availableDrivers.length === 0}
        className="w-full"
      >
        Assign Driver
      </Button>
    </div>
  );
};

export default DriverSelector;

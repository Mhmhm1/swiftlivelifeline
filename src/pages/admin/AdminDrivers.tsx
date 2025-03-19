
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Check, X, UserPlus } from "lucide-react";

const AdminDrivers = () => {
  const { getDrivers } = useAuth();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [getDrivers]);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          driver.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "available") return matchesSearch && driver.available;
    if (activeTab === "unavailable") return matchesSearch && !driver.available;
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="container p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
            <p className="text-muted-foreground">Manage and view all drivers in the system</p>
          </div>
          <Button className="mt-2 sm:mt-0" onClick={() => console.log("Add driver")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Driver
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Driver Directory</CardTitle>
            <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
              </div>
            ) : filteredDrivers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDrivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={driver.profileImage} />
                          <AvatarFallback>{driver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{driver.name}</h3>
                          <p className="text-sm text-muted-foreground">{driver.email}</p>
                        </div>
                      </div>
                      <Badge variant={driver.available ? "outline" : "secondary"}>
                        {driver.available ? 
                          <><Check className="mr-1 h-3 w-3" /> Available</> : 
                          <><X className="mr-1 h-3 w-3" /> Unavailable</>
                        }
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Vehicle</Label>
                        <p>{driver.vehicleNumber || "Not assigned"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <p>{driver.phone || "Not provided"}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" /> Location
                        </Label>
                        <p>{driver.location || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No drivers found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDrivers;

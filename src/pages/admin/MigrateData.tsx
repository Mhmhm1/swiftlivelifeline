
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MigrateData: React.FC = () => {
  const { migrateMockDataToSupabase, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any[] } | null>(null);
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== "admin") {
      navigate("/admin/dashboard");
      toast.error("Only administrators can access this page");
    }
  }, [user, navigate]);

  const handleMigration = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log("Starting migration process...");
      const migrationResult = await migrateMockDataToSupabase();
      
      console.log("Migration result:", migrationResult);
      
      setResult({
        success: migrationResult.success,
        message: migrationResult.message,
        details: migrationResult.results
      });
      
      if (migrationResult.success) {
        toast.success(migrationResult.message);
      } else {
        toast.error(migrationResult.message);
      }
    } catch (error) {
      console.error("Migration error:", error);
      setResult({ 
        success: false, 
        message: (error as Error).message || "An unexpected error occurred" 
      });
      toast.error("Migration failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Migrate Mock Data to Supabase</CardTitle>
          <CardDescription>
            This will migrate all predefined drivers and admin accounts to your Supabase database.
            Only use this once to populate your database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-4">
            <p className="text-sm text-gray-600 mb-4">
              This operation will:
            </p>
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
              <li>Create auth users for each predefined account</li>
              <li>Create profiles for each user</li>
              <li>Skip existing users to avoid duplicates</li>
            </ul>
          </div>
          
          {result && (
            <div className={`p-4 mt-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Migration Successful' : 'Migration Failed'}
                  </h3>
                  <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    <p>{result.message}</p>
                    
                    {result.details && result.details.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="font-medium mb-1">Details:</p>
                        <ul className="list-disc ml-5 space-y-1">
                          {result.details.map((item, idx) => (
                            <li key={idx} className={
                              item.status === "success" ? "text-green-600" : 
                              item.status === "skipped" ? "text-blue-600" : 
                              "text-red-600"
                            }>
                              {item.email}: {item.message || item.status}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMigration} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Migrating...
              </>
            ) : (
              'Start Migration'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MigrateData;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequestProvider } from "@/context/RequestContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User pages
import UserDashboard from "./pages/user/UserDashboard";
import RequestAmbulance from "./pages/user/RequestAmbulance";
import RequestDetails from "./pages/user/RequestDetails";

// Driver pages
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverProfile from "./pages/driver/DriverProfile";
import DriverJob from "./pages/driver/DriverJob";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminRequestDetails from "./pages/admin/AdminRequestDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RequestProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/request" element={<RequestAmbulance />} />
              <Route path="/user/request/:requestId" element={<RequestDetails />} />
              
              {/* Driver Routes */}
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/driver/profile" element={<DriverProfile />} />
              <Route path="/driver/job/:requestId" element={<DriverJob />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/requests" element={<AdminRequests />} />
              <Route path="/admin/drivers" element={<AdminDrivers />} />
              <Route path="/admin/request/:requestId" element={<AdminRequestDetails />} />
              
              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RequestProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

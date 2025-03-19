
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
          Welcome to SwiftAid Lifeline Dispatch
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Fast, reliable emergency medical services at your fingertips. Connect with ambulance 
          drivers in real-time and get the help you need when it matters most.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
        
        <div className="mt-12 text-gray-600">
          <p className="mb-2">Emergency services available 24/7 across Kenya</p>
          <p className="text-sm">For immediate assistance, please log in or register</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

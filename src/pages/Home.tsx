
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ambulance, Shield, Clock, UserCheck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ambulance className="h-6 w-6 text-medical" />
            <span className="font-semibold text-xl tracking-tight text-medical-dark">
              SwiftAid Lifeline
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-medical-dark">
              Login
            </Link>
            <Link to="/register">
              <Button className="bg-medical hover:bg-medical-dark">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Emergency Medical Response <span className="text-medical-dark">When You Need It Most</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              SwiftAid Lifeline provides rapid ambulance dispatch services to ensure you receive medical attention as quickly as possible.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-emergency hover:bg-emergency-dark w-full sm:w-auto">
                  Request Ambulance
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-medical to-blue-400 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1612531816501-c2452c564a8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Ambulance Service"
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SwiftAid Lifeline</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide efficient and reliable ambulance dispatch services with a focus on rapid response times and quality care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-medical" />}
              title="Rapid Response"
              description="Our team responds quickly to emergency calls, ensuring that help arrives as soon as possible."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-medical" />}
              title="Qualified Professionals"
              description="All our drivers are trained medical professionals equipped to handle emergencies."
            />
            <FeatureCard
              icon={<Headphones className="h-10 w-10 text-medical" />}
              title="24/7 Support"
              description="Our services are available around the clock to respond to emergencies at any time."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures you get the help you need without unnecessary delays.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <StepCard 
              number="01"
              title="Register an Account"
              description="Create your account with your personal details for faster emergency requests."
            />
            <StepCard 
              number="02"
              title="Request an Ambulance"
              description="Submit the emergency details through our simple form. Include patient information and location."
            />
            <StepCard 
              number="03"
              title="Driver Assignment"
              description="Our admin team quickly assigns the nearest available driver to your location."
            />
            <StepCard 
              number="04"
              title="Real-time Communication"
              description="Stay in touch with the driver through our built-in chat system for updates."
              isLast
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-medical to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join SwiftAid Lifeline today and ensure you have access to emergency medical services when you need them most.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-medical-dark hover:bg-gray-100 w-full sm:w-auto">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <Ambulance className="h-6 w-6 text-white" />
                <span className="font-semibold text-xl">
                  SwiftAid Lifeline
                </span>
              </div>
              <p className="mt-2 text-gray-400">
                Emergency medical services you can rely on.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
              <div>
                <h3 className="font-medium mb-2">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
                  <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">info@swiftaid.com</li>
                  <li className="text-gray-400">+254 700 123 456</li>
                  <li className="text-gray-400">Nairobi, Kenya</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SwiftAid Lifeline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, title, description, isLast = false }: { number: string, title: string, description: string, isLast?: boolean }) => {
  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-medical text-white font-bold">
            {number}
          </div>
          {!isLast && (
            <div className="absolute top-12 bottom-0 left-6 w-px bg-gray-300"></div>
          )}
        </div>
        <div className="ml-6 pb-12">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

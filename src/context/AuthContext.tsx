
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define user types
export type UserRole = "user" | "driver" | "admin";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  gender?: string;
  profileImage?: string;
  vehicleNumber?: string;
  available?: boolean;
  location?: string;
  onSchedule?: boolean;
}

// Create dummy admin account
const ADMIN_ACCOUNT = {
  id: "admin-001",
  name: "System Administrator",
  email: "admin@swiftaid.com",
  password: "admin123",
  role: "admin" as UserRole,
  phone: "+254700123456",
};

// Create 20 driver accounts with Kenyan names
const DRIVER_ACCOUNTS = [
  { id: "driver-001", name: "Wambui Kamau", email: "wambui.kamau@swiftaid.com", password: "driver001", vehicleNumber: "KBA 001X", phone: "+254711234001", location: "Nairobi CBD", available: true },
  { id: "driver-002", name: "Jabari Ochieng", email: "jabari.ochieng@swiftaid.com", password: "driver002", vehicleNumber: "KAZ 112Y", phone: "+254711234002", location: "Westlands", available: true },
  { id: "driver-003", name: "Zawadi Mutua", email: "zawadi.mutua@swiftaid.com", password: "driver003", vehicleNumber: "KCX 223H", phone: "+254711234003", location: "Kilimani", available: true },
  { id: "driver-004", name: "Mwangi Ngugi", email: "mwangi.ngugi@swiftaid.com", password: "driver004", vehicleNumber: "KDJ 334J", phone: "+254711234004", location: "Eastleigh", available: true },
  { id: "driver-005", name: "Amani Kariuki", email: "amani.kariuki@swiftaid.com", password: "driver005", vehicleNumber: "KBZ 445K", phone: "+254711234005", location: "Langata", available: true },
  { id: "driver-006", name: "Baraka Mwangi", email: "baraka.mwangi@swiftaid.com", password: "driver006", vehicleNumber: "KCA 556L", phone: "+254711234006", location: "Karen", available: false },
  { id: "driver-007", name: "Zuri Wanjiku", email: "zuri.wanjiku@swiftaid.com", password: "driver007", vehicleNumber: "KDF 667M", phone: "+254711234007", location: "Ngong Road", available: true },
  { id: "driver-008", name: "Imani Njoroge", email: "imani.njoroge@swiftaid.com", password: "driver008", vehicleNumber: "KBC 778N", phone: "+254711234008", location: "Gigiri", available: true },
  { id: "driver-009", name: "Jomo Kamau", email: "jomo.kamau@swiftaid.com", password: "driver009", vehicleNumber: "KAW 889P", phone: "+254711234009", location: "Upperhill", available: true },
  { id: "driver-010", name: "Maisha Kimani", email: "maisha.kimani@swiftaid.com", password: "driver010", vehicleNumber: "KCE 990Q", phone: "+254711234010", location: "Embakasi", available: false },
  { id: "driver-011", name: "Neema Otieno", email: "neema.otieno@swiftaid.com", password: "driver011", vehicleNumber: "KDK 001R", phone: "+254711234011", location: "Dagoretti", available: true },
  { id: "driver-012", name: "Dalila Wekesa", email: "dalila.wekesa@swiftaid.com", password: "driver012", vehicleNumber: "KBE 112S", phone: "+254711234012", location: "South B", available: true },
  { id: "driver-013", name: "Bakari Njenga", email: "bakari.njenga@swiftaid.com", password: "driver013", vehicleNumber: "KAJ 223T", phone: "+254711234013", location: "South C", available: true },
  { id: "driver-014", name: "Jelani Omondi", email: "jelani.omondi@swiftaid.com", password: "driver014", vehicleNumber: "KCH 334U", phone: "+254711234014", location: "Kasarani", available: false },
  { id: "driver-015", name: "Saida Mbugua", email: "saida.mbugua@swiftaid.com", password: "driver015", vehicleNumber: "KDN 445V", phone: "+254711234015", location: "Parklands", available: true },
  { id: "driver-016", name: "Hamisi Kiprop", email: "hamisi.kiprop@swiftaid.com", password: "driver016", vehicleNumber: "KBJ 556W", phone: "+254711234016", location: "Githurai", available: true },
  { id: "driver-017", name: "Faraji Makena", email: "faraji.makena@swiftaid.com", password: "driver017", vehicleNumber: "KAP 667X", phone: "+254711234017", location: "Roysambu", available: true },
  { id: "driver-018", name: "Kamau Wangari", email: "kamau.wangari@swiftaid.com", password: "driver018", vehicleNumber: "KCN 778Y", phone: "+254711234018", location: "Ruaka", available: false },
  { id: "driver-019", name: "Zuberi Achieng", email: "zuberi.achieng@swiftaid.com", password: "driver019", vehicleNumber: "KDT 889Z", phone: "+254711234019", location: "Pipeline", available: true },
  { id: "driver-020", name: "Taji Nyambura", email: "taji.nyambura@swiftaid.com", password: "driver020", vehicleNumber: "KBP 990A", phone: "+254711234020", location: "Umoja", available: true },
].map(driver => ({ ...driver, role: "driver" as UserRole }));

// Predefined accounts for login
const PREDEFINED_ACCOUNTS = [
  ADMIN_ACCOUNT,
  ...DRIVER_ACCOUNTS
];

// Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, password: string) => Promise<boolean>;
  updateDriverProfile: (driverId: string, data: Partial<UserData>) => void;
  updateDriverAvailability: (driverId: string, available: boolean) => void;
  updateDriverSchedule: (driverId: string, onSchedule: boolean) => void;
  updateDriverLocation: (driverId: string, location: string) => void;
  getDrivers: () => Promise<UserData[]>;
  getAvailableDrivers: () => Promise<UserData[]>;
  getUserById: (id: string) => Promise<UserData | undefined>;
  migrateMockDataToSupabase: () => Promise<{ success: boolean, message: string }>;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateDriverProfile: () => {},
  updateDriverAvailability: () => {},
  updateDriverSchedule: () => {},
  updateDriverLocation: () => {},
  getDrivers: async () => [],
  getAvailableDrivers: async () => [],
  getUserById: async () => undefined,
  migrateMockDataToSupabase: async () => ({ success: false, message: "Not implemented" }),
});

// Helper function to map Supabase profile to UserData
const mapProfileToUserData = (profile: any): UserData => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email || '',
    role: profile.role as UserRole,
    phone: profile.phone,
    gender: profile.status, // Using status field for gender temporarily
    profileImage: profile.photo_url,
    vehicleNumber: profile.license_number, // Using license_number for vehicle_number
    available: profile.status === 'available', // Using status field to derive available
    location: profile.current_location,
    onSchedule: profile.current_job !== null, // If there's a current job, they're on schedule
  };
};

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(mapProfileToUserData(profile));
          setIsAuthenticated(true);
        }
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(mapProfileToUserData(profile));
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try Supabase authentication first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fall back to local storage for backwards compatibility
        // Find the user in our "database"
        const foundUser = PREDEFINED_ACCOUNTS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
    
        if (foundUser) {
          try {
            // Try to sign up the user with Supabase
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: foundUser.name,
                  role: foundUser.role,
                  phone: foundUser.phone,
                },
              },
            });
            
            if (error) throw error;
            
            if (data.user) {
              // Update the profile with additional data
              const { error: updateError } = await supabase
                .from('profiles')
                .update({
                  license_number: foundUser.vehicleNumber,
                  status: foundUser.available ? 'available' : 'unavailable',
                  current_location: foundUser.location,
                  current_job: foundUser.onSchedule ? 'active' : null,
                })
                .eq('id', data.user.id);
              
              if (updateError) {
                console.error("Error updating profile:", updateError);
              }
              
              // Wait for the profile to be ready
              const checkProfileInterval = setInterval(async () => {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', data.user!.id)
                  .single();
                
                if (profile) {
                  clearInterval(checkProfileInterval);
                  
                  // Set the authenticated user
                  setUser(mapProfileToUserData(profile));
                  setIsAuthenticated(true);
                }
              }, 1000);
              
              setTimeout(() => {
                clearInterval(checkProfileInterval);
              }, 10000); // Timeout after 10 seconds
            }
            
            toast.success("Account created and logged in!");
            return true;
          } catch (signupError) {
            console.error("Error signing up:", signupError);
            toast.error("Error creating account in Supabase");
            return false;
          }
        } else {
          toast.error("Invalid email or password");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error during login");
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have been logged out");
  };

  // Register function (for new users only)
  const register = async (userData: any, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            status: userData.gender, // Using status for gender
            phone: userData.phone,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please check your email for verification.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error((error as Error).message || "Registration failed. Please try again.");
      return false;
    }
  };

  // Update driver profile
  const updateDriverProfile = async (driverId: string, data: Partial<UserData>) => {
    try {
      // Map from our interface to the database structure
      const profileData: any = {};
      
      if (data.name) profileData.name = data.name;
      if (data.phone) profileData.phone = data.phone;
      if (data.gender) profileData.status = data.gender; // Using status for gender
      if (data.profileImage) profileData.photo_url = data.profileImage;
      if (data.vehicleNumber) profileData.license_number = data.vehicleNumber; // Using license_number for vehicle
      if (data.available !== undefined) profileData.status = data.available ? 'available' : 'unavailable';
      if (data.location) profileData.current_location = data.location;
      if (data.onSchedule !== undefined) profileData.current_job = data.onSchedule ? 'active' : null;
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', driverId);
      
      if (error) throw error;
      
      // If the current user is the one being updated, update that too
      if (user && user.id === driverId) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Update driver availability
  const updateDriverAvailability = (driverId: string, available: boolean) => {
    updateDriverProfile(driverId, { available });
  };

  // Update driver schedule
  const updateDriverSchedule = (driverId: string, onSchedule: boolean) => {
    updateDriverProfile(driverId, { onSchedule });
  };

  // Update driver location
  const updateDriverLocation = (driverId: string, location: string) => {
    updateDriverProfile(driverId, { location });
  };

  // Get all drivers
  const getDrivers = async (): Promise<UserData[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver');
      
      if (error) throw error;
      
      return data.map(mapProfileToUserData);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      return [];
    }
  };

  // Get only available drivers
  const getAvailableDrivers = async (): Promise<UserData[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver')
        .eq('status', 'available')
        .is('current_job', null);
      
      if (error) throw error;
      
      return data.map(mapProfileToUserData);
    } catch (error) {
      console.error("Error fetching available drivers:", error);
      return [];
    }
  };

  // Get user by ID
  const getUserById = async (id: string): Promise<UserData | undefined> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return mapProfileToUserData(data);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  };

  // Migration function to transfer predefined accounts to Supabase
  const migrateMockDataToSupabase = async (): Promise<{ success: boolean, message: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('migrate-mock-data', {
        body: { mockData: PREDEFINED_ACCOUNTS }
      });
      
      if (error) {
        console.error("Migration error:", error);
        return { success: false, message: error.message };
      }
      
      return { 
        success: true, 
        message: `Successfully migrated ${data.migrated} users to Supabase` 
      };
    } catch (error) {
      console.error("Migration function error:", error);
      return { 
        success: false, 
        message: (error as Error).message || "Migration failed. Please try again." 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        register,
        updateDriverProfile,
        updateDriverAvailability,
        updateDriverSchedule,
        updateDriverLocation,
        getDrivers,
        getAvailableDrivers,
        getUserById,
        migrateMockDataToSupabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);

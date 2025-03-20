
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
const ADMIN_ACCOUNT: UserData & { password: string } = {
  id: "admin-001",
  name: "System Administrator",
  email: "admin@swiftaid.com",
  password: "admin123",
  role: "admin",
  phone: "+254700123456",
  vehicleNumber: "",
  available: false,
  location: "",
  onSchedule: false
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
  migrateMockDataToSupabase: () => Promise<{ success: boolean, message: string, results: any[] }>;
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
  migrateMockDataToSupabase: async () => ({ success: false, message: "Not implemented", results: [] }),
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
      console.log("Login attempt with:", email);
      
      // Check for admin account first - special handling
      if (email.toLowerCase() === ADMIN_ACCOUNT.email.toLowerCase() && password === ADMIN_ACCOUNT.password) {
        console.log("Admin account matched");
        
        // Set user directly from predefined account data
        setUser({
          id: ADMIN_ACCOUNT.id,
          name: ADMIN_ACCOUNT.name,
          email: ADMIN_ACCOUNT.email,
          role: ADMIN_ACCOUNT.role,
          phone: ADMIN_ACCOUNT.phone,
          // For admin, we don't need these other properties
        });
        setIsAuthenticated(true);
        toast.success("Admin logged in successfully");
        return true;
      }
      
      // Try direct Supabase authentication for non-admin users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (!error && data.user) {
        console.log("Supabase login successful");
        // Fetch the user profile immediately to ensure we have the role
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profile) {
            setUser(mapProfileToUserData(profile));
            setIsAuthenticated(true);
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
        }
        return true;
      }
      
      console.log("Supabase login failed, checking predefined accounts:", error?.message);
      
      // If Supabase auth fails, check predefined driver accounts
      const foundUser = DRIVER_ACCOUNTS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        console.error("No matching user found in predefined accounts");
        return false;
      }
      
      // User found in predefined accounts, try to create in Supabase
      console.log("Found predefined driver:", foundUser.email);
      
      // For driver accounts, attempt to register them in Supabase if they don't exist
      try {
        // First try to sign in directly in case the account already exists
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!signInError && signInData.user) {
          console.log("Existing driver login successful");
          // Set user data immediately
          setUser({
            id: signInData.user.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            phone: foundUser.phone,
            vehicleNumber: foundUser.vehicleNumber,
            available: foundUser.available,
            location: foundUser.location,
          });
          setIsAuthenticated(true);
          return true;
        }
        
        // If sign-in fails, try to register the account
        console.log("Driver login failed, attempting to create account");
        
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
        
        if (error) {
          console.error("Error signing up driver:", error);
          
          // If the error is that the user already exists, try to sign in directly again
          if (error.message.includes("already registered")) {
            console.log("User already exists, retrying login...");
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (retryError) {
              console.error("Failed to sign in existing user:", retryError);
              return false;
            }
            
            // Set user data immediately if retry succeeded
            if (retryData.user) {
              // Fetch the user profile
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', retryData.user.id)
                .single();
                
              if (profile) {
                setUser(mapProfileToUserData(profile));
                setIsAuthenticated(true);
              } else {
                // Fallback to driver data
                setUser({
                  id: retryData.user.id,
                  name: foundUser.name,
                  email: foundUser.email,
                  role: foundUser.role,
                  phone: foundUser.phone,
                  vehicleNumber: foundUser.vehicleNumber,
                  available: foundUser.available,
                  location: foundUser.location,
                });
                setIsAuthenticated(true);
              }
            }
            
            return true;
          }
          
          return false;
        }
        
        // For a new user, update their profile
        if (data.user) {
          const driverData = foundUser as any;
          
          // Set user data immediately
          setUser({
            id: data.user.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            phone: foundUser.phone,
            vehicleNumber: foundUser.vehicleNumber,
            available: foundUser.available,
            location: foundUser.location,
          });
          setIsAuthenticated(true);
          
          // Update the profile with driver-specific data
          const profileData: any = {
            license_number: driverData.vehicleNumber || null,
            status: driverData.available ? 'available' : 'unavailable',
            current_location: driverData.location || null,
            current_job: driverData.onSchedule ? 'active' : null,
          };
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', data.user.id);
          
          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
        }
        
        toast.success("Account created and logged in successfully!");
        return true;
      } catch (signupError) {
        console.error("Error during signup process:", signupError);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
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
      // Ensure we're using a valid role
      const validRole = "user"; // Always register new users as regular users
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            name: userData.name,
            role: validRole,
            status: userData.gender, // Using status for gender
            phone: userData.phone,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please verify your email to log in.");
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
  const migrateMockDataToSupabase = async (): Promise<{ success: boolean, message: string, results: any[] }> => {
    try {
      console.log("Starting migration of mock data");
      
      // First, try using the Supabase Edge Function
      try {
        console.log("Calling Supabase Edge Function for migration");
        const { data, error } = await supabase.functions.invoke("migrate-mock-data", {
          body: { mockData: PREDEFINED_ACCOUNTS }
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Edge function error: ${error.message}`);
        }
        
        console.log("Migration function response:", data);
        
        return { 
          success: true, 
          message: data.message || `Successfully migrated ${data.migrated} users`,
          results: data.results || []
        };
      } catch (functionError) {
        console.error("Failed to use edge function, falling back to manual migration:", functionError);
        
        // Fallback to manual migration
        let migratedCount = 0;
        const results = [];
        
        // Process accounts one by one
        for (const account of PREDEFINED_ACCOUNTS) {
          try {
            // Check if user already exists
            const { data: existingUsers } = await supabase
              .from('profiles')
              .select('id, email')
              .eq('email', account.email);
            
            if (existingUsers && existingUsers.length > 0) {
              console.log(`User ${account.email} already exists, skipping...`);
              results.push({ 
                email: account.email, 
                status: "skipped", 
                message: "User already exists" 
              });
              continue;
            }
            
            // Make sure the role is valid
            const validRole = ['user', 'driver', 'admin'].includes(account.role) ? account.role : 'user';
            
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email: account.email,
              password: (account as any).password,
              options: {
                data: {
                  name: account.name,
                  role: validRole,
                  phone: account.phone
                }
              }
            });
            
            if (authError) {
              console.error(`Failed to create auth user ${account.email}:`, authError);
              results.push({ 
                email: account.email, 
                status: "error", 
                message: authError.message 
              });
              continue;
            }
            
            const userId = authData.user?.id;
            if (!userId) {
              console.error(`Failed to get user ID for ${account.email}`);
              results.push({ 
                email: account.email, 
                status: "error", 
                message: "Failed to get user ID" 
              });
              continue;
            }
            
            // Create or update profile
            const profileData: any = {
              id: userId,
              name: account.name,
              email: account.email,
              role: validRole,
              phone: account.phone
            };
            
            // Add driver-specific fields
            if (account.role === 'driver') {
              const driverAccount = account as UserData;
              profileData.license_number = driverAccount.vehicleNumber;
              profileData.status = driverAccount.available ? 'available' : 'unavailable';
              profileData.current_location = driverAccount.location;
              profileData.current_job = null;
            }
            
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert(profileData);
            
            if (profileError) {
              console.error(`Failed to create profile for ${account.email}:`, profileError);
              results.push({ 
                email: account.email, 
                status: "partial", 
                message: `Auth user created but profile update failed: ${profileError.message}`,
                id: userId
              });
              continue;
            }
            
            migratedCount++;
            results.push({ 
              email: account.email, 
              status: "success",
              id: userId,
              message: `User ${account.email} with role ${validRole} created successfully`
            });
            console.log(`Successfully migrated ${account.email}`);
          } catch (accountError) {
            console.error(`Error processing account ${account.email}:`, accountError);
            results.push({ 
              email: account.email, 
              status: "error", 
              message: (accountError as Error).message 
            });
          }
        }
        
        return {
          success: migratedCount > 0,
          message: `Manually migrated ${migratedCount} users to Supabase`,
          results
        };
      }
    } catch (error) {
      console.error("Migration function error:", error);
      return { 
        success: false, 
        message: (error as Error).message || "Migration failed. Please try again.",
        results: []
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
        migrateMockDataToSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

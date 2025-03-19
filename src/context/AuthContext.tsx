
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

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
  getDrivers: () => UserData[];
  getAvailableDrivers: () => UserData[];
  getUserById: (id: string) => UserData | undefined;
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
  getDrivers: () => [],
  getAvailableDrivers: () => [],
  getUserById: () => undefined,
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<(UserData & { password: string })[]>([]);
  const [drivers, setDrivers] = useState<UserData[]>([]);

  // Initialize with predefined accounts
  useEffect(() => {
    // Load data from localStorage or use predefined accounts
    const savedUsers = localStorage.getItem("users");
    const savedDrivers = localStorage.getItem("drivers");
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(PREDEFINED_ACCOUNTS);
      localStorage.setItem("users", JSON.stringify(PREDEFINED_ACCOUNTS));
    }
    
    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers));
    } else {
      setDrivers(DRIVER_ACCOUNTS);
      localStorage.setItem("drivers", JSON.stringify(DRIVER_ACCOUNTS));
    }
    
    // Check for an existing session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Find the user in our "database"
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // Create a clean user object without the password
      const { password: _, ...cleanUserData } = foundUser;
      
      // Set the authenticated user
      setUser(cleanUserData);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(cleanUserData));
      
      toast.success("Login successful!");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    toast.info("You have been logged out");
  };

  // Register function (for new users only)
  const register = async (userData: any, password: string): Promise<boolean> => {
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      toast.error("Email already registered");
      return false;
    }

    // Create a new user with a unique ID
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: "user" as UserRole,
      password,
    };

    // Add to our "database"
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast.success("Registration successful! Please log in.");
    return true;
  };

  // Update driver profile
  const updateDriverProfile = (driverId: string, data: Partial<UserData>) => {
    // Update both users and drivers arrays
    const updatedUsers = users.map(user => 
      user.id === driverId ? { ...user, ...data } : user
    );
    
    const updatedDrivers = drivers.map(driver => 
      driver.id === driverId ? { ...driver, ...data } : driver
    );
    
    setUsers(updatedUsers);
    setDrivers(updatedDrivers);
    
    // If the current user is the one being updated, update that too
    if (user && user.id === driverId) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
    
    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    
    toast.success("Profile updated successfully");
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
  const getDrivers = () => {
    return drivers;
  };

  // Get only available drivers
  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.available === true && !driver.onSchedule);
  };

  // Get user by ID
  const getUserById = (id: string) => {
    return [...drivers, ...users.map(({ password: _, ...user }) => user)]
      .find(user => user.id === id);
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
        getUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);

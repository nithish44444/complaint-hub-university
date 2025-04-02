
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "investigator";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("udc_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // First check demo accounts
      if (email === "admin@university.edu" && password === "password") {
        const adminUser: User = {
          id: "admin-123",
          name: "Admin User",
          email: "admin@university.edu",
          role: "admin",
        };
        setUser(adminUser);
        localStorage.setItem("udc_user", JSON.stringify(adminUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${adminUser.name}!`,
        });
        return;
      } 
      
      if (email === "student@university.edu" && password === "password") {
        const studentUser: User = {
          id: "student-123",
          name: "Student User",
          email: "student@university.edu",
          role: "student",
        };
        setUser(studentUser);
        localStorage.setItem("udc_user", JSON.stringify(studentUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${studentUser.name}!`,
        });
        return;
      } 
      
      if (email === "investigator@university.edu" && password === "password") {
        const investigatorUser: User = {
          id: "investigator-123",
          name: "Investigator User",
          email: "investigator@university.edu",
          role: "investigator",
        };
        setUser(investigatorUser);
        localStorage.setItem("udc_user", JSON.stringify(investigatorUser));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${investigatorUser.name}!`,
        });
        return;
      }
      
      // Then check registered users
      const usersInStorage = localStorage.getItem("udc_registered_users");
      
      if (usersInStorage) {
        const registeredUsers = JSON.parse(usersInStorage);
        const foundUser = registeredUsers.find((u: any) => 
          u.email === email && u.password === password
        );
        
        if (foundUser) {
          const userToLogin: User = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role || "student",
          };
          
          setUser(userToLogin);
          localStorage.setItem("udc_user", JSON.stringify(userToLogin));
          
          toast({
            title: "Logged in successfully",
            description: `Welcome back, ${userToLogin.name}!`,
          });
          return;
        }
      }
      
      // If we get here, login failed
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user ID
      const userId = `user-${Date.now()}`;
      
      // For demo purposes, we'll create a student user
      const newUser: User = {
        id: userId,
        name,
        email,
        role: "student",
      };
      
      // Store user with password for demo authentication
      const userWithPassword = {
        ...newUser,
        password,
      };
      
      // Save to local storage for demo persistence
      const usersInStorage = localStorage.getItem("udc_registered_users");
      const existingUsers = usersInStorage ? JSON.parse(usersInStorage) : [];
      
      localStorage.setItem(
        "udc_registered_users", 
        JSON.stringify([...existingUsers, userWithPassword])
      );
      
      // Log in the user
      setUser(newUser);
      localStorage.setItem("udc_user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("udc_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

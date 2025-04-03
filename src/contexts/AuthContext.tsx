
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "investigator";
  age?: string;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (userData: User) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  addLoginNotification?: (userName: string, userEmail: string) => void;
};

// This will be set by the NotificationProvider after it's initialized
let addNotificationFunction: ((
  title: string,
  message: string,
  type: string,
  targetRole?: string
) => void) | undefined;

export const setAddNotificationFunction = (fn: typeof addNotificationFunction) => {
  addNotificationFunction = fn;
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

  const addLoginNotification = (userName: string, userEmail: string) => {
    if (addNotificationFunction) {
      addNotificationFunction(
        `${userName} Logged In`,
        `${userName} (${userEmail}) has logged into the system.`,
        "login",
        undefined
      );
    }
  };

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
        
        // Create login notification for admins and investigators
        if (addNotificationFunction) {
          addNotificationFunction(
            "Admin User Logged In",
            `Admin User (admin@university.edu) has logged into the system.`,
            "login",
            undefined
          );
        }
        
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
        
        // Create login notification for admins and investigators
        if (addNotificationFunction) {
          addNotificationFunction(
            "Student User Logged In",
            `Student User (student@university.edu) has logged into the system.`,
            "login",
            undefined
          );
        }
        
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
        
        // Create login notification for admins and investigators
        if (addNotificationFunction) {
          addNotificationFunction(
            "Investigator User Logged In",
            `Investigator User (investigator@university.edu) has logged into the system.`,
            "login",
            undefined
          );
        }
        
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
            age: foundUser.age,
            department: foundUser.department,
          };
          
          setUser(userToLogin);
          localStorage.setItem("udc_user", JSON.stringify(userToLogin));
          
          // Create login notification for admins and investigators
          if (addNotificationFunction) {
            addNotificationFunction(
              `${userToLogin.name} Logged In`,
              `${userToLogin.name} (${userToLogin.email}) has logged into the system.`,
              "login",
              undefined
            );
          }
          
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

  const updateProfile = async (userData: User) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in state
      setUser(userData);
      
      // Update user in local storage
      localStorage.setItem("udc_user", JSON.stringify(userData));
      
      // If this is a registered user, also update in registered users
      const usersInStorage = localStorage.getItem("udc_registered_users");
      if (usersInStorage) {
        const registeredUsers = JSON.parse(usersInStorage);
        const updatedUsers = registeredUsers.map((u: any) => 
          u.id === userData.id ? { ...u, ...userData } : u
        );
        
        localStorage.setItem("udc_registered_users", JSON.stringify(updatedUsers));
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error("No user logged in");
      }
      
      // For demo users, don't allow password changes
      if (["admin-123", "student-123", "investigator-123"].includes(user.id)) {
        toast({
          title: "Cannot change password",
          description: "Demo accounts cannot change passwords",
          variant: "destructive",
        });
        return;
      }
      
      // For registered users, verify current password and update
      const usersInStorage = localStorage.getItem("udc_registered_users");
      if (usersInStorage) {
        const registeredUsers = JSON.parse(usersInStorage);
        const userIndex = registeredUsers.findIndex((u: any) => 
          u.id === user.id && u.password === currentPassword
        );
        
        if (userIndex >= 0) {
          registeredUsers[userIndex].password = newPassword;
          localStorage.setItem("udc_registered_users", JSON.stringify(registeredUsers));
          
          toast({
            title: "Password updated",
            description: "Your password has been updated successfully",
          });
        } else {
          toast({
            title: "Password change failed",
            description: "Current password is incorrect",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Password change failed",
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
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      updateProfile,
      updatePassword,
      logout,
      addLoginNotification
    }}>
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

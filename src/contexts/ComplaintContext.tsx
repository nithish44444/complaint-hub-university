
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";

export type ComplaintCategory = 
  | "academic_misconduct" 
  | "harassment" 
  | "discrimination" 
  | "safety_concern" 
  | "facility_issue" 
  | "other";

export type ComplaintStatus = 
  | "pending" 
  | "investigating" 
  | "resolved" 
  | "rejected";

export type Complaint = {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  submittedBy: string;
  submittedByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
};

type ComplaintContextType = {
  complaints: Complaint[];
  userComplaints: Complaint[];
  isLoading: boolean;
  submitComplaint: (
    title: string,
    description: string,
    category: ComplaintCategory
  ) => Promise<void>;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    resolution?: string
  ) => Promise<void>;
  assignComplaint: (
    id: string, 
    assignedTo: string,
    assignedToName: string
  ) => Promise<void>;
};

const ComplaintContext = createContext<ComplaintContextType | undefined>(
  undefined
);

// Demo data
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "c-001",
    title: "Cheating during final exam",
    description: "Student was seen using unauthorized notes during the CS-101 final exam.",
    category: "academic_misconduct",
    status: "investigating",
    submittedBy: "admin-123",
    submittedByName: "Admin User",
    assignedTo: "investigator-123",
    assignedToName: "Investigator User",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-16T14:20:00Z",
  },
  {
    id: "c-002",
    title: "Harassment by fellow student",
    description: "I have been repeatedly harassed by a fellow student in my dorm.",
    category: "harassment",
    status: "pending",
    submittedBy: "student-123",
    submittedByName: "Student User",
    createdAt: "2023-06-18T09:15:00Z",
    updatedAt: "2023-06-18T09:15:00Z",
  },
  {
    id: "c-003",
    title: "Discriminatory comments by professor",
    description: "Professor made discriminatory comments during lecture on May 5th.",
    category: "discrimination",
    status: "resolved",
    submittedBy: "student-123",
    submittedByName: "Student User",
    assignedTo: "investigator-123",
    assignedToName: "Investigator User",
    createdAt: "2023-05-06T11:45:00Z",
    updatedAt: "2023-05-20T16:30:00Z",
    resolution: "After investigation, professor was required to attend sensitivity training and has issued an apology to the class.",
  },
  {
    id: "c-004",
    title: "Broken equipment in chemistry lab",
    description: "Several bunsen burners in the chemistry lab (room 302) are not functioning properly, creating a safety hazard.",
    category: "safety_concern",
    status: "resolved",
    submittedBy: "student-123",
    submittedByName: "Student User",
    assignedTo: "investigator-123",
    assignedToName: "Investigator User",
    createdAt: "2023-06-10T13:20:00Z",
    updatedAt: "2023-06-12T09:45:00Z",
    resolution: "Maintenance has replaced all defective equipment in the lab.",
  },
  {
    id: "c-005",
    title: "Elevator out of service in dormitory",
    description: "The elevator in East Hall has been out of service for two weeks, causing accessibility issues.",
    category: "facility_issue",
    status: "investigating",
    submittedBy: "student-456",
    submittedByName: "Another Student",
    assignedTo: "investigator-123",
    assignedToName: "Investigator User",
    createdAt: "2023-06-08T16:10:00Z",
    updatedAt: "2023-06-09T10:30:00Z",
  },
];

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Initialize with mock data
    const storedComplaints = localStorage.getItem("udc_complaints");
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    } else {
      setComplaints(MOCK_COMPLAINTS);
      localStorage.setItem("udc_complaints", JSON.stringify(MOCK_COMPLAINTS));
    }
    setIsLoading(false);
  }, []);

  // Filter complaints based on user role
  const userComplaints = user
    ? user.role === "student"
      ? complaints.filter((c) => c.submittedBy === user.id)
      : complaints
    : [];

  const submitComplaint = async (
    title: string,
    description: string,
    category: ComplaintCategory
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit a complaint",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComplaint: Complaint = {
        id: `c-${Date.now()}`,
        title,
        description,
        category,
        status: "pending",
        submittedBy: user.id,
        submittedByName: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedComplaints = [...complaints, newComplaint];
      setComplaints(updatedComplaints);
      localStorage.setItem("udc_complaints", JSON.stringify(updatedComplaints));

      // Add notification for admins and investigators
      addNotification(
        "New Complaint Submitted",
        `${user.name} has submitted a new complaint: "${title}"`,
        "complaint_submitted"
      );

      toast({
        title: "Complaint submitted",
        description: "Your complaint has been submitted successfully",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    resolution?: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      let complaintToUpdate: Complaint | undefined;

      const updatedComplaints = complaints.map((complaint) => {
        if (complaint.id === id) {
          complaintToUpdate = {
            ...complaint,
            status,
            resolution: resolution || complaint.resolution,
            updatedAt: new Date().toISOString(),
          };
          return complaintToUpdate;
        }
        return complaint;
      });

      setComplaints(updatedComplaints);
      localStorage.setItem("udc_complaints", JSON.stringify(updatedComplaints));

      // If the complaint is resolved, create a notification
      if (status === "resolved" && complaintToUpdate) {
        addNotification(
          "Complaint Resolved",
          `Complaint "${complaintToUpdate.title}" has been resolved.`,
          "complaint_resolved"
        );
      }

      toast({
        title: "Complaint updated",
        description: `Complaint status has been updated to ${status}`,
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

  const assignComplaint = async (
    id: string, 
    assignedTo: string,
    assignedToName: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedComplaints = complaints.map((complaint) => {
        if (complaint.id === id) {
          const updatedComplaint: Complaint = {
            ...complaint,
            assignedTo,
            assignedToName,
            status: "investigating",
            updatedAt: new Date().toISOString(),
          };
          return updatedComplaint;
        }
        return complaint;
      });

      setComplaints(updatedComplaints);
      localStorage.setItem("udc_complaints", JSON.stringify(updatedComplaints));

      toast({
        title: "Complaint assigned",
        description: `Complaint has been assigned to ${assignedToName}`,
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        userComplaints,
        isLoading,
        submitComplaint,
        updateComplaintStatus,
        assignComplaint,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
}

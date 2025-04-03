import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { setAddNotificationFunction } from "./AuthContext";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "login" | "complaint_resolved" | "complaint_submitted" | "system";
  targetRole?: "student" | "admin" | "investigator" | "all";
};

type NotificationContextType = {
  notifications: Notification[];
  userNotifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type: Notification["type"],
    targetRole?: Notification["targetRole"]
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem("udc_notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Filter notifications based on user role
  const userNotifications = user
    ? notifications.filter(
        (notification) =>
          notification.targetRole === "all" ||
          notification.targetRole === undefined ||
          notification.targetRole === user.role
      )
    : [];

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const addNotification = (
    title: string,
    message: string,
    type: Notification["type"],
    targetRole: Notification["targetRole"] = "all"
  ) => {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      targetRole,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "udc_notifications",
      JSON.stringify(updatedNotifications)
    );

    // Only show toast for notifications relevant to current user
    if (
      !user ||
      targetRole === "all" ||
      targetRole === user.role
    ) {
      toast({
        title,
        description: message,
      });
    }

    return newNotification;
  };

  // Register the addNotification function with AuthContext
  useEffect(() => {
    setAddNotificationFunction(addNotification);
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "udc_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "udc_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "udc_notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("udc_notifications", JSON.stringify([]));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

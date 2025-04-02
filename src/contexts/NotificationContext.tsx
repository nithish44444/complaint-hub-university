
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "login" | "complaint_resolved" | "complaint_submitted" | "system";
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type: Notification["type"]
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

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem("udc_notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    title: string,
    message: string,
    type: Notification["type"]
  ) => {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "udc_notifications",
      JSON.stringify(updatedNotifications)
    );

    // Show toast for new notification
    toast({
      title,
      description: message,
    });

    return newNotification;
  };

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

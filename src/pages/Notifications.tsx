
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Check, LogIn, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "login" | "complaint_resolved" | "complaint_submitted" | "system";
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const storedNotifications = localStorage.getItem("udc_notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      } else {
        // Set demo notifications if none exist
        const demoNotifications: Notification[] = [
          {
            id: "n1",
            title: "New User Login",
            message: "Student User has logged in to the system.",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
            read: false,
            type: "login",
          },
          {
            id: "n2",
            title: "Complaint Resolved",
            message:
              "Complaint #c-003 has been resolved by Investigator User.",
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: true,
            type: "complaint_resolved",
          },
          {
            id: "n3",
            title: "New Complaint Submitted",
            message:
              "Student User has submitted a new complaint regarding harassment.",
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
            read: true,
            type: "complaint_submitted",
          },
          {
            id: "n4",
            title: "System Maintenance",
            message:
              "The system will undergo maintenance tonight from 2-4 AM.",
            timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
            read: true,
            type: "system",
          },
        ];
        setNotifications(demoNotifications);
        localStorage.setItem(
          "udc_notifications",
          JSON.stringify(demoNotifications)
        );
      }
    };

    loadNotifications();
  }, []);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "login":
        return (
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <LogIn className="h-5 w-5 text-blue-600" />
          </div>
        );
      case "complaint_resolved":
        return (
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        );
      case "complaint_submitted":
        return (
          <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500" variant="secondary">
              {unreadCount} New
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications}>
            Clear All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            {notifications.length === 0
              ? "No notifications"
              : `You have ${notifications.length} notification${
                  notifications.length !== 1 ? "s" : ""
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                You don't have any notifications yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-medium ${
                            !notification.read ? "font-bold" : ""
                          }`}
                        >
                          {notification.title}
                          {!notification.read && (
                            <Badge className="ml-2 bg-blue-500">New</Badge>
                          )}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-600"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default NotificationsPage;

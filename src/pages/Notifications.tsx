
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Check, FileText, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NotificationsPage = () => {
  const { user } = useAuth();
  const { 
    userNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotifications();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

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
      case "complaint_resolved":
        return (
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        );
      case "complaint_investigating":
        return (
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-blue-600" />
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
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            {userNotifications.length === 0
              ? "No notifications"
              : `You have ${userNotifications.length} notification${
                  userNotifications.length !== 1 ? "s" : ""
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                You don't have any notifications yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userNotifications.map((notification) => (
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
                      
                      {/* Add link to complaint if complaint ID exists */}
                      {notification.complaintId && (
                        <div className="mt-1">
                          <Link 
                            to={`/complaints/${notification.complaintId}`} 
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Complaint Details
                          </Link>
                        </div>
                      )}
                      
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

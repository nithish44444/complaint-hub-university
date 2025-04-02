
import React, { useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultRole, setDefaultRole] = useState<string>("student");
  const [emailDomain, setEmailDomain] = useState<string>("university.edu");
  const [appName, setAppName] = useState<string>("UDC System");

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleSaveGeneral = () => {
    // Save to local storage
    localStorage.setItem(
      "udc_settings_general",
      JSON.stringify({
        appName,
        emailDomain,
      })
    );

    toast({
      title: "Settings saved",
      description: "General settings have been updated.",
    });
  };

  const handleSaveUsers = () => {
    // Save to local storage
    localStorage.setItem(
      "udc_settings_users",
      JSON.stringify({
        defaultRole,
      })
    );

    toast({
      title: "Settings saved",
      description: "User settings have been updated.",
    });
  };

  const handleSaveNotifications = () => {
    // Save to local storage
    localStorage.setItem(
      "udc_settings_notifications",
      JSON.stringify({
        notificationsEnabled,
      })
    );

    toast({
      title: "Settings saved",
      description: "Notification settings have been updated.",
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage the general system settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailDomain">Email Domain</Label>
                <Input
                  id="emailDomain"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Used for verification of university emails.
                </p>
              </div>
              <Button
                className="bg-university-navy hover:bg-university-darkBlue"
                onClick={handleSaveGeneral}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>
                Configure the default settings for new users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultRole">Default Role for New Users</Label>
                <Select
                  value={defaultRole}
                  onValueChange={setDefaultRole}
                >
                  <SelectTrigger id="defaultRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="investigator">Investigator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-university-navy hover:bg-university-darkBlue"
                onClick={handleSaveUsers}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are sent and displayed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">System Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable all notifications in the system.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <Button
                className="bg-university-navy hover:bg-university-darkBlue"
                onClick={handleSaveNotifications}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;

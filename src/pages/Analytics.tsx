
import React from "react";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints, ComplaintCategory } from "@/contexts/ComplaintContext";
import MainLayout from "@/components/layout/MainLayout";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const Analytics = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Calculate statistics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const investigatingComplaints = complaints.filter(c => c.status === "investigating").length;
  const rejectedComplaints = complaints.filter(c => c.status === "rejected").length;

  const resolutionRate = totalComplaints > 0 
    ? Math.round((resolvedComplaints / totalComplaints) * 100) 
    : 0;

  // Prepare data for charts
  const statusData = [
    { name: "Pending", value: pendingComplaints },
    { name: "Investigating", value: investigatingComplaints },
    { name: "Resolved", value: resolvedComplaints },
    { name: "Rejected", value: rejectedComplaints },
  ];

  const categoryData: { name: string; count: number }[] = [];
  const categoryCounts: Record<string, number> = {};

  complaints.forEach(complaint => {
    const category = complaint.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  Object.entries(categoryCounts).forEach(([category, count]) => {
    const readableCategory = category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    categoryData.push({ name: readableCategory, count });
  });

  // Average resolution time calculation
  const resolvedComplaintsData = complaints.filter(c => c.status === "resolved");
  let totalResolutionTime = 0;

  resolvedComplaintsData.forEach(complaint => {
    const createdDate = new Date(complaint.createdAt);
    const updatedDate = new Date(complaint.updatedAt);
    const resolutionTime = updatedDate.getTime() - createdDate.getTime();
    totalResolutionTime += resolutionTime;
  });

  const avgResolutionTimeMs = resolvedComplaintsData.length > 0 
    ? totalResolutionTime / resolvedComplaintsData.length 
    : 0;
  
  const avgResolutionDays = Math.round(avgResolutionTimeMs / (1000 * 60 * 60 * 24));

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
              <p className="text-3xl font-bold">{totalComplaints}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
              <p className="text-3xl font-bold">{resolutionRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Open Complaints</p>
              <p className="text-3xl font-bold">{pendingComplaints + investigatingComplaints}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
              <p className="text-3xl font-bold">{avgResolutionDays} days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Status</CardTitle>
            <CardDescription>
              Distribution of complaints across different statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
            <CardDescription>
              Number of complaints in each category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;

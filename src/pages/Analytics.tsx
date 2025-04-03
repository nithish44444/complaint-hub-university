
import React, { useState } from "react";
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
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const Analytics = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [timeRange, setTimeRange] = useState<string>("all");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin" && user.role !== "investigator") {
    return <Navigate to="/dashboard" />;
  }

  // Filter complaints by time range
  const getFilteredComplaints = () => {
    if (timeRange === "all") return complaints;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeRange === "7days") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === "30days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeRange === "90days") {
      cutoffDate.setDate(now.getDate() - 90);
    }
    
    return complaints.filter(c => new Date(c.createdAt) >= cutoffDate);
  };

  const filteredComplaints = getFilteredComplaints();

  // Calculate statistics
  const totalComplaints = filteredComplaints.length;
  const resolvedComplaints = filteredComplaints.filter(c => c.status === "resolved").length;
  const pendingComplaints = filteredComplaints.filter(c => c.status === "pending").length;
  const investigatingComplaints = filteredComplaints.filter(c => c.status === "investigating").length;
  const rejectedComplaints = filteredComplaints.filter(c => c.status === "rejected").length;

  const resolutionRate = totalComplaints > 0 
    ? Math.round((resolvedComplaints / totalComplaints) * 100) 
    : 0;

  // Compare with previous period
  const getPreviousData = () => {
    if (timeRange === "all") return { totalComplaints: 0, resolvedComplaints: 0 };
    
    const now = new Date();
    let currentPeriodStart = new Date();
    let previousPeriodStart = new Date();
    let previousPeriodEnd = new Date();
    
    if (timeRange === "7days") {
      currentPeriodStart.setDate(now.getDate() - 7);
      previousPeriodStart.setDate(now.getDate() - 14);
      previousPeriodEnd.setDate(now.getDate() - 7);
    } else if (timeRange === "30days") {
      currentPeriodStart.setDate(now.getDate() - 30);
      previousPeriodStart.setDate(now.getDate() - 60);
      previousPeriodEnd.setDate(now.getDate() - 30);
    } else if (timeRange === "90days") {
      currentPeriodStart.setDate(now.getDate() - 90);
      previousPeriodStart.setDate(now.getDate() - 180);
      previousPeriodEnd.setDate(now.getDate() - 90);
    }
    
    const previousComplaints = complaints.filter(c => {
      const date = new Date(c.createdAt);
      return date >= previousPeriodStart && date <= previousPeriodEnd;
    });
    
    return {
      totalComplaints: previousComplaints.length,
      resolvedComplaints: previousComplaints.filter(c => c.status === "resolved").length,
    };
  };

  const previousData = getPreviousData();
  
  const totalComplaintsChange = previousData.totalComplaints > 0
    ? Math.round(((totalComplaints - previousData.totalComplaints) / previousData.totalComplaints) * 100)
    : 100;
    
  const resolutionRateChange = previousData.totalComplaints > 0
    ? resolutionRate - Math.round((previousData.resolvedComplaints / previousData.totalComplaints) * 100)
    : resolutionRate;

  // Prepare data for charts
  const statusData = [
    { name: "Pending", value: pendingComplaints },
    { name: "Investigating", value: investigatingComplaints },
    { name: "Resolved", value: resolvedComplaints },
    { name: "Rejected", value: rejectedComplaints },
  ];

  const categoryData: { name: string; count: number }[] = [];
  const categoryCounts: Record<string, number> = {};

  filteredComplaints.forEach(complaint => {
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
  const resolvedComplaintsData = filteredComplaints.filter(c => c.status === "resolved");
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

  // Prepare monthly trends data
  const getMonthlyTrendsData = () => {
    const monthlyData: Record<string, {complaints: number, resolved: number}> = {};
    
    // Initialize with past 12 months
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      const monthYear = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      monthlyData[monthYear] = { complaints: 0, resolved: 0 };
    }
    
    // Fill with actual data
    complaints.forEach(complaint => {
      const date = new Date(complaint.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (monthlyData[monthYear]) {
        monthlyData[monthYear].complaints += 1;
        if (complaint.status === "resolved") {
          monthlyData[monthYear].resolved += 1;
        }
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      complaints: data.complaints,
      resolved: data.resolved,
      pending: data.complaints - data.resolved
    }));
  };

  const monthlyTrendsData = getMonthlyTrendsData();

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-3xl font-bold">{totalComplaints}</p>
                {timeRange !== 'all' && totalComplaintsChange !== 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant={totalComplaintsChange > 0 ? "destructive" : "default"} className="h-5 px-1">
                      {totalComplaintsChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(totalComplaintsChange)}%
                    </Badge>
                    <span className="text-muted-foreground text-xs">vs previous period</span>
                  </div>
                )}
              </div>
              <div className="h-10 w-10 rounded-full bg-university-navy/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-university-navy" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                <p className="text-3xl font-bold">{resolutionRate}%</p>
                {timeRange !== 'all' && resolutionRateChange !== 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant={resolutionRateChange > 0 ? "default" : "destructive"} className="h-5 px-1">
                      {resolutionRateChange > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(resolutionRateChange)}%
                    </Badge>
                    <span className="text-muted-foreground text-xs">vs previous period</span>
                  </div>
                )}
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Open Complaints</p>
              <p className="text-3xl font-bold">{pendingComplaints + investigatingComplaints}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-amber-500">{pendingComplaints} pending</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-blue-500">{investigatingComplaints} investigating</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white hover:shadow-md transition-all duration-200">
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
              <p className="text-3xl font-bold">{avgResolutionDays} days</p>
              <p className="text-sm text-muted-foreground">Based on {resolvedComplaintsData.length} resolved complaints</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
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
                    <CartesianGrid strokeDasharray="3 3" />
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
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Complaint Trends</CardTitle>
                <CardDescription>
                  Number of complaints and resolutions over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrendsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="complaints" 
                      stroke="#8884d8" 
                      name="Total Complaints" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#82ca9d" 
                      name="Resolved" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
                <CardDescription>
                  Comparison between new complaints and resolutions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyTrendsData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="complaints" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Total Complaints" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Resolved Complaints" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of complaint categories
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Complaints" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Analytics;

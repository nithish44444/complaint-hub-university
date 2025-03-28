
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus,
  Filter,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints, ComplaintStatus, Complaint } from "@/contexts/ComplaintContext";
import MainLayout from "@/components/layout/MainLayout";

const StatusCard = ({
  title,
  count,
  icon: Icon,
  color,
}: {
  title: string;
  count: number;
  icon: any;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{count}</h3>
        </div>
        <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ComplaintItem = ({ complaint }: { complaint: Complaint }) => {
  const getStatusClass = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{complaint.title}</h3>
        <span className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass(complaint.status)}`}>
          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {complaint.description}
      </p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>ID: {complaint.id}</span>
        <span>Submitted: {formatDate(complaint.createdAt)}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { userComplaints } = useComplaints();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Count complaints by status
  const pendingCount = userComplaints.filter(
    (c) => c.status === "pending"
  ).length;
  const investigatingCount = userComplaints.filter(
    (c) => c.status === "investigating"
  ).length;
  const resolvedCount = userComplaints.filter(
    (c) => c.status === "resolved"
  ).length;
  const totalComplaints = userComplaints.length;

  // Get recent complaints
  const recentComplaints = [...userComplaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user.role === "student" && (
          <Button 
            className="bg-university-navy hover:bg-university-darkBlue"
            asChild
          >
            <Link to="/complaints/new">
              <Plus className="mr-2 h-4 w-4" /> Submit New Complaint
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Total Complaints"
          count={totalComplaints}
          icon={FileText}
          color="bg-university-navy"
        />
        <StatusCard
          title="Pending"
          count={pendingCount}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatusCard
          title="Under Investigation"
          count={investigatingCount}
          icon={AlertCircle}
          color="bg-blue-500"
        />
        <StatusCard
          title="Resolved"
          count={resolvedCount}
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Recent Complaints</CardTitle>
              <Button variant="ghost" size="sm" className="text-university-navy" asChild>
                <Link to="/complaints">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <ComplaintItem key={complaint.id} complaint={complaint} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No complaints found</p>
                  {user.role === "student" && (
                    <Button 
                      className="mt-4 bg-university-navy hover:bg-university-darkBlue" 
                      asChild
                    >
                      <Link to="/complaints/new">
                        Submit Your First Complaint
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === "student" && (
                <Button 
                  className="w-full bg-university-navy hover:bg-university-darkBlue" 
                  asChild
                >
                  <Link to="/complaints/new">
                    <Plus className="mr-2 h-4 w-4" /> New Complaint
                  </Link>
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <Link to="/complaints">
                  <FileText className="mr-2 h-4 w-4" /> All Complaints
                </Link>
              </Button>
              {user.role !== "student" && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <Link to="/complaints?status=pending">
                    <Filter className="mr-2 h-4 w-4" /> Filter Pending
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

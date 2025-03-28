
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Filter, MoreHorizontal, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ComplaintStatus,
  ComplaintCategory,
  useComplaints,
  Complaint,
} from "@/contexts/ComplaintContext";
import MainLayout from "@/components/layout/MainLayout";

const categoryLabels: Record<ComplaintCategory, string> = {
  academic_misconduct: "Academic Misconduct",
  harassment: "Harassment",
  discrimination: "Discrimination",
  safety_concern: "Safety Concern",
  facility_issue: "Facility Issue",
  other: "Other",
};

const statusLabels: Record<ComplaintStatus, string> = {
  pending: "Pending",
  investigating: "Investigating",
  resolved: "Resolved",
  rejected: "Rejected",
};

const ComplaintsList = () => {
  const { user } = useAuth();
  const { userComplaints } = useComplaints();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "all">("all");

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Filter complaints based on search, status, and category
  const filteredComplaints = userComplaints.filter((complaint) => {
    const matchesSearch =
      searchQuery === "" ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || complaint.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "status-pill pending";
      case "investigating":
        return "status-pill investigating";
      case "resolved":
        return "status-pill resolved";
      case "rejected":
        return "status-pill rejected";
      default:
        return "status-pill";
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Complaints</h1>
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

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>
            Filter and search through complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ComplaintStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as ComplaintCategory | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic_misconduct">
                    Academic Misconduct
                  </SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="discrimination">Discrimination</SelectItem>
                  <SelectItem value="safety_concern">Safety Concern</SelectItem>
                  <SelectItem value="facility_issue">Facility Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredComplaints.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">
                        {complaint.id}
                      </TableCell>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>
                        {categoryLabels[complaint.category]}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusClass(complaint.status)}>
                          {statusLabels[complaint.status]}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                      <TableCell>{formatDate(complaint.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/complaints/${complaint.id}`} className="cursor-pointer">
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert className="bg-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No complaints found matching your filters.
          </AlertDescription>
        </Alert>
      )}
    </MainLayout>
  );
};

export default ComplaintsList;

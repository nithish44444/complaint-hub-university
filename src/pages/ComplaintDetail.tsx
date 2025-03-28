
import React, { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useComplaints,
  ComplaintStatus,
  ComplaintCategory,
} from "@/contexts/ComplaintContext";
import MainLayout from "@/components/layout/MainLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";

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

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { complaints, updateComplaintStatus, assignComplaint, isLoading } = useComplaints();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "">("");
  const [resolution, setResolution] = useState("");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <MainLayout>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complaint not found. It may have been deleted or you don't have
            permission to view it.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "investigating":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    try {
      await updateComplaintStatus(complaint.id, selectedStatus, resolution);
      toast({
        title: "Status updated",
        description: `Complaint status has been updated to ${selectedStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAssignToMe = async () => {
    if (!user) return;

    try {
      await assignComplaint(complaint.id, user.id, user.name);
      toast({
        title: "Complaint assigned",
        description: "This complaint has been assigned to you",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{complaint.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Complaint ID: {complaint.id}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {statusLabels[complaint.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="whitespace-pre-line">{complaint.description}</p>
              </div>

              {complaint.resolution && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Resolution
                  </h3>
                  <p className="whitespace-pre-line bg-muted p-4 rounded-md">
                    {complaint.resolution}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p>{categoryLabels[complaint.category]}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted By
                </p>
                <p>{complaint.submittedByName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted On
                </p>
                <p>{formatDate(complaint.createdAt)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p>{formatDate(complaint.updatedAt)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned To
                </p>
                <p>
                  {complaint.assignedToName || "Not assigned"}
                </p>
              </div>
            </CardContent>
          </Card>

          {user.role !== "student" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!complaint.assignedTo && (
                  <Button 
                    className="w-full bg-university-navy hover:bg-university-darkBlue"
                    onClick={handleAssignToMe}
                    disabled={isLoading}
                  >
                    Assign to Me
                  </Button>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Update Status
                  </p>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as ComplaintStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(selectedStatus === "resolved" || selectedStatus === "rejected") && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Resolution/Reason
                    </p>
                    <Textarea
                      placeholder="Provide details about the resolution or reason for rejection"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                    />
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={!selectedStatus || isLoading}
                    >
                      Update Status
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change the status to {selectedStatus}?
                        {(selectedStatus === "resolved" || selectedStatus === "rejected") && 
                          !resolution && 
                          " Please provide a resolution or reason."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleStatusChange}
                        disabled={(selectedStatus === "resolved" || selectedStatus === "rejected") && !resolution}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ComplaintDetail;


import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints, ComplaintCategory } from "@/contexts/ComplaintContext";
import MainLayout from "@/components/layout/MainLayout";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }).max(100, {
    message: "Title cannot exceed 100 characters",
  }),
  category: z.enum([
    "academic_misconduct",
    "harassment",
    "discrimination",
    "safety_concern",
    "facility_issue",
    "other",
  ] as const),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
});

const ComplaintForm = () => {
  const { user } = useAuth();
  const { submitComplaint, isLoading } = useComplaints();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "academic_misconduct",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await submitComplaint(values.title, values.description, values.category);
    navigate("/complaints");
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "student") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Submit a New Complaint</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>
            Please provide detailed information about your complaint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief title describing the issue"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Create a concise title that summarizes your complaint
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="academic_misconduct">
                          Academic Misconduct
                        </SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="discrimination">
                          Discrimination
                        </SelectItem>
                        <SelectItem value="safety_concern">
                          Safety Concern
                        </SelectItem>
                        <SelectItem value="facility_issue">
                          Facility Issue
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best fits your complaint
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the issue"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include all relevant details, including dates, locations, and
                      names of individuals involved
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/complaints")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-university-navy hover:bg-university-darkBlue"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Complaint"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ComplaintForm;

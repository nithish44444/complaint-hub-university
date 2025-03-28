
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, FileText, BarChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <Card className="border-none shadow-md">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-full bg-university-navy/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-university-navy" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="py-10 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                University Disciplinary Committee
                <br />
                <span className="text-university-gold">Complaint Management System</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Efficiently manage, track, and resolve campus complaints with our secure and user-friendly platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button className="bg-university-navy hover:bg-university-darkBlue" size="lg" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button className="bg-university-navy hover:bg-university-darkBlue" size="lg" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
            <FeatureCard
              icon={FileText}
              title="Easy Submission"
              description="Submit complaints easily with our streamlined form and categorization system."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="All complaints are handled with the highest level of security and privacy."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Efficient Resolution"
              description="Track the progress of your complaints from submission to resolution."
            />
            <FeatureCard
              icon={BarChart}
              title="Data Insights"
              description="Administrators can analyze complaint data to improve campus safety and services."
            />
          </div>

          <div className="mt-20 border-t pt-10">
            <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-university-navy text-white flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium mb-2">Submit a Complaint</h3>
                <p className="text-muted-foreground">
                  Create an account, fill out the complaint form with all relevant details.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-university-navy text-white flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium mb-2">Investigation Process</h3>
                <p className="text-muted-foreground">
                  The appropriate authorities will review and investigate your complaint.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full bg-university-navy text-white flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium mb-2">Resolution & Feedback</h3>
                <p className="text-muted-foreground">
                  Receive notifications on the progress and resolution of your complaint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

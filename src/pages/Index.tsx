
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, FileText, BarChart, ChevronRight, ArrowRight } from "lucide-react";
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
  <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-full bg-university-navy/10 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-university-navy" />
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
      <section className="py-10 md:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-university-navy/5 to-university-gold/5 pointer-events-none" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-6 text-center mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-university-navy to-university-darkBlue">
                University Disciplinary Committee
              </h1>
              <h2 className="text-3xl font-bold text-university-gold sm:text-4xl mb-4">
                Complaint Management System
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Efficiently manage, track, and resolve campus complaints with our secure and user-friendly platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button className="bg-university-navy hover:bg-university-darkBlue text-lg px-8 py-6 h-auto" size="lg" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button className="bg-university-navy hover:bg-university-darkBlue text-lg px-8 py-6 h-auto" size="lg" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="text-lg px-8 py-6 h-auto border-2" size="lg" asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-8">
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

          <div className="mt-24 border-t pt-16">
            <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full bg-university-navy text-white flex items-center justify-center mb-6 group-hover:bg-university-darkBlue transition-all duration-300">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Submit a Complaint</h3>
                <p className="text-muted-foreground">
                  Create an account, fill out the complaint form with all relevant details.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full bg-university-navy text-white flex items-center justify-center mb-6 group-hover:bg-university-darkBlue transition-all duration-300">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Investigation Process</h3>
                <p className="text-muted-foreground">
                  The appropriate authorities will review and investigate your complaint.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full bg-university-navy text-white flex items-center justify-center mb-6 group-hover:bg-university-darkBlue transition-all duration-300">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Resolution & Feedback</h3>
                <p className="text-muted-foreground">
                  Receive notifications on the progress and resolution of your complaint.
                </p>
              </div>
            </div>
          </div>
          
          {!user && (
            <div className="mt-20 text-center">
              <Button className="bg-university-navy hover:bg-university-darkBlue text-lg group" size="lg" asChild>
                <Link to="/register">
                  Get Started Today
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

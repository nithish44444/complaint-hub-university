
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, FileText, BarChart, ChevronRight, ArrowRight, GraduationCap, BookOpen, Scale } from "lucide-react";
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
            <div className="inline-block p-2 bg-university-gold/10 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-university-gold" />
            </div>
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
          
          <div className="mt-20 bg-university-navy/5 py-12 px-6 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Committed to Campus Justice</h3>
                <p className="text-muted-foreground mb-6">
                  Our disciplinary committee is dedicated to maintaining a fair, safe, and respectful 
                  campus environment through transparent complaint resolution processes.
                </p>
                {!user && (
                  <Button className="bg-university-navy hover:bg-university-darkBlue text-lg group" size="lg" asChild>
                    <Link to="/register">
                      Get Started Today
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-university-gold/20 flex items-center justify-center">
                  <Scale className="h-12 w-12 text-university-gold" />
                </div>
              </div>
            </div>
          </div>
          
          <footer className="mt-20 pt-10 border-t text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-university-navy" />
              <span className="font-medium text-university-darkBlue">University Disciplinary Committee</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 University Disciplinary Committee. All Rights Reserved.
            </p>
          </footer>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;


import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Shield, FileText, BarChart, ChevronRight, ArrowRight, GraduationCap, BookOpen, Scale, Sparkles, Users, Star } from "lucide-react";
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
  <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-university-lightBlue/20">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-university-navy/20 to-university-gold/20 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="h-8 w-8 text-university-navy" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-university-darkBlue">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-university-navy/5 to-university-gold/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-university-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-university-navy/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-8 text-center mb-20 animate-fade-in">
            <div className="inline-block p-3 bg-gradient-to-r from-university-navy/10 to-university-gold/10 rounded-full mb-6 shadow-md">
              <GraduationCap className="h-10 w-10 text-university-gold" />
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-university-navy via-university-darkBlue to-university-navy">
                University Disciplinary Committee
              </h1>
              <h2 className="text-3xl font-bold text-university-gold sm:text-4xl mb-4">
                Complaint Management System
              </h2>
              <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
                Efficiently manage, track, and resolve campus complaints with our secure and 
                user-friendly platform designed for transparency and fairness.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 mt-6">
              {user ? (
                <Button className="bg-university-navy hover:bg-university-darkBlue text-lg px-8 py-7 h-auto rounded-xl shadow-lg transition-all hover:shadow-xl" size="lg" asChild>
                  <Link to="/dashboard" className="flex items-center">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button className="bg-gradient-to-r from-university-navy to-university-darkBlue text-lg px-8 py-7 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all" size="lg" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="text-lg px-8 py-7 h-auto border-2 rounded-xl shadow-md hover:shadow-lg hover:bg-university-lightBlue/20 transition-all" size="lg" asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
            <FeatureCard
              icon={FileText}
              title="Easy Submission"
              description="Submit complaints effortlessly with our streamlined form and intuitive categorization system."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="All complaints are handled with the highest level of security, privacy, and confidentiality."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Efficient Resolution"
              description="Track the progress of your complaints from submission to resolution with real-time updates."
            />
            <FeatureCard
              icon={BarChart}
              title="Data Insights"
              description="Administrators can analyze complaint data to improve campus safety and services effectively."
            />
          </div>

          <div className="mt-32 border-t border-university-navy/10 pt-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-university-darkBlue">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center group p-6 rounded-xl hover:bg-university-lightBlue/20 transition-all duration-300">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-university-navy to-university-darkBlue text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-medium mb-4 text-university-darkBlue">Submit a Complaint</h3>
                <p className="text-muted-foreground">
                  Create an account, fill out the detailed complaint form with all relevant information and supporting evidence.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group p-6 rounded-xl hover:bg-university-lightBlue/20 transition-all duration-300">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-university-navy to-university-darkBlue text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-medium mb-4 text-university-darkBlue">Investigation Process</h3>
                <p className="text-muted-foreground">
                  The appropriate authorities review and thoroughly investigate your complaint following established protocols.
                </p>
              </div>
              <div className="flex flex-col items-center text-center group p-6 rounded-xl hover:bg-university-lightBlue/20 transition-all duration-300">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-university-navy to-university-darkBlue text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-medium mb-4 text-university-darkBlue">Resolution & Feedback</h3>
                <p className="text-muted-foreground">
                  Receive timely notifications on the progress and resolution of your complaint with comprehensive feedback.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-28 bg-gradient-to-br from-university-navy/10 to-university-gold/10 py-16 px-8 rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-2/3">
                <h3 className="text-3xl font-bold mb-6 text-university-darkBlue">Committed to Campus Justice</h3>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Our disciplinary committee is dedicated to maintaining a fair, safe, and respectful 
                  campus environment through transparent and equitable complaint resolution processes.
                  We strive to uphold the highest standards of integrity and confidentiality.
                </p>
                {!user && (
                  <Button className="bg-gradient-to-r from-university-navy to-university-darkBlue text-lg group px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all" size="lg" asChild>
                    <Link to="/register">
                      Get Started Today
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-university-gold/30 to-university-gold/10 flex items-center justify-center shadow-2xl">
                  <Scale className="h-16 w-16 text-university-gold" />
                </div>
              </div>
            </div>
          </div>
          
          {/* New testimonial section */}
          <div className="mt-28">
            <h2 className="text-3xl font-bold text-center mb-12 text-university-darkBlue">Why Choose Our Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-university-lightBlue/20 p-6 rounded-xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-university-navy/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-university-gold" />
                  </div>
                  <h3 className="text-xl font-semibold">Transparency</h3>
                  <p>Full visibility into the complaint process from start to finish</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-university-lightBlue/20 p-6 rounded-xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-university-navy/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-university-gold" />
                  </div>
                  <h3 className="text-xl font-semibold">Accountability</h3>
                  <p>Clear assignment of responsibilities and tracking of actions</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-university-lightBlue/20 p-6 rounded-xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-university-navy/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-university-gold" />
                  </div>
                  <h3 className="text-xl font-semibold">Excellence</h3>
                  <p>Commitment to fairness and the highest ethical standards</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <footer className="mt-28 pt-12 border-t border-university-navy/10 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-university-navy" />
              <span className="font-medium text-xl text-university-darkBlue">University Disciplinary Committee</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              © 2025 University Disciplinary Committee. All Rights Reserved.
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-university-darkBlue/60">
              <a href="#" className="hover:text-university-navy transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-university-navy transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-university-navy transition-colors">Contact Us</a>
            </div>
          </footer>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

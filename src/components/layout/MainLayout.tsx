
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className={`flex-1 ${user ? "md:ml-64" : ""}`}>
          <div className="container py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

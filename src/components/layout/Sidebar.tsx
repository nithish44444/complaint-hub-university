
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const NavItem = ({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: any;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-university-darkBlue text-white"
          : "text-university-lightBlue hover:bg-university-darkBlue/20 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col bg-university-navy fixed left-0 top-16">
      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="flex flex-col gap-2">
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </NavItem>
          <NavItem to="/complaints" icon={FileText}>
            Complaints
          </NavItem>
          {user.role === "admin" && (
            <>
              <NavItem to="/analytics" icon={BarChart}>
                Analytics
              </NavItem>
              <NavItem to="/users" icon={Users}>
                Users
              </NavItem>
              <NavItem to="/settings" icon={Settings}>
                Settings
              </NavItem>
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-university-darkBlue p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-university-lightBlue">
            <span className="text-sm font-medium text-university-darkBlue">
              {user.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-university-lightBlue">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

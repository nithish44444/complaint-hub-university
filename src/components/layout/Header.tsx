
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/contexts/NotificationContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-university-navy text-white">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="text-xl font-bold text-university-gold">
                    UDC System
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      to="/dashboard"
                      className={`udc-nav-link ${
                        location.pathname === "/dashboard" ? "active" : ""
                      }`}
                    >
                      Dashboard
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/complaints"
                      className={`udc-nav-link ${
                        location.pathname.includes("/complaints") ? "active" : ""
                      }`}
                    >
                      Complaints
                    </Link>
                  </SheetClose>
                  {user?.role === "admin" && (
                    <>
                      <SheetClose asChild>
                        <Link
                          to="/analytics"
                          className={`udc-nav-link ${
                            location.pathname === "/analytics" ? "active" : ""
                          }`}
                        >
                          Analytics
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/users"
                          className={`udc-nav-link ${
                            location.pathname === "/users" ? "active" : ""
                          }`}
                        >
                          Users
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/settings"
                          className={`udc-nav-link ${
                            location.pathname === "/settings" ? "active" : ""
                          }`}
                        >
                          Settings
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <Link to="/" className="text-xl font-bold text-university-navy">
            UDC <span className="text-university-gold">System</span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-university-navy"
              asChild
            >
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 bg-university-navy text-white">
                    <AvatarFallback>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-university-navy text-white hover:bg-university-darkBlue" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

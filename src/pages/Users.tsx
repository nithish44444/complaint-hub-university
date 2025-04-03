
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  UserPlus,
  Download,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "investigator";
  age?: string;
  department?: string;
  createdAt?: string;
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    // Get registered users from localStorage
    const loadUsers = () => {
      const usersInStorage = localStorage.getItem("udc_registered_users");
      const demoUsers: RegisteredUser[] = [
        {
          id: "admin-123",
          name: "Admin User",
          email: "admin@university.edu",
          role: "admin",
          createdAt: "2023-01-15T10:30:00Z",
        },
        {
          id: "student-123",
          name: "Student User",
          email: "student@university.edu",
          role: "student",
          department: "Computer Science",
          age: "21",
          createdAt: "2023-02-20T14:45:00Z",
        },
        {
          id: "investigator-123",
          name: "Investigator User",
          email: "investigator@university.edu",
          role: "investigator",
          department: "Student Affairs",
          createdAt: "2023-01-25T09:15:00Z",
        },
      ];

      if (usersInStorage) {
        // Filter out password from users and ensure role is properly typed
        const registeredUsers = JSON.parse(usersInStorage).map(
          (u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role || "student") as "student" | "admin" | "investigator",
            age: u.age,
            department: u.department,
            createdAt: u.createdAt || new Date().toISOString(),
          })
        );
        setUsers([...demoUsers, ...registeredUsers]);
      } else {
        setUsers(demoUsers);
      }
    };

    loadUsers();
  }, []);

  // Redirect if not admin or investigator
  if (!user || (user.role !== "admin" && user.role !== "investigator")) {
    return <Navigate to="/dashboard" />;
  }

  const filteredUsers = users.filter(
    (u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      
      return matchesSearch && matchesRole;
    }
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Department", "Age", "Registered Date"];
    const csvRows = [
      headers.join(","),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.department || "N/A",
        user.age || "N/A",
        formatDate(user.createdAt)
      ].join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-university-navy hover:bg-university-darkBlue">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Users</CardTitle>
          <CardDescription>
            Search users by name, email, role, or department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("student")}>
                  Students
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                  Administrators
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("investigator")}>
                  Investigators
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
                {roleFilter && ` (filtered by ${roleFilter})`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Columns
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Registered Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your search criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "investigator"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || "-"}</TableCell>
                    <TableCell>{user.age || "-"}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Users;


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
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "investigator";
  age?: string;
  department?: string;
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get registered users from localStorage
    const loadUsers = () => {
      const usersInStorage = localStorage.getItem("udc_registered_users");
      const demoUsers = [
        {
          id: "admin-123",
          name: "Admin User",
          email: "admin@university.edu",
          role: "admin",
        },
        {
          id: "student-123",
          name: "Student User",
          email: "student@university.edu",
          role: "student",
        },
        {
          id: "investigator-123",
          name: "Investigator User",
          email: "investigator@university.edu",
          role: "investigator",
        },
      ];

      if (usersInStorage) {
        // Filter out password from users
        const registeredUsers = JSON.parse(usersInStorage).map(
          (u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role || "student",
            age: u.age,
            department: u.department,
          })
        );
        setUsers([...demoUsers, ...registeredUsers]);
      } else {
        setUsers(demoUsers);
      }
    };

    loadUsers();
  }, []);

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button className="bg-university-navy hover:bg-university-darkBlue">
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Users</CardTitle>
          <CardDescription>
            Search users by name, email, or role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
          </CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Users;

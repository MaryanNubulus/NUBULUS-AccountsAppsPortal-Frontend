// src/features/users/index.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2 } from "lucide-react";
import { useUsersViewModel } from "./viewmodel";

export default function Users() {
  const { users, isLoading, error } = useUsersViewModel();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading users...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>User List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  user.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

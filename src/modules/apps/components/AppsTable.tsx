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
import type { AppInfoDTO } from "../types";

interface AppsTableProps {
  apps?: AppInfoDTO[];
  isLoading?: boolean;
  error?: string | null;
}

export default function AppsTable({
  apps = [],
  isLoading = false,
  error = null,
}: AppsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading apps...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No apps found.
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Apps List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apps.map((app) => (
          <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell>{app.key}</TableCell>
            <TableCell>{app.name}</TableCell>
            <TableCell>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  app.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.isActive ? "Active" : "Inactive"}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserToShare } from "../types";

interface SelectUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsers: UserToShare[];
  isLoading: boolean;
  isSubmitting: boolean;
  onSelect: (user: UserToShare) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  hasSearched: boolean;
  totalCount: number;
  t: (key: string) => string;
}

export function SelectUsersModal({
  open,
  onOpenChange,
  availableUsers,
  isLoading,
  isSubmitting,
  onSelect,
  searchTerm,
  onSearch,
  hasSearched,
  totalCount,
  t,
}: SelectUsersModalProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Sync local search term with parent when search is performed
  useEffect(() => {
    if (hasSearched) {
      setLocalSearchTerm(searchTerm);
    }
  }, [hasSearched, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    onSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("selectModal.title")}</DialogTitle>
          <DialogDescription>{t("selectModal.description")}</DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={
                  t("selectModal.searchPlaceholder") || "Search users..."
                }
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="default">
              <Search className="h-4 w-4 mr-2" />
              {t("selectModal.searchButton") || "Search"}
            </Button>
            {searchTerm && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4 mr-2" />
                {t("selectModal.clearButton") || "Clear"}
              </Button>
            )}
          </div>
        </form>

        {/* Results info */}
        {hasSearched && (
          <div className="text-sm text-muted-foreground mb-2">
            {totalCount === 0
              ? t("selectModal.noResults")
              : `${t("selectModal.found")}: ${totalCount}`}
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("selectModal.name")}</TableHead>
                <TableHead>{t("selectModal.email")}</TableHead>
                <TableHead className="text-right">
                  {t("selectModal.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasSearched ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    {t("selectModal.performSearch") ||
                      "Perform a search to see available users"}
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : availableUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    {t("selectModal.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                availableUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => onSelect(user)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? t("selectModal.sharing")
                          : t("selectModal.share")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

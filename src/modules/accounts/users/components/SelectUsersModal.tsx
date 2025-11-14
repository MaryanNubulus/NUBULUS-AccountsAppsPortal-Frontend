import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
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
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onChangePageSize: (size: number) => void;
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
  currentPage,
  totalPages,
  pageSize,
  onNextPage,
  onPreviousPage,
  onChangePageSize,
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
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("selectModal.title")}</DialogTitle>
          <DialogDescription>{t("selectModal.description")}</DialogDescription>
        </DialogHeader>

        <SearchBar
          placeholder={t("page.searchPlaceholder")}
          value={localSearchTerm}
          onChange={setLocalSearchTerm}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          hasSearchTerm={!!searchTerm}
        />

        {hasSearched && totalCount === 0 ? (
          <div className="text-sm text-muted-foreground mb-2">
            {t("selectModal.noResults")}
          </div>
        ) : (
          <>
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              hasPreviousPage={currentPage > 1}
              hasNextPage={currentPage < totalPages}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
              onGoToPage={() => {}}
              onPageSizeChange={onChangePageSize}
              label={{
                of: t("page.of"),
                items: t("page.users"),
                previous: t("page.previous"),
                next: t("page.next"),
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

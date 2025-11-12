// page.tsx - Accounts module main page

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AccountsTable } from "./components/AccountsTable";
import { AddNewAccountModal } from "./components/AddNewAccountModal";
import { EditAccountModal } from "./components/EditAccountModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import { useAccounts } from "./viewmodel";
import type { Account } from "./types";

export default function AccountsPage() {
  const {
    accounts,
    isLoading,
    error,
    reload,
    currentPage,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    previousPage,
    goToPage,
    searchTerm,
    search,
    t,
  } = useAccounts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [stateChangeAction, setStateChangeAction] = useState<
    "pause" | "resume" | null
  >(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    reload();
  };

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
    reload();
  };

  const handleStateChangeClick = (account: Account, pause: boolean) => {
    setSelectedAccount(account);
    setStateChangeAction(pause ? "pause" : "resume");
    setIsConfirmDialogOpen(true);
  };

  const handleStateChangeSuccess = () => {
    setIsConfirmDialogOpen(false);
    setSelectedAccount(null);
    setStateChangeAction(null);
    reload();
  };

  const handleConfirmDialogClose = () => {
    if (!isConfirmDialogOpen) return;
    setIsConfirmDialogOpen(false);
    setSelectedAccount(null);
    setStateChangeAction(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    search("");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t("page.title")}
            </CardTitle>
            <CardDescription>{t("page.description")}</CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("page.addButton")}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("page.searchPlaceholder")}
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="default">
                <Search className="h-4 w-4 mr-2" />
                {t("page.searchButton")}
              </Button>
              {searchTerm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("page.clearButton")}
                </Button>
              )}
            </div>
          </form>

          {error && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("table.loading")}
            </div>
          ) : (
            <>
              <AccountsTable
                accounts={accounts}
                onEdit={handleEditClick}
                onChangeState={handleStateChangeClick}
                t={t}
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t("table.pagination.showing", {
                      from:
                        accounts.length > 0 ? (currentPage - 1) * 10 + 1 : 0,
                      to: (currentPage - 1) * 10 + accounts.length,
                      total: totalCount,
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousPage}
                      disabled={!hasPreviousPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      {t("table.pagination.previous")}
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage =
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 &&
                              page <= currentPage + 1);

                          const showEllipsis =
                            (page === currentPage - 2 && currentPage > 3) ||
                            (page === currentPage + 2 &&
                              currentPage < totalPages - 2);

                          if (showEllipsis) {
                            return (
                              <span
                                key={page}
                                className="px-2 text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }

                          if (!showPage) return null;

                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => goToPage(page)}
                              className="min-w-[2.5rem]"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={!hasNextPage}
                    >
                      {t("table.pagination.next")}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AddNewAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        account={selectedAccount}
      />

      <ConfirmStateChangeDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleConfirmDialogClose}
        onSuccess={handleStateChangeSuccess}
        account={selectedAccount}
        action={stateChangeAction}
      />
    </div>
  );
}

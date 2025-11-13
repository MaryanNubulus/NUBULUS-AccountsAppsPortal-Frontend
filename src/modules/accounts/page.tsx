// page.tsx - Accounts module main page

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
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
import { SearchBar } from "./components/SearchBar";
import { Pagination } from "./components/Pagination";
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
    pageSize,
    changePageSize,
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
    <div className="container mx-auto py-3 space-y-6">
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
          <SearchBar
            placeholder={t("page.searchPlaceholder")}
            value={localSearchTerm}
            onChange={setLocalSearchTerm}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            hasSearchTerm={!!searchTerm}
          />

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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
                onNextPage={nextPage}
                onPreviousPage={previousPage}
                onGoToPage={goToPage}
                onPageSizeChange={changePageSize}
                label={{
                  of: t("table.pagination.of"),
                  items: t("table.pagination.accounts"),
                  previous: t("table.pagination.previous"),
                  next: t("table.pagination.next"),
                }}
              />
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

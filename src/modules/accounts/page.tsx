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
import { useAccounts } from "./viewmodel";
import type { Account } from "./types";

export default function AccountsPage() {
  const { accounts, isLoading, error, reload, t } = useAccounts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [stateChangeAction, setStateChangeAction] = useState<
    "activate" | "deactivate" | null
  >(null);

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

  const handleStateChangeClick = (account: Account, activate: boolean) => {
    setSelectedAccount(account);
    setStateChangeAction(activate ? "activate" : "deactivate");
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
            <AccountsTable
              accounts={accounts}
              onEdit={handleEditClick}
              onChangeState={handleStateChangeClick}
              t={t}
            />
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

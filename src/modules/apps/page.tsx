import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppsTable from "./components/AppsTable";
import { useAppsViewModel } from "./viewmodel";
import { AddNewAppModal } from "./components/AddNewAppModal";
import { EditAppModal } from "./components/EditAppModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import type { AppInfoDTO } from "./types";

export default function AppsPage() {
  const {
    apps,
    isLoading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    handleCloseModal,
    createApp,
    pauseResumeApp,
    addAppState,
    editingApp,
    isEditModalOpen,
    handleCloseEditModal,
    handleStartEdit,
    handleEditApp,
    editAppState,
    t,
  } = useAppsViewModel();

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppInfoDTO | null>(null);
  const [stateChangeAction, setStateChangeAction] = useState<
    "activate" | "deactivate" | null
  >(null);

  const handleStateChangeClick = (app: AppInfoDTO, activate: boolean) => {
    setSelectedApp(app);
    setStateChangeAction(activate ? "activate" : "deactivate");
    setConfirmationOpen(true);
  };

  const handleConfirmStateChange = async () => {
    if (selectedApp && stateChangeAction) {
      await pauseResumeApp(selectedApp.id, stateChangeAction === "deactivate");
      setConfirmationOpen(false);
      setSelectedApp(null);
      setStateChangeAction(null);
    }
  };

  const handleConfirmDialogClose = () => {
    setConfirmationOpen(false);
    setSelectedApp(null);
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

          <AppsTable
            apps={apps}
            isLoading={isLoading}
            error={error}
            onEdit={handleStartEdit}
            onChangeState={handleStateChangeClick}
            t={t}
          />
        </CardContent>
      </Card>

      <AddNewAppModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={createApp}
        isSubmitting={addAppState.isSubmitting}
        status={addAppState.status}
      />

      <EditAppModal
        app={editingApp}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditApp}
        isSubmitting={editAppState.isSubmitting}
        status={editAppState.status}
      />

      <ConfirmStateChangeDialog
        open={confirmationOpen}
        onOpenChange={handleConfirmDialogClose}
        isPause={stateChangeAction === "deactivate"}
        onConfirm={handleConfirmStateChange}
      />
    </div>
  );
}

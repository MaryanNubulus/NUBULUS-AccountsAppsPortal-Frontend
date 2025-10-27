import { Button } from "@/components/ui/button";
import AppsTable from "./components/AppsTable";
import { useAppsViewModel } from "./viewmodel";
import { AddNewAppModal } from "./components/AddNewAppModal";
import { EditAppModal } from "./components/EditAppModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AppsPage() {
  const { t } = useTranslation("apps");
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
  } = useAppsViewModel();

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    appId: string;
    newState: boolean;
  } | null>(null);

  const handleStateChange = (appId: string, newState: boolean) => {
    setPendingAction({ appId, newState });
    setConfirmationOpen(true);
  };

  const handleConfirmStateChange = async () => {
    if (pendingAction) {
      await pauseResumeApp(pendingAction.appId, pendingAction.newState);
      setConfirmationOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-end mb-6">
        <Button onClick={() => setIsAddModalOpen(true)}>
          {t("page.addButton")}
        </Button>
      </div>

      <AppsTable
        apps={apps}
        isLoading={isLoading}
        error={error}
        onEdit={handleStartEdit}
        onStateChange={handleStateChange}
      />

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
        onOpenChange={setConfirmationOpen}
        isPause={pendingAction?.newState ?? false}
        onConfirm={handleConfirmStateChange}
      />
    </>
  );
}

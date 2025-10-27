import { Button } from "@/components/ui/button";
import AppsTable from "./components/AppsTable";
import { useAppsViewModel } from "./viewmodel";
import { AddNewAppModal } from "./components/AddNewAppModal";
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
  } = useAppsViewModel();

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
        onPauseResume={pauseResumeApp}
      />

      <AddNewAppModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={createApp}
        isSubmitting={addAppState.isSubmitting}
        status={addAppState.status}
      />
    </>
  );
}

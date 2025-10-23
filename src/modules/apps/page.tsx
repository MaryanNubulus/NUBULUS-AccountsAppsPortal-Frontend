import { Button } from "@/components/ui/button";
import AppsTable from "./components/AppsTable";
import { useAppsViewModel } from "./viewmodel";
import { AddNewAppModal } from "./components/AddNewAppModal";

export default function AppsPage() {
  const {
    apps,
    isLoading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    handleCloseModal,
    createApp,
    addAppState,
  } = useAppsViewModel();

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New</Button>
      </div>

      <AppsTable apps={apps} isLoading={isLoading} error={error} />

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

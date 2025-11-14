// page.tsx - Apps module main page

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
import { AppsTable } from "./components/AppsTable";
import { AddNewAppModal } from "./components/AddNewAppModal";
import { EditAppModal } from "./components/EditAppModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import { SearchBar } from "./components/SearchBar";
import { Pagination } from "./components/Pagination";
import { useApps } from "./viewmodel";
import type { App } from "./types";

export default function AppsPage() {
  const {
    apps,
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
  } = useApps();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [stateChangeAction, setStateChangeAction] = useState<
    "pause" | "resume" | null
  >(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    reload();
  };

  const handleEditClick = (app: App) => {
    setSelectedApp(app);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedApp(null);
    reload();
  };

  const handleStateChangeClick = (app: App, pause: boolean) => {
    setSelectedApp(app);
    setStateChangeAction(pause ? "pause" : "resume");
    setIsConfirmDialogOpen(true);
  };

  const handleStateChangeSuccess = () => {
    setIsConfirmDialogOpen(false);
    setSelectedApp(null);
    setStateChangeAction(null);
    reload();
  };

  const handleConfirmDialogClose = () => {
    if (!isConfirmDialogOpen) return;
    setIsConfirmDialogOpen(false);
    setSelectedApp(null);
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
            hasSearchTerm={searchTerm.length > 0}
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
              <AppsTable
                apps={apps}
                onEdit={handleEditClick}
                onChangeState={handleStateChangeClick}
                t={t}
              />

              {totalPages > 0 && (
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
                    items: t("table.pagination.apps"),
                    previous: t("table.pagination.previous"),
                    next: t("table.pagination.next"),
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AddNewAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditAppModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        app={selectedApp}
      />

      <ConfirmStateChangeDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleConfirmDialogClose}
        onSuccess={handleStateChangeSuccess}
        app={selectedApp}
        action={stateChangeAction}
      />
    </div>
  );
}

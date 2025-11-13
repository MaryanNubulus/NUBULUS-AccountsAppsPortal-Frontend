import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "./components/UsersTable";
import { SharedUsersTable } from "./components/SharedUsersTable";
import { AddNewUserModal } from "./components/AddNewUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { SelectUsersModal } from "./components/SelectUsersModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import { SearchBar } from "./components/SearchBar";
import { Pagination } from "./components/Pagination";
import {
  useUsers,
  useGetSharedUsers,
  useGetUsersToShare,
  useShareUser,
  useUnshareUser,
} from "./viewmodel";
import type { User, UserToShare } from "./types";

export function UsersPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const {
    users,
    isLoading,
    reload,
    t,
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
    setSearchTerm,
  } = useUsers();
  const {
    sharedUsers,
    isLoading: isSharedLoading,
    reload: reloadShared,
    currentPage: sharedCurrentPage,
    totalPages: sharedTotalPages,
    totalCount: sharedTotalCount,
    pageSize: sharedPageSize,
    changePageSize: changeSharedPageSize,
    hasPreviousPage: sharedHasPreviousPage,
    hasNextPage: sharedHasNextPage,
    nextPage: sharedNextPage,
    previousPage: sharedPreviousPage,
    goToPage: sharedGoToPage,
    searchTerm: sharedSearchTerm,
    setSearchTerm: setSharedSearchTerm,
  } = useGetSharedUsers();
  const {
    availableUsers,
    isLoading: isAvailableLoading,
    load: loadAvailable,
    totalCount: availableTotalCount,
    searchTerm: availableSearchTerm,
    setSearchTerm: setAvailableSearchTerm,
    hasSearched,
  } = useGetUsersToShare();
  const { handleShare, isSubmitting: isSharing } = useShareUser(() => {
    loadAvailable();
    reloadShared();
    setIsSelectModalOpen(false);
  });
  const { handleUnshare, isSubmitting: isUnsharing } = useUnshareUser(() => {
    reloadShared();
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [shouldResume, setShouldResume] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSharedSearchTerm, setLocalSharedSearchTerm] = useState("");

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleChangeState = (user: User, resume: boolean) => {
    setSelectedUser(user);
    setShouldResume(resume);
    setIsConfirmDialogOpen(true);
  };

  const handleSuccess = () => {
    reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOpenSelectModal = () => {
    loadAvailable();
    setIsSelectModalOpen(true);
  };

  const handleSelectUser = async (user: UserToShare) => {
    await handleShare(user.userId.toString());
  };

  const handleUnshareClick = async (user: UserToShare) => {
    await handleUnshare(user.userId.toString());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
  };

  const handleSearchShared = (e: React.FormEvent) => {
    e.preventDefault();
    setSharedSearchTerm(localSharedSearchTerm);
  };

  const handleClearSearchShared = () => {
    setLocalSharedSearchTerm("");
    setSharedSearchTerm("");
  };

  if (!accountId) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t("errors.invalidAccountId")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("page.backButton")}
        </Button>
      </div>

      {/* Els Meus Usuaris */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("page.myUsers")}</CardTitle>
              <CardDescription>{t("page.description")}</CardDescription>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("page.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar
            placeholder={t("page.searchPlaceholder")}
            value={localSearchTerm}
            onChange={setLocalSearchTerm}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            hasSearchTerm={!!searchTerm}
            searchButton={t("page.searchButton")}
            clearButton={t("page.clearButton")}
          />

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <UsersTable
                users={users}
                onEdit={handleEdit}
                onChangeState={handleChangeState}
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
                  of: t("page.of"),
                  items: t("page.users"),
                  previous: t("page.previous"),
                  next: t("page.next"),
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Usuaris Compartits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("page.sharedUsers")}</CardTitle>
              <CardDescription>
                Usuaris compartits amb aquest compte
              </CardDescription>
            </div>
            <Button onClick={handleOpenSelectModal}>
              <Plus className="mr-2 h-4 w-4" />
              {t("page.shareButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar
            placeholder={t("page.searchPlaceholder")}
            value={localSharedSearchTerm}
            onChange={setLocalSharedSearchTerm}
            onSearch={handleSearchShared}
            onClear={handleClearSearchShared}
            hasSearchTerm={!!sharedSearchTerm}
            searchButton={t("page.searchButton")}
            clearButton={t("page.clearButton")}
          />

          {isSharedLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <SharedUsersTable
                sharedUsers={sharedUsers}
                onUnshare={handleUnshareClick}
                isLoading={isUnsharing}
                t={t}
              />

              <Pagination
                currentPage={sharedCurrentPage}
                totalPages={sharedTotalPages}
                totalCount={sharedTotalCount}
                pageSize={sharedPageSize}
                hasPreviousPage={sharedHasPreviousPage}
                hasNextPage={sharedHasNextPage}
                onNextPage={sharedNextPage}
                onPreviousPage={sharedPreviousPage}
                onGoToPage={sharedGoToPage}
                onPageSizeChange={changeSharedPageSize}
                label={{
                  of: t("page.of"),
                  items: t("page.users"),
                  previous: t("page.previous"),
                  next: t("page.next"),
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AddNewUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleSuccess}
      />

      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        user={selectedUser}
      />

      <ConfirmStateChangeDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onSuccess={handleSuccess}
        user={selectedUser}
        shouldResume={shouldResume}
      />

      <SelectUsersModal
        open={isSelectModalOpen}
        onOpenChange={setIsSelectModalOpen}
        availableUsers={availableUsers}
        isLoading={isAvailableLoading}
        isSubmitting={isSharing}
        onSelect={handleSelectUser}
        searchTerm={availableSearchTerm}
        onSearch={setAvailableSearchTerm}
        hasSearched={hasSearched}
        totalCount={availableTotalCount}
        t={t}
      />
    </div>
  );
}

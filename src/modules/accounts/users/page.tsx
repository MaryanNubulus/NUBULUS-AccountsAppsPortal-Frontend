import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
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
import { AddNewUserModal } from "./components/AddNewUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { ConfirmStateChangeDialog } from "./components/ConfirmStateChangeDialog";
import { useUsers } from "./viewmodel";
import type { User } from "./types";

export function UsersPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const { users, isLoading, reload, t } = useUsers();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [shouldResume, setShouldResume] = useState(false);

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
    <div className="p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("page.title")}</CardTitle>
              <CardDescription>{t("page.description")}</CardDescription>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("page.addButton")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <UsersTable
              users={users}
              onEdit={handleEdit}
              onChangeState={handleChangeState}
              t={t}
            />
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
    </div>
  );
}

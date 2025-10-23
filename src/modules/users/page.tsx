import { useUsersViewModel } from "./viewmodel";
import UsersTable from "./components/UsersTable";
import type { UserInfoDTO } from "./types";
import UserDefinition from "./components/UserDefinition";
import { useState } from "react";

export default function UsersPage() {
  const { users, isLoading, error } = useUsersViewModel();
  const [selectedUser, setSelectedUser] = useState<UserInfoDTO | null>(null);

  const handleUserSelect = (user: UserInfoDTO) => {
    setSelectedUser(user);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-end mb-6">
        <UserDefinition user={selectedUser} />
      </div>

      <UsersTable
        users={users}
        isLoading={isLoading}
        error={error}
        onUserSelect={handleUserSelect}
      />
    </>
  );
}

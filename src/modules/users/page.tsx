import { useUsersViewModel } from "./viewmodel";
import UsersTable from "./components/UsersTable";

export default function UsersPage() {
  const { users, isLoading, error } = useUsersViewModel();

  return (
    <>
      <UsersTable users={users} isLoading={isLoading} error={error} />
    </>
  );
}

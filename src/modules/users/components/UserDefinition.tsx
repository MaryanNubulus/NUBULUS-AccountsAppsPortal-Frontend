import type { UserInfoDTO } from "../types";

interface UserDefinitionProps {
  user: UserInfoDTO | null;
}
export default function UserDefinition({ user }: UserDefinitionProps) {
  return (
    <h2>
      {user ? `User Definition Component for ${user.name}` : "No User Selected"}
    </h2>
  );
}

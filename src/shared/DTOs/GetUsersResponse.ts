export interface GetUsersResponse {
  success: boolean;
  message: string | null;
  users: UserInfoDTO[] | null;
}

export interface UserInfoDTO {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}

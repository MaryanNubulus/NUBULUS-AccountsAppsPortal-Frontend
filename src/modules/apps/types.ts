export interface GetAppsResponse {
  success: boolean;
  message: string | null;
  apps: AppInfoDTO[] | null;
}

export interface AppInfoDTO {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
}

export interface CreateAppRequest {
  key: string;
  name: string;
}

export interface UpdateAppRequest {
  name: string;
}

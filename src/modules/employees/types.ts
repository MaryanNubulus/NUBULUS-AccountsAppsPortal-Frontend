export interface GetEmployeesResponse {
  success: boolean;
  message: string | null;
  employees: EmployeeInfoDTO[] | null;
}

export interface EmployeeInfoDTO {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}
